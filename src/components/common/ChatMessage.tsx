import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Editor from "@monaco-editor/react";
import { FormattedMessage } from "@/lib/utils";

interface ChatMessageProps {
  message: FormattedMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div 
      className={`p-3 px-4 rounded-2xl max-w-[95%] w-fit flex flex-col gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser 
          ? "bg-primary text-primary-foreground ml-auto rounded-tr-none shadow-primary/10" 
          : isSystem 
            ? "bg-destructive/10 text-destructive mx-auto border border-destructive/20 text-[11px] italic py-2" 
            : "bg-muted/40 border border-border/40 mr-auto rounded-tl-none backdrop-blur-sm"
      }`}
    >
      {message.files && message.files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-0.5">
          {message.files.map((file, idx) => (
            <div 
              key={idx} 
              className="text-[10px] bg-background/20 px-2 py-1 rounded-md border border-current/10 flex items-center gap-1.5 backdrop-blur-sm transition-colors hover:bg-background/30"
            >
              <span className="opacity-70">📁</span>
              <span className="truncate max-w-[150px] font-medium opacity-90">{file}</span>
            </div>
          ))}
        </div>
      )}
      <div className={`text-[13px] leading-relaxed tracking-tight markdown-content ${isUser ? 'prose-user' : 'prose-assistant'}`}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-1.5 last:mb-0 opacity-95">{children}</p>,
            ul: ({ children }) => <ul className="list-disc ml-5 mb-1.5 space-y-0.5 opacity-90">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-5 mb-1.5 space-y-0.5 opacity-90">{children}</ol>,
            li: ({ children }) => <li className="pl-0.5">{children}</li>,
            pre: (props: any) => {
              const { children } = props;
              const codeEl = children?.props;
              const className = codeEl?.className || '';
              const match = /language-(\w+)/.exec(className);
              const code = String(codeEl?.children || '').replace(/\n$/, '');
              const lang = match?.[1] || 'plaintext';
              const lineCount = code.split('\n').length;
              const height = Math.min(lineCount * 19 + 24, 600);

              return (
                <div className="my-2.5 w-full min-w-[300px] md:min-w-[500px]">
                  <div className="overflow-hidden rounded-xl border border-white/5 shadow-2xl bg-[#1e1e1e]">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {lang}
                      </span>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                      </div>
                    </div>
                    <Editor
                      height={height}
                      language={lang}
                      value={code}
                      theme="vs-dark"
                      loading={<div className="h-20 flex items-center justify-center text-[10px] text-muted-foreground animate-pulse">Đang tải...</div>}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 12.5,
                        fontFamily: "'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        renderLineHighlight: 'none',
                        scrollbar: {
                          vertical: 'hidden',
                          horizontal: 'auto',
                          useShadows: false
                        },
                        overviewRulerLanes: 0,
                        hideCursorInOverviewRuler: true,
                        folding: false,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        glyphMargin: false,
                        automaticLayout: true,
                        padding: { top: 12, bottom: 12 },
                        fixedOverflowWidgets: true,
                        domReadOnly: true
                      }}
                    />
                  </div>
                </div>
              );
            },
            code: (props: any) => {
              const { children, ...rest } = props;
              return (
                <code className="bg-muted-foreground/15 px-1.5 py-0.5 rounded text-[11.5px] font-mono border border-current/5 font-medium" {...rest}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-3 first:mt-0 tracking-tight">{children}</h1>,
            h2: ({ children }) => <h2 className="text-[14px] font-bold mb-1.5 mt-2.5 first:mt-0 tracking-tight opacity-90">{children}</h2>,
            h3: ({ children }) => <h3 className="text-[13px] font-bold mb-1 mt-2 first:mt-0 tracking-tight opacity-80">{children}</h3>,
            blockquote: ({ children }) => <blockquote className="border-l-3 border-primary/30 pl-4 italic my-2 bg-primary/5 py-1 pr-2 rounded-r-lg">{children}</blockquote>,
            table: ({ children }) => (
              <div className="my-2.5 overflow-x-auto rounded-xl border border-current/10 shadow-sm bg-background/5">
                <table className="w-full text-[11.5px] text-left border-collapse">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-current/5 font-bold">{children}</thead>,
            th: ({ children }) => <th className="px-3 py-2 border-b border-current/10">{children}</th>,
            td: ({ children }) => <td className="px-3 py-1.5 border-b border-current/5 last:border-b-0">{children}</td>,
            hr: () => <hr className="my-3 border-current/10" />,
            a: ({ href, children }) => (
              <a href={href} className="text-primary font-medium hover:underline underline-offset-4 decoration-2" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
