import {CITATION_MARKER_PATTERN} from "@/constants";

export function stripReferenceMarkers(text: string): string {
	if (!text) return text;
	return text.replace(CITATION_MARKER_PATTERN, "");
}
