"use client";

/**
 * Obuna tanlash va to'lovga o'tish.
 *
 * To'lov havolasi olingach foydalanuvchi provayder sahifasiga
 * yo'naltiriladi. Obuna shu yerda YOQILMAYDI — u faqat webhook
 * to'lovni tasdiqlagach yoqiladi. Shuning uchun qaytib kelganda
 * sahifa "tekshirilmoqda" holatini ko'rsatadi va bir necha marta
 * qayta so'raydi: webhook bir necha soniya kechikishi mumkin.
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check, Loader2, Sparkles, ShieldCheck, ArrowRight, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PLAN_PRICES_UZS, MONTH_OPTIONS, MONTH_DISCOUNT, subscriptionAmount,
} from "@/lib/agent/access";
import type { AgentAccess } from "@/lib/agent/types";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

type Plan = "pro" | "pro_plus";
type Provider = "payme" | "click";

const PLAN_FEATURES = (t: Dictionary): Record<Plan, string[]> => ({
  pro: [
    t.agent.perkChat,
    t.agent.perkTwoTracks,
    t.agent.perkVoice,
    t.agent.perkQuiz,
  ],
  pro_plus: [
    t.agent.perkAllPro,
    t.agent.perkUnlimitedTracks,
    t.agent.perkCodeReview,
    t.agent.perkParentReport,
  ],
});

const PLAN_NAMES: Record<Plan, string> = { pro: "Pro", pro_plus: "Pro+" };

export default function SubscribeView({
  initialAccess,
  initialPlan = "pro",
}: {
  initialAccess: AgentAccess;
  initialPlan?: Plan;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const justPaid = params.get("paid") === "1";

  const [access, setAccess] = useState(initialAccess);
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [months, setMonths] = useState<number>(1);
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(justPaid);

  /**
   * To'lovdan qaytgach obunani kutamiz. Webhook darhol kelmasligi
   * mumkin, shuning uchun bir necha marta so'raymiz — foydalanuvchi
   * "to'ladim, lekin hech narsa o'zgarmadi" degan holatga tushmasin.
   */
  const pollAccess = useCallback(async (attempt = 0) => {
    try {
      const res = await fetch("/api/agent/subscribe");
      const data = await res.json();

      if (data.access?.allowed && !data.access.isTrial) {
        setAccess(data.access);
        setChecking(false);
        router.refresh();
        return;
      }

      if (attempt < 5) {
        setTimeout(() => void pollAccess(attempt + 1), 2000);
      } else {
        setChecking(false);
      }
    } catch {
      setChecking(false);
    }
  }, [router]);

  useEffect(() => {
    if (justPaid) void pollAccess();
  }, [justPaid, pollAccess]);

  async function pay(provider: Provider) {
    setLoading(provider);
    setError(null);

    try {
      const res = await fetch("/api/agent/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, months, provider }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "To'lov boshlanmadi");

      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setLoading(null);
    }
  }

  const amount = subscriptionAmount(plan, months);
  const isActive = access.allowed && !access.isTrial;

  /* ---------------- To'lovdan keyin ---------------- */
  if (checking) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
        <h2 className="mb-2 text-lg font-semibold">To'lov tekshirilmoqda...</h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {t.agent.subWait}
        </p>
      </div>
    );
  }

  /* ---------------- Faol obuna ---------------- */
  if (isActive) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <h1 className="mb-2 text-2xl font-bold">
          {PLAN_NAMES[access.plan as Plan] || access.plan} obuna faol
        </h1>

        {access.expiresAt && (
          <p className="mb-8 text-sm text-muted-foreground">
            Amal qilish muddati:{" "}
            {new Date(access.expiresAt).toLocaleDateString("uz-UZ", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        )}

        <div className="mx-auto flex max-w-sm flex-col gap-3">
          <Link
            href="/agent"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            <Sparkles className="h-4 w-4" />
            {t.agent.subContinue}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => setAccess({ ...access, allowed: false })}
            className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
          >
            Obunani uzaytirish
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Tanlov ---------------- */
  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Ustoz obunasi</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {t.agent.subDesc}
        </p>
      </div>

      {/* Tarif */}
      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(PLAN_NAMES) as Plan[]).map((p) => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className={cn(
              "rounded-2xl border p-6 text-left transition-colors",
              plan === p ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
            )}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">{PLAN_NAMES[p]}</span>
              {plan === p && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>

            <div className="mb-4 text-2xl font-bold">
              {PLAN_PRICES_UZS[p].toLocaleString("uz-UZ")}
              <span className="text-sm font-normal text-muted-foreground"> so'm / oy</span>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {PLAN_FEATURES(t)[p].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* Muddat */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4" />
          Muddat
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MONTH_OPTIONS.map((m) => {
            const discount = MONTH_DISCOUNT[m] ?? 0;
            return (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={cn(
                  "relative rounded-xl border px-4 py-3 text-center transition-colors",
                  months === m ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                )}
              >
                <div className="font-medium">{m} oy</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {subscriptionAmount(plan, m).toLocaleString("uz-UZ")} so'm
                </div>
                {discount > 0 && (
                  <span className="absolute -top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                    -{Math.round(discount * 100)}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Yakuniy summa va to'lov */}
      <div className="rounded-2xl border border-border p-6">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            {PLAN_NAMES[plan]} · {months} oy
          </span>
          <span className="text-2xl font-bold">
            {amount.toLocaleString("uz-UZ")}{" "}
            <span className="text-sm font-normal text-muted-foreground">so'm</span>
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => pay("payme")}
            disabled={loading !== null}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#00CCCC] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading === "payme" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Payme orqali to'lash
          </button>

          <button
            onClick={() => pay("click")}
            disabled={loading !== null}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#00A3E0] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading === "click" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Click orqali to'lash
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          To'lov tasdiqlangach obuna avtomatik yoqiladi. Muddati tugamagan
          obunani uzaytirsangiz, qolgan kunlar yo'qolmaydi.
        </p>
      </div>
    </div>
  );
}
