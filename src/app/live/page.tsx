"use client";

import { useState } from "react";
import Link from "@/components/i18n/Link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { savePlayer } from "@/lib/liveGame";
import { Code2, Loader2, LogIn } from "lucide-react";

/**
 * PIN bilan o'yinga kirish.
 * Akkaunt talab qilinmaydi — darsda hamma o'quvchining hisobi bo'lmasligi
 * mumkin, lekin hamma o'ynay olishi kerak.
 */
export default function LiveJoinPage() {
  const supabase = createClient();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim().length < 4) { toast.error("PIN to'liq emas"); return; }
    if (nickname.trim().length < 2) { toast.error("Ismingizni kiriting"); return; }

    setBusy(true);
    const { data, error } = await supabase.rpc("join_game_session", {
      p_pin: pin.trim(),
      p_nickname: nickname.trim(),
    });
    setBusy(false);

    if (error) { toast.error(error.message); return; }

    savePlayer(data.session_id, data.player_id, data.nickname);
    router.push(`/live/${data.session_id}`);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <span className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center">
          <Code2 className="w-5 h-5 text-white" />
        </span>
        <span className="font-display font-bold text-xl">
          Edu<span className="gradient-text">Code</span>
        </span>
      </Link>

      <motion.form
        onSubmit={join}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-4"
      >
        <div className="text-center mb-6">
          <h1 className="font-display font-extrabold text-3xl mb-2">O&apos;yinga kirish</h1>
          <p className="text-muted-foreground">
            O&apos;qituvchi ekranidagi PIN kodni kiriting
          </p>
        </div>

        <input
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="input-field text-center font-display font-extrabold text-3xl tracking-[0.3em]"
          placeholder="123456"
          inputMode="numeric"
          autoComplete="off"
          aria-label="PIN kod"
        />

        <input
          value={nickname}
          onChange={e => setNickname(e.target.value.slice(0, 20))}
          className="input-field text-center text-lg"
          placeholder="Ismingiz"
          autoComplete="off"
          aria-label="Ismingiz"
        />

        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
          Kirish
        </button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Ro&apos;yxatdan o&apos;tish shart emas
        </p>
      </motion.form>
    </div>
  );
}
