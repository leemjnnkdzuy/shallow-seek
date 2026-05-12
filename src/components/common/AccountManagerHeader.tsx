import { Play, Square, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountManagerHeaderProps {
  isRunning: boolean;
  onToggleStartStop: () => void;
  onRestart: () => void;
  email?: string;
}

export default function AccountManagerHeader({ isRunning, onToggleStartStop, onRestart, email }: AccountManagerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {email ? `Quản lý: ${email}` : "Quản lý tài khoản"}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-3 w-3">
            {isRunning ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-muted-foreground"></span>
            )}
          </span>
          <span className={isRunning ? "text-emerald-500 font-medium" : "text-muted-foreground font-medium"}>
            {isRunning ? "Running" : "Stopped"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant={isRunning ? "destructive" : "default"} 
          size="sm" 
          onClick={onToggleStartStop}
          className="gap-2 w-24 transition-all"
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4 fill-current" /> Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Start
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRestart}
          disabled={!isRunning}
          className="gap-2"
        >
          <RotateCw className="w-4 h-4" /> Restart
        </Button>
      </div>
    </div>
  );
}
