import {useState, useEffect, useCallback} from "react";
import {useTitleBar} from "@/hooks/useTitleBar";
import AccountManagerLayout from "@/components/layouts/AccountManagerLayout";
import ChatAccountManager from "@/components/common/AccountManager/ChatAccountManager";
import LogAccountManager from "@/components/common/AccountManager/LogAccountManager";
import KeyAccountManager from "@/components/common/AccountManager/KeyAccountManager";
import {Button} from "@/components/ui/button";
import {Plus, Trash2} from "lucide-react";
import type {Account, ChatSessionSummary} from "@/types";
import {parseChatSession, handleDeleteSession as deleteSessionHandler, toggleServer, restartServer} from "@/handlers";

export default function AccountManagerPage() {
	const id = window.location.hash.split("/").pop();
	const [activeTab, setActiveTab] = useState("logs");
	const [isRunning, setIsRunning] = useState(false);
	const [port, setPort] = useState<number>(11434);
	const [basePort, setBasePort] = useState<number>(11434);
	const [accountPorts, setAccountPorts] = useState<Record<string, number>>(
		{},
	);
	const [account, setAccount] = useState<Account | null>(null);
	const [history, setHistory] = useState<ChatSessionSummary[]>([]);
	const [loadingHistory, setLoadingHistory] = useState(false);
	const [selectedSession, setSelectedSession] = useState<string | null>(null);
	const [logs, setLogs] = useState<string[]>([]);
	const {setConfig, resetConfig} = useTitleBar();
	const accountToken = account?.chat_token;

	useEffect(() => {
		setConfig({
			title: "Quản lý tài khoản",
			showBack: true,
			onBack: () => (window.location.hash = "/"),
		});
		const fetchAccount = async () => {
			const res = await window.electron?.db.getAccounts();
			if (res?.success && res.data) {
				const acc = res.data.find((a) => a.id === id);
				if (acc) {
					setAccount(acc);
					setConfig({
						title: `Quản lý: ${acc.email}`,
						showBack: true,
						onBack: () => (window.location.hash = "/"),
					});
				} else {
					console.error(
						"[AccountManagerPage] Account not found for id:",
						id,
					);
				}
			}
		};
		fetchAccount();

		return () => resetConfig();
	}, [id, setConfig, resetConfig]);

	useEffect(() => {
		const checkStatus = async () => {
			const res = await window.electron?.server?.status();
			setIsRunning(res?.isRunning || false);
			if (res?.port) {
				setBasePort(res.port);
			}
			if (res?.accountPorts) {
				setAccountPorts(res.accountPorts);
			} else {
				setAccountPorts({});
			}
			const logRes = await window.electron?.server?.getLogs();
			if (logRes?.logs) {
				setLogs(logRes.logs);
			}
		};
		checkStatus();

		const cleanupStatus = window.electron?.server?.onStatusChanged(
			(running, p, ports) => {
				setIsRunning(running);
				if (p) {
					setBasePort(p);
				}
				if (ports) {
					setAccountPorts(ports);
				} else {
					setAccountPorts({});
				}
			},
		);
		const cleanupLog = window.electron?.server?.onLog((msg) => {
			setLogs((prev) => [...prev, msg]);
		});

		return () => {
			if (cleanupStatus) cleanupStatus();
			if (cleanupLog) cleanupLog();
		};
	}, []);

	useEffect(() => {
		if (!account?.id) return;
		const nextPort = accountPorts[account.id] ?? basePort;
		setPort(nextPort);
	}, [account, accountPorts, basePort]);

	const fetchHistory = useCallback(async () => {
		if (!accountToken) return;
		setLoadingHistory(true);
		try {
			const res = await window.electron?.deepseek?.fetchHistory({
				token: accountToken,
			});
			const rawSessions = (
				res?.data as
					| {data?: {biz_data?: {chat_sessions?: unknown}}}
					| undefined
			)?.data?.biz_data?.chat_sessions;
			if (!res?.ok || !Array.isArray(rawSessions)) {
				console.error(
					"[AccountManagerPage] Failed to fetch history or invalid data structure",
					res,
				);
				setHistory([]);
				return;
			}
			const parsedSessions = rawSessions
				.map(parseChatSession)
				.filter(
					(session): session is ChatSessionSummary =>
						session !== null,
				);
			setHistory(parsedSessions);
		} catch (err) {
			console.error("[AccountManagerPage] Error fetching history:", err);
		} finally {
			setLoadingHistory(false);
		}
	}, [accountToken]);

	useEffect(() => {
		if (activeTab === "history") {
			fetchHistory();
		}
	}, [activeTab, fetchHistory]);

	const handleToggleStartStop = () => toggleServer(isRunning);
	const handleRestart = () => restartServer(isRunning);

	const handleDeleteSession = (sessionId: string) => {
		deleteSessionHandler(sessionId, accountToken, selectedSession, {
			fetchHistory,
			setSelectedSession,
		});
	};

	return (
		<AccountManagerLayout
			activeTab={activeTab}
			setActiveTab={setActiveTab}
			isRunning={isRunning}
			onToggleStartStop={handleToggleStartStop}
			onRestart={handleRestart}
			port={port}
		>
			{activeTab === "history" && account && (
				<div className='flex h-full gap-4 overflow-hidden'>
					<div className='flex-1 h-full overflow-hidden'>
						<ChatAccountManager
							account={account}
							sessionId={selectedSession}
							onSessionCreated={(id: string) => {
								setSelectedSession(id);
								fetchHistory();
							}}
							onRefreshHistory={fetchHistory}
						/>
					</div>
					<div className='w-[300px] flex flex-col gap-4 border-l pl-4 shrink-0'>
						<div className='flex items-center justify-between'>
							<h3 className='text-lg font-semibold tracking-tight'>
								Lịch sử
							</h3>
							<Button
								onClick={() => setSelectedSession(null)}
								className='gap-1 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold px-3.5'
							>
								<Plus className='w-3.5 h-3.5 stroke-[2.5]' />
								<span>Mới</span>
							</Button>
						</div>
						<div className='flex-1 overflow-y-auto overflow-x-hidden relative pr-1'>
							<div className='space-y-2 py-1'>
								{history.length > 0 ?
									history.map((session) => (
										<div
											key={session.id}
											className={`group px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col gap-1.5 pr-12 animate-chat-card-mount hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
												selectedSession === session.id ?
													"bg-primary/8 border-primary/35 shadow-[0_4px_12px_rgba(77,106,255,0.05)] translate-x-1"
												:	"bg-card/20 border-border/50 hover:bg-card/50 hover:border-border/80 hover:translate-x-0.5"
											}`}
											onClick={() =>
												setSelectedSession(session.id)
											}
										>
											{/* Left vertical active bar */}
											<div
												className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary transition-all duration-200 ${
													(
														selectedSession ===
														session.id
													) ?
														"scale-y-100 opacity-100"
													:	"scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-40"
												}`}
											/>

											<h4
												className={`text-sm truncate w-full transition-colors ${
													(
														selectedSession ===
														session.id
													) ?
														"text-foreground font-semibold"
													:	"text-foreground/85 font-medium group-hover:text-foreground"
												}`}
											>
												{session.title || "New Chat"}
											</h4>

											<p
												className={`text-[10px] truncate w-full transition-colors ${
													(
														selectedSession ===
														session.id
													) ?
														"text-primary/80 font-medium"
													:	"text-muted-foreground"
												}`}
											>
												{new Date(
													session.updated_at * 1000,
												).toLocaleDateString()}
											</p>

											{/* Delete button that fades in on hover */}
											<div className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
												<Button
													variant='ghost'
													size='icon'
													className='h-7 w-7 rounded-lg items-center justify-center transition-all shrink-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteSession(
															session.id,
														);
													}}
												>
													<Trash2 className='h-3.5 w-3.5' />
												</Button>
											</div>
										</div>
									))
								:	!loadingHistory && (
										<p className='text-muted-foreground text-sm text-center py-10'>
											Không có lịch sử.
										</p>
									)
								}
							</div>
						</div>
					</div>
				</div>
			)}
			{activeTab === "logs" && (
				<LogAccountManager logs={logs} onClear={() => setLogs([])} />
			)}
			{activeTab === "api-keys" && account && (
				<KeyAccountManager account={account} />
			)}
			{activeTab === "tokens" && (
				<div className='space-y-4'>
					<h3 className='text-xl font-bold'>Quản lý Token Usage</h3>
					<p className='text-muted-foreground'>
						Input / Output token analytics will go here.
					</p>
				</div>
			)}
			{activeTab === "prompt" && (
				<div className='space-y-4'>
					<h3 className='text-xl font-bold'>Quản lý System Prompt</h3>
					<p className='text-muted-foreground'>
						System prompt configuration goes here.
					</p>
				</div>
			)}
		</AccountManagerLayout>
	);
}
