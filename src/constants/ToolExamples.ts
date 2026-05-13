interface ToolExample {
	name: string;
	params: string;
}

function wrapParam(name: string, value: string): string {
	const cdata = value.includes("]]>")
		? "<![CDATA[" + value.replace(/]]>/g, "]]]><![CDATA[>") + "]]>"
		: "<![CDATA[" + value + "]]>";
	return `<|DSML|parameter name="${name}">${cdata}</|DSML|parameter>`;
}

function exampleBasicParams(name: string): string | null {
	switch (name.trim()) {
		case "Read":
			return wrapParam("file_path", "README.md");
		case "Glob":
			return wrapParam("pattern", "**/*.go") + "\n" + wrapParam("path", ".");
		case "read_file":
			return wrapParam("path", "src/main.go");
		case "list_files":
			return wrapParam("path", ".");
		case "search_files":
			return wrapParam("query", "tool call parser");
		case "Bash":
		case "execute_command":
			return wrapParam("command", "pwd");
		case "exec_command":
			return wrapParam("cmd", "pwd");
		case "Write":
			return wrapParam("file_path", "notes.txt") + "\n" + wrapParam("content", "Hello world");
		case "write_to_file":
			return wrapParam("path", "notes.txt") + "\n" + wrapParam("content", "Hello world");
		case "Edit":
			return wrapParam("file_path", "README.md") + "\n" + wrapParam("old_string", "foo") + "\n" + wrapParam("new_string", "bar");
		default:
			return null;
	}
}

function firstBasicExample(names: string[]): ToolExample | null {
	for (const name of names) {
		const params = exampleBasicParams(name);
		if (params) return { name, params };
	}
	return null;
}

function firstNBasicExamples(names: string[], count: number): ToolExample[] {
	const out: ToolExample[] = [];
	for (const name of names) {
		const params = exampleBasicParams(name);
		if (params) {
			out.push({ name, params });
			if (out.length >= count) return out;
		}
	}
	return out;
}

function firstScriptExample(names: string[]): ToolExample | null {
	const scriptCmd = `cat > /tmp/test_escape.sh <<'EOF'\n#!/bin/bash\necho 'single "double"'\necho "literal dollar: \\$HOME"\nEOF\nbash /tmp/test_escape.sh`;
	const scriptContent = `#!/bin/bash\necho 'single "double"'\necho "literal dollar: $HOME"`;

	for (const name of names) {
		switch (name.trim()) {
			case "Bash":
				return { name, params: wrapParam("command", scriptCmd) + "\n" + wrapParam("description", "Test shell escaping") };
			case "execute_command":
				return { name, params: wrapParam("command", scriptCmd) };
			case "exec_command":
				return { name, params: wrapParam("cmd", scriptCmd) };
			case "Write":
				return { name, params: wrapParam("file_path", "test_escape.sh") + "\n" + wrapParam("content", scriptContent) };
			case "write_to_file":
				return { name, params: wrapParam("path", "test_escape.sh") + "\n" + wrapParam("content", scriptContent) };
		}
	}
	return null;
}

function renderExampleBlock(calls: ToolExample[]): string {
	let block = "<|DSML|tool_calls>\n";
	for (const call of calls) {
		block += `  <|DSML|invoke name="${call.name}">\n`;
		const lines = call.params.split("\n");
		for (const line of lines) {
			block += "    " + line + "\n";
		}
		block += "  </|DSML|invoke>\n";
	}
	block += "</|DSML|tool_calls>";
	return block;
}

export function buildCorrectToolExamples(toolNames: string[]): string {
	const unique = [...new Set(toolNames.map(n => n.trim()).filter(Boolean))];
	if (unique.length === 0) return "";

	const examples: string[] = [];

	const single = firstBasicExample(unique);
	if (single) {
		examples.push("Example A — Single tool:\n" + renderExampleBlock([single]));
	}

	const parallel = firstNBasicExamples(unique, 2);
	if (parallel.length >= 2) {
		examples.push("Example B — Two tools in parallel:\n" + renderExampleBlock(parallel));
	}

	const script = firstScriptExample(unique);
	if (script) {
		examples.push("Example C — Tool with long script using CDATA (RELIABLE FOR CODE/SCRIPTS):\n" + renderExampleBlock([script]));
	}

	if (examples.length === 0) return "";
	return "【CORRECT EXAMPLES】:\n\n" + examples.join("\n\n");
}

export function hasReadLikeTool(names: string[]): boolean {
	for (const name of names) {
		const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (normalized === "read" || normalized === "readfile") return true;
	}
	return false;
}
