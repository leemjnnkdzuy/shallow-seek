import {PromptToolExample} from "@/types/ToolCall";
import {TOOL_CALL_INSTRUCTIONS} from "@/constants";

export function buildToolCallInstructions(toolNames: string[]): string {
	return `${TOOL_CALL_INSTRUCTIONS}
${buildCorrectToolExamples(toolNames)}`;
}


function buildCorrectToolExamples(toolNames: string[]): string {
	const names = uniqueToolNames(toolNames);
	const examples: string[] = [];

	const single = firstBasicExample(names);
	if (single) {
		examples.push(
			"Example A — Single tool:\n" + renderToolExampleBlock([single]),
		);
	}

	const parallel = firstNBasicExamples(names, 2);
	if (parallel.length >= 2) {
		examples.push(
			"Example B — Two tools in parallel:\n" +
				renderToolExampleBlock(parallel),
		);
	}

	const nested = firstNestedExample(names);
	if (nested) {
		examples.push(
			"Example C — Tool with nested XML parameters:\n" +
				renderToolExampleBlock([nested]),
		);
	}

	const script = firstScriptExample(names);
	if (script) {
		examples.push(
			"Example D — Tool with long script using CDATA (RELIABLE FOR CODE/SCRIPTS):\n" +
				renderToolExampleBlock([script]),
		);
	}

	if (examples.length === 0) {
		return "";
	}
	return "【CORRECT EXAMPLES】:\n\n" + examples.join("\n\n") + "\n\n";
}

function uniqueToolNames(toolNames: string[]): string[] {
	const names: string[] = [];
	const seen = new Set<string>();
	for (let name of toolNames) {
		name = name.trim();
		if (name === "" || seen.has(name)) {
			continue;
		}
		seen.add(name);
		names.push(name);
	}
	return names;
}

function firstBasicExample(names: string[]): PromptToolExample | null {
	for (const name of names) {
		const params = exampleBasicParams(name);
		if (params) {
			return {name, params};
		}
	}
	return null;
}

function firstNBasicExamples(
	names: string[],
	count: number,
): PromptToolExample[] {
	const out: PromptToolExample[] = [];
	for (const name of names) {
		const params = exampleBasicParams(name);
		if (params) {
			out.push({name, params});
			if (out.length === count) {
				return out;
			}
		}
	}
	return out;
}

function firstNestedExample(names: string[]): PromptToolExample | null {
	for (const name of names) {
		const params = exampleNestedParams(name);
		if (params) {
			return {name, params};
		}
	}
	return null;
}

function firstScriptExample(names: string[]): PromptToolExample | null {
	for (const name of names) {
		const params = exampleScriptParams(name);
		if (params) {
			return {name, params};
		}
	}
	return null;
}

function renderToolExampleBlock(calls: PromptToolExample[]): string {
	let b = "<|DSML|tool_calls>\n";
	for (const call of calls) {
		b += `  <|DSML|invoke name="${call.name}">\n`;
		b += indentPromptParameters(call.params, "    ");
		b += "\n  </|DSML|invoke>\n";
	}
	b += "</|DSML|tool_calls>";
	return b;
}

function indentPromptParameters(body: string, indent: string): string {
	if (body.trim() === "") {
		return indent + `<|DSML|parameter name="content"></|DSML|parameter>`;
	}
	const lines = body.split("\n");
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim() === "") {
			continue;
		}
		lines[i] = indent + lines[i];
	}
	return lines.join("\n");
}

function wrapParameter(name: string, inner: string): string {
	return `<|DSML|parameter name="${name}">${inner}</|DSML|parameter>`;
}

function exampleBasicParams(name: string): string | null {
	switch (name.trim()) {
		case "Read":
			return wrapParameter("file_path", promptCDATA("README.md"));
		case "Glob":
			return (
				wrapParameter("pattern", promptCDATA("**/*.go")) +
				"\n" +
				wrapParameter("path", promptCDATA("."))
			);
		case "read_file":
			return wrapParameter("path", promptCDATA("src/main.go"));
		case "list_files":
			return wrapParameter("path", promptCDATA("."));
		case "search_files":
			return wrapParameter("query", promptCDATA("tool call parser"));
		case "Bash":
		case "execute_command":
			return wrapParameter("command", promptCDATA("pwd"));
		case "exec_command":
			return wrapParameter("cmd", promptCDATA("pwd"));
		case "Write":
			return (
				wrapParameter("file_path", promptCDATA("notes.txt")) +
				"\n" +
				wrapParameter("content", promptCDATA("Hello world"))
			);
		case "write_to_file":
			return (
				wrapParameter("path", promptCDATA("notes.txt")) +
				"\n" +
				wrapParameter("content", promptCDATA("Hello world"))
			);
		case "Edit":
			return (
				wrapParameter("file_path", promptCDATA("README.md")) +
				"\n" +
				wrapParameter("old_string", promptCDATA("foo")) +
				"\n" +
				wrapParameter("new_string", promptCDATA("bar"))
			);
		case "MultiEdit":
			return (
				wrapParameter("file_path", promptCDATA("README.md")) +
				"\n" +
				`<|DSML|parameter name="edits"><item><old_string>${promptCDATA("foo")}</old_string><new_string>${promptCDATA("bar")}</new_string></item></|DSML|parameter>`
			);
	}
	return null;
}

function exampleNestedParams(name: string): string | null {
	switch (name.trim()) {
		case "MultiEdit":
			return (
				wrapParameter("file_path", promptCDATA("README.md")) +
				"\n" +
				`<|DSML|parameter name="edits"><item><old_string>${promptCDATA("foo")}</old_string><new_string>${promptCDATA("bar")}</new_string></item></|DSML|parameter>`
			);
		case "Task":
			return (
				wrapParameter(
					"description",
					promptCDATA("Investigate flaky tests"),
				) +
				"\n" +
				wrapParameter(
					"prompt",
					promptCDATA("Run targeted tests and summarize failures"),
				)
			);
		case "ask_followup_question":
			return (
				wrapParameter(
					"question",
					promptCDATA("Which approach do you prefer?"),
				) +
				"\n" +
				`<|DSML|parameter name="follow_up"><item><text>${promptCDATA("Option A")}</text></item><item><text>${promptCDATA("Option B")}</text></item></|DSML|parameter>`
			);
	}
	return null;
}

function exampleScriptParams(name: string): string | null {
	const scriptCommand = `cat > /tmp/test_escape.sh <<'EOF'
#!/bin/bash
echo 'single "double"'
echo "literal dollar: \\$HOME"
EOF
bash /tmp/test_escape.sh`;
	const scriptContent = `#!/bin/bash
echo 'single "double"'
echo "literal dollar: $HOME"`;

	switch (name.trim()) {
		case "Bash":
			return (
				wrapParameter("command", promptCDATA(scriptCommand)) +
				"\n" +
				wrapParameter("description", promptCDATA("Test shell escaping"))
			);
		case "execute_command":
			return wrapParameter("command", promptCDATA(scriptCommand));
		case "exec_command":
			return wrapParameter("cmd", promptCDATA(scriptCommand));
		case "Write":
			return (
				wrapParameter("file_path", promptCDATA("test_escape.sh")) +
				"\n" +
				wrapParameter("content", promptCDATA(scriptContent))
			);
		case "write_to_file":
			return (
				wrapParameter("path", promptCDATA("test_escape.sh")) +
				"\n" +
				wrapParameter("content", promptCDATA(scriptContent))
			);
	}
	return null;
}

function promptCDATA(text: string): string {
	if (text === "") {
		return "";
	}
	if (text.includes("]]>")) {
		return "<![CDATA[" + text.split("]]>").join("]]]]><![CDATA[>") + "]]>";
	}
	return "<![CDATA[" + text + "]]>";
}

export function hasReadLikeTool(names: string[]): boolean {
	for (const name of names) {
		const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (normalized === "read" || normalized === "readfile") return true;
	}
	return false;
}
