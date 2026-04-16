import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { historyApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Camera, MessageSquare, Loader2, Clock } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [{ title: "History — FarmWise" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [tab, setTab] = useState<"diagnoses" | "chats">("diagnoses");
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchData = tab === "diagnoses"
      ? historyApi.diagnoses().then((r) => setDiagnoses(r.diagnoses || []))
      : historyApi.chats().then((r) => setChats(r.chats || []));
    fetchData.catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="mt-2 text-muted-foreground">Review your past diagnoses and conversations</p>
      </motion.div>

      <div className="mt-6 flex gap-2">
        {(["diagnoses", "chats"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {t === "diagnoses" ? <Camera className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            {t === "diagnoses" ? "Diagnoses" : "Chats"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

        {!loading && !error && tab === "diagnoses" && (
          <div className="space-y-3">
            {diagnoses.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">No diagnoses yet. Try uploading a plant photo!</p>
            )}
            {diagnoses.map((d, i) => (
              <motion.div
                key={d.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
              >
                {d.imageUrl && (
                  <img src={d.imageUrl || d.image_url} alt="Plant" className="h-16 w-16 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{d.prediction || d.result || "Unknown"}</p>
                  {d.confidence !== undefined && (
                    <p className="text-sm text-muted-foreground">Confidence: {(d.confidence * 100).toFixed(1)}%</p>
                  )}
                  {(d.createdAt || d.created_at) && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(d.createdAt || d.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && tab === "chats" && (
          <div className="space-y-3">
            {chats.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">No chats yet. Try asking the chatbot a question!</p>
            )}
            {chats.map((c, i) => (
              <motion.div
                key={c.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="text-sm font-medium">Q: {c.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">A: {c.response || c.answer}</p>
                {(c.createdAt || c.created_at) && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(c.createdAt || c.created_at).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
