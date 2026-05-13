export function parseStructuredToolCallInput(raw: string): Record<string, any> {
	const trimmed = raw.trim();
	if (!trimmed) return {};

	if (trimmed.startsWith("<")) {
		const {value, ok} = parseXMLFragmentValue(trimmed);
		if (ok) {
			if (
				typeof value === "object" &&
				value !== null &&
				!Array.isArray(value)
			) {
				return value;
			}
			if (typeof value === "string") {
				const text = value.trim();
				if (!text) return {};
				return {_raw: value};
			}
		}
	}

	return {_raw: trimmed};
}

export function parseXMLFragmentValue(raw: string): {value: any; ok: boolean} {
	const trimmed = raw.trim();
	if (!trimmed) return {value: "", ok: true};

	try {
		const result = parseSimpleXml(trimmed);
		return {value: result, ok: true};
	} catch {
		return {value: null, ok: false};
	}
}

function parseSimpleXml(xml: string): any {
	const wrapped = `<root>${xml}</root>`;
	const tokens = tokenizeXml(wrapped);
	let pos = 0;

	function parseNode(): any {
		const startTag = tokens[pos++];
		if (
			!startTag ||
			!startTag.startsWith("<") ||
			startTag.startsWith("</")
		) {
			throw new Error("Invalid start tag");
		}

		const tagName = startTag.slice(1, -1).split(" ")[0];
		const children: Record<string, any> = {};
		let text = "";

		while (pos < tokens.length) {
			const token = tokens[pos];
			if (token.startsWith("</")) {
				const endTagName = token.slice(2, -1);
				if (endTagName !== tagName) throw new Error("Mismatched tag");
				pos++;

				if (Object.keys(children).length === 0) {
					return tryParseJsonLiteral(text.trim()) ?? text;
				}
				if (text.trim()) {
					children["_text"] =
						tryParseJsonLiteral(text.trim()) ?? text;
				}

				const childKeys = Object.keys(children);
				if (childKeys.length === 1 && childKeys[0] === "item") {
					return Array.isArray(children["item"]) ?
							children["item"]
						:	[children["item"]];
				}

				return children;
			} else if (token.startsWith("<")) {
				const childName = token.slice(1, -1).split(" ")[0];
				const childValue = parseNode();
				appendXMLChildValue(children, childName, childValue);
			} else {
				text += token;
				pos++;
			}
		}
		return text;
	}

	return parseNode();
}

function appendXMLChildValue(
	dst: Record<string, any>,
	key: string,
	value: any,
) {
	if (!key) return;
	if (Object.prototype.hasOwnProperty.call(dst, key)) {
		const existing = dst[key];
		if (Array.isArray(existing)) {
			existing.push(value);
		} else {
			dst[key] = [existing, value];
		}
	} else {
		dst[key] = value;
	}
}

function tokenizeXml(xml: string): string[] {
	const tokens: string[] = [];
	let current = "";
	for (let i = 0; i < xml.length; i++) {
		if (xml[i] === "<") {
			if (current) tokens.push(current);
			let end = xml.indexOf(">", i);
			if (end === -1) end = xml.length;
			tokens.push(xml.slice(i, end + 1));
			i = end;
			current = "";
		} else {
			current += xml[i];
		}
	}
	if (current) tokens.push(current);
	return tokens;
}

function tryParseJsonLiteral(s: string): any {
	if (!s) return null;
	const lower = s.toLowerCase();
	if (lower === "true") return true;
	if (lower === "false") return false;
	if (lower === "null") return null;
	if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
	return undefined;
}
