import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import '@/index.css';
import routes from '@/routes';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

const App = () => {
  useTheme();
  useLanguage();
  const [currentPath, setCurrentPath] = React.useState(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      return hash.substring(1) || '/';
    }
    const path = window.location.pathname;
    return path.includes('index.html') ? '/' : (path || '/');
  });

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#')) {
        setCurrentPath(hash.substring(1) || '/');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  try {
    const pathOnly = currentPath.split('?')[0];
    const route = routes.find((r: any) => {
      if (r.path.includes('/:')) {
        const routeParts = r.path.split('/');
        const pathParts = pathOnly.split('/');
        if (routeParts.length !== pathParts.length) return false;
        return routeParts.every((part: string, i: number) => part.startsWith(':') || part === pathParts[i]);
      }
      return r.path === pathOnly;
    }) || (routes && routes.length > 0 ? routes[0] : null);
    
    if (!route) {
      return (
        <div className="flex items-center justify-center h-screen bg-background text-foreground">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Error: No route configuration found.</h1>
            <p className="text-muted-foreground">Please check src/routes/index.ts</p>
          </div>
        </div>
      );
    }

    const Page = route.component;
    const Layout = route.layout;

    if (!Page || !Layout) {
      return (
        <div className="flex items-center justify-center h-screen bg-background text-foreground">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Error: Missing Page or Layout for route {currentPath}</h1>
          </div>
        </div>
      );
    }

    return (
      <Layout>
        <Page />
      </Layout>
    );
  } catch (error) {
    console.error('Render error:', error);
    return (
      <div className="flex items-center justify-center h-screen bg-background text-destructive p-8">
        <div className="max-w-md w-full bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h1 className="text-xl font-bold mb-2">Runtime Error</h1>
          <pre className="text-xs overflow-auto whitespace-pre-wrap">{String(error)}</pre>
        </div>
      </div>
    );
  }
};

import { TitleBarProvider } from '@/hooks/useTitleBar';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TitleBarProvider>
        <App />
      </TitleBarProvider>
    </React.StrictMode>
  );
}
