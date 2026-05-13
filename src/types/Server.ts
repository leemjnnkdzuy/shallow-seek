export interface ServerAPI {
	startAccount: (payload: {
		accountId: string;
		port?: number;
		apiKey?: string;
	}) => Promise<{
		ok: boolean;
		error?: string;
		port?: number;
	}>;
	stopAccount: (payload: {
		accountId: string;
	}) => Promise<{ok: boolean; error?: string}>;
	statusAccount: (payload: {
		accountId: string;
	}) => Promise<{
		isRunning: boolean;
		port?: number;
	}>;
	getLogsAccount: (payload: {
		accountId: string;
	}) => Promise<{logs: string[]}>;
	getAllRunning: () => Promise<Record<string, number>>;
	onAccountLog: (
		callback: (accountId: string, msg: string) => void,
	) => () => void;
	onAccountStatusChanged: (
		callback: (
			accountId: string,
			isRunning: boolean,
			port: number,
		) => void,
	) => () => void;
}
