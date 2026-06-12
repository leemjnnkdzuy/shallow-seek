export interface Account {
	id: string;
	email: string;
	chat_token: string;
	platform_token?: string;
	proxy?: string;
}
