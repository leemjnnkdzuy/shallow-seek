import React, { useEffect, useState } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { logo } from '@/assets';
import { useTitleBar } from '@/hooks/useTitleBar';

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { showMinimize, showMaximize, showClose } = useTitleBar();

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
      className="h-10 w-full bg-background flex items-center justify-end select-none z-50 flex-shrink-0" 
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex h-full items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {/* Logo and Icon moved here */}
        <div className="flex items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
          <img src={logo} alt="ShallowSeek Logo" className="w-4 h-4 object-contain" />
          <span className="opacity-70">ShallowSeek</span>
        </div>

        {showMinimize && (
          <button 
            onClick={handleMinimize} 
            className="h-full px-4 hover:bg-muted inline-flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
        
        {showMaximize && (
          <button 
            onClick={handleMaximize} 
            className="h-full px-4 hover:bg-muted inline-flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
          >
            {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
          </button>
        )}

        {showClose && (
          <button 
            onClick={handleClose} 
            className="h-full px-4 hover:bg-destructive hover:text-destructive-foreground inline-flex items-center justify-center transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TitleBar;

