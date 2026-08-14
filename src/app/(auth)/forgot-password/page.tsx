"use client";

import { useState } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    });
    setSent(true);
    setLoading(false);
  }

  if (sent) {
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
            {t.auth.linkSent}
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
            <strong className="text-foreground">{email}</strong> {t.auth.resetSentTail}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-medium text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Kirish sahifasiga qaytish
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
    >
      <div className="p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kirish sahifasiga qaytish
        </Link>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
          Parolni tiklash
        </h1>
        <p className="text-base text-muted-foreground mb-7">
          {t.auth.resetHint}
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPh}
                className="w-full bg-surface/60 border border-border rounded-xl pl-12 pr-4 py-3.5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-[15px] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> {t.auth.sending}
              </>
            ) : (
              <>
                {t.auth.sendLink} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
