export interface DbAPI {
	addAccount: (account: {
		id: string;
		email: string;
		chat_token: string;
		platform_token?: string;
	}) => Promise<{ success: boolean; error?: string }>;
	getAccounts: () => Promise<{
		success: boolean;
		data?: { id: string; email: string; chat_token: string; platform_token?: string }[];
		error?: string;
	}>;
	deleteAccount: (
		id: string,
	) => Promise<{ success: boolean; error?: string }>;
	checkAccountExists: (
		email: string,
	) => Promise<{ success: boolean; exists: boolean; error?: string }>;
	getSetting: (key: string) => Promise<{ success: boolean; value?: string; error?: string }>;
	setSetting: (key: string, value: string) => Promise<{ success: boolean; error?: string }>;
	getAllSettings: () => Promise<{ success: boolean; data?: Record<string, string>; error?: string }>;
}
