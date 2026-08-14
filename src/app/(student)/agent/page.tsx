import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAgentAccess, PLAN_PRICES_UZS, FREE_TRIAL_MESSAGES } from "@/lib/agent/access";
import AgentChat from "@/components/agent/AgentChat";
import type { Metadata } from "next";
import { getServerDictionary } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.agent.seoTitle,
    description: t.agent.seoDesc,
    };
}

export default async function AgentPage({
  searchParams,
}: {
  searchParams: { modul?: string };
}) {
  const t = await getServerDictionary();
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware ham shu manzilni himoyalaydi; bu ikkinchi to'siq —
  // sessiya middleware'dan keyin tugab qolsa ham sahifa ochilmasin
  if (!user) redirect("/login?redirect=/agent");

  const access = await getAgentAccess(supabase, user.id);

  // Demo tugagan yoki obuna muddati o'tgan — paywall
  if (!access.allowed) {
    return <Paywall reason={access.reason} t={t} />;
  }

  // Rejadagi "Boshlash" tugmasidan kelingan bo'lsa — mavzu nomi.
  // Faqat nomi kerak, shuning uchun bitta ustun o'qiladi.
  let startTopic: string | null = null;
  if (searchParams.modul) {
    const { data: mod } = await supabase
      .from("agent_modules")
      .select("title")
      .eq("id", searchParams.modul)
      .maybeSingle();
    startTopic = mod?.title ?? null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      {access.isTrial && (
        <div className="border-b border-border bg-primary/5 px-4 py-2 text-center text-xs text-muted-foreground">
          {t.agent.freeTrialLeft} {access.freeRemaining} {t.agent.messagesLeft}{" "}
          <Link href="/agent/obuna" className="font-medium text-primary hover:underline">
            Pro obunaga o'tish
          </Link>
        </div>
      )}
      <AgentChat startTopic={startTopic} />
    </div>
  );
}

function Paywall({ reason, t }: { reason?: string; t: Dictionary }) {
  const title =
    reason === "expired" ? t.agent.subExpired : t.agent.trialOver;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-8 w-8" />
      </div>

      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
        {reason === "expired"
          ? t.agent.renewHint
          : `${t.agent.usedWith} ${FREE_TRIAL_MESSAGES} ${t.agent.trialUsed}`}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <PlanCard t={t}
          name="Pro"
          price={PLAN_PRICES_UZS.pro}
          features={[
            t.agent.perkChat,
            t.agent.perkTwoTracks,
            t.agent.perkVoiceShort,
            t.agent.certificate,
          ]}
        />
        <PlanCard t={t}
          name="Pro+"
          price={PLAN_PRICES_UZS.pro_plus}
          highlighted
          features={[
            "Pro dagi hamma narsa",
            "Cheksiz yo'nalish",
            "Kod review",
            "Ota-ona hisoboti",
          ]}
        />
      </div>
    </div>
  );
}

function PlanCard({
  t,
  name, price, features, highlighted,
}: {
  t: Dictionary;
  name: string;
  price: number;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border p-6 text-left " +
        (highlighted ? "border-primary bg-primary/5" : "border-border")
      }
    >
      <div className="mb-1 font-semibold">{name}</div>
      <div className="mb-4 text-2xl font-bold">
        {price.toLocaleString("uz-UZ")}{" "}
        <span className="text-sm font-normal text-muted-foreground">{t.agent.perMonth}</span>
      </div>

      <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/agent/obuna?plan=${name === "Pro" ? "pro" : "pro_plus"}`}
        className={
          "block rounded-xl px-4 py-2.5 text-center text-sm font-medium " +
          (highlighted
            ? "bg-primary text-primary-foreground"
            : "border border-border hover:bg-muted")
        }
      >
        {t.agent.pick}
      </Link>
    </div>
  );
}
