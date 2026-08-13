"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import { cn, getInitials } from "@/lib/utils";
import type { Profile } from "@/types";
import {
  Code2, LayoutDashboard, Users, ClipboardList, BarChart3,
  Download, LogOut, Moon, Sun, ChevronLeft, Menu,
  Library, BookMarked, Lightbulb, Gamepad2, School, Gift
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";
import { useI18n } from "@/lib/i18n";

const teacherLinks = (t: Dictionary) => [
  { href: "/t-dashboard", label: t.cabinet.dashboard, icon: LayoutDashboard },
  { href: "/t-groups", label: t.teacher.groups, icon: School },
  { href: "/t-students", label: t.teacher.myStudents, icon: Users },
  { href: "/t-assignments", label: t.nav.challenges, icon: ClipboardList },
  { href: "/t-analytics", label: t.teacher.analytics, icon: BarChart3 },
  { href: "/t-lesson-games", label: t.nav.lessonGames, icon: Gamepad2 },
  { href: "/t-store", label: t.teacher.myGifts, icon: Gift },
  { href: "/t-methods", label: t.nav.methods, icon: Lightbulb },
  { href: "/t-books", label: t.nav.books, icon: Library },
  { href: "/t-glossary", label: t.nav.glossary, icon: BookMarked },
  { href: "/t-export", label: t.teacher.export, icon: Download },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) { const p = await getOrCreateProfile(supabase, user.id); if (p) setProfile(p as Profile); }
    })();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    document.cookie = 'user-role=; path=/; max-age=0';
    router.push("/login");
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className={cn("flex items-center px-5 h-16 border-b border-border/50", collapsed && "justify-center px-3")}>
        <Link href="/t-dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center"><Code2 className="w-5 h-5 text-white" /></div>
          {!collapsed && <span className="font-display font-bold text-lg">Edu<span className="gradient-text">Code</span></span>}
        </Link>
      </div>
      {profile && !collapsed && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-bold text-sm">
              {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(profile.full_name)}
            </div>
            <div><p className="font-semibold text-sm truncate">{profile.full_name}</p><p className="text-xs text-neon-blue font-medium">{t.teacher.role}</p></div>
          </div>
        </div>
      )}
      {/*
        overflow-y-auto SHART: 11 ta havola + profil bloki ekranga sig'maydi
        va usiz pastdagi mavzu/chiqish tugmalari ko'rinmay qoladi.
        O'quvchi va admin panellarida bu allaqachon bor edi.
      */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {teacherLinks(t).map(link => {
          const active = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                collapsed && "justify-center px-3",
                active ? "bg-neon-blue/10 text-neon-blue" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
              <link.icon className="w-5 h-5" />{!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/50 space-y-1">
        {!collapsed && (
          <div className="px-1 pb-1">
            <LanguageSwitcher />
          </div>
        )}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-accent w-full", collapsed && "justify-center px-3")}>
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}{!collapsed && <span>{theme === "dark" ? t.cabinet.lightMode : t.cabinet.darkMode}</span>}
        </button>
        <button onClick={handleLogout}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-neon-red/70 hover:bg-neon-red/10 w-full", collapsed && "justify-center px-3")}>
          <LogOut className="w-5 h-5" />{!collapsed && <span>{t.nav.logout}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className={cn("fixed left-0 top-0 h-full bg-card/80 backdrop-blur-xl border-r border-border/50 z-40 transition-all duration-300 hidden lg:block",
        collapsed ? "w-[72px]" : "w-64")}>
        <Sidebar />
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent">
          <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-xl border-b border-border/50 z-30 flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-accent rounded-xl"><Menu className="w-5 h-5" /></button>
        <span className="font-display font-bold text-sm">{t.teacher.role}</span>
        <div className="w-9" />
      </header>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 lg:hidden"
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} transition={{ type: "spring", damping: 25 }}>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <main className={cn("min-h-screen transition-all duration-300 pt-14 lg:pt-0", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
