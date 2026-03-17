"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/reset-password`,
    });
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-neon-green mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl mb-2">Havola yuborildi</h1>
          <p className="text-muted-foreground mb-6">
            <strong className="text-foreground">{email}</strong> manziliga parolni tiklash havolasi yuborildi.
          </p>
          <Link href="/login" className="btn-ghost inline-flex">Kirish sahifasiga qaytish</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="glass-card p-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Kirish sahifasiga qaytish
        </Link>
        <h1 className="font-display font-bold text-2xl mb-2">Parolni tiklash</h1>
        <p className="text-muted-foreground text-sm mb-6">Emailingizni kiriting, parolni tiklash havolasi yuboriladi.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sizning@email.uz" className="input-field pl-11" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? "Yuborilmoqda..." : "Havola yuborish"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
