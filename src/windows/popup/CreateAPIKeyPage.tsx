import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTitleBar } from "@/hooks/useTitleBar";
import {
	Check,
	Copy,
	RefreshCw,
	AlertCircle,
	ArrowRight,
	Info,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {ApiKey} from "@/types";
import {createKey as onCreateKeyHandler, copyToClipboard as onCopyHandler} from "@/handlers";

const phaseVariants = {
	initial: { opacity: 0, y: 8, scale: 0.995 },
	animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28 } },
	exit: { opacity: 0, y: -8, scale: 0.995, transition: { duration: 0.18 } },
};

const CreateAPIKeyPage: React.FC = () => {
	const hash = window.location.hash;
	const matchIndex = hash.indexOf("/create-api-key/");
	const tokenRaw = matchIndex !== -1 ? hash.substring(matchIndex + "/create-api-key/".length) : "";
	const token = decodeURIComponent(tokenRaw);


	const [keyName, setKeyName] = useState("");
	const [phase, setPhase] = useState<1 | 2>(1);
	const [creating, setCreating] = useState(false);
	const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
	const [copied, setCopied] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const { setConfig, resetConfig } = useTitleBar();

	useEffect(() => {
		setConfig({
			showMinimize: false,
			showMaximize: false,
			showLogo: false,
			title: "",
		});
		return () => resetConfig();
	}, [setConfig, resetConfig]);

	const handleCreateKey = () => {
		onCreateKeyHandler(token, keyName, {
			setCreating,
			setErrorMessage,
			setCreatedKey,
			setPhase,
		});
	};

	const copyToClipboard = (text: string) => {
		onCopyHandler(text, {setCopied});
	};

	return (
		<div className="min-h-full w-full flex items-center justify-center p-6 bg-transparent select-none">
			<Card className="w-full max-w-md shadow-none border-none bg-transparent">
				<AnimatePresence mode="wait">
					{phase === 1 ? (
						<motion.div
							key="phase-1"
							variants={phaseVariants}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							<CardHeader className="space-y-1">
								<div className="flex items-center gap-2 mb-1">
									<CardTitle className="text-xl font-bold">
										Tạo API Key Mới
									</CardTitle>
								</div>
								<CardDescription>
									Khởi tạo API Key mới để kết nối các ứng dụng, agent hoặc môi trường phát triển của bạn.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="keyName">Tên API Key</Label>
									<Input
										id="keyName"
										placeholder="Ví dụ: Key_phat_trien, Agent_Key..."
										className="h-10 rounded-xl"
										value={keyName}
										onChange={(e) => {
											setKeyName(e.target.value);
											if (errorMessage) setErrorMessage("");
										}}
										onKeyDown={(e) => e.key === "Enter" && !creating && keyName.trim() && handleCreateKey()}
										disabled={creating}
										autoFocus
									/>
									{errorMessage && (
										<p className="text-xs text-destructive font-medium mt-1">
											{errorMessage}
										</p>
									)}
								</div>

								<div className="text-[11px] text-muted-foreground flex items-start gap-1.5 bg-muted/50 p-3 rounded-xl border border-border/40 leading-relaxed">
									<Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
									<span>
										Bạn sẽ được xem khóa API đầy đủ một lần duy nhất sau khi tạo. Hãy chắc chắn rằng bạn có thể sao chép nó ngay lập tức.
									</span>
								</div>
							</CardContent>

							<CardFooter className="flex flex-col gap-3.5 pt-2">
								<Button
									className="w-full h-10 rounded-xl font-semibold gap-1.5"
									onClick={handleCreateKey}
									disabled={!keyName.trim() || creating}
								>
									{creating ? (
										<>
											<RefreshCw className="w-4 h-4 animate-spin" />
											<span>Đang tạo khóa...</span>
										</>
									) : (
										<>
											<span>Tạo API Key</span>
										</>
									)}
								</Button>
								<Button
									variant="ghost"
									className="w-full h-10 rounded-xl font-medium"
									onClick={() => window.electron?.windowControls.close()}
									disabled={creating}
								>
									Hủy bỏ
								</Button>
							</CardFooter>
						</motion.div>
					) : (
						<motion.div
							key="phase-2"
							variants={phaseVariants}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							<CardHeader className="space-y-1">
								<div className="flex items-center gap-2 mb-1 text-emerald-500">
									<CardTitle className="text-xl font-bold">
										Tạo Khóa Thành Công!
									</CardTitle>
								</div>
								<CardDescription>
									Sao chép khóa API bên dưới để sử dụng trong các sản phẩm của bạn.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-xl p-3.5 text-xs leading-relaxed">
									<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
									<span>
										Vì lý do bảo mật, <strong>bạn sẽ không thể xem lại khóa này</strong> sau khi đóng cửa sổ này. Hãy sao chép và cất giữ ở nơi an toàn ngay!
									</span>
								</div>

								<div className="space-y-2">
									<Label className="text-xs text-muted-foreground font-semibold">Tên API Key</Label>
									<div className="px-3.5 py-2 bg-muted rounded-xl text-sm font-medium border border-border/50">
										{createdKey?.name}
									</div>
								</div>

								<div className="space-y-2">
									<Label className="text-xs text-muted-foreground font-semibold">Mã API Key (Chỉ hiển thị lúc này)</Label>
									<div className="flex items-center gap-2">
										<div className="flex-1 px-3 py-2.5 bg-zinc-950 dark:bg-black text-zinc-200 rounded-xl text-xs font-mono border border-border/50 select-all overflow-x-auto whitespace-nowrap scrollbar-none">
											{createdKey?.sensitive_id}
										</div>
										<Button
											size="icon"
											variant="outline"
											className="h-9 w-9 rounded-xl shrink-0 transition-all duration-200"
											onClick={() => createdKey && copyToClipboard(createdKey.sensitive_id)}
										>
											{copied ? (
												<Check className="w-4 h-4 text-emerald-500" />
											) : (
												<Copy className="w-4 h-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</div>
							</CardContent>

							<CardFooter className="pt-2">
								<Button
									onClick={() => window.electron?.windowControls.close()}
									className="w-full h-10 rounded-xl font-semibold gap-1.5"
								>
									<span>Tôi đã lưu khóa này</span>
									<ArrowRight className="w-4 h-4" />
								</Button>
							</CardFooter>
						</motion.div>
					)}
				</AnimatePresence>
			</Card>
		</div>
	);
};

export default CreateAPIKeyPage;
