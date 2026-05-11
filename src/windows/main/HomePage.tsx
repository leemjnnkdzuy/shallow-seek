import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background transition-colors duration-300">
      {/* Header / Top Bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={() => window.electron?.windowControls.openAddAccount()}
          >
            <Plus className="w-4 h-4" />
            Thêm tài khoản
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Chào mừng bạn</h1>
          <p className="text-muted-foreground text-lg">
            Bắt đầu bằng cách thêm một tài khoản DeepSeek để quản lý các cuộc hội thoại của bạn một cách hiệu quả.
          </p>
          <div className="pt-4">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Khám phá ngay
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
