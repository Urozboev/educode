"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import { cn, getInitials, getLevelLabel, getLevelColor } from "@/lib/utils";
import type { Profile } from "@/types";
import {
  Code2, LayoutDashboard, BookOpen, Swords, Gamepad2,
  BarChart3, Trophy, Store, User, LogOut, ChevronLeft,
  Menu, X, Moon, Sun, Flame, Coins, ChevronDown, MessageCircle
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import AutoLogout from "@/components/AutoLogout";

const studentLinks = [
  { href: "/dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/courses", label: "Kurslar", icon: BookOpen },
  { href: "/challenges", label: "Topshiriqlar", icon: Swords },
  { href: "/playground", label: "Playground", icon: Code2 },
  { href: "/games", label: "O'yinlar", icon: Gamepad2 },
  { href: "/chat", label: "AI Yordamchi", icon: MessageCircle },
  { href: "/my-results", label: "Natijalarim", icon: BarChart3 },
  { href: "/leaderboard", label: "Reyting", icon: Trophy },
  { href: "/store", label: "Do'kon", icon: Store },
  { href: "/profile", label: "Profil", icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Public preview yo'llari (login qilinmagan foydalanuvchi ham ko'ra oladi)
  const isPublicPreview =
    pathname === "/playground" ||
    /^\/courses\/[^\/]+$/.test(pathname) ||
    /^\/courses\/[^\/]+\/topics\/[^\/]+$/.test(pathname) ||
    /^\/challenges\/[^\/]+$/.test(pathname);

  const loadProfile = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        // Public preview sahifasida login majburiy emas
        if (isPublicPreview) {
          setLoading(false);
          return;
        }
        router.push("/login");
        return;
      }

      // Profilni olish yoki yaratish (trigger ishlamagan bo'lsa)
      const profile = await getOrCreateProfile(supabase, user.id);
      if (profile) {
        setProfile(profile as Profile);
      }
    } catch (err) {
      console.error("Profil yuklash xatolik:", err);
    }
    setLoading(false);
  }, [supabase, router, isPublicPreview]);

  useEffect(() => {
    loadProfile();

    // Auth holati o'zgarganda profilni qayta yuklash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          loadProfile();
        }
        if (event === "SIGNED_OUT") {
          setProfile(null);
          router.push("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile, supabase, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    document.cookie = 'user-role=; path=/; max-age=0';
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center px-5 h-16 border-b border-border/50", collapsed && "justify-center px-3")}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center flex-shrink-0">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg">
              Edu<span className="gradient-text">Code</span>
            </span>
          )}
        </Link>
      </div>

      {/* User Info */}
      {profile && (
        <div className={cn("p-4 border-b border-border/50", collapsed && "px-2")}>
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(profile.full_name)
              )}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{profile.full_name}</p>
                <p className={cn("text-xs font-medium", getLevelColor(profile.level))}>
                  {getLevelLabel(profile.level)}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="flex items-center gap-3 mt-3">
              <div className="coin-badge text-xs">
                <Coins className="w-3.5 h-3.5" />
                {profile.coins}
              </div>
              {profile.streak_days > 0 && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-neon-red/10 text-neon-red border border-neon-red/20">
                  <Flame className="w-3.5 h-3.5" />
                  {profile.streak_days}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface animate-pulse" />
            {!collapsed && (
              <div className="space-y-2">
                <div className="h-3 w-24 bg-surface rounded animate-pulse" />
                <div className="h-2 w-16 bg-surface rounded animate-pulse" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {studentLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-3",
                active
                  ? "bg-neon-purple/10 text-neon-purple"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <link.icon className={cn("w-5 h-5 flex-shrink-0", active && "text-neon-purple")} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all w-full", collapsed && "justify-center px-3")}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span>{theme === "dark" ? "Yorug'" : "Qorong'u"} rejim</span>}
        </button>
        <button
          onClick={handleLogout}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neon-red/70 hover:bg-neon-red/10 hover:text-neon-red transition-all w-full", collapsed && "justify-center px-3")}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Chiqish</span>}
        </button>
      </div>
    </div>
  );

  // Public preview: login qilmagan foydalanuvchi /courses/[slug] yoki /challenges/[slug] da bo'lsa,
  // student sidebar o'rniga oddiy katalog navbar ko'rsatamiz.
  if (!loading && !profile && isPublicPreview) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-lg shadow-neon-purple/20">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Edu<span className="gradient-text">Code</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/explore/courses" className="px-3.5 py-2 rounded-lg text-[15px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">Kurslar</Link>
              <Link href="/explore/challenges" className="px-3.5 py-2 rounded-lg text-[15px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">Topshiriqlar</Link>
              <Link href="/playground" className="px-3.5 py-2 rounded-lg text-[15px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">Playground</Link>
              <Link href="/explore/about" className="px-3.5 py-2 rounded-lg text-[15px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">Platforma haqida</Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 hover:bg-accent rounded-xl text-muted-foreground transition-colors"
                title="Mavzu o'zgartirish"
              >
                {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <Link href="/login" className="hidden md:block px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">Kirish</Link>
              <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">Boshlash</Link>
            </div>
          </div>
        </nav>
        <main className="pt-24 md:pt-28 pb-20 px-4 md:px-6">
          <div className="max-w-6xl mx-auto overflow-x-hidden">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-card/80 backdrop-blur-xl border-r border-border/50 z-40 transition-all duration-300 hidden lg:block",
        collapsed ? "w-[72px]" : "w-64"
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
        >
          <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 lg:hidden"
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 z-30 flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-accent rounded-xl">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold">EduCode</span>
        </Link>

        {/* Mobil user menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2"
          >
            {profile ? (
              <>
                <div className="coin-badge text-xs">
                  <Coins className="w-3.5 h-3.5" />
                  {profile.coins}
                </div>
                <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(profile.full_name)
                  )}
                </div>
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
            )}
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                className="absolute right-0 top-12 w-56 glass-card p-2 shadow-xl z-50"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                {profile && (
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="font-semibold text-sm">{profile.full_name}</p>
                    <p className={cn("text-xs", getLevelColor(profile.level))}>{getLevelLabel(profile.level)}</p>
                  </div>
                )}
                <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                  <User className="w-4 h-4" /> Profil
                </Link>
                <Link href="/my-results" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                  <BarChart3 className="w-4 h-4" /> Natijalarim
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neon-red hover:bg-neon-red/10 transition-colors w-full">
                  <LogOut className="w-4 h-4" /> Chiqish
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen transition-all duration-300 pt-16 lg:pt-0",
        collapsed ? "lg:pl-[72px]" : "lg:pl-64"
      )}>
        <div className="p-6 lg:p-8">
          <AutoLogout />
          {children}
        </div>
      </main>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" onClick={() => setUserMenuOpen(false)} />
      )}
    </div>
  );
}
