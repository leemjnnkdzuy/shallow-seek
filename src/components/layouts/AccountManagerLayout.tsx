import React from "react";
import AccountManagerHeader from "@/components/common/AccountManagerHeader";
import AccountManagerSidar from "@/components/common/AccountManagerSidar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AccountManagerLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRunning: boolean;
  onToggleStartStop: () => void;
  onRestart: () => void;
  email?: string;
  port?: number;
}

export default function AccountManagerLayout({
  children,
  activeTab,
  setActiveTab,
  isRunning,
  onToggleStartStop,
  onRestart,
  email,
  port
}: AccountManagerLayoutProps) {
  return (
    <SidebarProvider className="h-full min-h-0 w-full overflow-hidden bg-background">
      <AccountManagerSidar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset className="bg-background overflow-hidden flex flex-col relative w-full h-full">
        <AccountManagerHeader 
          isRunning={isRunning} 
          onToggleStartStop={onToggleStartStop} 
          onRestart={onRestart}
          email={email}
          port={port}
        />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
