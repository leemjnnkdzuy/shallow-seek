export const TOOL_CALL_INSTRUCTIONS = `TOOL CALL FORMAT — FOLLOW EXACTLY:

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

Remember: The ONLY valid way to use tools is the <|DSML|tool_calls>...</|DSML|tool_calls> block at the end of your response.`;

export const READ_TOOL_CACHE_GUARD =
	"Read-tool cache guard: If a Read/read_file-style tool result says the file " +
	"is unchanged, already available in history, should be referenced from previous " +
	"context, or otherwise provides no file body, treat that result as missing content. " +
	"Do not repeatedly call the same read request for that missing body. Request a " +
	"full-content read if the tool supports it, or tell the user that the file contents " +
	"need to be provided again.";
