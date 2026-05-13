export interface ToolCall {
	id: string;
	type: string;
	function: {
		name: string;
		arguments: string;
	};
}
