const citationMarkerPattern = /\[(citation|reference):\s*(\d+)\]/gi;

export function replaceCitationMarkersWithLinks(
	text: string,
	links: Map<number, string> | Record<number, string>,
): string {
	if (!text.trim() || !links) return text;

	const linkMap =
		links instanceof Map ? links : (
			new Map(Object.entries(links).map(([k, v]) => [Number(k), v]))
		);

	if (linkMap.size === 0) return text;

	const zeroBasedReference = hasZeroBasedReferenceMarker(text);

	return text.replace(citationMarkerPattern, (match, type, numStr) => {
		const idx = Number.parseInt(numStr, 10);
		if (Number.isNaN(idx) || idx < 0) return match;

		let lookupIdx = idx;
		if (type.toLowerCase() === "reference" && zeroBasedReference) {
			lookupIdx = idx + 1;
		}

		const url = linkMap.get(lookupIdx)?.trim();
		if (!url) return match;

		return `[${idx}](${url})`;
	});
}

function hasZeroBasedReferenceMarker(text: string): boolean {
	const pattern = /\[(citation|reference):\s*(\d+)\]/gi;
	let m: RegExpExecArray | null;
	while ((m = pattern.exec(text)) !== null) {
		if (m[1].toLowerCase() !== "reference") continue;
		const idx = Number.parseInt(m[2], 10);
		if (idx === 0) return true;
	}
	return false;
}
