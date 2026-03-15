"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { Code2, LayoutDashboard, LogOut, User, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center"><Code2 className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-xl">Edu<span className="gradient-text">Code</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore/courses" className="text-sm text-muted-foreground hover:text-foreground">Kurslar</Link>
            <Link href="/explore/challenges" className="text-sm text-muted-foreground hover:text-foreground">Topshiriqlar</Link>
            <Link href="/explore/games" className="text-sm text-muted-foreground hover:text-foreground">O'yinlar</Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={dashboardUrl} className="btn-primary text-sm py-2 px-5">Dashboard</Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm py-2 px-5">Kirish</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">Boshlash</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="pt-24 pb-16 px-6"><div className="max-w-7xl mx-auto">{children}</div></main>
    </div>
  );
}
