import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { cropsApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Search, Leaf, Loader2 } from "lucide-react";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Guides — FarmWise" },
      { name: "description", content: "Browse crop advisory information" },
    ],
  }),
  component: CropsPage,
});

function CropsPage() {
  const [crops, setCrops] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      setError("");
      cropsApi.list(search || undefined)
        .then((r) => setCrops(r.crops || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Crop Advisory Guides</h1>
        <p className="mt-2 text-muted-foreground">Explore comprehensive farming guides for various crops</p>
      </motion.div>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search crops (e.g. tomato, maize)..."
          className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm outline-none ring-ring focus:ring-2"
        />
      </div>

      <div className="mt-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crops.length === 0 && (
              <p className="col-span-full py-12 text-center text-muted-foreground">No crops found.</p>
            )}
            {crops.map((crop, i) => (
              <motion.div
                key={crop.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{crop.name || crop.cropName}</h3>
                </div>
                {(crop.description || crop.overview) && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{crop.description || crop.overview}</p>
                )}
                {crop.season && (
                  <p className="mt-2 text-xs font-medium text-primary">Season: {crop.season}</p>
                )}
                {crop.region && (
                  <p className="text-xs text-muted-foreground">Region: {crop.region}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
