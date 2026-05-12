import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	KeyRound,
	Plus,
	Trash2,
	Pencil,
	Check,
	X,
	RefreshCw,
	Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface ApiKey {
	created_at: number;
	last_use: string | null;
	tracking_id: string;
	sensitive_id: string;
	name: string;
}

interface KeyAccountManagerProps {
	account: { id: string; token: string };
}

export default function KeyAccountManager({ account }: KeyAccountManagerProps) {
	const [keys, setKeys] = useState<ApiKey[]>([]);
	const [loading, setLoading] = useState(false);

	// Renaming state
	const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [updating, setUpdating] = useState(false);

	// Platform Token logic
	const [platformToken, setPlatformToken] = useState<string | null>(null);
	const [inputToken, setInputToken] = useState("");

	useEffect(() => {
		const loadPlatformToken = async () => {
			if (!account?.id) return;
			const res = await window.electron?.db.getSetting(`platform_token_${account.id}`);
			if (res?.success && res.value) {
				setPlatformToken(res.value);
			}
		};
		loadPlatformToken();
	}, [account?.id]);

	const handleSaveToken = async () => {
		const token = inputToken.trim();
		if (!token || !account?.id) return;
		await window.electron?.db.setSetting(`platform_token_${account.id}`, token);
		setPlatformToken(token);
	};

	const fetchKeys = async () => {
		const tokenToUse = platformToken || account?.token;
		if (!tokenToUse) return;
		
		setLoading(true);
		try {
			const res = await window.electron?.deepseek?.getApiKeys({
				token: tokenToUse,
			});
			
			if (res?.ok && res.data?.code === 0 && res.data?.data?.biz_data?.api_keys) {
				setKeys(res.data.data.biz_data.api_keys);
				if (!platformToken && tokenToUse === account.token) {
					setPlatformToken(account.token);
				}
			} else if (res?.data?.code === 40003 || res?.error?.message?.includes("40003") || (res?.ok && res?.data?.code !== 0)) {
				setPlatformToken(null);
			} else {
				console.error("Failed to fetch keys:", res);
			}
		} catch (err) {
			console.error("Error fetching keys:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (platformToken !== null || account?.token) {
			fetchKeys();
		}
	}, [account, platformToken]);

	useEffect(() => {
		const handleFocus = () => {
			fetchKeys();
		};
		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, [account]);

	const handleDeleteKey = async (key: ApiKey) => {
		if (!account?.token) return;

		const confirmed = await window.electron?.windowControls.openConfirm({
			title: "Xóa API Key",
			message: `Bạn có chắc chắn muốn xóa API Key "${key.name}"? Các ứng dụng đang sử dụng key này sẽ không thể truy cập được nữa.`,
			confirmText: "Xóa",
			cancelText: "Hủy",
			variant: "destructive",
			type: "danger",
		});

		if (confirmed) {
			try {
				const res = await window.electron?.deepseek?.editApiKeys({
					token: account.token,
					body: {
						action: "delete",
						name: null,
						redacted_key: key.sensitive_id,
						created_at: key.created_at,
					},
				});

				if (res?.ok && res.data?.code === 0) {
					fetchKeys();
				} else {
					console.error("Failed to delete key:", res);
				}
			} catch (err) {
				console.error("Error deleting key:", err);
			}
		}
	};

	const handleStartRename = (key: ApiKey) => {
		setEditingKeyId(key.tracking_id);
		setEditingName(key.name);
	};

	const handleSaveRename = async (key: ApiKey) => {
		const trimmedName = editingName.trim();
		if (!trimmedName || trimmedName === key.name || !account?.token) {
			setEditingKeyId(null);
			return;
		}

		setUpdating(true);
		try {
			const res = await window.electron?.deepseek?.editApiKeys({
				token: account.token,
				body: {
					action: "update",
					name: trimmedName,
					redacted_key: key.sensitive_id,
					created_at: key.created_at,
				},
			});

			if (res?.ok && res.data?.code === 0) {
				setEditingKeyId(null);
				fetchKeys();
			} else {
				console.error("Failed to rename key:", res);
			}
		} catch (err) {
			console.error("Error renaming key:", err);
		} finally {
			setUpdating(false);
		}
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp * 1000).toLocaleString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleOpenCreatePopup = () => {
		if (platformToken) {
			window.electron?.windowControls.openCreateApiKey(platformToken);
		} else if (account?.token) {
			// Fallback to chat token if trying anyway
			window.electron?.windowControls.openCreateApiKey(account.token);
		}
	};

	if (!platformToken) {
		return (
			<div className="flex flex-col h-full bg-transparent overflow-hidden gap-4 items-center justify-center p-4">
				<div className="max-w-md w-full bg-card p-6 rounded-2xl flex flex-col gap-4 text-center border border-border/50 shadow-sm">
					<div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-xl mb-2">
						<KeyRound className="w-6 h-6" />
					</div>
					<h3 className="text-lg font-semibold">Cần Platform Token</h3>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Hệ thống bảo mật <strong className="text-foreground">Cloudflare WAF/Turnstile (Mã 202)</strong> trên trang phát triển của DeepSeek chặn đăng nhập tự động.
					</p>
					<p className="text-xs text-muted-foreground/80 leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/40 text-left">
						Vui lòng truy cập <a href="https://platform.deepseek.com" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">platform.deepseek.com</a>, mở Network (F12) và copy Bearer Token để dán vào dưới đây.
					</p>
					<div className="flex flex-col gap-2 mt-2">
						<Input
							type="password"
							placeholder="Nhập Platform Token (Bearer ...)"
							value={inputToken}
							onChange={(e) => setInputToken(e.target.value)}
							className="rounded-xl text-center h-10"
							onKeyDown={(e) => e.key === "Enter" && handleSaveToken()}
						/>
						<Button className="rounded-xl mt-2 font-semibold h-10" onClick={handleSaveToken} disabled={!inputToken.trim()}>
							Lưu Token & Tiếp Tục
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-transparent overflow-hidden gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<KeyRound className="w-5 h-5 text-primary" />
					<h3 className="text-lg font-semibold tracking-tight">Quản lý API Keys</h3>
				</div>
				<div className="flex items-center gap-2">
					{platformToken && platformToken !== account?.token && (
						<Button
							variant="outline"
							size="sm"
							className="h-9 rounded-xl text-muted-foreground px-3 gap-1.5 hover:bg-muted/30"
							onClick={() => {
								setPlatformToken(null);
							}}
							title="Đổi Platform Token"
						>
							<KeyRound className="w-3.5 h-3.5" />
							<span className="hidden md:inline">Đổi Token</span>
						</Button>
					)}
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-xl text-muted-foreground"
						onClick={fetchKeys}
						disabled={loading}
					>
						<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
					</Button>
					<Button
						size="sm"
						className="gap-1.5 h-9 rounded-xl font-semibold"
						onClick={handleOpenCreatePopup}
						disabled={!platformToken}
					>
						<Plus className="w-4 h-4" />
						<span>Tạo API Key</span>
					</Button>
				</div>
			</div>

			{/* Keys List Table */}
			<div className="flex-1 bg-card rounded-2xl overflow-hidden flex flex-col">
				<div className="flex-1 overflow-y-auto">
					{loading ? (
						<div className="h-full flex flex-col items-center justify-center text-muted-foreground italic gap-2.5">
							<RefreshCw className="w-6 h-6 animate-spin text-primary" />
							<span className="text-xs">Đang tải danh sách API Key...</span>
						</div>
					) : keys.length > 0 ? (
						<div className="divide-y divide-border/50">
							{keys.map((key) => {
								const isEditing = editingKeyId === key.tracking_id;

								return (
									<div
										key={key.tracking_id}
										className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors duration-150 gap-4"
									>
										<div className="flex-1 flex flex-col gap-1 overflow-hidden">
											{isEditing ? (
												<div className="flex items-center gap-1.5 max-w-sm">
													<Input
														value={editingName}
														onChange={(e) => setEditingName(e.target.value)}
														disabled={updating}
														className="h-8 rounded-lg text-sm"
														onKeyDown={(e) => e.key === "Enter" && handleSaveRename(key)}
													/>
													<Button
														size="icon"
														variant="outline"
														className="h-8 w-8 rounded-lg text-emerald-500 shrink-0"
														onClick={() => handleSaveRename(key)}
														disabled={updating}
													>
														<Check className="w-3.5 h-3.5" />
													</Button>
													<Button
														size="icon"
														variant="outline"
														className="h-8 w-8 rounded-lg text-muted-foreground shrink-0"
														onClick={() => setEditingKeyId(null)}
														disabled={updating}
													>
														<X className="w-3.5 h-3.5" />
													</Button>
												</div>
											) : (
												<div className="flex items-center gap-2 group">
													<span className="font-semibold text-sm truncate text-foreground">
														{key.name}
													</span>
													<Button
														variant="ghost"
														size="icon"
														className="h-6 w-6 rounded-md text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-muted transition-all"
														onClick={() => handleStartRename(key)}
													>
														<Pencil className="w-3 h-3" />
													</Button>
												</div>
											)}
											<div className="flex items-center gap-2.5 text-xs text-muted-foreground font-mono select-all select-text">
												<span className="px-1.5 py-0.5 bg-muted rounded text-[10px] uppercase font-sans font-bold tracking-wider shrink-0 select-none">
													API Key
												</span>
												<span className="truncate">{key.sensitive_id}</span>
											</div>
										</div>

										<div className="flex items-center gap-5 shrink-0">
											<div className="flex flex-col items-end gap-0.5 text-right">
												<div className="flex items-center gap-1 text-[11px] text-muted-foreground/80 font-medium">
													<Calendar className="w-3.5 h-3.5" />
													<span>Ngày tạo</span>
												</div>
												<span className="text-[11px] font-mono text-muted-foreground/60">
													{formatDate(key.created_at)}
												</span>
											</div>

											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-xl text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
												onClick={() => handleDeleteKey(key)}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="h-full flex flex-col items-center justify-center text-muted-foreground italic gap-2 py-12">
							<div className="p-3 bg-muted rounded-2xl text-muted-foreground/40">
								<KeyRound className="w-8 h-8" />
							</div>
							<span className="text-xs font-medium">Chưa có API Key nào được tạo.</span>
							<Button
								variant="link"
								size="sm"
								className="text-xs text-primary"
								onClick={handleOpenCreatePopup}
							>
								Tạo API Key đầu tiên ngay bây giờ
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
