export interface SearchResult {
	url: string;
	title: string;
	snippet?: string;
	site_name?: string;
}

export interface ChatFragment {
	type: string;
	files?: { file_name: string }[];
	content?: string;
	search_results?: SearchResult[];
}

export interface DeepSeekMessage {
	role: string;
	content?: string;
	text?: string;
	message_id?: string | number;
	id?: string | number;
	fragments?: ChatFragment[];
	search_results?: SearchResult[];
}

export interface FormattedMessage {
	role: string;
	content: string;
	files?: string[];
	id?: number | string;
	search_results?: SearchResult[];
}
