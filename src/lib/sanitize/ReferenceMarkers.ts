const citationReferenceMarkerPattern = /\[(citation|reference):\s*\d+\]/gi;

export function stripReferenceMarkers(text: string): string {
	if (!text) return text;
	return text.replace(citationReferenceMarkerPattern, "");
}
