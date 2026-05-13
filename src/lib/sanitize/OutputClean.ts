import {sanitizeLeakedOutput} from "@/lib/sanitize/LeakedOutputSanitizer";
import {stripReferenceMarkers} from "@/lib/sanitize/ReferenceMarkers";

export function cleanVisibleOutput(
	text: string,
	stripRefMarkers = true,
): string {
	if (!text) return text;
	let out = text;
	if (stripRefMarkers) {
		out = stripReferenceMarkers(out);
	}
	return sanitizeLeakedOutput(out);
}
