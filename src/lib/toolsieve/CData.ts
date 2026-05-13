export function indexToolCDATAOpen(text: string, from: number): number {
  const sub = text.slice(from);
  const match = sub.match(/(?:<|＜|〈)(?:!|！)\[CDATA\[/i);
  return match && match.index !== undefined ? from + match.index : -1;
}

export function toolCDATAOpenLenAt(text: string, pos: number): number {
  const sub = text.slice(pos);
  const match = sub.match(/^(?:<|＜|〈)(?:!|！)\[CDATA\[/i);
  return match ? match[0].length : 0;
}

export function findToolCDATAEnd(text: string, from: number): number {
  for (let i = from; i < text.length; i++) {
    const len = toolCDATACloseLenAt(text, i);
    if (len > 0) return i;
  }
  return -1;
}

export function toolCDATACloseLenAt(text: string, pos: number): number {
  const sub = text.slice(pos);
  const match = sub.match(/^\]\](?:>|＞|〉)/);
  return match ? match[0].length : 0;
}

export function extractStandaloneCDATA(text: string): string {
  const openLen = toolCDATAOpenLenAt(text, 0);
  if (openLen === 0) return text;

  const endPos = findToolCDATAEnd(text, openLen);
  if (endPos === -1) return text.slice(openLen);

  return text.slice(openLen, endPos);
}

export function sanitizeLooseCDATA(text: string): string {
  let out = text;
  let pos = 0;

  while (true) {
    const openIdx = indexToolCDATAOpen(out, pos);
    if (openIdx === -1) break;

    const openLen = toolCDATAOpenLenAt(out, openIdx);
    const endIdx = findToolCDATAEnd(out, openIdx + openLen);

    if (endIdx === -1) {
      out += ']]>';
      break;
    }
    pos = endIdx + toolCDATACloseLenAt(out, endIdx);
  }

  return out;
}
