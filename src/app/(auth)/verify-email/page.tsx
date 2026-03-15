"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="glass-card p-8 md:p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-neon-purple" />
        </div>
        <h1 className="font-display font-bold text-2xl mb-3">Emailingizni tekshiring</h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Tasdiqlash havolasi emailingizga yuborildi. Havolani bosib hisobingizni faollashtiring.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Email kelmadimi? Spam papkasini ham tekshiring.
        </p>
        <Link href="/login" className="btn-primary inline-flex items-center gap-2 py-3 px-8">
          Kirish sahifasiga <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
