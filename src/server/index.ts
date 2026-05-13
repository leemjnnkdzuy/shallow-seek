import http from "node:http";

import * as dsClient from "./DeepseekClient";
import type {ServerConfig} from "../types";
import type {ServerInstanceState, ServerInstance} from "../types/ServerInternal";
import {handleRequest} from "../handlers/ServerRequest";
import {
	setLogCallback as _setLogCallback,
	logWithPort,
	getErrorMessage,
} from "../handlers/ServerHelpers";

/** Map of accountId → running ServerInstance */
const runningServers = new Map<string, ServerInstance>();

export function setLogCallback(cb: (msg: string) => void) {
	_setLogCallback(cb);
}

/**
 * Start a server for a single account.
 * Returns the port the server is listening on.
 */
export async function startServerForAccount(
	accountId: string,
	config: ServerConfig,
): Promise<number> {
	if (runningServers.has(accountId)) {
		throw new Error(`Server for account ${accountId} is already running`);
	}
	if (!config.accounts || config.accounts.length === 0) {
		throw new Error("No account configured");
	}

	const port = config.port;
	if (port <= 0 || port >= 65536) {
		throw new Error(`Port out of range: ${port}`);
	}

	const instance = await startServerInstance(config);
	runningServers.set(accountId, instance);
	return port;
}

/**
 * Stop a specific account's server.
 */
export async function stopServerForAccount(accountId: string): Promise<void> {
	const instance = runningServers.get(accountId);
	if (!instance) {
		throw new Error(`Server for account ${accountId} is not running`);
	}
	runningServers.delete(accountId);
	await stopServerInstance(instance);
}

/**
 * Check if a specific account's server is running.
 */
export function isAccountRunning(accountId: string): boolean {
	return runningServers.has(accountId);
}

/**
 * Get the port of a running account's server.
 */
export function getAccountPort(accountId: string): number | null {
	const instance = runningServers.get(accountId);
	return instance ? instance.state.port : null;
}

/**
 * Get all running account IDs and their ports.
 */
export function getAllRunningAccounts(): Record<string, number> {
	const result: Record<string, number> = {};
	for (const [id, instance] of runningServers) {
		result[id] = instance.state.port;
	}
	return result;
}

async function startServerInstance(
	config: ServerConfig,
): Promise<ServerInstance> {
	const state: ServerInstanceState = {
		config,
		accountTokens: new Map(),
		accountIndex: 0,
		port: config.port,
	};

	for (const acc of config.accounts) {
		if (acc.token) {
			state.accountTokens.set(acc.email, acc.token);
		} else {
			try {
				const token = await dsClient.login(acc);
				state.accountTokens.set(acc.email, token);
				logWithPort(
					state.port,
					`[shallowseek-api] ✓ Logged in: ${acc.email.slice(0, 3)}***`,
				);
			} catch (err: unknown) {
				const message = getErrorMessage(err);
				logWithPort(
					state.port,
					`[shallowseek-api] ✗ Login failed for ${acc.email}: ${message}`,
				);
			}
		}
	}

	if (state.accountTokens.size === 0) {
		throw new Error("No accounts available (all login attempts failed)");
	}

	const server = http.createServer((req, res) =>
		handleRequest(req, res, state),
	);
	await new Promise<void>((resolve, reject) => {
		server.listen(config.port, () => {
			logWithPort(
				state.port,
				`[shallowseek-api] OpenAI-compatible API server listening on port ${config.port}`,
			);
			resolve();
		});
		server.on("error", reject);
	});

	return {server, state};
}

async function stopServerInstance(instance: ServerInstance): Promise<void> {
	return new Promise((resolve) => {
		instance.server.close(() => {
			logWithPort(
				instance.state.port,
				"[shallowseek-api] Server stopped",
			);
			resolve();
		});
	});
}
