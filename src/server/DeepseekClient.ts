import axios from "axios";
import {
	DEEPSEEK_LOGIN_URL,
	DEEPSEEK_CREATE_SESSION_URL,
	DEEPSEEK_CREATE_POW_URL,
	DEEPSEEK_COMPLETION_URL,
	DEEPSEEK_COMPLETION_TARGET_PATH,
	DEEPSEEK_DELETE_SESSION_URL,
	getLoginHeaders,
	getLoginRequestBody,
	getHistoryHeaders,
	getChatHeaders,
} from "@/constants";
import {solveAndBuildHeader} from "@/ipcs/Pow";
import {getProxyAgent} from "@/services/ProxyAgent";
import {getProxyForToken} from "@/services/QueryDB";
import type {AccountConfig, DeepSeekPowChallenge} from "@/types";

function intFrom(v: any): number {
	if (typeof v === "number") return Math.floor(v);
	return 0;
}

export async function login(acc: AccountConfig): Promise<string> {
	const body = getLoginRequestBody(
		acc.email.trim(),
		acc.password.trim(),
		"deepseek_to_api",
	);
	const httpsAgent = getProxyAgent(acc.proxy);
	const resp = await axios.post(DEEPSEEK_LOGIN_URL, body, {
		headers: getLoginHeaders(),
		validateStatus: () => true,
		httpsAgent,
	});
	const data = resp.data;
	const code = intFrom(data?.code);
	if (code !== 0) throw new Error(`login failed: ${data?.msg}`);
	const bizCode = intFrom(data?.data?.biz_code);
	if (bizCode !== 0) throw new Error(`login failed: ${data?.data?.biz_msg}`);
	const token = data?.data?.biz_data?.user?.token;
	if (!token || typeof token !== "string" || !token.trim()) {
		throw new Error("missing login token");
	}
	return token.trim();
}

export async function createSession(
	token: string,
	maxAttempts = 3,
): Promise<string> {
	const proxyUrl = getProxyForToken(token);
	const httpsAgent = getProxyAgent(proxyUrl);
	const headers = getHistoryHeaders(token);
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const resp = await axios.post(
				DEEPSEEK_CREATE_SESSION_URL,
				{agent: "chat"},
				{
					headers,
					validateStatus: () => true,
					httpsAgent,
				},
			);
			const data = resp.data;
			if (
				resp.status === 200 &&
				intFrom(data?.code) === 0 &&
				intFrom(data?.data?.biz_code) === 0
			) {
				const sessionId = extractSessionId(data);
				if (sessionId) return sessionId;
			}
			console.warn(
				"[shallowseek-api] create_session failed",
				resp.status,
				data?.msg,
			);
		} catch (err: any) {
			console.warn("[shallowseek-api] create_session error", err.message);
		}
	}
	throw new Error("create session failed after retries");
}

function extractSessionId(resp: any): string | null {
	const bizData = resp?.data?.biz_data;
	if (typeof bizData?.id === "string" && bizData.id.trim())
		return bizData.id.trim();
	if (
		typeof bizData?.chat_session?.id === "string" &&
		bizData.chat_session.id.trim()
	) {
		return bizData.chat_session.id.trim();
	}
	return null;
}

export async function getPow(token: string, maxAttempts = 3): Promise<string> {
	const proxyUrl = getProxyForToken(token);
	const httpsAgent = getProxyAgent(proxyUrl);
	const headers = getHistoryHeaders(token);
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const resp = await axios.post(
				DEEPSEEK_CREATE_POW_URL,
				{target_path: DEEPSEEK_COMPLETION_TARGET_PATH},
				{headers, validateStatus: () => true, httpsAgent},
			);
			const data = resp.data;
			if (
				resp.status === 200 &&
				intFrom(data?.code) === 0 &&
				intFrom(data?.data?.biz_code) === 0
			) {
				const challenge: DeepSeekPowChallenge =
					data?.data?.biz_data?.challenge;
				if (!challenge)
					throw new Error("invalid pow challenge response");
				return solveAndBuildHeader(challenge);
			}
			console.warn(
				"[shallowseek-api] get_pow failed",
				resp.status,
				data?.msg,
			);
		} catch (err: any) {
			console.warn("[shallowseek-api] get_pow error", err.message);
		}
	}
	throw new Error("get pow failed after retries");
}

export async function callCompletion(
	token: string,
	payload: Record<string, any>,
	powResponse: string,
): Promise<import("axios").AxiosResponse> {
	const proxyUrl = getProxyForToken(token);
	const httpsAgent = getProxyAgent(proxyUrl);
	const headers = getChatHeaders(token, powResponse);
	return axios.post(DEEPSEEK_COMPLETION_URL, payload, {
		headers,
		responseType: "stream",
		validateStatus: () => true,
		httpsAgent,
	});
}

export async function deleteSession(
	token: string,
	sessionId: string,
): Promise<void> {
	try {
		const proxyUrl = getProxyForToken(token);
		const httpsAgent = getProxyAgent(proxyUrl);
		await axios.post(
			DEEPSEEK_DELETE_SESSION_URL,
			{chat_session_id: sessionId},
			{headers: getHistoryHeaders(token), validateStatus: () => true, httpsAgent},
		);
	} catch (err: any) {
		console.warn("[shallowseek-api] delete_session error", err.message);
	}
}
