import http from "node:http";
import {openAIModelsResponse, ALL_MODELS} from "@/server/ModelConfig";
import type {ServerInstanceState} from "@/types/ServerInternal";
import {
	logWithPort,
	getErrorMessage,
	jsonResponse,
	setCORS,
} from "@/handlers/ServerHelpers";
import {handleChatCompletions} from "@/handlers/ServerCompletion";

export async function handleRequest(
	req: http.IncomingMessage,
	res: http.ServerResponse,
	state: ServerInstanceState,
) {
	const startTime = Date.now();
	const method = req.method || "GET";

	setCORS(res, req);
	if (method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	const url = new URL(
		req.url || "/",
		`http://${req.headers.host || "localhost"}`,
	);
	const path = url.pathname;
	const clientIP = req.socket.remoteAddress || "unknown";

	res.once("finish", () => {
		const duration = Date.now() - startTime;
		const status = res.statusCode;
		if (path !== "/healthz" && path !== "/readyz") {
			logWithPort(
				state.port,
				`[api] ${method} ${path} → ${status} (${duration}ms) [${clientIP}]`,
			);
		}
	});

	try {
		if (path === "/healthz" || path === "/readyz") {
			jsonResponse(res, 200, {status: "ok"});
			return;
		}

		if ((path === "/v1/models" || path === "/models") && method === "GET") {
			jsonResponse(res, 200, openAIModelsResponse());
			return;
		}

		const modelMatch = path.match(/^\/(?:v1\/)?models\/(.+)$/);
		if (modelMatch && method === "GET") {
			const modelId = modelMatch[1];
			const model = ALL_MODELS.find((m) => m.id === modelId);
			if (model) {
				jsonResponse(res, 200, model);
			} else {
				jsonResponse(res, 404, {
					error: {
						message: `Model '${modelId}' not found`,
						type: "invalid_request_error",
					},
				});
			}
			return;
		}

		if (
			(path === "/v1/chat/completions" || path === "/chat/completions") &&
			method === "POST"
		) {
			if (!validateAuth(req, res, state)) return;
			await handleChatCompletions(req, res, state);
			return;
		}

		// ── Session management endpoints ──
		if (
			(path === "/v1/sessions/reset" || path === "/sessions/reset") &&
			method === "POST"
		) {
			if (!validateAuth(req, res, state)) return;
			// Reset all active sessions — starts a fresh "section"
			await state.sessionManager.cleanup();
			logWithPort(state.port, `[api] ✓ All sessions reset (new section)`);
			jsonResponse(res, 200, {status: "ok", message: "All sessions reset"});
			return;
		}

		if (
			(path === "/v1/sessions/info" || path === "/sessions/info") &&
			method === "GET"
		) {
			if (!validateAuth(req, res, state)) return;
			const info: Record<string, unknown>[] = [];
			for (const [, token] of state.accountTokens) {
				info.push(state.sessionManager.getSessionInfo(token));
			}
			jsonResponse(res, 200, {sessions: info});
			return;
		}

		jsonResponse(res, 404, {
			error: {message: "Not found", type: "invalid_request_error"},
		});
	} catch (err: unknown) {
		const message = getErrorMessage(err);
		logWithPort(
			state.port,
			`[api] ✗ ${method} ${path} — unhandled error: ${message}`,
		);
		jsonResponse(res, 500, {
			error: {message: "Internal Server Error", type: "api_error"},
		});
	}
}

function validateAuth(
	req: http.IncomingMessage,
	res: http.ServerResponse,
	state: ServerInstanceState,
): boolean {
	if (!state.config || state.config.apiKeys.length === 0) return true;

	const authHeader = req.headers["authorization"] || "";
	let key = "";
	if (authHeader.startsWith("Bearer ")) {
		key = authHeader.slice(7).trim();
	}
	if (!key) {
		const url = new URL(
			req.url || "/",
			`http://${req.headers.host || "localhost"}`,
		);
		key =
			url.searchParams.get("key") ||
			url.searchParams.get("api_key") ||
			"";
	}

	if (!key || !state.config.apiKeys.includes(key)) {
		jsonResponse(res, 401, {
			error: {
				message: "Invalid API key",
				type: "invalid_request_error",
				code: "invalid_api_key",
			},
		});
		return false;
	}
	return true;
}
