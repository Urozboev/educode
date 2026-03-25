"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { Code2, LayoutDashboard, Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/explore/courses", label: "Kurslar" },
  { href: "/explore/challenges", label: "Topshiriqlar" },
  { href: "/playground", label: "Playground" },
  { href: "/explore/games", label: "O'yinlar" },
  { href: "/explore/about", label: "Platforma haqida" },
];

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", session.user.id).single();
        if (data) setUser({ name: data.full_name, avatar: data.avatar_url, role: data.role });
      }
    })();
  }, []);

  const dashboardUrl = user?.role === "admin" ? "/a-dashboard" : user?.role === "teacher" ? "/t-dashboard" : "/dashboard";

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center"><Code2 className="w-4 h-4 text-white" /></div>
            <span className="font-display font-bold text-lg">Edu<span className="gradient-text">Code</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className={`text-sm transition-colors ${pathname === l.href ? "text-neon-purple font-medium" : "text-muted-foreground hover:text-foreground"}`}>{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-accent rounded-lg text-muted-foreground" title="Mavzu o'zgartirish">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <Link href={dashboardUrl} className="btn-primary text-xs py-1.5 px-4">Dashboard</Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-xs py-1.5 px-4">Kirish</Link>
                <Link href="/register" className="btn-primary text-xs py-1.5 px-4">Boshlash</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-accent rounded-lg">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="md:hidden bg-card border-b border-border px-4 py-3 space-y-1"
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 px-3 rounded-lg text-sm ${pathname === l.href ? "bg-neon-purple/10 text-neon-purple" : "hover:bg-accent"}`}>{l.label}</Link>
              ))}
              {!user && (
                <div className="flex gap-2 pt-2 border-t border-border mt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm py-2 px-4 flex-1 text-center">Kirish</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm py-2 px-4 flex-1 text-center">Boshlash</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <main className="pt-20 pb-16 px-4 md:px-6"><div className="max-w-7xl mx-auto overflow-x-hidden">{children}</div></main>
    </div>
  );
}
