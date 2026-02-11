import { useState, useRef, useEffect, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { QuickReplies } from "./QuickReplies";
import { streamChat, type Message } from "@/lib/chat";
import { toast } from "sonner";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there! 👋 Welcome to Summit Outdoors. I'm here to help with orders, products, shipping, returns, and more. How can I help you today?",
  timestamp: new Date(),
};

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      let assistantContent = "";
      const assistantId = crypto.randomUUID();

      const allMessages = [...messages, userMsg];

      await streamChat({
        messages: allMessages.filter((m) => m.id !== "welcome"),
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) {
              return prev.map((m) =>
                m.id === assistantId ? { ...m, content: assistantContent } : m
              );
            }
            return [
              ...prev,
              {
                id: assistantId,
                role: "assistant" as const,
                content: assistantContent,
                timestamp: new Date(),
              },
            ];
          });
        },
        onDone: () => setIsLoading(false),
        onError: (error) => {
          setIsLoading(false);
          toast.error(error);
        },
      });
    },
    [isLoading, messages]
  );

  const resetChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setIsLoading(false);
  }, []);

  const showQuickReplies = messages.length <= 1;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-card chat-shadow">
      <ChatHeader onReset={resetChat} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && !messages.some((m) => m.id !== "welcome" && m.role === "assistant" && m.content === "") && (
          <TypingIndicator />
        )}

        {showQuickReplies && (
          <div className="pt-2">
            <p className="mb-2 px-1 text-xs text-muted-foreground">Try asking:</p>
            <QuickReplies onSelect={sendMessage} disabled={isLoading} />
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
