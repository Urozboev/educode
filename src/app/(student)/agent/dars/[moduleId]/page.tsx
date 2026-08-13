import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAgentAccess } from "@/lib/agent/access";
import LessonView from "@/components/agent/LessonView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dars | Ustoz — EduCode",
};

export default async function AgentLessonPage({
  params,
}: {
  params: { moduleId: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/agent/dars/${params.moduleId}`);

  const access = await getAgentAccess(supabase, user.id);
  if (!access.allowed) redirect("/agent");

  // RLS moduli faqat egasiga ko'rsatadi — begona modul id si bilan
  // kirishga urinish shu yerda 404 bo'ladi
  const { data: mod } = await supabase
    .from("agent_modules")
    .select("id, track_id")
    .eq("id", params.moduleId)
    .maybeSingle();

  if (!mod) notFound();

  const { data: track } = await supabase
    .from("agent_tracks")
    .select("lang")
    .eq("id", mod.track_id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <LessonView moduleId={params.moduleId} lang={track?.lang || "uz"} />
    </div>
  );
}
