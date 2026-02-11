import { Bot, User } from "lucide-react";
import type { Message } from "@/lib/chat";

interface ChatMessageProps {
  message: Message;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-appear flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={`max-w-[80%] space-y-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-md bg-chat-user text-chat-user-foreground"
              : "rounded-bl-md bg-chat-bot text-chat-bot-foreground"
          }`}
        >
          {message.content}
        </div>
        <p
          className={`text-[10px] text-muted-foreground px-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chat-user/10 text-chat-user">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
