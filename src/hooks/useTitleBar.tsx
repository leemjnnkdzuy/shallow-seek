import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface TitleBarConfig {
  showMinimize: boolean;
  showMaximize: boolean;
  showClose: boolean;
  showLogo: boolean;
  showBack: boolean;
  title: string;
  onBack?: () => void;
}

interface TitleBarContextType extends TitleBarConfig {
  setConfig: (config: Partial<TitleBarConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: TitleBarConfig = {
  showMinimize: true,
  showMaximize: true,
  showClose: true,
  showLogo: true,
  showBack: false,
  title: "ShallowSeek",
};

const TitleBarContext = createContext<TitleBarContextType | undefined>(undefined);

export const TitleBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<TitleBarConfig>(defaultConfig);

  const setConfig = useCallback((newConfig: Partial<TitleBarConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(defaultConfig);
  }, []);

  const contextValue = useMemo(() => ({
    ...config,
    setConfig,
    resetConfig
  }), [config, setConfig, resetConfig]);

  return (
    <TitleBarContext.Provider value={contextValue}>
      {children}
    </TitleBarContext.Provider>
  );
};

export const useTitleBar = () => {
  const context = useContext(TitleBarContext);
  if (!context) {
    throw new Error('useTitleBar must be used within a TitleBarProvider');
  }
  return context;
};
