import React, { createContext, useContext, useState } from 'react';

interface TitleBarConfig {
  showMinimize: boolean;
  showMaximize: boolean;
  showClose: boolean;
}

interface TitleBarContextType extends TitleBarConfig {
  setConfig: (config: Partial<TitleBarConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: TitleBarConfig = {
  showMinimize: true,
  showMaximize: true,
  showClose: true,
};

const TitleBarContext = createContext<TitleBarContextType | undefined>(undefined);

export const TitleBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<TitleBarConfig>(defaultConfig);

  const setConfig = (newConfig: Partial<TitleBarConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfigState(defaultConfig);
  };

  return (
    <TitleBarContext.Provider value={{ ...config, setConfig, resetConfig }}>
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
