"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const passwordChecks = [
    { label: "Kamida 8 ta belgi", valid: password.length >= 8 },
    { label: "Katta harf mavjud", valid: /[A-Z]/.test(password) },
    { label: "Raqam mavjud", valid: /[0-9]/.test(password) },
  ];

  const isPasswordValid = passwordChecks.every((c) => c.valid);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!isPasswordValid) return;
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/placement-test`,
      },
    });

    if (error) {
      setErrorMsg(error.message === "User already registered"
        ? "Bu email allaqachon ro'yxatdan o'tgan"
        : "Xatolik yuz berdi. Qayta urinib ko'ring."
      );
      setLoading(false);
      return;
    }

    // Agar email tasdiqlash o'chirilgan bo'lsa — session darhol yaratiladi
    if (data?.session) {
      router.push("/placement-test");
      return;
    }

    // Email tasdiqlash kerak
    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleRegister() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/placement-test`,
      },
    });
    if (error) setErrorMsg("Google bilan kirishda xatolik yuz berdi");
  }

  if (success) {
    return (
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card p-8 md:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-neon-green" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-3">Email tasdiqlang</h1>
          <p className="text-muted-foreground mb-6">
            <strong className="text-foreground">{email}</strong> manziliga tasdiqlash havolasi yuborildi.
            Emailingizni tekshiring va havolani bosing.
          </p>
          <Link href="/login" className="btn-ghost inline-flex">
            Kirish sahifasiga qaytish
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl mb-2">Ro'yxatdan o'tish</h1>
          <p className="text-muted-foreground">Bepul hisob yarating va o'rganishni boshlang</p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-neon-red/10 border border-neon-red/20 text-neon-red text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 bg-surface hover:bg-surface-hover border border-border rounded-xl px-4 py-3 font-medium transition-all duration-200 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google bilan ro'yxatdan o'tish
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="bg-card px-4 text-sm text-muted-foreground">yoki</span></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">To'liq ism</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Ism Familiya" className="input-field pl-11" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="sizning@email.uz" className="input-field pl-11" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Parol</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="input-field pl-11 pr-11" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                {passwordChecks.map((check) => (
                  <div key={check.label} className={`flex items-center gap-2 text-xs ${check.valid ? 'text-neon-green' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {check.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading || !isPasswordValid}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? "Yaratilmoqda..." : "Hisob yaratish"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="text-neon-purple font-medium hover:underline">Kirish</Link>
        </p>
      </div>
    </motion.div>
  );
}
