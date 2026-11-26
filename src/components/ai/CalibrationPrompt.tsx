"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/user";
import { cn } from "@/lib/utils";
import { Gauge, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Metakognitiv kalibrlash: talaba topshiriqni boshlashdan OLDIN
 * "SI va maslahatlarsiz yecha olaman" ishonchini belgilaydi.
 * Yechilgandan keyin bashorat natija bilan solishtiriladi
 * (89-migratsiya: calibration_predictions, calibration_items).
 */

const OPTIONS = [
  { v: 1, label: "Yecha olmayman", hint: "~10%" },
  { v: 2, label: "Ehtimol yo'q", hint: "~35%" },
  { v: 3, label: "Ehtimol ha", hint: "~65%" },
  { v: 4, label: "Albatta yechaman", hint: "~90%" },
];

interface Item { confidence: number; outcome: number | null }

export default function CalibrationPrompt({ taskId, taskType, solved }: { taskId: string; taskType: "topic_task" | "challenge"; solved: boolean }) {
  const supabase = createClient();
  const [item, setItem] = useState<Item | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const user = await getCurrentUser(supabase);
      if (!user) { setDisabled(true); return; }
      const { data, error } = await supabase.rpc("calibration_items", { p_user: user.id });
      if (!alive) return;
      // 89-migratsiya yo'q — komponent ko'rinmaydi
      if (error) { setDisabled(true); return; }
      const row = (data as { task_id: string; task_type: string; confidence: number; outcome: number | null }[])
        .find((r) => r.task_id === taskId && r.task_type === taskType);
      setItem(row ? { confidence: row.confidence, outcome: row.outcome } : null);
      setReady(true);
    })();
    return () => { alive = false; };
  }, [taskId, taskType, solved]);

  async function pick(v: number) {
    const user = await getCurrentUser(supabase);
    if (!user) return;
    setSaving(v);
    const { error } = await supabase.from("calibration_predictions").insert({ user_id: user.id, task_id: taskId, task_type: taskType, confidence: v });
    setSaving(null);
    if (error && error.code !== "23505") { toast.error(error.message); return; }
    setItem({ confidence: v, outcome: null });
  }

  if (disabled || !ready) return null;
  // Bashoratsiz yechilgan topshiriqda so'ralmaydi — kalibrlash oldindan bo'lishi kerak
  if (!item && solved) return null;

  if (!item) {
    return (
      <div className="rounded-2xl border border-neon-purple/30 bg-neon-purple/[0.05] px-4 py-3">
        <p className="text-sm font-semibold flex items-center gap-2"><Gauge className="w-4 h-4 text-neon-purple" /> Boshlashdan oldin: bu topshiriqni SI va maslahatlarsiz yecha olasizmi?</p>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">Halol baholang — bu baho emas. O&apos;z imkoniyatini to&apos;g&apos;ri baholash ham o&apos;rganiladigan ko&apos;nikma.</p>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <button key={o.v} type="button" onClick={() => pick(o.v)} disabled={saving !== null}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium hover:border-neon-purple hover:bg-neon-purple/5 inline-flex items-center gap-1.5">
              {saving === o.v && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{o.label} <span className="text-[11px] text-muted-foreground">{o.hint}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const label = OPTIONS[item.confidence - 1]?.label;
  if (item.outcome === null) {
    return (
      <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
        <Gauge className="w-3.5 h-3.5" /> Bashoratingiz: <b className="text-foreground">{label}</b>. Natija topshiriq yechilgach solishtiriladi.
      </p>
    );
  }

  // Natija: 1 — mustaqil yechildi, 0 — yordam bilan yoki yechilmadi
  const expectedYes = item.confidence >= 3;
  const match = expectedYes === (item.outcome === 1);
  const msg = match
    ? "Bashoratingiz to'g'ri chiqdi — o'z imkoniyatingizni aniq baholadingiz."
    : expectedYes
      ? "O'zingizni biroz ortiqcha baholadingiz: topshiriq maslahat yoki tayyor kod yordamida yechildi. Keyingi safar boshlashdan oldin qaysi qismi qiyin ekanini o'ylab ko'ring."
      : "O'zingizni kam baholadingiz — siz o'ylaganingizdan kuchliroqsiz! Topshiriq mustaqil yechildi.";
  return (
    <div className={cn("rounded-2xl border px-4 py-2.5 text-sm flex items-start gap-2",
      match ? "border-emerald-500/30 bg-emerald-500/[0.06]" : "border-amber-500/30 bg-amber-500/[0.07]")}>
      {match ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
      <p><b>Bashorat: {label}</b> → natija: {item.outcome === 1 ? "mustaqil yechildi" : "yordam bilan yechildi yoki yechilmadi"}. {msg}</p>
    </div>
  );
}
