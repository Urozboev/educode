import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAgentAccess } from "@/lib/agent/access";
import PlanWizard from "@/components/agent/PlanWizard";
import PlanView from "@/components/agent/PlanView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "O'quv reja | Ustoz — EduCode",
  description: "AI agent tuzgan shaxsiy o'quv reja: modullar, daraja va progress.",
};

export default async function AgentPlanPage({
  searchParams,
}: {
  searchParams: { yangi?: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/agent/reja");

  const access = await getAgentAccess(supabase, user.id);
  // Paywall `/agent` da ko'rsatiladi — bu yerda takrorlamaymiz
  if (!access.allowed) redirect("/agent");

  const { data: track } = await supabase
    .from("agent_tracks")
    .select("id, title, goal, start_level, target_level, weekly_hours")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const { data: modules } = track
    ? await supabase
        .from("agent_modules")
        .select("id, order_index, title, summary, topic_key, level, estimated_minutes, status")
        .eq("track_id", track.id)
        .order("order_index")
    : { data: null };

  // `?yangi=1` — mavjud reja bo'lsa ham sehrgarni ochish
  const showWizard = !track || searchParams.yangi === "1";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <div className="flex items-center justify-between border-b border-border py-4">
        <span className="text-sm font-medium text-muted-foreground">Ustoz — o'quv reja</span>
        <Link
          href="/agent"
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <MessageCircle className="h-4 w-4" />
          Suhbatga qaytish
        </Link>
      </div>

      {showWizard
        ? <PlanWizard />
        : <PlanView track={track!} modules={(modules as any) || []} />}
    </div>
  );
}
