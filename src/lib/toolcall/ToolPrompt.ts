export function buildToolCallInstructions(toolNames: string[]): string {
	return `TOOL CALL FORMAT — FOLLOW EXACTLY:

<|DSML|tool_calls>
  <|DSML|invoke name="TOOL_NAME_HERE">
    <|DSML|parameter name="PARAMETER_NAME"><![CDATA[PARAMETER_VALUE]]></|DSML|parameter>
  </|DSML|invoke>
</|DSML|tool_calls>

RULES:
1) Use the <|DSML|tool_calls> wrapper format.
2) Put one or more <|DSML|invoke> entries under a single <|DSML|tool_calls> root.
3) Put the tool name in the invoke name attribute: <|DSML|invoke name="TOOL_NAME">.
3a) Tag punctuation alphabet: ASCII < > / = " plus the halfwidth pipe |.
4) All string values must use <![CDATA[...]]>, even short ones. This includes code, scripts, file contents, prompts, paths, names, and queries.
5) Every top-level argument must be a <|DSML|parameter name="ARG_NAME">...</|DSML|parameter> node.
6) Objects use nested XML elements inside the parameter body. Arrays may repeat <item> children.
7) Numbers, booleans, and null stay plain text.
8) Use only the parameter names in the tool schema. Do not invent fields.
9) Fill parameters with the actual values required for this call. Do not emit placeholder, blank, or whitespace-only parameters.
10) If a required parameter value is unknown, ask the user or answer normally instead of outputting an empty tool call.
11) For shell tools such as Bash / execute_command, the command/script must be inside the command parameter. Never call them with an empty command.
12) Do NOT wrap XML in markdown fences. Do NOT output explanations, role markers, or internal monologue.
13) If you call a tool, the first non-whitespace characters of that tool block must be exactly <|DSML|tool_calls>.
14) Never omit the opening <|DSML|tool_calls> tag, even if you already plan to close with </|DSML|tool_calls>.
15) Compatibility note: the runtime also accepts the legacy XML tags <tool_calls> / <invoke> / <parameter>, but prefer the DSML-prefixed form above.

PARAMETER SHAPES:
- string => <|DSML|parameter name="x"><![CDATA[value]]></|DSML|parameter>
- object => <|DSML|parameter name="x"><field>...</field></|DSML|parameter>
- array => <|DSML|parameter name="x"><item>...</item><item>...</item></|DSML|parameter>
- number/bool/null => <|DSML|parameter name="x">plain_text</|DSML|parameter>

【WRONG — Do NOT do these】:

Wrong 1 — mixed text after XML:
  <|DSML|tool_calls>...</|DSML|tool_calls> I hope this helps.
Wrong 2 — Markdown code fences:
  \`\`\`xml
  <|DSML|tool_calls>...</|DSML|tool_calls>
  \`\`\`
Wrong 3 — missing opening wrapper:
  <|DSML|invoke name="TOOL_NAME">...</|DSML|invoke>
  </|DSML|tool_calls>
Wrong 4 — empty parameters:
  <|DSML|tool_calls>
    <|DSML|invoke name="Bash">
      <|DSML|parameter name="command"></|DSML|parameter>
    </|DSML|invoke>
  </|DSML|tool_calls>

Remember: The ONLY valid way to use tools is the <|DSML|tool_calls>...</|DSML|tool_calls> block at the end of your response.
${buildCorrectToolExamples(toolNames)}`;
}

interface PromptToolExample {
	name: string;
	params: string;
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
