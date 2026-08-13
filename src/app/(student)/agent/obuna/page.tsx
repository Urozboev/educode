import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAgentAccess } from "@/lib/agent/access";
import SubscribeView from "@/components/agent/SubscribeView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Obuna | Ustoz — EduCode",
  description: "Ustoz AI o'qituvchisi uchun obuna: Pro va Pro+ tariflari.",
};

export default async function AgentSubscribePage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/agent/obuna");

  const access = await getAgentAccess(supabase, user.id);
  const initialPlan = searchParams.plan === "pro_plus" ? "pro_plus" : "pro";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <div className="border-b border-border py-4">
        <Link
          href="/agent"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Ustozga qaytish
        </Link>
      </div>

      {/* useSearchParams — Suspense ichida bo'lishi shart */}
      <Suspense fallback={<div className="py-24 text-center text-sm text-muted-foreground">Yuklanmoqda...</div>}>
        <SubscribeView initialAccess={access} initialPlan={initialPlan} />
      </Suspense>
    </div>
  );
}
