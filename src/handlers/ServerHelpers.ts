import http from "node:http";
import {Readable} from "node:stream";
import type {ServerInstanceState} from "@/types/ServerInternal";

let _logCallback: ((msg: string) => void) | null = null;

export function setLogCallback(cb: (msg: string) => void) {
	_logCallback = cb;
}

export function serverLog(msg: string) {
	console.log(msg);
	if (_logCallback) _logCallback(msg);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

export function getErrorMessage(err: unknown): string {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	if (isRecord(err) && typeof err.message === "string") return err.message;
	return "Unknown error";
}

export function logWithPort(port: number, msg: string) {
	if (msg.includes("[shallowseek-api]")) {
		serverLog(
			msg.replace("[shallowseek-api]", `[shallowseek-api] [${port}]`),
		);
		return;
	}
	if (msg.includes("[api]")) {
		serverLog(msg.replace("[api]", `[api] [${port}]`));
		return;
	}
	serverLog(`[${port}] ${msg}`);
}

export function getNextToken(state: ServerInstanceState): string | null {
	if (state.accountTokens.size === 0) return null;
	const entries = Array.from(state.accountTokens.entries());
	const [, token] = entries[state.accountIndex % entries.length];
	state.accountIndex = (state.accountIndex + 1) % entries.length;
	return token;
}

export function getAlternateToken(
	state: ServerInstanceState,
	currentToken: string,
): string | null {
	if (state.accountTokens.size <= 1) return null;
	for (const [, token] of state.accountTokens) {
		if (token !== currentToken) return token;
	}
	return null;
}

export function readBody(req: http.IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => resolve(body));
		req.on("error", reject);
	});
}

export function streamToString(stream: Readable): Promise<string> {
	return new Promise((resolve, reject) => {
		let data = "";
		stream.on("data", (chunk) => {
			data += chunk.toString();
		});
		stream.on("end", () => resolve(data));
		stream.on("error", reject);
	});
}

export function jsonResponse(
	res: http.ServerResponse,
	status: number,
	data: unknown,
) {
	res.writeHead(status, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data));
}

export function setCORS(res: http.ServerResponse, req: http.IncomingMessage) {
	const origin = req.headers["origin"] || "*";
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, DELETE",
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, X-API-Key",
	);
	res.setHeader("Access-Control-Max-Age", "600");
}

export function estimateTokens(text: string): number {
	if (!text) return 0;
	let asciiChars = 0;
	let nonASCIIChars = 0;

	for (let i = 0; i < text.length; i++) {
		if (text.charCodeAt(i) < 128) {
			asciiChars++;
		} else {
			nonASCIIChars++;
		}
	}

	const n = Math.floor(asciiChars / 4) + Math.floor((nonASCIIChars * 10 + 7) / 13);
	return Math.max(1, n);
}
