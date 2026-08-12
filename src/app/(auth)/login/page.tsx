"use client";

import { useState, Suspense } from "react";
import Link from "@/components/i18n/Link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md">
          <div className="p-10 h-96 rounded-3xl border border-border/50 bg-card/40 animate-pulse" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    errorParam === "blocked"
      ? "Hisobingiz bloklangan."
      : errorParam === "auth_failed"
      ? "Autentifikatsiyada xatolik."
      : ""
  );

  const supabase = createClient();

  async function checkPlacementAndRedirect() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    document.cookie = "user-role=; path=/; max-age=0";

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      // Rolga qarab yo'naltirish
      if (profile?.role === "parent") {
        router.push("/p-dashboard");
        router.refresh();
        return;
      }
      if (profile?.role === "admin") {
        router.push("/a-dashboard");
        router.refresh();
        return;
      }
      if (profile?.role === "teacher") {
        router.push("/t-dashboard");
        router.refresh();
        return;
      }

      // Talaba — placement test tekshiruvi
      const { data: placement } = await supabase
        .from("placement_results")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!placement) {
        router.push("/placement-test");
        return;
      }
    }
    router.push(redirect);
    router.refresh();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(
        error.message === "Invalid login credentials"
          ? "Email yoki parol noto'g'ri"
          : error.message === "Email not confirmed"
          ? "Email tasdiqlanmagan. Pochtangizni tekshiring."
          : "Kirish xatoligi."
      );
      setLoading(false);
      return;
    }

    await checkPlacementAndRedirect();
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${redirect}`,
      },
    });
    if (error) {
      setErrorMsg("Google xatolik: " + error.message);
      setGoogleLoading(false);
    }
  }

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
            {t.auth.loginTitle}
          </h1>
          <p className="text-muted-foreground text-base">
            {t.auth.loginSubtitle}
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-red/8 border border-neon-red/20 text-neon-red text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-surface/60 hover:bg-surface border border-border rounded-xl px-4 py-3.5 font-semibold text-[15px] transition-all mb-6 disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {googleLoading ? "Kutilmoqda..." : "Google bilan kirish"}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-sm text-muted-foreground">yoki email bilan</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">{t.auth.email}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sizning@email.uz"
                className="w-full bg-surface/60 border border-border rounded-xl pl-12 pr-4 py-3.5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
                required
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">{t.auth.password}</label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-neon-purple hover:underline"
              >
                {t.auth.forgotPassword}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface/60 border border-border rounded-xl pl-12 pr-12 py-3.5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-[15px] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Kirish...
              </>
            ) : (
              <>
                Kirish <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[15px] text-muted-foreground mt-7 pt-6 border-t border-border/40">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="text-neon-purple font-semibold hover:underline">
            {t.auth.submitRegister}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
