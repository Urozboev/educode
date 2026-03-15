"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import { cn, getInitials } from "@/lib/utils";
import type { Profile } from "@/types";
import {
  Code2, LayoutDashboard, BookOpen, Swords, Users, Award,
  GraduationCap, BarChart3, Settings, Download, LogOut, Moon, Sun,
  ChevronLeft, Menu, X
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const adminLinks = [
  { href: "/a-dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/a-courses", label: "Kurslar", icon: BookOpen },
  { href: "/a-challenges", label: "Topshiriqlar", icon: Swords },
  { href: "/a-users", label: "Foydalanuvchilar", icon: Users },
  { href: "/a-achievements", label: "Yutuqlar", icon: Award },
  { href: "/a-certificates", label: "Sertifikatlar", icon: GraduationCap },
  { href: "/a-analytics", label: "Tahlillar", icon: BarChart3 },
  { href: "/a-settings", label: "Sozlamalar", icon: Settings },
  { href: "/a-export", label: "Eksport", icon: Download },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
        <Link href="/a-dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-red to-neon-yellow flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="font-display font-bold text-lg">Admin</span>}
        </Link>
      </div>
      {profile && !collapsed && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-red/20 flex items-center justify-center text-neon-red font-bold text-sm">
              {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(profile.full_name)}
            </div>
            <div><p className="font-semibold text-sm truncate">{profile.full_name}</p><p className="text-xs text-neon-red font-medium">Administrator</p></div>
          </div>
        </div>
      )}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {adminLinks.map(link => {
          const active = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                collapsed && "justify-center px-3",
                active ? "bg-neon-red/10 text-neon-red" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
              <link.icon className="w-5 h-5" />{!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/50 space-y-1">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-accent w-full", collapsed && "justify-center px-3")}>
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}{!collapsed && <span>{theme === "dark" ? "Yorug'" : "Qorong'u"}</span>}
        </button>
        <button onClick={handleLogout}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-neon-red/70 hover:bg-neon-red/10 w-full", collapsed && "justify-center px-3")}>
          <LogOut className="w-5 h-5" />{!collapsed && <span>Chiqish</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className={cn("fixed left-0 top-0 h-full bg-card/80 backdrop-blur-xl border-r border-border/50 z-40 transition-all duration-300 hidden lg:block",
        collapsed ? "w-[72px]" : "w-64")}>
        <Sidebar />
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent">
          <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-xl border-b border-border/50 z-30 flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-accent rounded-xl"><Menu className="w-5 h-5" /></button>
        <span className="font-display font-bold text-sm">Admin Panel</span>
        <div className="w-9" />
      </header>

      {/* Mobile Sidebar */}
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
