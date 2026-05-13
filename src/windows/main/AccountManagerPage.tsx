import { useState, useEffect } from "react";
import { useTitleBar } from "@/hooks/useTitleBar";
import AccountManagerLayout from "@/components/layouts/AccountManagerLayout";
import ChatAccountManager from "@/components/common/AccountManager/ChatAccountManager";
import LogAccountManager from "@/components/common/AccountManager/LogAccountManager";
import KeyAccountManager from "@/components/common/AccountManager/KeyAccountManager";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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
          setAccount(acc);
          setConfig({ 
            title: `Quản lý: ${acc.email}`,
            showBack: true,
            onBack: () => window.location.hash = "/"
          });
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
    try {
      const res = await window.electron?.deepseek?.fetchHistory({
        token: account.chat_token,
      });
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative pr-1">
              <div className="space-y-2 py-1">
                {history.length > 0 ? (
                  history.map((session: any) => (
                    <div 
                      key={session.id} 
                      className={`group px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col gap-1.5 pr-12 animate-chat-card-mount hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
                        selectedSession === session.id 
                          ? 'bg-primary/8 border-primary/35 shadow-[0_4px_12px_rgba(77,106,255,0.05)] translate-x-1' 
                          : 'bg-card/20 border-border/50 hover:bg-card/50 hover:border-border/80 hover:translate-x-0.5'
                      }`}
                      onClick={() => setSelectedSession(session.id)}
                    >
                      {/* Left vertical active bar */}
                      <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary transition-all duration-200 ${
                        selectedSession === session.id ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-40'
                      }`} />

                      <h4 className={`text-sm truncate w-full transition-colors ${
                        selectedSession === session.id ? 'text-foreground font-semibold' : 'text-foreground/85 font-medium group-hover:text-foreground'
                      }`}>
                        {session.title || "New Chat"}
                      </h4>
                      
                      <p className={`text-[10px] truncate w-full transition-colors ${
                        selectedSession === session.id ? 'text-primary/80 font-medium' : 'text-muted-foreground'
                      }`}>
                        {new Date(session.updated_at * 1000).toLocaleDateString()}
                      </p>
                      
                      {/* Delete button that fades in on hover */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-lg items-center justify-center transition-all shrink-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  !loadingHistory && (
                    <p className="text-muted-foreground text-sm text-center py-10">Không có lịch sử.</p>
                  )
                )}
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

