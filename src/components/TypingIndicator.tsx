import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="message-appear flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-chat-bot px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/60" />
          <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/60" />
          <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/60" />
        </div>
      </div>
    </div>
  );
}
