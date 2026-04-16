import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — FarmWise" },
      { name: "description", content: "Create your FarmWise account to start smart farming" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", location: "", cropTypes: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        location: form.location || undefined,
        cropTypes: form.cropTypes ? form.cropTypes.split(",").map((s) => s.trim()) : undefined,
      });
      setAuth(res.user, res.token);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start your smart farming journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name *</label>
            <input type="text" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2" placeholder="Jane Farmer" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2" placeholder="jane@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password *</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required value={form.password} onChange={(e) => update("password", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none ring-ring focus:ring-2" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Location</label>
            <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2" placeholder="Limpopo" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Crop Types</label>
            <input type="text" value={form.cropTypes} onChange={(e) => update("cropTypes", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2" placeholder="Tomato, Maize" />
            <p className="mt-1 text-xs text-muted-foreground">Comma-separated</p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg gradient-hero py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
