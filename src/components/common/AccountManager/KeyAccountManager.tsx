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

import {
	ApiKey,
	fetchApiKeys,
	connectPlatform,
	deleteApiKey,
	renameApiKey,
} from "@/handlers/ApiKeyHandler";

interface KeyAccountManagerProps {
	account: { id: string; email: string; chat_token: string; platform_token?: string };
}

export default function KeyAccountManager({ account }: KeyAccountManagerProps) {
	const [keys, setKeys] = useState<ApiKey[]>([]);
	const [loading, setLoading] = useState(false);

	const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [updating, setUpdating] = useState(false);

	const [platformToken, setPlatformToken] = useState<string | null>(null);
	const [error40003, setError40003] = useState(false);

	useEffect(() => {
		const loadPlatformToken = async () => {
			if (account?.platform_token) {
				setPlatformToken(account.platform_token);
			} else if (account?.id) {
				const res = await window.electron?.db.getSetting(`platform_token_${account.id}`);
				if (res?.success && res.value) {
					setPlatformToken(res.value);
				}
			}
		};
		loadPlatformToken();
	}, [account?.id]);

	const fetchKeys = async () => {
		await fetchApiKeys(platformToken, {
			setKeys,
			setPlatformToken,
			setError40003,
			setLoading,
		});
	};

	const handleConnectPlatform = async () => {
		if (!account?.id) return;
		await connectPlatform(account.id, {
			setLoading,
			setPlatformToken,
			setError40003,
			fetchKeys,
		});
	};

	useEffect(() => {
		if (platformToken !== null || account?.chat_token) {
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
		const tokenToUse = platformToken || account?.chat_token;
		if (!tokenToUse) return;
		await deleteApiKey(key, tokenToUse, { fetchKeys });
	};

	const handleStartRename = (key: ApiKey) => {
		setEditingKeyId(key.tracking_id);
		setEditingName(key.name);
	};

	const handleSaveRename = async (key: ApiKey) => {
		const tokenToUse = platformToken || account?.chat_token;
		if (!tokenToUse) return;
		await renameApiKey(key, editingName, tokenToUse, {
			setEditingKeyId,
			setUpdating,
			fetchKeys,
		});
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
		} else if (account?.chat_token) {
			window.electron?.windowControls.openCreateApiKey(account.chat_token);
		}
	};

	return (
		<div className="flex flex-col h-full bg-transparent overflow-hidden gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<KeyRound className="w-5 h-5 text-primary" />
					<h3 className="text-lg font-semibold tracking-tight">Quản lý API Keys</h3>
				</div>
				<div className="flex items-center gap-2">

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

			{/* Keys Grid / Scroll Container */}
			<div className="flex-1 overflow-y-auto pr-1">
				{loading ? (
					<div className="h-full min-h-[250px] flex flex-col items-center justify-center text-muted-foreground italic gap-2.5">
						<RefreshCw className="w-6 h-6 animate-spin text-primary" />
						<span className="text-xs">Đang tải danh sách API Key...</span>
					</div>
				) : error40003 ? (
					<div className="h-full min-h-[250px] flex flex-col items-center justify-center text-muted-foreground gap-4 py-10 bg-card rounded-2xl border border-dashed border-border/40 px-6 text-center">
						<div className="p-3.5 bg-amber-500/10 rounded-2xl text-amber-500">
							<KeyRound className="w-6 h-6" />
						</div>
						<div className="flex flex-col gap-1 max-w-sm">
							<span className="text-sm font-semibold text-foreground">Yêu cầu Đăng nhập cổng Platform</span>
							<span className="text-xs text-muted-foreground leading-relaxed">
								Để quản lý API Keys (Xem, Tạo, Đổi tên, Xóa), bạn cần đăng nhập tài khoản trên cổng DeepSeek Platform để lấy mã xác thực an toàn.
							</span>
						</div>
						<Button
							onClick={handleConnectPlatform}
							disabled={loading}
							className="gap-2 h-9 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
						>
							<KeyRound className="w-4 h-4" />
							<span>Đăng nhập cổng Platform</span>
						</Button>
					</div>
				) : keys.length > 0 ? (
					<div className="flex flex-col gap-3">
						{keys.map((key) => {
							const isEditing = editingKeyId === key.tracking_id;

							return (
								<div
									key={key.tracking_id}
									className="px-5 py-4 flex flex-row items-center justify-between bg-card hover:bg-card/85 border border-border/40 hover:border-border-muted rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 gap-4"
								>
									{/* Left group: Name and Redacted key details */}
									<div className="flex-1 min-w-0 flex items-center gap-4">
										{/* Key name/input section */}
										<div className="w-[150px] shrink-0 min-w-[100px] max-w-[180px]">
											{isEditing ? (
												<div className="flex items-center gap-1 w-full">
													<Input
														value={editingName}
														onChange={(e) => setEditingName(e.target.value)}
														disabled={updating}
														className="h-8 rounded-lg text-sm flex-1"
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
												<div className="flex items-center gap-1.5 group">
													<span className="font-semibold text-sm truncate text-foreground" title={key.name}>
														{key.name}
													</span>
													<Button
														variant="ghost"
														size="icon"
														className="h-6 w-6 rounded-md text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-muted transition-all shrink-0"
														onClick={() => handleStartRename(key)}
													>
														<Pencil className="w-3 h-3" />
													</Button>
												</div>
											)}
										</div>

										{/* Key Value section */}
										<div className="flex-1 flex items-center gap-2.5 min-w-0">
											<span className="px-1.5 py-0.5 bg-muted rounded text-[10px] uppercase font-sans font-bold tracking-wider shrink-0 select-none">
												API Key
											</span>
											<span className="font-mono text-xs text-muted-foreground truncate select-all">{key.sensitive_id}</span>
										</div>
									</div>

									{/* Right group: Date created and delete button */}
									<div className="flex items-center gap-5 shrink-0 ml-4">
										<div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium">
											<Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
											<span>Ngày tạo:</span>
											<span className="font-mono text-muted-foreground/60 font-normal">
												{formatDate(key.created_at)}
											</span>
										</div>

										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 rounded-xl text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
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
					<div className="h-full min-h-[250px] flex flex-col items-center justify-center text-muted-foreground italic gap-2 py-12 rounded-2xl">
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
	);
}
