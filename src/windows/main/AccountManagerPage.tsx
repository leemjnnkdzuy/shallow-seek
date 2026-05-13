import { useState, useEffect } from "react";
import { useTitleBar } from "@/hooks/useTitleBar";
import AccountManagerLayout from "@/components/layouts/AccountManagerLayout";
import ChatAccountManager from "@/components/common/AccountManager/ChatAccountManager";
import LogAccountManager from "@/components/common/AccountManager/LogAccountManager";
import KeyAccountManager from "@/components/common/AccountManager/KeyAccountManager";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RefreshCw } from "lucide-react";

export default function AccountManagerPage() {
  const id = window.location.hash.split("/").pop();
  const [activeTab, setActiveTab] = useState("logs");
  const [isRunning, setIsRunning] = useState(false);
  const [port, setPort] = useState<number>(11434);
  const [account, setAccount] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { setConfig, resetConfig } = useTitleBar();

  useEffect(() => {
    setConfig({ 
      title: "Quản lý tài khoản",
      showBack: true,
      onBack: () => window.location.hash = "/"
    });
    const fetchAccount = async () => {
      const res = await window.electron?.db.getAccounts();
      if (res?.success && res.data) {
        const acc = res.data.find((a: any) => a.id === id);
        if (acc) {
          console.log("[AccountManagerPage] Found account:", acc.email, "Token exists:", !!acc.chat_token);
          setAccount(acc);
        } else {
          console.error("[AccountManagerPage] Account not found for id:", id);
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
        setPort(res.port);
      }
      const logRes = await window.electron?.server?.getLogs();
      if (logRes?.logs) {
        setLogs(logRes.logs);
      }
    };
    checkStatus();

    const cleanupStatus = window.electron?.server?.onStatusChanged((running, p) => {
      setIsRunning(running);
      if (p) {
        setPort(p);
      }
    });
    const cleanupLog = window.electron?.server?.onLog((msg) => {
      setLogs((prev) => [...prev, msg]);
    });

    return () => {
      if (cleanupStatus) cleanupStatus();
      if (cleanupLog) cleanupLog();
    };
  }, []);



  const fetchHistory = async () => {
    if (!account) return;
    setLoadingHistory(true);
    console.log("[AccountManagerPage] Fetching history for account:", account.email);
    try {
      const res = await window.electron?.deepseek?.fetchHistory({
        token: account.chat_token,
      });
      console.log("[AccountManagerPage] fetchHistory response:", res);
      if (res?.ok && res.data?.data?.biz_data?.chat_sessions) {
        setHistory(res.data.data.biz_data.chat_sessions);
      } else {
        console.error("[AccountManagerPage] Failed to fetch history or invalid data structure", res);
      }
    } catch (err) {
      console.error("[AccountManagerPage] Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history" && account) {
      fetchHistory();
    }
  }, [activeTab, account]);

  const handleToggleStartStop = async () => {
    if (isRunning) {
      await window.electron?.server?.stop();
    } else {
      await window.electron?.server?.start();
    }
  };

  const handleRestart = async () => {
    if (isRunning) {
      await window.electron?.server?.stop();
      setTimeout(async () => {
        await window.electron?.server?.start();
      }, 500);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!account?.chat_token) return;

    const confirmed = await window.electron?.windowControls.openConfirm({
      title: "",
      message: "Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      variant: "destructive",
      type: "danger"
    });

    if (confirmed) {
      try {
        const res = await window.electron?.deepseek?.deleteChatSession({
          token: account.chat_token,
          sessionId
        });
        if (res?.ok) {
          fetchHistory();
          if (selectedSession === sessionId) {
            setSelectedSession(null);
          }
        } else {
          console.error("Failed to delete session:", res?.error);
        }
      } catch (err) {
        console.error("Delete session error:", err);
      }
    }
  };

  return (
    <AccountManagerLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isRunning={isRunning}
      onToggleStartStop={handleToggleStartStop}
      onRestart={handleRestart}
      email={account?.email}
      port={port}
    >
      {activeTab === "history" && (
        <div className="flex h-full gap-4 overflow-hidden">
          <div className="flex-1 h-full overflow-hidden">
            <ChatAccountManager 
              account={account} 
              sessionId={selectedSession} 
              onSessionCreated={(id) => {
                setSelectedSession(id);
                fetchHistory();
              }}
              onRefreshHistory={fetchHistory}
            />
          </div>
          <div className="w-[300px] flex flex-col gap-4 border-l pl-4 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Lịch sử</h3>
              <Button 
                onClick={() => setSelectedSession(null)}
                className="gap-1 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold px-3.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Mới</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
              {loadingHistory && history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                  <p className="text-muted-foreground text-xs font-medium italic">Đang tải lịch sử...</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {loadingHistory && history.length > 0 && (
                    <div className="flex items-center justify-center py-1 mb-2 bg-primary/5 rounded-md border border-primary/10 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin text-primary mr-2" />
                      <span className="text-[10px] text-primary font-medium">Đang cập nhật...</span>
                    </div>
                  )}
                  {history.length > 0 ? (
                    history.map((session: any) => (
                      <div 
                        key={session.id} 
                        className={`group px-4 py-2.5 rounded-lg border cursor-pointer transition-all relative flex flex-col gap-0.5 pr-12 ${selectedSession === session.id ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'border-transparent hover:bg-muted text-foreground'}`}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <h4 className="font-medium text-sm truncate w-full">{session.title || "New Chat"}</h4>
                        <p className={`text-[10px] truncate w-full ${selectedSession === session.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(session.updated_at * 1000).toLocaleDateString()}
                        </p>
                        
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 items-center justify-center transition-all shrink-0 ${selectedSession === session.id ? 'hover:bg-white/20 text-white' : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-10">Không có lịch sử.</p>
                  )}
                </div>
              )}
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Quản lý Token Usage</h3>
          <p className="text-muted-foreground">Input / Output token analytics will go here.</p>
        </div>
      )}
      {activeTab === "prompt" && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Quản lý System Prompt</h3>
          <p className="text-muted-foreground">System prompt configuration goes here.</p>
        </div>
      )}
    </AccountManagerLayout>
  );
}

