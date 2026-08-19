"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { Code2, LayoutDashboard, Menu, X, Moon, Sun, LogOut, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import { primaryLinks, resourceLinks, tailLinks, allGuestLinks } from "@/lib/nav";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t, href } = useI18n();
  const primary = primaryLinks(t);
  const resources = resourceLinks(t);
  const tail = tailLinks(t);
  const allLinks = allGuestLinks(t);
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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
          <div className="hidden lg:flex items-center gap-1">
            {primary.map(l => (
              <Link key={l.href} href={l.href} className={`px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${pathname === l.href ? "text-neon-purple bg-neon-purple/8" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>{l.label}</Link>
            ))}

            {/* Resurslar — ochiladigan ro'yxat */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                onClick={() => setResourcesOpen(o => !o)}
                aria-expanded={resourcesOpen}
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${
                  resources.some(r => pathname === r.href)
                    ? "text-neon-purple bg-neon-purple/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {t.nav.resources}
                <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 w-64"
                  >
                    <div className="rounded-xl border border-border bg-card shadow-lift p-1.5">
                      {resources.map(r => (
                        <Link
                          key={r.href}
                          href={r.href}
                          onClick={() => setResourcesOpen(false)}
                          className={`block px-3 py-2.5 rounded-lg transition-colors ${
                            pathname === r.href ? "bg-neon-purple/8 text-neon-purple" : "hover:bg-accent"
                          }`}
                        >
                          <span className="block text-sm font-medium">{r.label}</span>
                          <span className="block text-[11px] text-muted-foreground mt-0.5">{r.hint}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {tail.map(l => (
              <Link key={l.href} href={l.href} className={`px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${pathname === l.href ? "text-neon-purple bg-neon-purple/8" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />

            <button suppressHydrationWarning onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 hover:bg-accent rounded-xl text-muted-foreground transition-colors" title={t.nav.theme}>
              {mounted && theme === "light" ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
            </button>

            {user ? (
              <Link href={dashboardUrl} className="px-5 py-2 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">{t.nav.dashboard}</Link>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">{t.nav.login}</Link>
                <Link href="/register" className="px-5 py-2 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">{t.nav.register}</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 hover:bg-accent rounded-lg">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown. Past ekranda ro'yxat sig'masdi va oxirgi
            havolalarga umuman yetib bo'lmasdi — ichidan aylantiriladi. */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="lg:hidden bg-card border-b border-border overflow-hidden"
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {/* Balandlik animatsiyasi TASHQI qavatda, aylantirish ICHKIDA.
                  Ikkalasi bitta elementda bo'lsa framer-motion "auto" ni
                  o'lchay olmay qoladi va panel ochilmaydi. */}
              <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
                {allLinks.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    className={`block py-2.5 px-3 rounded-lg text-sm ${pathname === l.href ? "bg-neon-purple/10 text-neon-purple" : "hover:bg-accent"}`}>{l.label}</Link>
                ))}
                {!user && (
                  <div className="flex gap-2 pt-2 border-t border-border mt-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm py-2 px-4 flex-1 text-center">{t.nav.login}</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm py-2 px-4 flex-1 text-center">{t.nav.getStarted}</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <main className="pt-24 md:pt-28 pb-20 px-4 md:px-6"><div className="max-w-6xl mx-auto overflow-x-hidden">{children}</div></main>
    </div>
  );
}
