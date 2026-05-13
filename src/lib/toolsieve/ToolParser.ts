import { ToolCallParseResult } from '@/types/ToolSieve';
import { toStringSafe, insideCodeFenceWithState, createToolSieveState } from './SieveState';
import { scanToolMarkupTagAt } from './TagScanner';
import { findXmlElementBlocks, parseMarkupSingleToolCall } from './XmlParser';

export function stripFencedCodeBlocks(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let inFence = false;
  let fenceChar = '';
  let fenceLen = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!inFence) {
      if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
        inFence = true;
        fenceChar = trimmed[0];
        fenceLen = countLeadingChars(trimmed, fenceChar);
        continue;
      }
      out.push(line);
    } else {
      if (trimmed.startsWith(fenceChar) && countLeadingChars(trimmed, fenceChar) >= fenceLen) {
        inFence = false;
        continue;
      }
    }
  }
  return out.join('\n');
}

function countLeadingChars(text: string, ch: string): number {
  let count = 0;
  while (count < text.length && text[count] === ch) count++;
  return count;
}

export function normalizeDSMLToolCallMarkup(text: string): string {
  let out = '';
  const state = createToolSieveState();
  
  for (let i = 0; i < text.length; ) {
    if (insideCodeFenceWithState(state, text.slice(0, i))) {
      out += text[i];
      i++;
      continue;
    }

    const tag = scanToolMarkupTagAt(text, i);
    if (tag) {
      out += `<${tag.closing ? '/' : ''}${tag.name}${text.slice(tag.nameEnd, tag.end)}>`;
      i = tag.end + 1;
      continue;
    }
    out += text[i];
    i++;
  }
  return out;
}

export function parseToolCalls(text: string): ToolCallParseResult {
  const result: ToolCallParseResult = {
    calls: [],
    sawToolCallSyntax: false,
    rejectedByPolicy: false,
    rejectedToolNames: []
  };

  const raw = toStringSafe(text);
  if (!raw) return result;

  const cleaned = stripFencedCodeBlocks(raw);
  const normalized = normalizeDSMLToolCallMarkup(cleaned);

  const wrappers = findXmlElementBlocks(normalized, 'tool_calls');
  if (wrappers.length > 0) result.sawToolCallSyntax = true;

  for (const wrapper of wrappers) {
    const calls = findXmlElementBlocks(wrapper.body, 'invoke');
    for (const callBlock of calls) {
      const parsed = parseMarkupSingleToolCall(callBlock);
      if (parsed) result.calls.push(parsed);
    }
  }

  return result;
}
