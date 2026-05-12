import React, { useEffect, useState } from 'react';
import { Minus, Square, X, Copy, ArrowLeft } from 'lucide-react';
import {logo} from "@/assets";
import {useTitleBar} from "@/hooks/useTitleBar";
import {motion, AnimatePresence} from "framer-motion";

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { 
    showMinimize, 
    showMaximize, 
    showClose, 
    showLogo, 
    showBack,
    title,
    onBack
  } = useTitleBar();

  useEffect(() => {
    window.electron?.windowControls.onWindowStateChange((state: 'maximized' | 'unmaximized') => {
      setIsMaximized(state === 'maximized');
    });
  }, []);

  const handleMinimize = () => {
    window.electron?.windowControls.minimize();
  };
  
  const handleMaximize = () => {
    window.electron?.windowControls.maximize();
  };
  
  const handleClose = () => {
    window.electron?.windowControls.close();
  };

  return (
    <div 
      className="h-10 w-full bg-background/70 backdrop-blur-xl border-b border-border/10 flex items-center justify-between select-none z-50 flex-shrink-0" 
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left side: Back button */}
      <div className="flex h-full items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <AnimatePresence mode="wait">
          {showBack && (
            <motion.button 
              key="back-button"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onClick={onBack} 
              className="h-full px-4 hover:bg-muted active:opacity-70 inline-flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Right side: Logo/Title + Window Controls */}
      <div className="flex h-full items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {/* Logo and Title sitting just left of window controls */}
        <div className="flex items-center gap-2 px-4 py-1.5 mr-1 border-r border-border/20">
          {showLogo && (
            <img src={logo} alt="Logo" className="w-3.5 h-3.5 object-contain" />
          )}
          <span className="text-[11px] font-bold tracking-tight text-muted-foreground opacity-80">
            {title}
          </span>
        </div>

        <AnimatePresence>
          {showMinimize && (
            <button 
              onClick={handleMinimize} 
              className="h-full px-4 hover:bg-muted active:opacity-70 inline-flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
          )}
          
          {showMaximize && (
            <button 
              onClick={handleMaximize} 
              className="h-full px-4 hover:bg-muted active:opacity-70 inline-flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
            >
              {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
            </button>
          )}
  
          {showClose && (
            <button 
              onClick={handleClose} 
              className="h-full px-4 hover:bg-destructive hover:text-destructive-foreground active:opacity-70 inline-flex items-center justify-center transition-all text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TitleBar;

