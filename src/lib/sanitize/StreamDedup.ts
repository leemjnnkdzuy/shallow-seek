export function trimContinuationOverlap(
	accumulated: string,
	newChunk: string,
): string {
	if (!accumulated || !newChunk) return newChunk;

	const maxOverlap = Math.min(accumulated.length, newChunk.length);
	if (maxOverlap === 0) return newChunk;

	let bestOverlap = 0;
	for (let len = maxOverlap; len >= 1; len--) {
		const tail = accumulated.slice(-len);
		const head = newChunk.slice(0, len);
		if (tail === head) {
			bestOverlap = len;
			break;
		}
	}

	if (bestOverlap === 0) return newChunk;
	return newChunk.slice(bestOverlap);
}

export class StreamTextAccumulator {
	private buffer = "";

	append(text: string): string {
		const trimmed = trimContinuationOverlap(this.buffer, text);
		if (trimmed) {
			this.buffer += trimmed;
		}
		return trimmed;
	}

	get text(): string {
		return this.buffer;
	}

	reset(): void {
		this.buffer = "";
	}
}
