export function repairInvalidJSONBackslashes(s: string): string {
	if (!s.includes("\\")) return s;

	let out = "";
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (ch === "\\") {
			if (i + 1 < s.length) {
				const next = s[i + 1];
				if (['"', "\\", "/", "b", "f", "n", "r", "t"].includes(next)) {
					out += "\\" + next;
					i++;
					continue;
				}
				if (next === "u" && i + 5 < s.length) {
					const hex = s.slice(i + 2, i + 6);
					if (/^[0-9a-fA-F]{4}$/.test(hex)) {
						out += "\\u" + hex;
						i += 5;
						continue;
					}
				}
			}
			out += "\\\\";
		} else {
			out += ch;
		}
	}
	return out;
}

export function repairLooseJSON(s: string): string {
	let out = s.trim();
	if (!out) return out;

	out = out.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
	const missingArrayPattern =
		/(:|：)\s*(\{(?:[^{}]|\{[^{}]*\})*\}(?:\s*,\s*\{(?:[^{}]|\{[^{}]*\})*\})+)/g;
	out = out.replace(missingArrayPattern, "$1[$2]");

	return out;
}

export function repairJSONLiterals(s: string): string {
	let out = s.trim();
	out = out.replace(/\bNone\b/g, "null");
	out = out.replace(/\bTrue\b/g, "true");
	out = out.replace(/\bFalse\b/g, "false");
	out = out.replace(/\bundefined\b/g, "null");
	return out;
}
