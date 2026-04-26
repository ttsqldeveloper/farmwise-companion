import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { aiApi, historyApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, Leaf, History as HistoryIcon } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Farming Chatbot — FarmWise" },
      { name: "description", content: "Ask AI-powered farming questions and review your past conversation" },
    ],
  }),
  component: ChatPage,
});

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  createdAt?: string;
  pending?: boolean;
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Hello! I'm your FarmWise assistant. Ask me anything about farming, crops, or plant diseases.",
};

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ChatPage() {
  const token = useAuthStore((s) => s.token);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount (only when authenticated)
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoadingHistory(true);
    setHistoryError("");
    historyApi
      .chats(50, 0)
      .then((res) => {
        if (cancelled) return;
        const raw = res.chats || [];
        // API may return newest-first; sort ascending so oldest is at top
        const sorted = [...raw].sort((a, b) => {
          const ta = new Date(a.createdAt || a.created_at || 0).getTime();
          const tb = new Date(b.createdAt || b.created_at || 0).getTime();
          return ta - tb;
        });
        const expanded: Message[] = [];
        sorted.forEach((c, idx) => {
          const ts = c.createdAt || c.created_at;
          const baseId = c.id || `h-${idx}`;
          if (c.question) {
            expanded.push({
              id: `${baseId}-q`,
              role: "user",
              text: c.question,
              createdAt: ts,
            });
          }
          const answer = c.response || c.answer;
          if (answer) {
            expanded.push({
              id: `${baseId}-a`,
              role: "bot",
              text: answer,
              createdAt: ts,
            });
          }
        });
        setMessages(expanded.length ? [WELCOME, ...expanded] : [WELCOME]);
      })
      .catch((e) => {
        if (!cancelled) setHistoryError(e.message || "Couldn't load chat history");
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Auto-scroll to bottom on new messages / loading state
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending, loadingHistory]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || sending) return;
    setInput("");
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: question,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    try {
      const res = await aiApi.chat(question);
      setMessages((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: res.response || "Sorry, I couldn't process that.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: "bot",
          text: `Error: ${err.message || "Something went wrong"}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="mx-auto flex max-w-3xl flex-col px-4 py-6"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Farming Chatbot</h1>
        <p className="text-sm text-muted-foreground">
          Ask questions about farming, crops, and diseases — your full conversation is shown below.
        </p>
      </div>

      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 scroll-smooth"
      >
        {/* History loading state */}
        {loadingHistory && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
            <HistoryIcon className="h-3.5 w-3.5" />
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading your conversation history…
          </div>
        )}

        {/* History error */}
        {historyError && !loadingHistory && (
          <div className="mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {historyError}
          </div>
        )}

        {/* Skeleton bubbles while history loads */}
        {loadingHistory ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex gap-3 ${i % 2 ? "flex-row-reverse" : ""}`}
              >
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
                <div
                  className={`h-12 animate-pulse rounded-2xl bg-muted ${
                    i % 2 ? "w-2/5" : "w-3/5"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "bot"
                        ? "bg-primary/10 text-primary"
                        : "gradient-hero text-primary-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {msg.role === "bot" ? (
                      <Leaf className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`flex max-w-[75%] flex-col gap-1 ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "gradient-hero text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                    {msg.createdAt && (
                      <span className="px-1 text-[10px] text-muted-foreground">
                        {formatTime(msg.createdAt)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator while sending */}
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Leaf className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={sending ? "Waiting for response…" : "Ask a farming question..."}
          disabled={sending}
          className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
          aria-label="Chat message"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl gradient-hero text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
}
