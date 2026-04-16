import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import { Camera, MessageSquare, BarChart3, Leaf, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — FarmWise" }],
  }),
  component: DashboardPage,
});

const actions = [
  {
    to: "/diagnose",
    icon: Camera,
    title: "Diagnose Disease",
    desc: "Upload a plant photo for AI diagnosis",
    gradient: "gradient-hero",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "Ask Chatbot",
    desc: "Get farming advice from AI",
    gradient: "gradient-accent",
  },
  {
    to: "/history",
    icon: BarChart3,
    title: "View History",
    desc: "Review past diagnoses & chats",
    gradient: "bg-secondary",
  },
  {
    to: "/crops",
    icon: Leaf,
    title: "Crop Guides",
    desc: "Browse crop advisory info",
    gradient: "bg-secondary",
  },
];

function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-gradient">{user?.fullName || "Farmer"}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">What would you like to do today?</p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {actions.map((a, i) => (
          <motion.div
            key={a.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={a.to as any}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${a.gradient} text-primary-foreground`}>
                <a.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
