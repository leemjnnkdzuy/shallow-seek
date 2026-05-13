import { ToolSieveState } from '@/types/ToolSieve';

export function createToolSieveState(): ToolSieveState {
  return {
    pending: '',
    capture: '',
    capturing: false,
    codeFenceStack: [],
    codeFencePendingTicks: 0,
    codeFencePendingTildes: 0,
    codeFenceLineStart: true,
    markdownCodeSpanTicks: 0,
    pendingToolRaw: '',
    pendingToolCalls: [],
    disableDeltas: false,
    toolNameSent: false,
    toolName: '',
    toolArgsStart: -1,
    toolArgsSent: -1,
    toolArgsString: false,
    toolArgsDone: false,
  };
}

export function resetIncrementalToolState(state: ToolSieveState): void {
  state.disableDeltas = false;
  state.toolNameSent = false;
  state.toolName = '';
  state.toolArgsStart = -1;
  state.toolArgsSent = -1;
  state.toolArgsString = false;
  state.toolArgsDone = false;
}

export function noteText(state: ToolSieveState, text: string): void {
  if (!state || !text) return;
  updateMarkdownCodeSpanState(state, text);
  updateCodeFenceState(state, text);
}

export function updateCodeFenceState(state: ToolSieveState, text: string): void {
  const next = simulateCodeFenceState(
    state.codeFenceStack,
    state.codeFencePendingTicks,
    state.codeFencePendingTildes,
    state.codeFenceLineStart,
    text
  );
  state.codeFenceStack = next.stack;
  state.codeFencePendingTicks = next.pendingTicks;
  state.codeFencePendingTildes = next.pendingTildes;
  state.codeFenceLineStart = next.lineStart;
}

export function simulateCodeFenceState(
  stack: number[],
  pendingTicks: number,
  pendingTildes: number,
  lineStart: boolean,
  text: string
) {
  const nextStack = [...stack];
  let ticks = pendingTicks;
  let tildes = pendingTildes;
  let atLineStart = lineStart;

  const flushPending = () => {
    if (ticks > 0) {
      if (atLineStart && ticks >= 3) applyFenceMarker(nextStack, ticks);
      atLineStart = false;
      ticks = 0;
    }
    if (tildes > 0) {
      if (atLineStart && tildes >= 3) applyFenceMarker(nextStack, -tildes);
      atLineStart = false;
      tildes = 0;
    }
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '`') {
      if (tildes > 0) flushPending();
      ticks++;
      continue;
    }
    if (ch === '~') {
      if (ticks > 0) flushPending();
      tildes++;
      continue;
    }
    flushPending();
    if (ch === '\n' || ch === '\r') {
      atLineStart = true;
      continue;
    }
    if ((ch === ' ' || ch === '\t') && atLineStart) continue;
    atLineStart = false;
  }

  return {
    stack: nextStack,
    pendingTicks: ticks,
    pendingTildes: tildes,
    lineStart: atLineStart,
  };
}

function applyFenceMarker(stack: number[], marker: number): void {
  if (stack.length === 0) {
    stack.push(marker);
    return;
  }
  const top = stack[stack.length - 1];
  const sameType = (top > 0 && marker > 0) || (top < 0 && marker < 0);
  if (!sameType) {
    stack.push(marker);
    return;
  }
  if (Math.abs(marker) >= Math.abs(top)) {
    stack.pop();
    return;
  }
  stack.push(marker);
}

export function updateMarkdownCodeSpanState(state: ToolSieveState, text: string): void {
  state.markdownCodeSpanTicks = simulateMarkdownCodeSpanTicks(state, state.markdownCodeSpanTicks, text);
}

export function simulateMarkdownCodeSpanTicks(state: ToolSieveState | null, initialTicks: number, text: string): number {
  let ticks = initialTicks;
  for (let i = 0; i < text.length; ) {
    if (text[i] !== '`') {
      i++;
      continue;
    }
    const run = countBacktickRun(text, i);
    if (ticks === 0) {
      if (run >= 3 && atMarkdownFenceLineStart(text, i)) {
        i += run;
        continue;
      }
      if (state && insideCodeFenceWithState(state, text.slice(0, i))) {
        i += run;
        continue;
      }
      ticks = run;
    } else if (run === ticks) {
      ticks = 0;
    }
    i += run;
  }
  return ticks;
}

export function insideCodeFenceWithState(state: ToolSieveState, text: string): boolean {
  const simulated = simulateCodeFenceState(
    state.codeFenceStack,
    state.codeFencePendingTicks,
    state.codeFencePendingTildes,
    state.codeFenceLineStart,
    text
  );
  return simulated.stack.length > 0;
}

function countBacktickRun(text: string, start: number): number {
  let count = 0;
  while (start + count < text.length && text[start + count] === '`') count++;
  return count;
}

function atMarkdownFenceLineStart(text: string, idx: number): boolean {
  for (let i = idx - 1; i >= 0; i--) {
    const ch = text[i];
    if (ch === ' ' || ch === '\t') continue;
    return ch === '\n' || ch === '\r';
  }
  return true;
}

export function toStringSafe(v: any): string {
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v)) return toStringSafe(v[0]);
  if (v == null) return '';
  return String(v).trim();
}
