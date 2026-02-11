import { Mountain, RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  onReset: () => void;
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  return (
    <div className="bg-chat-header text-chat-header-foreground rounded-t-xl px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <Mountain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold leading-tight">Summit Outdoors</h2>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary-foreground/60 animate-pulse" />
              <span className="text-xs opacity-80">Online now</span>
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          className="rounded-lg p-2 transition-colors hover:bg-primary-foreground/10"
          title="Reset conversation"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
