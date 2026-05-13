import { useState } from "react";
import { Play, Square, RotateCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountManagerHeaderProps {
  isRunning: boolean;
  onToggleStartStop: () => void;
  onRestart: () => void;
  port?: number;
}

export default function AccountManagerHeader({ isRunning, onToggleStartStop, onRestart, port = 11434 }: AccountManagerHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const endpoint = `http://localhost:${port}/v1`;
    navigator.clipboard.writeText(endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
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

          {isRunning && (
            <div className="flex items-center gap-1.5 ml-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 text-xs font-mono font-medium shadow-sm shadow-emerald-500/5 transition-all">
              <span>http://localhost:{port}/v1</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-emerald-500/20 text-emerald-600 hover:text-emerald-700 rounded-full transition-colors p-0 flex items-center justify-center shrink-0"
                onClick={handleCopy}
                title="Copy API Endpoint"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          )}
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
