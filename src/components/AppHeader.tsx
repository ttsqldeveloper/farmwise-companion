import { Link, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/auth-store";
import { Leaf, Menu, X, LogOut, User, BarChart3, MessageSquare, Search, Home } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const publicLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/login", label: "Login", icon: User },
  { to: "/register", label: "Sign Up", icon: User },
];

const authLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/diagnose", label: "Diagnose", icon: Search },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/history", label: "History", icon: BarChart3 },
  { to: "/crops", label: "Crops", icon: Leaf },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppHeader() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const links = isAuthenticated ? authLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient">FarmWise</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to as any}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === l.to
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-lg p-2 hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to as any}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
