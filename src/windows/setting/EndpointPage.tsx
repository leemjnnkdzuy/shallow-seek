import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe, Save, Power } from 'lucide-react';
import { useTitleBar } from '@/hooks/useTitleBar';

const EndpointPage: React.FC = () => {
  const { t } = useLanguage();
  const { setConfig } = useTitleBar();
  const [port, setPort] = useState(localStorage.getItem('endpointPort') || '11434');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setConfig({ title: t('sidebar.endpoint') });
  }, [t]);

  const handleSave = () => {
    localStorage.setItem('endpointPort', port);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">{t('settings.endpoint_title')}</h1>
        <p className="text-muted-foreground">{t('settings.endpoint_desc')}</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t('sidebar.endpoint')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('settings.endpoint_desc')}
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-1">
            <Label htmlFor="port" className="text-sm font-bold ml-1">{t('settings.port_label')}</Label>
            <div className="flex gap-3">
              <Input
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder={t('settings.port_placeholder')}
                className="max-w-[240px] h-12 rounded-xl border-2 border-border bg-transparent focus-visible:ring-primary/20 font-bold"
              />
              <Button onClick={handleSave} className="h-12 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95">
                <Save className="w-4 h-4" />
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex items-center justify-between">
          <div className="space-y-1 pl-1">
            <Label className="text-lg font-bold">{t('settings.status')}</Label>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
              {isActive ? t('settings.active') : t('settings.inactive')}
            </p>
          </div>
          <Button 
            variant={isActive ? "destructive" : "default"}
            className={`h-11 px-8 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isActive ? 'shadow-destructive/20' : 'shadow-primary/20'} hover:scale-105 active:scale-95`}
            onClick={() => setIsActive(!isActive)}
          >
            <Power className="w-4 h-4" />
            {isActive ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndpointPage;
