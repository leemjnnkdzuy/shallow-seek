export interface ServerAPI {
	start: (config?: { token?: string; port?: number; apiKey?: string }) => Promise<{ ok: boolean; error?: string; port?: number }>;
	stop: () => Promise<{ ok: boolean; error?: string }>;
	status: () => Promise<{ isRunning: boolean; port?: number }>;
	getLogs: () => Promise<{ logs: string[] }>;
	onLog: (callback: (msg: string) => void) => () => void;
	onStatusChanged: (callback: (isRunning: boolean, port?: number) => void) => () => void;
}
