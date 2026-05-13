import { useEffect } from 'react';
import { useTitleBar } from '@/hooks/useTitleBar';

export default function DeepseekBrowserPage() {
    const { setConfig } = useTitleBar();

    useEffect(() => {
        setConfig({
            title: "DeepSeek",
            logoIcon: "deepseek",
            showMinimize: true,
            showMaximize: true,
            showClose: true,
            showBack: false,
        });
    }, [setConfig]);

    return (
        <div className="w-full h-full bg-background flex items-center justify-center min-h-[500px]">
            <div className="text-muted-foreground text-sm animate-pulse">
                Loading DeepSeek...
            </div>
        </div>
    );
}
