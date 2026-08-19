"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  ShieldCheck, ShieldX, Award, Calendar, Loader2, ExternalLink, Search,
} from "lucide-react";

type Verified = {
  certificate_number: string;
  full_name: string;
  course_title: string;
  completion_date: string;
  score_percentage: number | null;
  issued_at: string;
  portfolio_username: string | null;
};

/**
 * Sertifikatni ommaviy tekshirish.
 *
 * Bu sahifaga QR kod olib keladi. Uni ish beruvchi yoki o'qituvchi ochadi —
 * EduCode'da hisobi bo'lmasligi mumkin, shuning uchun hech qanday login yo'q.
 * Sahifa bitta savolga javob beradi: bu sertifikat haqiqiymi?
 */
export function VerifyView({ number }: { number: string }) {
  const { t } = useI18n();
  const supabase = createClient();
  const [data, setData] = useState<Verified | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(number || "");

  useEffect(() => {
    if (!number) { setLoading(false); return; }
    (async () => {
      const { data: res } = await supabase.rpc("verify_certificate", { p_number: number });
      if (res) setData(res as Verified);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {data ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-neon-green/30 bg-neon-green/[0.05] overflow-hidden"
        >
          <div className="flex items-center gap-3 p-5 border-b border-neon-green/20">
            <span className="w-11 h-11 rounded-xl bg-neon-green/10 border border-neon-green/25 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-neon-green" />
            </span>
            <div>
              <p className="font-display font-bold text-neon-green">{t.verifyCert.validTitle}</p>
              <p className="text-xs text-muted-foreground">
                {t.verifyCert.validSubtitle}
              </p>
            </div>
          </div>

          <dl className="p-5 space-y-4">
            <Row label={t.verifyCert.owner} value={data.full_name} big />
            <Row label={t.verifyCert.course} value={data.course_title} />
            <Row
              label={t.verifyCert.completionDate}
              value={formatDate(data.completion_date)}
              icon={<Calendar className="w-3.5 h-3.5" />}
            />
            {data.score_percentage != null && data.score_percentage > 0 && (
              <Row label={t.verifyCert.avgScore} value={`${Math.round(data.score_percentage)}%`} />
            )}
            <Row
              label={t.verifyCert.certNumber}
              value={data.certificate_number}
              mono
              icon={<Award className="w-3.5 h-3.5" />}
            />
          </dl>

          {data.portfolio_username && (
            <div className="px-5 pb-5">
              <Link
                href={`/u/${data.portfolio_username}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-neon-purple hover:underline"
              >
                {t.verifyCert.viewPortfolio} <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-neon-red/30 bg-neon-red/[0.05] p-6 text-center"
        >
          <span className="w-12 h-12 rounded-xl bg-neon-red/10 border border-neon-red/25 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-6 h-6 text-neon-red" />
          </span>
          <p className="font-display font-bold text-neon-red mb-1">{t.verifyCert.notFoundTitle}</p>
          <p className="text-sm text-muted-foreground">
            {number
              ? <>{t.verifyCert.notFoundDesc} <span className="font-mono">{number}</span></>
              : t.verifyCert.enterNumberPrompt}
          </p>
        </motion.div>
      )}

      {/* Boshqa raqamni tekshirish */}
      <form
        onSubmit={e => {
          e.preventDefault();
          const q = query.trim();
          if (q) window.location.href = `/sertifikat/${encodeURIComponent(q)}`;
        }}
        className="space-y-3"
      >
        <label className="eyebrow block">{t.verifyCert.checkAnother}</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input-field pl-10 font-mono text-sm"
              placeholder="CERT-2026-000123"
              aria-label={t.verifyCert.certNumber}
            />
          </div>
          <button type="submit" className="btn-primary py-2.5 px-5 text-sm">{t.verifyCert.checkBtn}</button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        {t.verifyCert.footerHint}
      </p>
    </div>
  );
}

function Row({
  label, value, mono, big, icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  big?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5 mb-0.5">
        {icon}{label}
      </dt>
      <dd className={[
        big ? "font-display font-bold text-xl" : "text-base",
        mono ? "font-mono text-sm" : "",
      ].join(" ")}>
        {value}
      </dd>
    </div>
  );
}
