import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface LogAccountManagerProps {
	logs: string[];
	onClear: () => void;
}

export default function LogAccountManager({ logs, onClear }: LogAccountManagerProps) {
	const logsEndRef = useRef<HTMLDivElement>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (logsEndRef.current) {
			logsEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [logs]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(logs.join("\n"));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy logs:", err);
		}
	};

	const formatLogLine = (line: string) => {
		if (!line) return null;

		let element: React.ReactNode = line;

		if (line.includes("[shallowseek-api]")) {
			const parts = line.split("[shallowseek-api]");
			element = (
				<span>
					{parts[0]}
					<span className="text-primary font-bold">[shallowseek-api]</span>
					{parts.slice(1).map((part, idx) => {
						if (part.includes("✓")) {
							const subParts = part.split("✓");
							return (
								<span key={idx}>
									{subParts[0]}
									<span className="text-emerald-500 font-bold">✓</span>
									{subParts[1]}
								</span>
							);
						}
						if (part.includes("✗")) {
							const subParts = part.split("✗");
							return (
								<span key={idx}>
									{subParts[0]}
									<span className="text-destructive font-bold">✗</span>
									{subParts[1]}
								</span>
							);
						}
						return part;
					})}
				</span>
			);
		} else if (line.includes("[api]")) {
			const parts = line.split("[api]");
			element = (
				<span>
					{parts[0]}
					<span className="text-amber-600 dark:text-amber-500 font-bold">[api]</span>
					{parts.slice(1).map((part, idx) => {
						let renderedPart: React.ReactNode = part;

						if (part.includes("→ 200")) {
							const statusParts = part.split("→ 200");
							renderedPart = (
								<span key={idx}>
									{statusParts[0]}
									<span className="text-emerald-600 dark:text-emerald-500 font-bold">→ 200</span>
									{statusParts[1]}
								</span>
							);
						} else if (part.includes("→ 4") || part.includes("→ 5") || part.includes("✗")) {
							renderedPart = (
								<span key={idx} className="text-destructive font-medium">
									{part}
								</span>
							);
						} else if (part.includes("✓")) {
							const subParts = part.split("✓");
							renderedPart = (
								<span key={idx}>
									{subParts[0]}
									<span className="text-emerald-600 dark:text-emerald-500 font-bold">✓</span>
									{subParts[1]}
								</span>
							);
						}

						return renderedPart;
					})}
				</span>
			);
		} else if (line.includes("[rule-uploader]")) {
			const parts = line.split("[rule-uploader]");
			element = (
				<span>
					{parts[0]}
					<span className="text-blue-600 dark:text-blue-400 font-bold">
						[rule-uploader]
					</span>
					{parts.slice(1).map((part, idx) => {
						if (
							part.includes("ready") ||
							part.includes("success")
						) {
							const readyParts = part.split("ready");
							return (
								<span key={idx}>
									{readyParts.map((s, i) => (
										<span key={i}>
											{s}
											{i < readyParts.length - 1 && (
												<span className="text-emerald-500 font-bold">
													ready
												</span>
											)}
										</span>
									))}
								</span>
							);
						}
						return part;
					})}
				</span>
			);
		}

		return element;
	};

	return (
		<div className="flex flex-col h-full bg-transparent overflow-hidden gap-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold tracking-tight">Logs Hệ thống</h3>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 h-8 px-3 text-xs"
						onClick={handleCopy}
						disabled={logs.length === 0}
					>
						{copied ? (
							<>
								<Check className="w-3.5 h-3.5 text-emerald-500" />
								<span className="text-emerald-500 font-medium">Đã sao chép</span>
							</>
						) : (
							<>
								<Copy className="w-3.5 h-3.5" />
								<span>Sao chép</span>
							</>
						)}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 h-8 px-3 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
						onClick={onClear}
						disabled={logs.length === 0}
					>
						<Trash2 className="w-3.5 h-3.5" />
						<span>Xóa log</span>
					</Button>
				</div>
			</div>

			<div className="flex-1 bg-muted/40 border border-border/50 rounded-xl font-mono text-xs overflow-y-auto p-4 select-text flex flex-col gap-1.5 shadow-inner">
				{logs.length > 0 ? (
					logs.map((log, i) => (
						<div key={i} className="text-foreground/80 dark:text-foreground/90 break-all leading-relaxed">
							{formatLogLine(log)}
						</div>
					))
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-muted-foreground italic gap-1 select-none">
						<span>Không có logs hoạt động.</span>
						<span className="text-[10px]">Các yêu cầu từ client API sẽ hiển thị tại đây.</span>
					</div>
				)}
				<div ref={logsEndRef} />
			</div>
		</div>
	);
}
