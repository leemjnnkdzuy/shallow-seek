import {ipcMain, BrowserWindow} from "electron";
import * as apiServer from "@/server/index";
import {setLogCallback} from "@/server/index";
import {getSetting, getAccounts} from "@/services/QueryDB";
import type {ServerConfig, AccountConfig} from "@/types";

/** Per-account logs: accountId → string[] */
const accountLogs = new Map<string, string[]>();

/** Broadcast account server status to all renderer windows. */
function broadcastAccountStatus(accountId: string, isRunning: boolean, port: number) {
	for (const win of BrowserWindow.getAllWindows()) {
		try {
			win.webContents.send(
				"server-account-status-changed",
				accountId,
				isRunning,
				port,
			);
		} catch {
			// window might be destroyed
		}
	}
}

function captureLog(accountId: string, msg: string) {
	let logs = accountLogs.get(accountId);
	if (!logs) {
		logs = [];
		accountLogs.set(accountId, logs);
	}
	logs.push(msg);
	for (const win of BrowserWindow.getAllWindows()) {
		try {
			win.webContents.send("server-account-log", accountId, msg);
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

/** Get a single account from DB by id. */
function getAccountFromDB(accountId: string): AccountConfig | null {
	const dbAccounts = getAccounts();
	const acc = dbAccounts.find((a) => a.id === accountId);
	if (!acc) return null;
	return {
		id: acc.id,
		email: acc.email,
		password: "",
		token: acc.chat_token,
	};
}

/** Find the next available port starting from base, skipping already-used ports. */
function findAvailablePort(basePort: number): number {
	const usedPorts = new Set(
		Object.values(apiServer.getAllRunningAccounts()),
	);
	let port = basePort;
	while (usedPorts.has(port)) {
		port++;
		if (port >= 65536) {
			throw new Error("No available ports");
		}
	}
	return port;
}

export function registerServerIpcs() {
	// Wire server logs to a global log handler (for general server library messages)
	setLogCallback((msg) => {
		// Broadcast to all windows as a general log
		for (const win of BrowserWindow.getAllWindows()) {
			try {
				win.webContents.send("server-log", msg);
			} catch {
				// window might be destroyed
			}
		}
	});

	// ── Start a single account's server ──
	ipcMain.handle(
		"server-start-account",
		async (
			_event,
			payload: {
				accountId: string;
				port?: number;
				apiKey?: string;
			},
		) => {
			const {accountId} = payload;

			if (apiServer.isAccountRunning(accountId)) {
				return {ok: false, error: "Server for this account is already running"};
			}

			// Clear old logs for this account
			accountLogs.set(accountId, []);

			const basePort = payload.port || getPortFromDB();

			try {
				const account = getAccountFromDB(accountId);
				if (!account) {
					return {ok: false, error: "Account not found"};
				}

				const port = findAvailablePort(basePort);

				const apiKeys: string[] = [];
				const apiKey = payload.apiKey || getApiKeyFromDB();
				if (apiKey) {
					apiKeys.push(apiKey);
				}

				const serverConfig: ServerConfig = {
					port,
					apiKeys,
					accounts: [account],
					modelAliases: {},
					autoDeleteMode: "single",
				};

				captureLog(accountId, `[shallowseek-api] Starting server for ${account.email} on port ${port}...`);
				await apiServer.startServerForAccount(accountId, serverConfig);
				captureLog(accountId, `[shallowseek-api] Server started successfully on port ${port}`);
				captureLog(accountId, `[shallowseek-api] OpenAI base URL: http://localhost:${port}/v1`);

				broadcastAccountStatus(accountId, true, port);

				return {ok: true, port};
			} catch (err: any) {
				const msg = err.message || "Unknown error";
				captureLog(accountId, `[shallowseek-api] Start failed: ${msg}`);
				return {ok: false, error: msg};
			}
		},
	);

	// ── Stop a single account's server ──
	ipcMain.handle(
		"server-stop-account",
		async (_event, payload: {accountId: string}) => {
			const {accountId} = payload;

			if (!apiServer.isAccountRunning(accountId)) {
				return {ok: false, error: "Server for this account is not running"};
			}

			try {
				const port = apiServer.getAccountPort(accountId) || 0;
				await apiServer.stopServerForAccount(accountId);
				captureLog(accountId, "[shallowseek-api] Server stopped");
				broadcastAccountStatus(accountId, false, port);
				return {ok: true};
			} catch (err: any) {
				return {ok: false, error: err.message};
			}
		},
	);

	// ── Status for a single account ──
	ipcMain.handle(
		"server-status-account",
		(_event, payload: {accountId: string}) => {
			const {accountId} = payload;
			const isRunning = apiServer.isAccountRunning(accountId);
			const port = apiServer.getAccountPort(accountId) ?? getPortFromDB();
			return {isRunning, port};
		},
	);

	// ── Logs for a single account ──
	ipcMain.handle(
		"server-logs-account",
		(_event, payload: {accountId: string}) => {
			return {logs: accountLogs.get(payload.accountId) || []};
		},
	);

	// ── Global: get all running accounts ──
	ipcMain.handle("server-all-running", () => {
		return apiServer.getAllRunningAccounts();
	});
}
