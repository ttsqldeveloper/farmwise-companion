import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { profileApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import { User, MapPin, Leaf, Save, Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profile — FarmWise" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [form, setForm] = useState({ fullName: "", location: "", cropTypes: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    profileApi.get()
      .then((r) => {
        const u = r.user;
        setForm({
          fullName: u.fullName || u.full_name || "",
          location: u.location || "",
          cropTypes: Array.isArray(u.cropTypes || u.crop_types) ? (u.cropTypes || u.crop_types).join(", ") : "",
        });
        updateUser(u);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");
    try {
      const res = await profileApi.update({
        fullName: form.fullName,
        location: form.location || undefined,
        cropTypes: form.cropTypes ? form.cropTypes.split(",").map((s) => s.trim()) : undefined,
      });
      updateUser(res.user);
      setMsg("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await profileApi.delete();
      logout();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your account information</p>
      </motion.div>

      <form onSubmit={handleSave} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6">
        {msg && <div className="rounded-lg bg-success/10 p-3 text-sm text-success">{msg}</div>}
        {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-muted-foreground" /> Full Name
          </label>
          <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-muted-foreground" /> Location
          </label>
          <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Leaf className="h-4 w-4 text-muted-foreground" /> Crop Types
          </label>
          <input type="text" value={form.cropTypes} onChange={(e) => update("cropTypes", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
            placeholder="Tomato, Maize" />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg gradient-hero px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
          <button type="button" onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" /> Delete Account
          </button>
        </div>
      </form>
    </div>
  );
}
