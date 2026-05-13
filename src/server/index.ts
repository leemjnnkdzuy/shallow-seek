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

let currentServers: ServerInstance[] = [];

export function setLogCallback(cb: (msg: string) => void) {
	_setLogCallback(cb);
}

export async function startServer(config: ServerConfig): Promise<number> {
	if (currentServers.length > 0) throw new Error("Server is already running");
	if (!config.accounts || config.accounts.length === 0) {
		throw new Error("No accounts configured");
	}

	const basePort = config.port;
	const accounts = config.accounts;
	const started: ServerInstance[] = [];

	try {
		for (let i = 0; i < accounts.length; i++) {
			const port = basePort + i;
			if (port <= 0 || port >= 65536) {
				throw new Error(`Port out of range: ${port}`);
			}
			const serverConfig: ServerConfig = {
				...config,
				port,
				accounts: [accounts[i]],
			};
			const instance = await startServerInstance(serverConfig);
			started.push(instance);
		}
	} catch (err) {
		await Promise.all(
			started.map((instance) => stopServerInstance(instance)),
		);
		currentServers = [];
		throw err;
	}

	currentServers = started;
	return basePort;
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

export async function stopServer(): Promise<void> {
	if (currentServers.length === 0) throw new Error("Server is not running");
	const servers = currentServers;
	currentServers = [];
	await Promise.all(servers.map((instance) => stopServerInstance(instance)));
}

export function isRunning(): boolean {
	return currentServers.length > 0;
}
