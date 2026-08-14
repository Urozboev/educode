"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDateTime, getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ClipboardPaste, ShieldCheck, Trophy, Code2, ChevronDown, ChevronUp,
  Filter, RefreshCw, Loader2,
} from "lucide-react";
import { pasteLevel } from "@/components/challenges/PasteBadge";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

/**
 * Halollik nazorati — nusxa ko'chirilgan yechimlar ro'yxati.
 *
 * Ma'lumot `paste_report` RPC'sidan keladi: u masala nomini `challenges`
 * va `topic_tasks` dan yig'ib beradi hamda masala olimpiadaga tegishli
 * bo'lsa uni ham ko'rsatadi. Funksiya ichida admin/o'qituvchi tekshiruvi bor.
 *
 * Ko'rsatkichni ayblov sifatida o'qimaslik kerak — talaba o'z kodini
 * boshqa muharrirdan ko'chirgan bo'lishi mumkin. Shuning uchun yechim
 * matnini ochib ko'rish imkoni bor: qaror kod bilan tanishib chiqiladi.
 */

interface Row {
  submission_id: string;
  created_at: string;
  user_id: string;
  full_name: string;
  username: string | null;
  task_type: "topic_task" | "challenge";
  task_title: string;
  status: string;
  language: string;
  code_length: number;
  paste_count: number;
  pasted_chars: number;
  paste_ratio: number;
  contest_title: string | null;
}

const FILTERS = (t: Dictionary) => [
  { value: 1, label: t.admin.intg.allTab },
  { value: 40, label: t.admin.intg.moreThan40 },
  { value: 80, label: t.admin.intg.moreThan80 },
];

export default function IntegrityPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [minRatio, setMinRatio] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const [code, setCode] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.rpc("paste_report", {
      p_limit: 200,
      p_min_ratio: minRatio,
    });
    setRows((data ?? []) as Row[]);
    setLoading(false);
  }, [supabase, minRatio]);

  useEffect(() => { load(); }, [load]);

  async function toggle(id: string) {
    if (open === id) { setOpen(null); return; }
    setOpen(id);
    if (code[id]) return;
    const { data } = await supabase.from("submissions").select("code").eq("id", id).single();
    if (data) setCode(c => ({ ...c, [id]: data.code }));
  }

  const high = rows.filter(r => r.paste_ratio >= 80).length;
  const contest = rows.filter(r => r.contest_title).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl">{t.admin.integrity}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kod muharririga nusxa qo&apos;yilgan yechimlar
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="btn-ghost px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Yangilash
        </button>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-blue/[0.06] border border-neon-blue/20 text-sm">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-blue" />
        <span className="leading-relaxed text-muted-foreground">
          {t.admin.intg.notice}
          muharrirdan yoki telefonidan ko&apos;chirgan bo&apos;lishi mumkin. Xulosa
          chiqarishdan oldin yechim matnini ochib ko&apos;ring.
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Belgilangan yechim" value={rows.length} />
        <Stat label="80% dan ko'p" value={high} accent="text-neon-red" />
        <Stat label={t.admin.intg.inContest} value={contest} accent="text-neon-yellow" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {FILTERS(t).map(f => (
          <button
            key={f.value}
            onClick={() => setMinRatio(f.value)}
            className={cn("px-3.5 py-1.5 rounded-lg text-xs font-medium transition border",
              minRatio === f.value
                ? "bg-neon-purple/10 text-neon-purple border-neon-purple/25"
                : "bg-surface text-muted-foreground border-transparent")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3, 4].map(i => <div key={i} className="glass-card h-16 animate-pulse" />)}</div>
      ) : rows.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-2xl">
          <ClipboardPaste className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">{t.admin.intg.noSolution}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map(r => {
            const level = pasteLevel(r.paste_ratio, r.paste_count);
            const expanded = open === r.submission_id;
            return (
              <motion.div key={r.submission_id} className="glass-card overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={() => toggle(r.submission_id)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-surface/40 transition"
                >
                  <span className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {getInitials(r.full_name)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.username ? (
                        <Link href={`/u/${r.username}`} onClick={e => e.stopPropagation()}
                          className="font-semibold text-sm hover:text-neon-purple transition">
                          {r.full_name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-sm">{r.full_name}</span>
                      )}
                      <span className="text-xs text-muted-foreground truncate">{r.task_title}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        {r.contest_title
                          ? <><Trophy className="w-3 h-3 text-neon-yellow" /> {r.contest_title}</>
                          : <><Code2 className="w-3 h-3" /> {r.task_type === "challenge" ? t.admin.common.task : "Mavzu topshirig'i"}</>}
                      </span>
                      <span>{formatDateTime(r.created_at)}</span>
                      <span className={r.status === "accepted" ? "text-neon-green" : "text-neon-red"}>
                        {r.status === "accepted" ? "qabul qilingan" : r.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className={cn("numeric font-bold text-lg",
                      level === "high" ? "text-neon-red" : level === "medium" ? "text-neon-yellow" : "text-muted-foreground")}>
                      {r.paste_ratio}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      <span className="numeric">{r.paste_count}</span> marta
                    </p>
                  </div>

                  {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {expanded && (
                  <div className="border-t border-border/60 p-4 space-y-2">
                    <p className="text-[11px] text-muted-foreground">
                      Kod uzunligi <span className="numeric">{r.code_length}</span> belgi,
                      shundan <span className="numeric">{r.pasted_chars}</span> tasi ko&apos;chirilgan · {r.language}
                    </p>
                    <pre className="text-xs font-mono bg-[#0d1117] border border-border rounded-xl p-4 overflow-x-auto max-h-80 overflow-y-auto">
                      {code[r.submission_id] ?? "Yuklanmoqda..."}
                    </pre>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="p-4 rounded-xl border border-border/60 bg-card/40">
      <p className={cn("numeric text-2xl font-bold", accent)}>{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
