import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { aiApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Send, Loader2, Bot, User, Leaf } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Farming Chatbot — FarmWise" },
      { name: "description", content: "Ask AI-powered farming questions" },
    ],
  }),
  component: ChatPage,
});

interface Message {
  role: "user" | "bot";
  text: string;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! I'm your FarmWise assistant. Ask me anything about farming, crops, or plant diseases." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await aiApi.chat(question);
      setMessages((m) => [...m, { role: "bot", text: res.response || "Sorry, I couldn't process that." }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "bot", text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-6" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Farming Chatbot</h1>
        <p className="text-sm text-muted-foreground">Ask questions about farming practices, diseases, and more</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === "bot" ? "bg-primary/10 text-primary" : "gradient-hero text-primary-foreground"
              }`}>
                {msg.role === "bot" ? <Leaf className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "gradient-hero text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Leaf className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-secondary px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a farming question..."
          className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none ring-ring focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl gradient-hero text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
