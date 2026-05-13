import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Editor from "@monaco-editor/react";
import type {FormattedMessage} from "@/types";

import { Copy, Check } from "lucide-react";

interface ChatMessageProps {
	message: FormattedMessage;
	isStreaming?: boolean;
}

interface CodeBlockProps {
	code: string;
	lang: string;
	height: number;
	isStreaming: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = React.memo(({ code, lang, height, isStreaming }) => {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<div className='my-2.5 w-full min-w-[300px] md:min-w-[500px]'>
			<div className='overflow-hidden rounded-xl border border-white/5 shadow-2xl bg-[#1e1e1e]'>
				<div className='flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-white/5'>
					<span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60'>
						{lang}
					</span>
					<button
						onClick={handleCopy}
						className='flex items-center justify-center p-1 rounded text-muted-foreground/60 hover:text-foreground hover:bg-white/5 transition-all cursor-pointer'
						title={copied ? 'Đã sao chép!' : 'Sao chép mã'}
					>
						{copied ? (
							<Check className='w-3.5 h-3.5 text-green-500 animate-in fade-in zoom-in-75 duration-200' />
						) : (
							<Copy className='w-3.5 h-3.5' />
						)}
					</button>
				</div>
				{isStreaming ? (
					<pre
						className='p-3.5 overflow-x-auto text-[12.5px] font-mono text-zinc-200 bg-[#1e1e1e] leading-relaxed select-text whitespace-pre border-t border-white/5'
						style={{
							fontFamily:
								"'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
						}}
					>
						<code>{code}</code>
					</pre>
				) : (
					<Editor
						height={height}
						language={lang}
						value={code}
						theme='vs-dark'
						loading={
							<div className='h-20 flex items-center justify-center text-[10px] text-muted-foreground animate-pulse'>
								Đang tải...
							</div>
						}
						options={{
							readOnly: true,
							minimap: {enabled: false},
							fontSize: 12.5,
							fontFamily:
								"'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
							scrollBeyondLastLine: false,
							lineNumbers: "on",
							renderLineHighlight: "none",
							scrollbar: {
								vertical: "hidden",
								horizontal: "auto",
								useShadows: false,
							},
							overviewRulerLanes: 0,
							hideCursorInOverviewRuler: true,
							folding: false,
							lineDecorationsWidth: 10,
							lineNumbersMinChars: 3,
							glyphMargin: false,
							automaticLayout: true,
							padding: {top: 12, bottom: 12},
							fixedOverflowWidgets: true,
							domReadOnly: true,
						}}
					/>
				)}
			</div>
		</div>
	);
});

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
	({message, isStreaming = false}) => {
		const isUser = message.role === "user";
		const isSystem = message.role === "system";

		const markdownComponents = React.useMemo(
			() => ({
				p: ({children}: any) => (
					<p className='mb-1.5 last:mb-0 opacity-95'>{children}</p>
				),
				ul: ({children}: any) => (
					<ul className='list-disc ml-5 mb-1.5 space-y-0.5 opacity-90'>
						{children}
					</ul>
				),
				ol: ({children}: any) => (
					<ol className='list-decimal ml-5 mb-1.5 space-y-0.5 opacity-90'>
						{children}
					</ol>
				),
				li: ({children}: any) => <li className='pl-0.5'>{children}</li>,
				pre: (props: any) => {
					const {children} = props;
					const codeEl = children?.props;
					const className = codeEl?.className || "";
					const match = /language-(\w+)/.exec(className);
					const code = String(codeEl?.children || "").replace(
						/\n$/,
						"",
					);
					const lang = match?.[1] || "plaintext";
					const lineCount = code.split("\n").length;
					const height = Math.min(lineCount * 19 + 24, 600);

					return (
						<CodeBlock
							code={code}
							lang={lang}
							height={height}
							isStreaming={isStreaming}
						/>
					);
				},
				code: (props: any) => {
					const {children, ...rest} = props;
					return (
						<code
							className='bg-muted-foreground/15 px-1.5 py-0.5 rounded text-[11.5px] font-mono border border-current/5 font-medium'
							{...rest}
						>
							{children}
						</code>
					);
				},
				h1: ({children}: any) => (
					<h1 className='text-base font-bold mb-2 mt-3 first:mt-0 tracking-tight'>
						{children}
					</h1>
				),
				h2: ({children}: any) => (
					<h2 className='text-[14px] font-bold mb-1.5 mt-2.5 first:mt-0 tracking-tight opacity-90'>
						{children}
					</h2>
				),
				h3: ({children}: any) => (
					<h3 className='text-[13px] font-bold mb-1 mt-2 first:mt-0 tracking-tight opacity-80'>
						{children}
					</h3>
				),
				blockquote: ({children}: any) => (
					<blockquote className='border-l-3 border-primary/30 pl-4 italic my-2 bg-primary/5 py-1 pr-2 rounded-r-lg'>
						{children}
					</blockquote>
				),
				table: ({children}: any) => (
					<div className='my-2.5 overflow-x-auto rounded-xl border border-current/10 shadow-sm bg-background/5'>
						<table className='w-full text-[11.5px] text-left border-collapse'>
							{children}
						</table>
					</div>
				),
				thead: ({children}: any) => (
					<thead className='bg-current/5 font-bold'>{children}</thead>
				),
				th: ({children}: any) => (
					<th className='px-3 py-2 border-b border-current/10'>
						{children}
					</th>
				),
				td: ({children}: any) => (
					<td className='px-3 py-1.5 border-b border-current/5 last:border-b-0'>
						{children}
					</td>
				),
				hr: () => <hr className='my-3 border-current/10' />,
				a: ({href, children}: any) => {
					const handleClick = (
						e: React.MouseEvent<HTMLAnchorElement>,
					) => {
						if (href) {
							e.preventDefault();
							window.electron?.windowControls?.openExternal(href);
						}
					};
					return (
						<a
							href={href}
							onClick={handleClick}
							className={`${isUser ? "text-primary-foreground underline decoration-1" : "text-primary hover:underline"} font-medium underline-offset-4 decoration-2`}
							target='_blank'
							rel='noopener noreferrer'
						>
							{children}
						</a>
					);
				},
			}),
			[isStreaming, isUser],
		);

		return (
			<div
				className={`flex flex-col gap-2 max-w-[95%] w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${
					isUser ? "ml-auto items-end"
					: isSystem ? "mx-auto items-center"
					: "mr-auto items-start"
				}`}
			>
				{/* Attached Files (outside bubble) */}
				{message.files && message.files.length > 0 && (
					<div
						className={`flex flex-wrap gap-2 ${isUser ? "justify-end" : "justify-start"}`}
					>
						{message.files.map((file: string, idx: number) => {
							const extMatch = file.match(/\.([^.]+)$/);
							const ext =
								extMatch ?
									extMatch[1].toUpperCase().slice(0, 4)
								:	"FILE";
							return (
								<div
									key={idx}
									className='flex items-center gap-3 p-2 pr-3.5 rounded-xl border bg-card/80 backdrop-blur-sm border-border/50 shadow-sm max-w-[260px] hover:bg-accent/50 transition-colors'
								>
									<div className='w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold bg-primary/10 text-primary uppercase'>
										{ext}
									</div>
									<div className='flex flex-col min-w-0'>
										<span className='text-[13px] font-medium truncate text-foreground leading-tight'>
											{file}
										</span>
										<span className='text-[11px] text-muted-foreground truncate mt-0.5'>
											Tệp đính kèm
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Message Bubble */}
				<div
					className={`p-3 px-4 rounded-2xl w-fit flex flex-col gap-2 shadow-sm ${
						isUser ?
							"bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
						: isSystem ?
							"bg-destructive/10 text-destructive border border-destructive/20 text-[11px] italic py-2"
						:	"bg-muted/40 border border-border/40 rounded-tl-none backdrop-blur-sm"
					}`}
				>
					<div
						className={`text-[13px] leading-relaxed tracking-tight markdown-content ${isUser ? "prose-user" : "prose-assistant"}`}
					>
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={markdownComponents}
						>
							{message.content}
						</ReactMarkdown>
					</div>
				</div>
			</div>
		);
	},
);

export default ChatMessage;
