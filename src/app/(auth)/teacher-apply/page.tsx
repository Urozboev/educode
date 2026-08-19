"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TeacherApplication } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Presentation, Loader2, Send, Clock, CheckCircle2, XCircle,
  ArrowRight, AlertCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const REGIONS = [
  "Toshkent shahri", "Toshkent viloyati", "Andijon", "Buxoro", "Farg'ona",
  "Jizzax", "Xorazm", "Namangan", "Navoiy", "Qashqadaryo", "Qoraqalpog'iston",
  "Samarqand", "Sirdaryo", "Surxondaryo",
];

const SUBJECTS = [
  { value: "informatika", label: "Informatika" },
  { value: "matematika", label: "Matematika" },
  { value: "fizika", label: "Fizika" },
  { value: "boshlangich", label: "Boshlang'ich sinf" },
  { value: "boshqa", label: "Boshqa" },
];

const empty = {
  full_name: "", phone: "", region: REGIONS[0], district: "",
  school: "", subject: "informatika", experience_years: 0, about: "",
};

export default function TeacherApplyPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [application, setApplication] = useState<TeacherApplication | null>(null);
  const [form, setForm] = useState(empty);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login?redirect=/teacher-apply"); return; }
      setUserId(user.id);

      const [{ data: profile }, { data: app }] = await Promise.all([
        supabase.from("profiles").select("full_name, role").eq("id", user.id).single(),
        supabase.from("teacher_applications").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      // Roli allaqachon teacher bo'lsa, ariza sahifasida ushlab turishning ma'nosi yo'q
      if (profile?.role === "teacher") { router.push("/t-dashboard"); return; }

      if (app) {
        const a = app as TeacherApplication;
        setApplication(a);
        setForm({
          full_name: a.full_name, phone: a.phone, region: a.region || REGIONS[0],
          district: a.district || "", school: a.school, subject: a.subject,
          experience_years: a.experience_years, about: a.about || "",
        });
      } else if (profile?.full_name) {
        setForm(f => ({ ...f, full_name: profile.full_name }));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!form.full_name.trim() || !form.phone.trim() || !form.school.trim()) {
      toast.error(t.auth.fillRequired);
      return;
    }
    setSaving(true);

    const payload = {
      user_id: userId,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      region: form.region,
      district: form.district.trim() || null,
      school: form.school.trim(),
      subject: form.subject,
      experience_years: form.experience_years || 0,
      about: form.about.trim() || null,
    };

    // Rad etilgan ariza tahrirlanadi, aks holda yangisi yaratiladi
    const { error } = application
      ? await supabase.from("teacher_applications").update(payload).eq("id", application.id)
      : await supabase.from("teacher_applications").insert(payload);

    setSaving(false);
    if (error) { toast.error(error.message); return; }

    toast.success(t.auth.applySent);
    const { data } = await supabase.from("teacher_applications").select("*").eq("user_id", userId).maybeSingle();
    if (data) setApplication(data as TeacherApplication);
  }

  if (loading) {
    return (
      <div className="w-full max-w-lg">
        <div className="p-8 rounded-3xl border border-border/60 bg-card/80 h-64 animate-pulse" />
      </div>
    );
  }

  // ===== Ko'rib chiqilmoqda =====
  if (application?.status === "pending") {
    return (
      <StatusCard
        tone="pending"
        icon={<Clock className="w-8 h-8 text-neon-yellow" />}
        title={t.auth.applyPending}
        body={t.auth.applyAccepted}
      >
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-5">
          {t.auth.toStudentCabinet} <ArrowRight className="w-4 h-4" />
        </Link>
      </StatusCard>
    );
  }

  // ===== Tasdiqlangan (roli hali yangilanmagan holat uchun) =====
  if (application?.status === "approved") {
    return (
      <StatusCard
        tone="approved"
        icon={<CheckCircle2 className="w-8 h-8 text-neon-green" />}
        title={t.auth.applyApproved}
        body={t.auth.teacherOpened}
      >
        <Link href="/t-dashboard" className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-5">
          {t.auth.toTeacherCabinet} <ArrowRight className="w-4 h-4" />
        </Link>
      </StatusCard>
    );
  }

  // ===== Forma (yangi yoki rad etilgandan keyin qayta topshirish) =====
  return (
    <motion.div
      className="w-full max-w-lg"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5">
        <div className="w-14 h-14 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-5">
          <Presentation className="w-7 h-7 text-neon-green" />
        </div>

        <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-2">
          {t.auth.applyTitle}
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
          {t.auth.applySubtitle}
        </p>

        {application?.status === "rejected" && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-red/[0.07] border border-neon-red/25 text-sm mb-6">
            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-red" />
            <div className="leading-relaxed">
              <p className="font-semibold text-neon-red mb-0.5">Ariza rad etilgan</p>
              <p className="text-muted-foreground">
                {application.reject_reason || "Sabab ko'rsatilmagan."} Ma&apos;lumotlarni
                to&apos;g&apos;rilab qayta yuborishingiz mumkin.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t.auth.fullName} *</label>
            <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="input-field" placeholder={t.auth.fullNamePh} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t.auth.phone} *</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+998 90 123 45 67" inputMode="tel" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.auth.region}</label>
              <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="input-field">
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.auth.district}</label>
              <input value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} className="input-field" placeholder={t.auth.district} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t.auth.workplace} *</label>
            <input value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} className="input-field" placeholder="45-maktab" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.auth.subject}</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field">
                {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.auth.experience}</label>
              <input type="number" min={0} max={60} value={form.experience_years || ""} onChange={e => setForm({ ...form, experience_years: +e.target.value })} className="input-field" placeholder="5" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t.auth.additional}</label>
            <textarea value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} className="input-field resize-none" rows={3} placeholder={t.auth.motivationPh} maxLength={500} />
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface/60 border border-border text-xs text-muted-foreground">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {t.auth.applyPrivacy}
            </span>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {application ? t.auth.resend : t.auth.sendApplication}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Keyinroq to&apos;ldiraman
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

function StatusCard({
  icon, title, body, tone, children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: "pending" | "approved";
  children: React.ReactNode;
}) {
  const ring = tone === "approved" ? "bg-neon-green/10 border-neon-green/20" : "bg-neon-yellow/10 border-neon-yellow/20";
  return (
    <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl text-center shadow-2xl shadow-black/5">
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-6 ${ring}`}>
          {icon}
        </div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-3">{title}</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">{body}</p>
        {children}
      </div>
    </motion.div>
  );
}
