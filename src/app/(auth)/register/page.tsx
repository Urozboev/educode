"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Users,
  Presentation,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * "teacher" — bu yerda faqat niyat. Baza trigger'i yangi foydalanuvchini
 * har doim 'student' qilib yaratadi; o'qituvchi roli ariza admin tomonidan
 * tasdiqlangandan keyin beriladi (18_teacher_applications.sql).
 */
type Role = "student" | "parent" | "teacher";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  // Rolga qarab ro'yxatdan keyingi yo'nalish
  const nextPath =
    role === "parent" ? "/p-dashboard"
    : role === "teacher" ? "/teacher-apply"
    : "/placement-test";

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
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${nextPath}`,
      },
    });

    if (error) {
      setErrorMsg(
        error.message === "User already registered"
          ? "Bu email allaqachon ro'yxatdan o'tgan"
          : "Xatolik yuz berdi. Qayta urinib ko'ring."
      );
      setLoading(false);
      return;
    }

    if (data?.session) {
      router.push(nextPath);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleRegister() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Rol OAuth'da metadata orqali o'tmaydi — callback'da query bilan uzatamiz
        redirectTo: `${window.location.origin}/api/auth/callback?next=${nextPath}&role=${role}`,
      },
    });
    if (error) setErrorMsg("Google bilan kirishda xatolik yuz berdi");
  }

  if (success) {
    return (
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl text-center shadow-2xl shadow-black/5">
          <div className="w-16 h-16 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-neon-green" />
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-3">
            Email tasdiqlang
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
            <strong className="text-foreground">{email}</strong> manziliga tasdiqlash havolasi
            yuborildi. Emailingizni tekshiring va havolani bosing.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-medium text-sm transition-all"
          >
            Kirish sahifasiga qaytish
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5">
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
            Hisob yarating
          </h1>
          <p className="text-muted-foreground text-base">
            {role === "parent"
              ? "Farzandingiz o'quv jarayonini kuzating."
              : role === "teacher"
              ? "Hisob yaratgach ariza to'ldirasiz — admin tasdiqlagach o'qituvchi kabineti ochiladi."
              : "Bepul 100 coin va barcha kurslarga kirish huquqi."}
          </p>
        </div>

        {/* Rol tanlash — 360px ekranda uch ustun siqiladi, shuning uchun
            mobilda ikki ustun va uchinchisi butun qatorni egallaydi */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              role === "student"
                ? "border-neon-purple bg-neon-purple/10"
                : "border-border bg-surface/40 hover:bg-surface/60"
            }`}
          >
            <GraduationCap className={`w-6 h-6 ${role === "student" ? "text-neon-purple" : "text-muted-foreground"}`} />
            <span className="text-sm font-semibold">Talaba</span>
            <span className="text-[11px] text-muted-foreground text-center leading-tight">O'rganaman</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("parent")}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              role === "parent"
                ? "border-neon-blue bg-neon-blue/10"
                : "border-border bg-surface/40 hover:bg-surface/60"
            }`}
          >
            <Users className={`w-6 h-6 ${role === "parent" ? "text-neon-blue" : "text-muted-foreground"}`} />
            <span className="text-sm font-semibold">Ota-ona</span>
            <span className="text-[11px] text-muted-foreground text-center leading-tight">Kuzataman</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`col-span-2 sm:col-span-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              role === "teacher"
                ? "border-neon-green bg-neon-green/10"
                : "border-border bg-surface/40 hover:bg-surface/60"
            }`}
          >
            <Presentation className={`w-6 h-6 ${role === "teacher" ? "text-neon-green" : "text-muted-foreground"}`} />
            <span className="text-sm font-semibold">O&apos;qituvchi</span>
            <span className="text-[11px] text-muted-foreground text-center leading-tight">O&apos;rgataman</span>
          </button>
        </div>

        {role === "teacher" && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-blue/[0.07] border border-neon-blue/20 text-sm mb-6">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-blue" />
            <span className="leading-relaxed text-muted-foreground">
              O&apos;qituvchi huquqi tekshiruvdan keyin beriladi. Hisob yaratilgach
              qisqa ariza to&apos;ldirasiz; tasdiqlanguncha platformadan o&apos;quvchi
              sifatida foydalanishingiz mumkin.
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-red/8 border border-neon-red/20 text-neon-red text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 bg-surface/60 hover:bg-surface border border-border rounded-xl px-4 py-3.5 font-semibold text-[15px] transition-all mb-6"
        >
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
          Google bilan ro'yxatdan o'tish
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-sm text-muted-foreground">yoki email bilan</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">To'liq ism</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ism Familiya"
                className="w-full bg-surface/60 border border-border rounded-xl pl-12 pr-4 py-3.5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Email</label>
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
            <label className="text-sm font-semibold mb-2 block">Parol</label>
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
            {password && (
              <div className="mt-3 grid grid-cols-1 gap-1.5">
                {passwordChecks.map((check) => (
                  <div
                    key={check.label}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      check.valid ? "text-neon-green" : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {check.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-[15px] hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Yaratilmoqda...
              </>
            ) : (
              <>
                Hisob yaratish <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[15px] text-muted-foreground mt-7 pt-6 border-t border-border/40">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="text-neon-purple font-semibold hover:underline">
            Kirish
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
