"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TeacherApplication, TeacherApplicationStatus } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn, formatRelativeDate } from "@/lib/utils";
import {
  Presentation, Check, X, Loader2, Clock, CheckCircle2, XCircle,
  Phone, MapPin, School, Briefcase, RotateCcw, ChevronDown,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

const SUBJECT_LABEL = (t: Dictionary): Record<string, string> => ({
  informatika: "Informatika",
  matematika: "Matematika",
  fizika: "Fizika",
  boshlangich: t.admin.tch.subjPrimary,
  boshqa: t.admin.tch.subjOther,
});

const TABS = (t: Dictionary): { value: TeacherApplicationStatus | "all"; label: string }[] => [
  { value: "pending", label: t.admin.tch.pending },
  { value: "approved", label: t.admin.tch.approved },
  { value: "rejected", label: t.admin.tch.rejectedTab },
  { value: "all", label: t.admin.common.all },
];

export default function AdminTeachersPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [apps, setApps] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TeacherApplicationStatus | "all">("pending");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("teacher_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setApps(data as TeacherApplication[]);
    setLoading(false);
  }

  const filtered = useMemo(
    () => apps.filter(a => tab === "all" || a.status === tab),
    [apps, tab]
  );

  const pendingCount = useMemo(() => apps.filter(a => a.status === "pending").length, [apps]);

  async function approve(a: TeacherApplication) {
    if (!confirm(`${a.full_name} — o'qituvchi huquqi berilsinmi?`)) return;
    setBusyId(a.id);
    const { error } = await supabase.rpc("approve_teacher_application", { p_application_id: a.id });
    setBusyId(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`${a.full_name} tasdiqlandi`);
    load();
  }

  async function reject(a: TeacherApplication) {
    const reason = prompt("Rad etish sababi (arizachi ko'radi):", "");
    if (reason === null) return;
    setBusyId(a.id);
    const { error } = await supabase.rpc("reject_teacher_application", {
      p_application_id: a.id,
      p_reason: reason.trim() || null,
    });
    setBusyId(null);
    if (error) { toast.error(error.message); return; }
    toast.success(t.admin.tch.rejected);
    load();
  }

  async function revoke(a: TeacherApplication) {
    const reason = prompt("Huquqni bekor qilish sababi:", "");
    if (reason === null) return;
    setBusyId(a.id);
    const { error } = await supabase.rpc("revoke_teacher_role", {
      p_application_id: a.id,
      p_reason: reason.trim() || null,
    });
    setBusyId(null);
    if (error) { toast.error(error.message); return; }
    toast.success("O'qituvchi huquqi bekor qilindi");
    load();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Presentation className="w-6 h-6 text-neon-purple" /> O&apos;qituvchi arizalari
          </h1>
          <p className="text-sm text-muted-foreground">
            {pendingCount > 0
              ? `${pendingCount} ta ariza ko'rib chiqilishi kutilmoqda`
              : "Ko'rib chiqilmagan ariza yo'q"}
          </p>
        </div>
      </div>

      {/* Tablar */}
      <div className="flex gap-2 flex-wrap">
        {TABS(t).map(t => {
          const count = t.value === "all" ? apps.length : apps.filter(a => a.status === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                tab === t.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              {t.label}
              <span className={cn("numeric text-xs", tab === t.value ? "opacity-70" : "opacity-50")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Ro'yxat */}
      <div className="space-y-2">
        {loading ? [1, 2, 3].map(i => <div key={i} className="glass-card h-20 animate-pulse" />) :
        filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Presentation className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>
              {tab === "pending" ? "Yangi ariza yo'q" : "Bu bo'limda ariza yo'q"}
            </p>
          </div>
        ) : filtered.map(a => {
          const open = openId === a.id;
          const busy = busyId === a.id;
          return (
            <motion.div key={a.id} layout className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : a.id)}
                className="w-full text-left p-4 flex items-center gap-4 hover:bg-surface/40 transition-colors"
                aria-expanded={open}
              >
                <StatusPill status={a.status} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{a.full_name}</p>
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground mt-0.5">
                    <span>{SUBJECT_LABEL(t)[a.subject] || a.subject}</span>
                    <span>· {a.school}</span>
                    <span>· {formatRelativeDate(a.created_at)}</span>
                  </div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-border/50 space-y-4">
                      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 pt-4 text-sm">
                        <Row icon={<Phone className="w-3.5 h-3.5" />} label="Telefon" value={a.phone} />
                        <Row icon={<MapPin className="w-3.5 h-3.5" />} label={t.admin.tch.region}
                          value={[a.region, a.district].filter(Boolean).join(", ") || "—"} />
                        <Row icon={<School className="w-3.5 h-3.5" />} label={t.admin.tch.workplace} value={a.school} />
                        <Row icon={<Briefcase className="w-3.5 h-3.5" />} label={t.admin.tch.experience}
                          value={a.experience_years ? `${a.experience_years} yil` : "—"} />
                      </dl>

                      {a.about && (
                        <div>
                          <p className="eyebrow mb-1">{t.admin.tch.extra}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{a.about}</p>
                        </div>
                      )}

                      {a.status === "rejected" && a.reject_reason && (
                        <div className="p-3 rounded-lg bg-neon-red/[0.06] border border-neon-red/20">
                          <p className="text-xs font-semibold text-neon-red mb-0.5">{t.admin.tch.rejectReason}</p>
                          <p className="text-sm text-muted-foreground">{a.reject_reason}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {a.status !== "approved" && (
                          <button
                            onClick={() => approve(a)}
                            disabled={busy}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-neon-green/30 text-neon-green bg-neon-green/[0.06] hover:bg-neon-green/[0.12] disabled:opacity-50 transition-colors"
                          >
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Tasdiqlash
                          </button>
                        )}
                        {a.status === "pending" && (
                          <button
                            onClick={() => reject(a)}
                            disabled={busy}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-neon-red/30 text-neon-red bg-neon-red/[0.06] hover:bg-neon-red/[0.12] disabled:opacity-50 transition-colors"
                          >
                            <X className="w-4 h-4" /> Rad etish
                          </button>
                        )}
                        {a.status === "approved" && (
                          <button
                            onClick={() => revoke(a)}
                            disabled={busy}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-50 transition-colors"
                          >
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                            Huquqni bekor qilish
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: TeacherApplicationStatus }) {
  const map = {
    pending: { icon: <Clock className="w-4 h-4" />, cls: "text-neon-yellow bg-neon-yellow/10 border-neon-yellow/25" },
    approved: { icon: <CheckCircle2 className="w-4 h-4" />, cls: "text-neon-green bg-neon-green/10 border-neon-green/25" },
    rejected: { icon: <XCircle className="w-4 h-4" />, cls: "text-neon-red bg-neon-red/10 border-neon-red/25" },
  }[status];
  return (
    <span className={cn("w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0", map.cls)}>
      {map.icon}
    </span>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="min-w-0">
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="truncate">{value}</dd>
      </div>
    </div>
  );
}
