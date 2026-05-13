import {useState, useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {formatDeepSeekMessages} from "@/lib/utils";
import type {FormattedMessage} from "@/types";
import ChatMessage from "@/components/common/ChatMessage";
import { Atom, ArrowUp, Paperclip, Globe } from "lucide-react";
import { parseStreamLine } from "@/handlers";

export default function ChatAccountManager({
	account,
	sessionId,
	onSessionCreated,
	onRefreshHistory,
}: {
	account: {chat_token: string};
	sessionId?: string | null;
	onSessionCreated?: (id: string) => void;
	onRefreshHistory?: () => void;
}) {
	const [messages, setMessages] = useState<FormattedMessage[]>([]);
	const [input, setInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [model, setModel] = useState("deepseek-chat");
	const [thinkingEnabled, setThinkingEnabled] = useState(false);
	const [searchEnabled, setSearchEnabled] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const bufferRef = useRef("");
	const [parentMessageId, setParentMessageId] = useState<number>(0);
	const sessionCreatedLocallyRef = useRef<boolean>(false);

	useEffect(() => {
		if (sessionCreatedLocallyRef.current) {
			sessionCreatedLocallyRef.current = false;
			return;
		}

		setMessages([]);
		setInput("");
		setParentMessageId(0);
		if (!sessionId || !account?.chat_token) return;

		const fetchMessages = async () => {
			try {
				const res =
					await window.electron?.deepseek?.fetchSessionMessages({
						token: account.chat_token,
						sessionId,
					});
				if (res?.ok && res.data?.data?.biz_data?.chat_messages) {
					const msgs = res.data.data.biz_data.chat_messages;
					const formattedMsgs = formatDeepSeekMessages(msgs);
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
					currentEventType = parseStreamLine(line, currentEventType, {
						setIsStreaming,
						setParentMessageId,
						onAppendText: (textDelta, messageId) => {
							setMessages((prev) => {
								const newMsgs = [...prev];
								const lastIdx = newMsgs.length - 1;
								const last =
									lastIdx >= 0 ?
										{...newMsgs[lastIdx]}
									:	null;

								if (last && last.role === "assistant") {
									last.content += textDelta;
									if (messageId) {
										setParentMessageId(messageId);
									}
									newMsgs[lastIdx] = last;
								} else {
									newMsgs.push({
										role: "assistant",
										content: textDelta,
										id: messageId,
									});
									if (messageId) {
										setParentMessageId(messageId);
									}
								}
								return newMsgs;
							});
						}
					});
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
		if (!input.trim() || !account?.chat_token || isStreaming) return;

		const userMessage = input;
		setInput("");
		setMessages((prev) => [...prev, {role: "user", content: userMessage}]);
		setIsStreaming(true);

		let currentSessionId = sessionId;

		if (!currentSessionId) {
			try {
				const res = await window.electron?.deepseek?.createChatSession({
					token: account.chat_token,
				});
				if (res?.ok && res.data?.data?.biz_data?.chat_session?.id) {
					currentSessionId = res.data.data.biz_data.chat_session.id;
					sessionCreatedLocallyRef.current = true;
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

		const payload: any = {
			chat_session_id: currentSessionId,
			parent_message_id: parentMessageId > 0 ? parentMessageId : null,
			model_type: model === "deepseek-coder" ? "expert" : "default",
			prompt: userMessage,
			ref_file_ids: [],
			thinking_enabled: thinkingEnabled,
			search_enabled: searchEnabled,
		};

		window.electron?.deepseek?.startChatStream({
			token: account.chat_token,
			payload,
		});
	};

	return (
		<div className='flex flex-col h-full bg-transparent overflow-hidden gap-0'>
			<div 
				className='flex-1 overflow-y-auto space-y-4 pt-10 pb-16 pr-1' 
				ref={scrollRef}
				style={{
					WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 92%, transparent 100%)',
					maskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 92%, transparent 100%)',
				}}
			>
				{messages.length === 0 ?
					<div className='text-center text-muted-foreground mt-10'>
						Bắt đầu trò chuyện với DeepSeek
					</div>
				:	messages.map((m, i) => (
						<ChatMessage 
							key={i} 
							message={m} 
							isStreaming={isStreaming && i === messages.length - 1} 
						/>
					))}
				{isStreaming &&
					messages[messages.length - 1]?.role === "user" && (
						<div className='p-3 px-4 rounded-2xl w-fit bg-muted/50 border border-border/50 mr-auto rounded-tl-none flex items-center gap-2'>
							<Atom className='w-4 h-4 text-primary animate-spin' style={{ animationDuration: "3s" }} />
							<span className='text-xs text-muted-foreground font-medium italic'>
								Đang suy nghĩ...
							</span>
						</div>
					)}
			</div>
			<div className='pt-2 pb-2 px-1 bg-transparent'>
				<div className='relative rounded-2xl border border-border/80 bg-card/40 hover:bg-card/60 focus-within:bg-card/70 focus-within:border-ring/50 focus-within:ring-2 focus-within:ring-ring/10 transition-all duration-200 px-4 py-3 flex flex-col gap-2.5 shadow-sm'>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
						placeholder='Nhập tin nhắn...'
						disabled={isStreaming}
						rows={2}
						className='w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 resize-none text-sm placeholder:text-muted-foreground text-foreground min-h-[44px] max-h-[160px]'
					/>
					<div className='flex items-center justify-between pt-1'>
						{/* Left toolbar icons */}
						<div className='flex items-center gap-2 text-muted-foreground/60'>
							<Button variant='ghost' size='icon' className='h-7 w-7 rounded-lg hover:text-foreground hover:bg-muted/50'>
								<Paperclip className='w-4 h-4' />
							</Button>
							<Button 
								variant='ghost' 
								size='sm' 
								className={`h-7 rounded-lg text-xs gap-1.5 px-2.5 font-medium transition-colors ${thinkingEnabled ? 'text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary' : 'hover:text-foreground hover:bg-muted/50'}`}
								onClick={() => setThinkingEnabled(!thinkingEnabled)}
							>
								<Atom className='w-3.5 h-3.5' />
								<span>Suy nghĩ sâu</span>
							</Button>
							
							<Button 
								variant='ghost' 
								size='sm' 
								className={`h-7 rounded-lg text-xs gap-1.5 px-2.5 font-medium transition-colors ${searchEnabled ? 'text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary' : 'hover:text-foreground hover:bg-muted/50'}`}
								onClick={() => setSearchEnabled(!searchEnabled)}
							>
								<Globe className='w-3.5 h-3.5' />
								<span>Tìm kiếm web</span>
							</Button>

							<Select value={model} onValueChange={setModel}>
								<SelectTrigger className='w-fit h-7 text-xs border border-border bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground rounded-lg px-2.5 shadow-none focus:ring-0 focus-visible:ring-0 gap-1.5 transition-all duration-150'>
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

						{/* Right send button */}
						<Button
							size='icon'
							onClick={handleSend}
							disabled={isStreaming || !input.trim()}
							className='h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 shadow-sm shrink-0'
						>
							<ArrowUp className='w-4 h-4 stroke-[2.5]' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
