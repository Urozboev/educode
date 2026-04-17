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
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-lg shadow-neon-purple/20"><Code2 className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-xl tracking-tight">Edu<span className="gradient-text">Code</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className={`px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${pathname === l.href ? "text-neon-purple bg-neon-purple/8" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 hover:bg-accent rounded-xl text-muted-foreground transition-colors" title="Mavzu o'zgartirish">
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {user ? (
              <Link href={dashboardUrl} className="px-5 py-2 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">Dashboard</Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">Kirish</Link>
                <Link href="/register" className="px-5 py-2 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">Boshlash</Link>
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
      <main className="pt-24 md:pt-28 pb-20 px-4 md:px-6"><div className="max-w-6xl mx-auto overflow-x-hidden">{children}</div></main>
    </div>
  );
}
