export interface ChatFragment {
	type: string;
	files?: { file_name: string }[];
	content?: string;
}

export interface DeepSeekMessage {
	role: string;
	content?: string;
	text?: string;
	message_id?: string | number;
	id?: string | number;
	fragments?: ChatFragment[];
}

export interface FormattedMessage {
	role: string;
	content: string;
	files?: string[];
	id?: number | string;
}
