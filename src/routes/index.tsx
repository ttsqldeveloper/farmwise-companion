import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Leaf, Camera, MessageSquare, BookOpen, ArrowRight, Shield, Zap, Globe } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const features = [
  {
    icon: Camera,
    title: "Disease Detection",
    desc: "Upload a photo of your crop and get instant AI-powered disease diagnosis with treatment suggestions.",
  },
  {
    icon: MessageSquare,
    title: "Farming Chatbot",
    desc: "Ask any farming question and get expert AI-driven advice tailored to your needs.",
  },
  {
    icon: BookOpen,
    title: "Crop Guides",
    desc: "Access comprehensive advisory guides for various crops and farming practices.",
  },
  {
    icon: Shield,
    title: "History Tracking",
    desc: "Keep track of all your diagnoses and chat conversations for future reference.",
  },
];

function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Leaf className="h-4 w-4" />
              AI-Powered Farming
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Smarter Farming with{" "}
              <span className="text-gradient">FarmWise</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Detect plant diseases instantly, get expert farming advice, and access comprehensive crop guides — all powered by AI.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl gradient-hero px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything You Need to Farm Smarter
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Powerful AI tools designed for modern farmers
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="gradient-hero py-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-12 px-4 text-center text-primary-foreground">
          {[
            { value: "AI", label: "Powered Diagnosis" },
            { value: "24/7", label: "Chatbot Access" },
            { value: "50+", label: "Crop Guides" },
            { value: "Free", label: "To Get Started" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to Transform Your Farming?</h2>
        <p className="mt-3 text-muted-foreground">
          Join FarmWise today and start making data-driven decisions for your farm.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-xl gradient-hero px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          Create Your Account
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} FarmWise. Built with ❤️ for farmers everywhere.</p>
      </footer>
    </main>
  );
}
