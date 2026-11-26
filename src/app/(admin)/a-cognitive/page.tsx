"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials } from "@/lib/utils";
import { ENGAGEMENT_CODES, SUPPORT_LEVELS, type EngagementCode } from "@/lib/ai/engagement";
import { downloadCsv } from "@/lib/student-stats";
import { Brain, Compass, Gauge, MessageCircleQuestion, Download, Loader2, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

/**
 * Kognitiv avtonomiya (89-migratsiya): talabalar kesimida
 *  — haftalik SIga bog'liqlik ko'rsatkichi va moslashuvchan ko'mak darajasi,
 *  — muloqotda fikrlashni topshirish ulushi va tiklanish,
 *  — metakognitiv kalibrlash.
 * Pastda: o'zbekcha tasnifchini ekspert kodlashi bilan tekshirish (Koen kappasi).
 */

interface Row {
  user_id: string; full_name: string; avatar_url: string | null;
  dep_index: number | null; dep_zone: string | null; dep_events: number;
  support_level: number; level_changes: number;
  turns: number; co_share: number | null; recovery: number | null;
  cal_resolved: number; cal_brier: number | null; cal_bias: number | null;
}
interface Sample { id: string; user_query: string; engagement_code: string; created_at: string }
interface Pair { interaction_id: string; auto_code: string; human_code: string; coder_id: string }

const ZONE: Record<string, { label: string; cls: string }> = {
  healthy: { label: "Sog'lom", cls: "text-emerald-600 dark:text-emerald-400" },
  moderate: { label: "O'rtacha", cls: "text-amber-600 dark:text-amber-400" },
  high: { label: "Yuqori", cls: "text-orange-600 dark:text-orange-400" },
  very_high: { label: "Juda yuqori", cls: "text-rose-600 dark:text-rose-400" },
};
const LEVEL_CLS = ["bg-surface text-muted-foreground", "bg-sky-500/15 text-sky-600 dark:text-sky-400", "bg-amber-500/15 text-amber-600 dark:text-amber-400", "bg-rose-500/15 text-rose-600 dark:text-rose-400"];

/** Koen kappasi: ikki baholovchining kelishuvi, tasodifiy kelishuvdan tozalangan */
function cohenKappa(pairs: [string, string][]) {
  const n = pairs.length;
  if (!n) return { n: 0, agree: null as number | null, kappa: null as number | null };
  const cats = [...new Set(pairs.flat())];
  const po = pairs.filter(([a, b]) => a === b).length / n;
  const pe = cats.reduce((s, c) => s + (pairs.filter(([a]) => a === c).length / n) * (pairs.filter(([, b]) => b === c).length / n), 0);
  return { n, agree: po, kappa: pe === 1 ? 1 : (po - pe) / (1 - pe) };
}
const kindOfCode = (c: string) => ENGAGEMENT_CODES.find((x) => x.code === c)?.kind ?? "N";

export default function AdminCognitivePage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sample, setSample] = useState<Sample[]>([]);
  const [coded, setCoded] = useState<Record<string, string>>({});
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [sampleLoading, setSampleLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("cognitive_overview", { p_user: null });
      if (error) setError(error.message); else setRows((data ?? []) as Row[]);
      setLoading(false);
      loadPairs();
    })();
  }, []);

  async function loadPairs() {
    const { data } = await supabase.rpc("engagement_coding_pairs");
    setPairs((data ?? []) as Pair[]);
  }

  async function loadSample() {
    setSampleLoading(true);
    const { data, error } = await supabase.rpc("engagement_coding_sample", { p_limit: 20 });
    if (error) toast.error(error.message);
    setSample((data ?? []) as Sample[]);
    setCoded({});
    setSampleLoading(false);
  }

  async function code(s: Sample, c: EngagementCode) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("engagement_codings").upsert({ interaction_id: s.id, coder_id: u.user.id, code: c }, { onConflict: "interaction_id,coder_id" });
    if (error) { toast.error(error.message); return; }
    setCoded((m) => ({ ...m, [s.id]: c }));
    loadPairs();
  }

  const stats = useMemo(() => {
    const withIdx = rows.filter((r) => r.dep_index != null);
    const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
    return {
      students: rows.length,
      interpretable: withIdx.length,
      levels: [0, 1, 2, 3].map((l) => rows.filter((r) => r.support_level === l).length),
      coShare: avg(rows.filter((r) => r.co_share != null).map((r) => r.co_share!)),
      recovery: avg(rows.filter((r) => r.recovery != null).map((r) => r.recovery!)),
      calAcc: avg(rows.filter((r) => r.cal_brier != null).map((r) => Math.round((1 - Number(r.cal_brier)) * 100))),
    };
  }, [rows]);

  const kCodes = cohenKappa(pairs.map((p) => [p.auto_code, p.human_code]));
  const kKinds = cohenKappa(pairs.map((p) => [kindOfCode(p.auto_code), kindOfCode(p.human_code)]));

  function exportCsv() {
    downloadCsv(`kognitiv-avtonomiya-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Talaba", "Bog'liqlik (7 kun)", "Zona", "Hodisalar", "Ko'mak darajasi", "Daraja o'zgarishlari", "Savollar (30 kun)", "Topshirish ulushi %", "Tiklanish %", "Bashoratlar", "Brier", "Siljish"],
      rows.map((r) => [r.full_name, r.dep_index, r.dep_zone ? ZONE[r.dep_zone]?.label : "", r.dep_events, r.support_level, r.level_changes, r.turns, r.co_share, r.recovery, r.cal_resolved, r.cal_brier, r.cal_bias]));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">Kognitiv avtonomiya</h1>
          <p className="text-muted-foreground text-sm">SIga bog&apos;liqlik, moslashuvchan ko&apos;mak, muloqot sifati va o&apos;zini baholash aniqligi</p>
        </div>
        <button onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent disabled:opacity-50">
          <Download className="w-4 h-4" /> Excel (CSV)
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 border-l-4 border-l-neon-red text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-neon-red shrink-0 mt-0.5" />
          <div><p className="font-semibold">Ma&apos;lumot yuklanmadi</p><p className="text-muted-foreground">{error}</p>
            <p className="text-muted-foreground mt-1"><code>89_kognitiv_avtonomiya.sql</code> migratsiyasi Supabase SQL Editor da ishga tushirilganini tekshiring.</p></div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <Brain className="w-5 h-5 mb-2 text-neon-purple" />
          <div className="font-display font-bold text-2xl">{stats.interpretable}<span className="text-sm text-muted-foreground font-normal">/{stats.students}</span></div>
          <div className="text-xs text-muted-foreground">Ko&apos;rsatkichi talqin qilinadigan talabalar (≥ 3 hodisa)</div>
        </div>
        <div className="glass-card p-4">
          <Compass className="w-5 h-5 mb-2 text-sky-500" />
          <div className="flex gap-1.5 flex-wrap">
            {stats.levels.map((n, l) => <span key={l} className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", LEVEL_CLS[l])} title={SUPPORT_LEVELS[l].name}>{l}: {n}</span>)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Ko&apos;mak darajalari bo&apos;yicha</div>
        </div>
        <div className="glass-card p-4">
          <MessageCircleQuestion className="w-5 h-5 mb-2 text-amber-500" />
          <div className="font-display font-bold text-2xl">{stats.coShare ?? "—"}{stats.coShare != null && "%"}</div>
          <div className="text-xs text-muted-foreground">Fikrlashni topshirish ulushi · tiklanish {stats.recovery ?? "—"}{stats.recovery != null && "%"}</div>
        </div>
        <div className="glass-card p-4">
          <Gauge className="w-5 h-5 mb-2 text-emerald-500" />
          <div className="font-display font-bold text-2xl">{stats.calAcc ?? "—"}{stats.calAcc != null && "%"}</div>
          <div className="text-xs text-muted-foreground">O&apos;rtacha kalibrlash aniqligi (1 − Brier)</div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-semibold">Talaba</th>
                <th className="px-3 py-3 font-semibold" title="(2.1) formula, oxirgi 7 kun">Bog&apos;liqlik</th>
                <th className="px-3 py-3 font-semibold">Ko&apos;mak darajasi</th>
                <th className="px-3 py-3 font-semibold" title="ai_support_log yozuvlari">O&apos;zgarishlar</th>
                <th className="px-3 py-3 font-semibold" title="30 kundagi mentor savollari">Savollar</th>
                <th className="px-3 py-3 font-semibold" title="CO / (CO + AL)">Topshirish</th>
                <th className="px-3 py-3 font-semibold" title="CO navbatidan keyin 3 navbat ichida AL ga qaytish">Tiklanish</th>
                <th className="px-3 py-3 font-semibold" title="Natijasi ma'lum bashoratlar · 1 − Brier · siljish">Kalibrlash</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Yuklanmoqda…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">Ma&apos;lumot yo&apos;q</td></tr>
              ) : rows.map((r) => (
                <tr key={r.user_id} className="border-b border-border/30 hover:bg-surface/30">
                  <td className="px-5 py-2.5">
                    <Link href={`/a-students/${r.user_id}`} className="flex items-center gap-2.5 hover:text-neon-purple">
                      <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[11px] shrink-0 overflow-hidden">
                        {r.avatar_url ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" /> : getInitials(r.full_name)}
                      </div>
                      <span className="font-medium">{r.full_name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {r.dep_index == null
                      ? <span className="text-xs text-muted-foreground" title={`${r.dep_events} ta hodisa`}>yetarli emas</span>
                      : <span className={cn("font-mono font-semibold", ZONE[r.dep_zone ?? ""]?.cls)}>{r.dep_index}<span className="text-[10px] font-normal ml-1">{ZONE[r.dep_zone ?? ""]?.label}</span></span>}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", LEVEL_CLS[r.support_level])}>{r.support_level} · {SUPPORT_LEVELS[r.support_level].name}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">{r.level_changes}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">{r.turns}</td>
                  <td className={cn("px-3 py-2.5 text-center font-mono text-xs", r.co_share != null && r.co_share > 50 && "text-rose-600 dark:text-rose-400")}>{r.co_share == null ? "—" : `${r.co_share}%`}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">{r.recovery == null ? "—" : `${r.recovery}%`}</td>
                  <td className="px-3 py-2.5 text-center text-xs">
                    {r.cal_brier == null ? <span className="text-muted-foreground">—</span> : (
                      <span className="font-mono">{r.cal_resolved} · {Math.round((1 - Number(r.cal_brier)) * 100)}% ·{" "}
                        <span className={Number(r.cal_bias) > 0.15 ? "text-rose-600 dark:text-rose-400" : Number(r.cal_bias) < -0.15 ? "text-sky-600 dark:text-sky-400" : ""}>
                          {Number(r.cal_bias) > 0 ? "+" : ""}{Number(r.cal_bias).toFixed(2)}
                        </span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasnifchini tekshirish */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display font-semibold text-lg">Tasnifchini ekspert kodlashi bilan tekshirish</h2>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Talabalarning haqiqiy savollaridan tasodifiy namuna olinadi. Avtomatik kod ko&apos;rsatilmaydi (ko&apos;r kodlash). Siz tanlagan kod tasnifchi kodi bilan solishtirilib, kelishuv va Koen kappasi hisoblanadi. Ikki ekspert alohida kodlasa, har birining natijasi saqlanadi.
            </p>
          </div>
          <button onClick={loadSample} disabled={sampleLoading} className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2">
            {sampleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 20 ta yangi namuna
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-surface/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">Kodlangan juftliklar</p>
            <p className="font-display font-bold text-2xl">{kCodes.n}</p>
          </div>
          <div className="rounded-xl bg-surface/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">8 kod bo&apos;yicha: kelishuv · κ</p>
            <p className="font-display font-bold text-2xl">{kCodes.agree == null ? "—" : `${Math.round(kCodes.agree * 100)}% · ${kCodes.kappa!.toFixed(2)}`}</p>
          </div>
          <div className="rounded-xl bg-surface/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">CO / AL / N bo&apos;yicha: kelishuv · κ</p>
            <p className="font-display font-bold text-2xl">{kKinds.agree == null ? "—" : `${Math.round(kKinds.agree * 100)}% · ${kKinds.kappa!.toFixed(2)}`}</p>
          </div>
        </div>
        {kCodes.n > 0 && kCodes.n < 50 && <p className="text-xs text-muted-foreground">Ishonchli kappa uchun kamida 100–200 ta juftlik tavsiya etiladi.</p>}

        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">Kodlar ta&apos;rifi</summary>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-2">
            {ENGAGEMENT_CODES.map((c) => <p key={c.code}><b className="font-mono">{c.code}</b> {c.label} — <span className="text-muted-foreground">{c.example}</span></p>)}
          </div>
        </details>

        <div className="space-y-2">
          {sample.map((s) => (
            <div key={s.id} className={cn("rounded-xl border px-4 py-3", coded[s.id] ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-border")}>
              <p className="text-sm whitespace-pre-wrap break-words mb-2">{s.user_query.slice(0, 600)}</p>
              <div className="flex flex-wrap gap-1.5 items-center">
                {ENGAGEMENT_CODES.map((c) => (
                  <button key={c.code} type="button" onClick={() => code(s, c.code)} title={c.label}
                    className={cn("px-2 py-1 rounded-lg text-xs font-mono border",
                      coded[s.id] === c.code ? "bg-neon-purple text-white border-neon-purple" : "border-border hover:border-neon-purple",
                      c.kind === "CO" ? "text-amber-700 dark:text-amber-300" : c.kind === "AL" ? "text-emerald-700 dark:text-emerald-300" : "")}>
                    {c.code}
                  </button>
                ))}
                {coded[s.id] && (
                  <span className="text-xs ml-2 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    tasnifchi: <b className="font-mono">{s.engagement_code}</b>{coded[s.id] === s.engagement_code ? " — mos" : " — farq"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 text-xs text-muted-foreground space-y-1.5">
        <p><b className="text-foreground">Bog&apos;liqlik ko&apos;rsatkichi</b> — I = Σwₖnₖ / (Σwₖnₖ + Yₘ) · 100, oxirgi 7 kun. Vaznlar: mentor savoli va o&apos;tmagan kodga izoh 0,25, maslahatlar 0,25 / 0,50 / 0,75 / 1,00, reja va o&apos;tgan kodga izoh 0. Yₘ — 3/4-maslahatsiz va ko&apos;chirilmagan qabul qilingan yechimlar.</p>
        <p><b className="text-foreground">Ko&apos;mak darajasi</b>: 0 (≤ 30) to&apos;liq · 1 (31–60) yo&apos;naltiruvchi · 2 (61–80) ishora · 3 (81+) mustaqil sinov. Daraja belgilangandan keyin mustaqil yechim bo&apos;lsa, darhol bittaga pasayadi.</p>
        <p><b className="text-foreground">Kalibrlash</b>: talaba topshiriqdan oldin 1–4 ishonch beradi (0,10 / 0,35 / 0,65 / 0,90). Brier = o&apos;rtacha (p − natija)², siljish &gt; 0 — o&apos;zini ortiqcha baholash.</p>
      </div>
    </div>
  );
}
