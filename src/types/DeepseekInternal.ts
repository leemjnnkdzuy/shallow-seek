export interface DeepSeekCompletionPayload {
	chat_session_id: string;
	prompt: string;
	ref_file_ids: string[];
	thinking_enabled: boolean;
	search_enabled: boolean;
	model_class?: string;
	parent_message_id: number | null;
}
