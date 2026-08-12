import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAgentAccess, PLAN_PRICES_UZS, FREE_TRIAL_MESSAGES } from "@/lib/agent/access";
import AgentChat from "@/components/agent/AgentChat";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ustoz — shaxsiy AI o'qituvchi | EduCode",
  description:
    "Noldan advanced darajagacha IT o'rgatadigan AI agent: o'zi reja tuzadi, dars o'tadi, baholaydi va progressni kuzatadi.",
};

export default async function AgentPage({
  searchParams,
}: {
  searchParams: { modul?: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware ham shu manzilni himoyalaydi; bu ikkinchi to'siq —
  // sessiya middleware'dan keyin tugab qolsa ham sahifa ochilmasin
  if (!user) redirect("/login?redirect=/agent");

  const access = await getAgentAccess(supabase, user.id);

  // Demo tugagan yoki obuna muddati o'tgan — paywall
  if (!access.allowed) {
    return <Paywall reason={access.reason} />;
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
          Bepul sinov: yana {access.freeRemaining} ta xabar.{" "}
          <Link href="/agent/obuna" className="font-medium text-primary hover:underline">
            Pro obunaga o'tish
          </Link>
        </div>
      )}
      <AgentChat startTopic={startTopic} />
    </div>
  );
}

function Paywall({ reason }: { reason?: string }) {
  const title =
    reason === "expired" ? "Obuna muddati tugadi" : "Bepul sinov tugadi";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-8 w-8" />
      </div>

      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
        {reason === "expired"
          ? "Ustoz bilan ishlashni davom ettirish uchun obunani yangilang. Rejangiz va progressingiz saqlanib turibdi."
          : `Ustoz bilan ${FREE_TRIAL_MESSAGES} ta bepul xabar almashdingiz. Davom etish uchun obunani tanlang.`}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <PlanCard
          name="Pro"
          price={PLAN_PRICES_UZS.pro}
          features={[
            "Cheksiz suhbat va darslar",
            "2 ta o'quv yo'nalishi",
            "Ovozli dars",
            "Sertifikat",
          ]}
        />
        <PlanCard
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
  name, price, features, highlighted,
}: {
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
        <span className="text-sm font-normal text-muted-foreground">so'm / oy</span>
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
        Tanlash
      </Link>
    </div>
  );
}
