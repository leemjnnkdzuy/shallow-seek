import { XmlElementBlock, ParsedToolCall } from '@/types/ToolSieve';
import { toStringSafe } from './SieveState';
import { findToolMarkupTag } from './TagScanner';
import { extractStandaloneCDATA, sanitizeLooseCDATA } from './CData';

export function preservesCDATAStringParameter(name: string): boolean {
  const n = name.toLowerCase();
  return [
    'content', 'file_content', 'code', 'text', 
    'old_string', 'new_string', 'replacement',
    'prompt', 'command', 'script', 'path', 'file_path'
  ].includes(n);
}

export function parseTagAttributes(attrStr: string): Record<string, string> {
  const out: Record<string, string> = {};
  const pattern = /\b([a-z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match;
  while ((match = pattern.exec(attrStr)) !== null) {
    out[match[1]] = match[2] || match[3] || '';
  }
  return out;
}

export function findXmlElementBlocks(text: string, tagName: string): XmlElementBlock[] {
  const out: XmlElementBlock[] = [];
  let pos = 0;

  while (pos < text.length) {
    const tag = findToolMarkupTag(text, pos);
    if (!tag || tag.closing || tag.name !== tagName) {
      pos++;
      continue;
    }

    const closeTag = findMatchingCloseTag(text, tag);
    if (!closeTag) {
      pos = tag.end + 1;
      continue;
    }

    out.push({
      attrs: text.slice(tag.nameEnd, tag.end),
      body: text.slice(tag.end + 1, closeTag.start),
      start: tag.start,
      end: closeTag.end + 1
    });
    pos = closeTag.end + 1;
  }
  return out;
}

function findMatchingCloseTag(text: string, openTag: any) {
  let depth = 1;
  let pos = openTag.end + 1;
  while (pos < text.length) {
    const tag = findToolMarkupTag(text, pos);
    if (!tag || tag.name !== openTag.name) {
      pos++;
      continue;
    }
    if (tag.closing) {
      depth--;
      if (depth === 0) return tag;
    } else {
      depth++;
    }
    pos = tag.end + 1;
  }
  return null;
}

export function parseMarkupSingleToolCall(block: XmlElementBlock): ParsedToolCall | null {
  const attrs = parseTagAttributes(block.attrs);
  const name = toStringSafe(attrs.name);
  if (!name) return null;

  const input: Record<string, any> = {};
  const paramBlocks = findXmlElementBlocks(block.body, 'parameter');

  for (const pb of paramBlocks) {
    const pAttrs = parseTagAttributes(pb.attrs);
    const pName = toStringSafe(pAttrs.name);
    if (!pName) continue;

    let value: any = pb.body.trim();
    if (preservesCDATAStringParameter(pName)) {
      value = extractStandaloneCDATA(sanitizeLooseCDATA(value));
    } else {
      try {
        const decoded = JSON.parse(value);
        if (decoded !== null && typeof decoded === 'object') value = decoded;
      } catch {
        value = extractStandaloneCDATA(value);
      }
    }
    input[pName] = value;
  }

  return { name, input };
}
