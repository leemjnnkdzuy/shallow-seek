import {ipcMain, BrowserWindow} from "electron";
import * as apiServer from "../server/index";
import {setLogCallback} from "../server/index";
import {getSetting, getAccounts} from "../services/QueryDB";
import type {ServerConfig, AccountConfig} from "../types";

let serverLogs: string[] = [];
let serverAccountPorts: Record<string, number> = {};
let runningBasePort: number | null = null;

/** Broadcast server status to all renderer windows. */
function broadcastServerStatus(isRunning: boolean) {
	const port = runningBasePort ?? getPortFromDB();
	for (const win of BrowserWindow.getAllWindows()) {
		try {
			win.webContents.send(
				"server-status-changed",
				isRunning,
				port,
				serverAccountPorts,
			);
		} catch {
			// window might be destroyed
		}
	}
}

function captureLog(msg: string) {
	serverLogs.push(msg);
	for (const win of BrowserWindow.getAllWindows()) {
		try {
			win.webContents.send("server-log", msg);
		} catch {
			// window might be destroyed
		}
	}
}

/** Read port from DB settings, fall back to 11434. */
function getPortFromDB(): number {
	const raw = getSetting("endpointPort");
	if (raw) {
		const parsed = parseInt(raw, 10);
		if (!isNaN(parsed) && parsed > 0 && parsed < 65536) return parsed;
	}
	return 11434;
}

/** Read API key from DB settings. */
function getApiKeyFromDB(): string | null {
	return getSetting("endpointApiKey");
}

/** Build account list from DB accounts table. */
function getAccountsFromDB(): AccountConfig[] {
	const dbAccounts = getAccounts().slice().reverse();
	return dbAccounts.map((acc) => ({
		id: acc.id,
		email: acc.email,
		password: "",
		token: acc.chat_token,
	}));
}

function buildAccountPortMap(
	accounts: AccountConfig[],
	basePort: number,
): Record<string, number> {
	return accounts.reduce<Record<string, number>>((acc, account, index) => {
		acc[account.id] = basePort + index;
		return acc;
	}, {});
}

export function registerServerIpcs() {
	// Wire server logs to UI
	setLogCallback(captureLog);

	ipcMain.handle(
		"server-start",
		async (
			_event,
			config?: {
				token?: string;
				port?: number;
				apiKey?: string;
				accounts?: AccountConfig[];
			},
		) => {
			if (apiServer.isRunning()) {
				return {ok: false, error: "Server is already running"};
			}

			serverLogs = [];
			serverAccountPorts = {};
			runningBasePort = null;

			const port = config?.port || getPortFromDB();

			try {
				let accounts: AccountConfig[] = config?.accounts || [];

				if (accounts.length === 0) {
					accounts = getAccountsFromDB();
				}

				if (accounts.length === 0 && config?.token) {
					accounts = [
						{
							id: "direct-token",
							email: "direct",
							password: "",
							token: config.token,
						},
					];
				}

				if (accounts.length === 0) {
					return {ok: false, error: "No accounts configured"};
				}

				const apiKeys: string[] = [];
				const apiKey = config?.apiKey || getApiKeyFromDB();
				if (apiKey) {
					apiKeys.push(apiKey);
				}

				const serverConfig: ServerConfig = {
					port,
					apiKeys,
					accounts,
					modelAliases: {},
					autoDeleteMode: "single",
				};

				serverAccountPorts = buildAccountPortMap(accounts, port);
				runningBasePort = port;

				const startLabel =
					accounts.length > 1 ?
						`Starting ${accounts.length} server(s) from port ${port}...`
					:	`Starting server on port ${port}...`;
				captureLog(`[shallowseek-api] ${startLabel}`);
				await apiServer.startServer(serverConfig);
				captureLog(
					`[shallowseek-api] Server started successfully on port ${port}`,
				);
				captureLog(
					`[shallowseek-api] OpenAI base URL: http://localhost:${port}/v1`,
				);
				captureLog(
					`[shallowseek-api] ${accounts.length} account(s) loaded`,
				);

				broadcastServerStatus(true);

				return {ok: true, port, accountPorts: serverAccountPorts};
			} catch (err: any) {
				const msg = err.message || "Unknown error";
				serverAccountPorts = {};
				runningBasePort = null;
				captureLog(`[shallowseek-api] Start failed: ${msg}`);
				return {ok: false, error: msg};
			}
		},
	);

	ipcMain.handle("server-stop", async () => {
		if (!apiServer.isRunning()) {
			return {ok: false, error: "Server is not running"};
		}
		try {
			await apiServer.stopServer();
			serverAccountPorts = {};
			runningBasePort = null;
			broadcastServerStatus(false);
			return {ok: true};
		} catch (err: any) {
			return {ok: false, error: err.message};
		}
	});

	ipcMain.handle("server-status", () => {
		return {
			isRunning: apiServer.isRunning(),
			port: runningBasePort ?? getPortFromDB(),
			accountPorts: serverAccountPorts,
		};
	});

	ipcMain.handle("server-logs", () => {
		return {logs: serverLogs};
	});
}
