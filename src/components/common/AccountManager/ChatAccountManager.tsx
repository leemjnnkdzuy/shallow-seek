import {useState, useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {formatDeepSeekMessages, type FormattedMessage} from "@/lib/utils";
import ChatMessage from "@/components/common/ChatMessage";

export default function ChatAccountManager({
	account,
	sessionId,
	onSessionCreated,
	onRefreshHistory,
}: {
	account: {token: string};
	sessionId?: string | null;
	onSessionCreated?: (id: string) => void;
	onRefreshHistory?: () => void;
}) {
	const [messages, setMessages] = useState<FormattedMessage[]>([]);
	const [input, setInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [model, setModel] = useState("deepseek-chat");
	const scrollRef = useRef<HTMLDivElement>(null);

	const bufferRef = useRef("");
	const [parentMessageId, setParentMessageId] = useState<number>(0);

	useEffect(() => {
		setMessages([]);
		setInput("");
		setParentMessageId(0);
		if (!sessionId || !account?.token) return;

		const fetchMessages = async () => {
			try {
				const res =
					await window.electron?.deepseek?.fetchSessionMessages({
						token: account.token,
						sessionId,
					});
				if (res?.ok) {
					console.log(
						"ChatAccountManager received session messages response:",
						res.data,
					);
				}
				if (res?.ok && res.data?.data?.biz_data?.chat_messages) {
					const msgs = res.data.data.biz_data.chat_messages;
					console.log(
						"ChatAccountManager: Found messages:",
						msgs.length,
					);
					const formattedMsgs = formatDeepSeekMessages(msgs);
					console.log(
						"ChatAccountManager: Formatted messages:",
						formattedMsgs,
					);
					setMessages(formattedMsgs);
					if (msgs.length > 0) {
						const lastMsg = msgs[msgs.length - 1];
						setParentMessageId(
							lastMsg.message_id || lastMsg.id || 0,
						);
					}
				}
			} catch (err) {
				console.error("Failed to fetch messages:", err);
			}
		};
		fetchMessages();
	}, [sessionId, account]);

	useEffect(() => {
		if (!window.electron?.deepseek) return;

		let currentEventType = "";

		const removeChunkListener = window.electron.deepseek.onChatChunk(
			(chunk: string) => {
				bufferRef.current += chunk;
				const lines = bufferRef.current.split("\n");
				bufferRef.current = lines.pop() || "";

				for (const line of lines) {
					const trimmedLine = line.trim();
					// Empty line = SSE event boundary (\n\n), reset event type
					if (!trimmedLine) {
						currentEventType = "";
						continue;
					}

					// Handle SSE event type lines
					if (
						trimmedLine.startsWith("event:") ||
						trimmedLine.startsWith("event: ")
					) {
						currentEventType = trimmedLine
							.replace(/^event:\s*/, "")
							.trim();

						// "close" event means stream is finished
						if (currentEventType === "close") {
							setIsStreaming(false);
						}
						continue;
					}

					if (
						trimmedLine.startsWith("data: ") ||
						trimmedLine.startsWith("data:")
					) {
						const data = trimmedLine
							.replace(/^data:\s*/, "")
							.trim();
						if (data === "[DONE]") {
							setIsStreaming(false);
							continue;
						}
						if (!data) continue;

						try {
							const parsed = JSON.parse(data);

							// --- Handle "ready" event: extract response_message_id ---
							if (
								currentEventType === "ready" &&
								parsed.response_message_id
							) {
								setParentMessageId(parsed.response_message_id);
								continue;
							}

							// --- Handle "update_session" / "close" events: skip ---
							if (
								currentEventType === "update_session" ||
								currentEventType === "close"
							) {
								continue;
							}

							let textDelta = "";
							let responseMessageId: number | undefined;
							let isFinished = false;

							// --- DeepSeek Web format: JSON patch operations ---

							// 1. Initial response object with fragments
							// e.g. {"v":{"response":{"message_id":12,...,"fragments":[{"content":"Ch"}]}}}
							if (parsed?.v?.response) {
								const resp = parsed.v.response;
								if (resp.message_id) {
									responseMessageId = resp.message_id;
								}
								if (
									resp.fragments &&
									Array.isArray(resp.fragments)
								) {
									for (const frag of resp.fragments) {
										if (frag.content) {
											textDelta += frag.content;
										}
									}
								}
								if (resp.status === "FINISHED") {
									isFinished = true;
								}
							}
							// 2. Explicit APPEND operation on fragment content
							// e.g. {"p":"response/fragments/-1/content","o":"APPEND","v":"ào"}
							else if (
								parsed?.o === "APPEND" &&
								typeof parsed?.v === "string"
							) {
								textDelta = parsed.v;
							}
							// 3. SET operation (e.g. status = FINISHED)
							// e.g. {"p":"response/status","o":"SET","v":"FINISHED"}
							else if (parsed?.o === "SET") {
								if (
									parsed.p === "response/status" &&
									parsed.v === "FINISHED"
								) {
									isFinished = true;
								}
								// Other SET operations are ignored
							}
							// 4. BATCH operation (e.g. accumulated_token_usage + quasi_status)
							// e.g. {"p":"response","o":"BATCH","v":[{"p":"accumulated_token_usage","v":232},{"p":"quasi_status","v":"FINISHED"}]}
							else if (
								parsed?.o === "BATCH" &&
								Array.isArray(parsed?.v)
							) {
								for (const patch of parsed.v) {
									if (
										patch.p === "quasi_status" &&
										patch.v === "FINISHED"
									) {
										isFinished = true;
									}
								}
							}
							// 5. Shorthand append (no "p" or "o" fields, just {"v":"text"})
							// e.g. {"v":" bạn"}
							else if (
								typeof parsed?.v === "string" &&
								!parsed?.p &&
								!parsed?.o
							) {
								textDelta = parsed.v;
							}
							// --- DeepSeek mobile API format (JSON patches with p/v) ---
							else if (Array.isArray(parsed?.v)) {
								for (const patch of parsed.v) {
									if (
										(patch.p === "text" ||
											patch.p === "message/content") &&
										typeof patch.v === "string"
									) {
										textDelta += patch.v;
									}
								}
							} else if (
								parsed?.v &&
								typeof parsed.v === "string" &&
								(parsed.p === "text" ||
									parsed.p === "message/content")
							) {
								textDelta = parsed.v;
							}
							// --- OpenAI / compatible format ---
							else if (parsed?.choices?.[0]?.delta?.content) {
								textDelta = parsed.choices[0].delta.content;
							} else if (parsed?.message?.content) {
								textDelta = parsed.message.content;
							}

							// Apply text delta to messages
							if (textDelta) {
								setMessages((prev) => {
									const newMsgs = [...prev];
									const lastIdx = newMsgs.length - 1;
									const last =
										lastIdx >= 0 ?
											{...newMsgs[lastIdx]}
										:	null;

									if (last && last.role === "assistant") {
										last.content += textDelta;
										if (responseMessageId) {
											setParentMessageId(
												responseMessageId,
											);
										}
										newMsgs[lastIdx] = last;
									} else {
										newMsgs.push({
											role: "assistant",
											content: textDelta,
											id:
												responseMessageId ||
												parsed.message_id ||
												parsed.id,
										});
										if (responseMessageId) {
											setParentMessageId(
												responseMessageId,
											);
										}
									}
									return newMsgs;
								});
							}

							if (isFinished) {
								setIsStreaming(false);
								if (onRefreshHistory) onRefreshHistory();
							}
						} catch (e) {
							// ignore parse errors
						}
					}
					// Reset event type after processing data line
					currentEventType = "";
				}
			},
		);

		const removeEndListener = window.electron.deepseek.onChatEnd(() => {
			setIsStreaming(false);
			if (onRefreshHistory) onRefreshHistory();
		});

		const removeErrorListener = window.electron.deepseek.onChatError(
			(err: {message: string}) => {
				setIsStreaming(false);
				setMessages((prev) => [
					...prev,
					{role: "system", content: `Lỗi: ${err.message}`},
				]);
			},
		);

		return () => {
			removeChunkListener();
			removeEndListener();
			removeErrorListener();
		};
	}, []);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || !account?.token || isStreaming) return;

		const userMessage = input;
		setInput("");
		setMessages((prev) => [...prev, {role: "user", content: userMessage}]);
		setIsStreaming(true);

		let currentSessionId = sessionId;

		// 1. If no sessionId, create one first
		if (!currentSessionId) {
			try {
				const res = await window.electron?.deepseek?.createChatSession({
					token: account.token,
				});
				if (res?.ok && res.data?.data?.biz_data?.chat_session?.id) {
					currentSessionId = res.data.data.biz_data.chat_session.id;
					if (onSessionCreated)
						onSessionCreated(currentSessionId as string);
				} else {
					throw new Error("Không thể tạo phiên trò chuyện mới");
				}
			} catch (err: any) {
				setMessages((prev) => [
					...prev,
					{role: "system", content: `Lỗi: ${err.message}`},
				]);
				setIsStreaming(false);
				return;
			}
		}

		// 2. Start chat stream with the sessionId
		const payload: any = {
			chat_session_id: currentSessionId,
			parent_message_id: parentMessageId > 0 ? parentMessageId : null,
			model_type: model === "deepseek-coder" ? "expert" : "default",
			prompt: userMessage,
			ref_file_ids: [],
			thinking_enabled: false,
			search_enabled: false,
		};

		window.electron?.deepseek?.startChatStream({
			token: account.token,
			payload,
		});
	};

	return (
		<div className='flex flex-col h-full bg-transparent overflow-hidden gap-4'>
			<div className='flex items-center justify-between px-1'>
				<div className='flex items-center gap-2'>
					<Select value={model} onValueChange={setModel}>
						<SelectTrigger className='w-[180px] h-8 text-xs'>
							<SelectValue placeholder='Chọn model' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='deepseek-chat'>
								DeepSeek Chat
							</SelectItem>
							<SelectItem value='deepseek-coder'>
								DeepSeek Coder
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className='flex-1 overflow-y-auto space-y-4' ref={scrollRef}>
				{messages.length === 0 ?
					<div className='text-center text-muted-foreground mt-10'>
						Bắt đầu trò chuyện với DeepSeek
					</div>
				:	messages.map((m, i) => <ChatMessage key={i} message={m} />)}
				{isStreaming &&
					messages[messages.length - 1]?.role === "user" && (
						<div className='p-3 px-4 rounded-2xl w-fit bg-muted/50 border border-border/50 mr-auto rounded-tl-none animate-pulse flex items-center gap-2'>
							<div className='flex gap-1'>
								<div className='w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
								<div className='w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
								<div className='w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce'></div>
							</div>
							<span className='text-xs text-muted-foreground font-medium italic'>
								Đang suy nghĩ...
							</span>
						</div>
					)}
			</div>
			<div className='pt-4 flex items-center gap-2 bg-transparent'>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
					placeholder='Nhập tin nhắn...'
					disabled={isStreaming}
					className='flex-1'
				/>
				<Button
					onClick={handleSend}
					disabled={isStreaming || !input.trim()}
				>
					{isStreaming ? "Đang gửi..." : "Gửi"}
				</Button>
			</div>
		</div>
	);
}
