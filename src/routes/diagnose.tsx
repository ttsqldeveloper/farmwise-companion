import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { aiApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/diagnose")({
  head: () => ({
    meta: [
      { title: "Disease Diagnosis — FarmWise" },
      { name: "description", content: "Upload a plant photo for AI-powered disease detection" },
    ],
  }),
  component: DiagnosePage,
});

function DiagnosePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const res = await aiApi.predict(file);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Plant Disease Diagnosis</h1>
        <p className="mt-2 text-muted-foreground">Upload a clear photo of the affected plant leaf</p>
      </motion.div>

      <div className="mt-8">
        {/* Upload area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center transition-colors hover:border-primary/50 hover:bg-secondary/50"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-xl object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Click or drag & drop an image</p>
              <p className="text-sm text-muted-foreground">JPG, PNG up to 10MB</p>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{file.name}</span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl gradient-hero px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Diagnosis Result</h3>
              </div>
              <div className="mt-4 space-y-3">
                {result.prediction && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Prediction:</span>
                    <p className="mt-0.5 text-lg font-semibold">{result.prediction}</p>
                  </div>
                )}
                {result.confidence !== undefined && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
                    <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full gradient-hero transition-all"
                        style={{ width: `${(result.confidence * 100).toFixed(0)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-sm">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                )}
                {result.treatment && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Treatment:</span>
                    <p className="mt-0.5">{result.treatment}</p>
                  </div>
                )}
                {result.description && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Description:</span>
                    <p className="mt-0.5 text-sm text-muted-foreground">{result.description}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
