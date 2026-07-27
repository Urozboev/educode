"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";
import { School, Loader2, Check, LogIn, Users, ArrowRight } from "lucide-react";

type Membership = {
  group_id: string | null;
  teacher_id: string;
  teacher_name: string;
  group_name: string | null;
};

export default function JoinPage() {
  const supabase = createClient();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [justJoined, setJustJoined] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: rows } = await supabase
      .from("teacher_students")
      .select("teacher_id, group_id")
      .eq("student_id", user.id);

    if (!rows?.length) { setMemberships([]); setLoading(false); return; }

    const teacherIds = Array.from(new Set((rows as any[]).map(r => r.teacher_id)));
    const groupIds = (rows as any[]).map(r => r.group_id).filter(Boolean);

    const [{ data: teachers }, { data: groups }] = await Promise.all([
      supabase.from("profiles").select("id, full_name").in("id", teacherIds),
      groupIds.length
        ? supabase.from("teacher_groups").select("id, name").in("id", groupIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const tMap = new Map((teachers || []).map((t: any) => [t.id, t.full_name]));
    const gMap = new Map((groups || []).map((g: any) => [g.id, g.name]));

    setMemberships((rows as any[]).map(r => ({
      group_id: r.group_id,
      teacher_id: r.teacher_id,
      teacher_name: tMap.get(r.teacher_id) || "O'qituvchi",
      group_name: r.group_id ? gMap.get(r.group_id) ?? null : null,
    })));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length < 4) { toast.error("Kodni to'liq kiriting"); return; }

    setJoining(true);
    const { data, error } = await supabase.rpc("join_group_by_code", { p_code: clean });
    setJoining(false);

    if (error) { toast.error(error.message); return; }

    setJustJoined(data?.group_name || "Guruh");
    setCode("");
    toast.success("Guruhga qo'shildingiz");
    load();
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl flex items-center gap-2">
          <School className="w-6 h-6 text-neon-purple" /> Guruhga qo&apos;shilish
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          O&apos;qituvchingiz bergan kodni kiriting. Shundan keyin topshiriq va
          o&apos;yin natijalaringiz uning jurnalida ko&apos;rinadi.
        </p>
      </div>

      <form onSubmit={join} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Guruh kodi</label>
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            className="input-field text-center font-display font-extrabold text-2xl tracking-[0.3em] uppercase"
            placeholder="ABC123"
            maxLength={8}
            autoComplete="off"
            inputMode="text"
            aria-label="Guruh kodi"
          />
        </div>
        <button
          type="submit"
          disabled={joining || code.trim().length < 4}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          Qo&apos;shilish
        </button>
      </form>

      <AnimatePresence>
        {justJoined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-4 rounded-xl bg-neon-green/[0.07] border border-neon-green/25"
          >
            <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
            <span className="text-sm">
              <b>{justJoined}</b> guruhiga qo&apos;shildingiz
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mavjud guruhlar */}
      <section>
        <h2 className="eyebrow mb-3">Mening guruhlarim</h2>
        {loading ? (
          <div className="h-20 rounded-xl border border-border/40 bg-card/30 animate-pulse" />
        ) : memberships.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 border border-dashed border-border rounded-xl text-center">
            Hali guruhga qo&apos;shilmagansiz
          </p>
        ) : (
          <ul className="space-y-2">
            {memberships.map((m, i) => (
              <li key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card/40">
                <span className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {getInitials(m.teacher_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {m.group_name || "Guruhsiz"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    O&apos;qituvchi: {m.teacher_name}
                  </p>
                </div>
                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Bosh sahifaga qaytish <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
