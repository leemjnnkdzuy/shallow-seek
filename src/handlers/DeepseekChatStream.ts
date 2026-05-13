import axios from "axios";
import {
	DEEPSEEK_COMPLETION_TARGET_PATH,
	DEEPSEEK_CREATE_POW_URL,
	DEEPSEEK_COMPLETION_URL,
	getHistoryHeaders,
	getChatHeaders,
} from "@/constants";
import {solveAndBuildHeader} from "@/ipcs/Pow";
import type {ChatStreamPayload} from "@/types";

export interface ChatStreamSender {
	send: (channel: string, ...args: any[]) => void;
}

export async function handleChatStream(
	sender: ChatStreamSender,
	payload: ChatStreamPayload,
): Promise<void> {
	try {
		// 1. Get PoW challenge
		const powResponse = await axios.post(
			DEEPSEEK_CREATE_POW_URL,
			{target_path: DEEPSEEK_COMPLETION_TARGET_PATH},
			{
				headers: getHistoryHeaders(
					payload.token,
					payload.cookies,
				),
				validateStatus: () => true,
			},
		);

		if (
			powResponse.status !== 200 ||
			powResponse.data?.code !== 0
		) {
			sender.send("deepseek-chat-error", {
				message: "Failed to get PoW challenge",
			});
			return;
		}

		const challenge = powResponse.data?.data?.biz_data?.challenge;
		if (!challenge) {
			sender.send("deepseek-chat-error", {
				message: "Invalid PoW challenge response",
			});
			return;
		}

		// 2. Solve PoW
		const powHeaderStr = solveAndBuildHeader(challenge);

		// 3. Start streaming completion
		const chatHeaders = getChatHeaders(
			payload.token,
			powHeaderStr,
			payload.cookies,
		);
		console.log(
			"[deepseek-chat-stream] Request URL:",
			DEEPSEEK_COMPLETION_URL,
		);
		console.log(
			"[deepseek-chat-stream] Request Headers:",
			JSON.stringify(chatHeaders),
		);
		console.log(
			"[deepseek-chat-stream] Request Body:",
			JSON.stringify(payload.payload),
		);

		const response = await axios.post(
			DEEPSEEK_COMPLETION_URL,
			payload.payload,
			{
				headers: chatHeaders,
				responseType: "stream",
				validateStatus: () => true,
			},
		);

		if (response.status !== 200) {
			const stream = response.data;
			let errorData = "";
			for await (const chunk of stream) {
				errorData += chunk.toString();
			}
			console.error(
				"[deepseek-chat-stream] Error Status:",
				response.status,
			);
			console.error(
				"[deepseek-chat-stream] Error Data:",
				errorData,
			);
			sender.send("deepseek-chat-error", {
				message: `DeepSeek API Error: ${response.status}. ${errorData}`,
			});
			return;
		}

		const stream = response.data;
		stream.on("data", (chunk: Buffer) => {
			const text = chunk.toString("utf-8");
			sender.send("deepseek-chat-chunk", text);
		});

		stream.on("end", () => {
			sender.send("deepseek-chat-end");
		});

		stream.on("error", (err: Error) => {
			sender.send("deepseek-chat-error", {
				message: err.message,
			});
		});
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Unknown error";
		sender.send("deepseek-chat-error", {message});
	}
}
