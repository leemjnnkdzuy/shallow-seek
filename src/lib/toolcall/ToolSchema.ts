import {ParsedToolCall} from "@/types/ToolCall";

export function normalizeParsedToolCallsForSchemas(
	calls: ParsedToolCall[],
	toolsRaw: any,
): ParsedToolCall[] {
	if (!calls || calls.length === 0) return calls;

	const schemas = buildToolSchemaIndex(toolsRaw);
	if (!schemas || Object.keys(schemas).length === 0) return calls;

	let changedAny = false;
	const out = calls.map((call) => {
		const schema = schemas[call.Name.toLowerCase().trim()];
		if (!schema || !call.Input) return call;

		const {value: normalized, changed} = normalizeToolValueWithSchema(
			call.Input,
			schema,
		);
		if (changed && typeof normalized === "object" && normalized !== null) {
			changedAny = true;
			return {...call, Input: normalized as Record<string, any>};
		}
		return call;
	});

	return changedAny ? out : calls;
}

function buildToolSchemaIndex(toolsRaw: any): Record<string, any> {
	if (!Array.isArray(toolsRaw)) return {};
	const out: Record<string, any> = {};
	for (const item of toolsRaw) {
		const {name, schema} = extractToolMeta(item);
		if (name && schema) {
			out[name.toLowerCase()] = schema;
		}
	}
	return out;
}

function extractToolMeta(tool: any): {name: string; desc: string; schema: any} {
	let name = (tool.name || "").trim();
	let desc = (tool.description || "").trim();
	let schema =
		tool.parameters || tool.input_schema || tool.inputSchema || tool.schema;

	if (tool.function && typeof tool.function === "object") {
		if (!name) name = (tool.function.name || "").trim();
		if (!desc) desc = (tool.function.description || "").trim();
		schema =
			schema ||
			tool.function.parameters ||
			tool.function.input_schema ||
			tool.function.inputSchema ||
			tool.function.schema;
	}
	return {name, desc, schema};
}

function normalizeToolValueWithSchema(
	value: any,
	schema: any,
): {value: any; changed: boolean} {
	if (value === null || value === undefined || !schema)
		return {value, changed: false};

	if (shouldCoerceSchemaToString(schema)) {
		return stringifySchemaValue(value);
	}

	if (looksLikeObjectSchema(schema)) {
		if (
			typeof value !== "object" ||
			value === null ||
			Array.isArray(value)
		) {
			return {value, changed: false};
		}
		const properties = schema.properties || {};
		const additional = schema.additionalProperties;
		let changed = false;
		const out: Record<string, any> = {};

		for (const key in value) {
			const current = value[key];
			let next = current;
			let fieldChanged = false;

			if (properties[key]) {
				({value: next, changed: fieldChanged} =
					normalizeToolValueWithSchema(current, properties[key]));
			} else if (additional) {
				({value: next, changed: fieldChanged} =
					normalizeToolValueWithSchema(current, additional));
			}

			out[key] = next;
			if (fieldChanged) changed = true;
		}
		return {value: changed ? out : value, changed};
	}

	if (looksLikeArraySchema(schema)) {
		if (!Array.isArray(value)) return {value, changed: false};
		const itemsSchema = schema.items;
		if (!itemsSchema) return {value, changed: false};

		let changed = false;
		const out = value.map((item, i) => {
			let itemSchema = itemsSchema;
			if (Array.isArray(itemsSchema)) {
				itemSchema = i < itemsSchema.length ? itemsSchema[i] : null;
			}
			if (!itemSchema) return item;
			const {value: next, changed: itemChanged} =
				normalizeToolValueWithSchema(item, itemSchema);
			if (itemChanged) changed = true;
			return next;
		});

		return {value: changed ? out : value, changed};
	}

	return {value, changed: false};
}

function shouldCoerceSchemaToString(schema: any): boolean {
	if (!schema) return false;
	if (typeof schema.const === "string") return true;
	if (
		Array.isArray(schema.enum) &&
		schema.enum.every((v: any) => typeof v === "string")
	)
		return true;

	const type = schema.type;
	if (typeof type === "string") return type.toLowerCase() === "string";
	if (Array.isArray(type)) {
		return (
			type.some(
				(t: any) =>
					typeof t === "string" && t.toLowerCase() === "string",
			) &&
			type.every(
				(t: any) =>
					typeof t === "string" &&
					(t.toLowerCase() === "string" ||
						t.toLowerCase() === "null"),
			)
		);
	}
	return false;
}

function looksLikeObjectSchema(schema: any): boolean {
	if (!schema) return false;
	if (schema.type === "object") return true;
	return !!(schema.properties || schema.additionalProperties);
}

function looksLikeArraySchema(schema: any): boolean {
	if (!schema) return false;
	if (schema.type === "array") return true;
	return !!schema.items;
}

function stringifySchemaValue(value: any): {value: any; changed: boolean} {
	if (value === null || value === undefined) return {value, changed: false};
	if (typeof value === "string") return {value, changed: false};
	try {
		return {value: JSON.stringify(value), changed: true};
	} catch {
		return {value, changed: false};
	}
}
