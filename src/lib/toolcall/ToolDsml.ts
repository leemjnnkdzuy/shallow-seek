import {
	scanToolMarkupTagAt,
} from "./ToolScanner";
import {
	canonicalizeToolCallCandidateSpans,
	skipXMLIgnoredSection,
} from "./ToolCandidateDetector";
import {
	containsToolMarkupSyntaxOutsideIgnored,
} from "./ToolScanner";

/**
 * Port of toolcalls_dsml.go
 */
export function normalizeDSMLToolCallMarkup(text: string): {
	text: string;
	ok: boolean;
} {
	if (!text) return { text: "", ok: true };

	const canonicalized = canonicalizeToolCallCandidateSpans(text);
	const { hasDSML, hasCanonical } = containsToolMarkupSyntaxOutsideIgnored(canonicalized);

	if (!hasDSML && !hasCanonical) {
		return { text: canonicalized, ok: true };
	}

	return { text: rewriteDSMLToolMarkupOutsideIgnored(canonicalized), ok: true };
}

/**
 * rewriteDSMLToolMarkupOutsideIgnored rewrites DSML-style markup to canonical XML.
 */
function rewriteDSMLToolMarkupOutsideIgnored(text: string): string {
	if (!text) return "";
	let out = "";

	for (let i = 0; i < text.length; ) {
		const { next, advanced, blocked } = skipXMLIgnoredSection(text, i);
		if (blocked) {
			out += text.slice(i);
			break;
		}
		if (advanced) {
			out += text.slice(i, next);
			i = next;
			continue;
		}

		// markdownCodeSpanEnd check
		const codeEnd = markdownCodeSpanEndAt(text, i);
		if (codeEnd !== -1) {
			out += text.slice(i, codeEnd);
			i = codeEnd;
			continue;
		}

		const tag = scanToolMarkupTagAt(text, i);
		if (!tag) {
			out += text[i];
			i++;
			continue;
		}

		out += "<" + (tag.Closing ? "/" : "") + tag.Name + ">";
		i = tag.End + 1;
	}
	return out;
}

function markdownCodeSpanEndAt(text: string, idx: number): number {
	if (text[idx] !== "`") return -1;
	let count = 0;
	while (idx + count < text.length && text[idx + count] === "`") count++;
	const fence = text.slice(idx, idx + count);
	const end = text.indexOf(fence, idx + count);
	if (end === -1) return -1;
	return end + count;
}
