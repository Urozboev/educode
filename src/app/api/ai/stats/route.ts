import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDailyAIStats } from '@/lib/ai/usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const stats = await getDailyAIStats(supabase, user.id);

  // 7 kunlik trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const { data: trend } = await supabase
    .from('ai_usage_daily')
    .select('date, total_queries')
    .eq('user_id', user.id)
    .gte('date', sevenDaysAgo.toISOString().slice(0, 10))
    .order('date', { ascending: true });

  // Bugungi qabul qilingan yechimlar
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: submissionsToday } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'accepted')
    .gte('created_at', todayStart.toISOString());

  // Haftalik bog'liqlik ko'rsatkichi — dissertatsiyadagi (2.1) formula,
  // ko'mak darajasi, kalibrlash va muloqot ko'rsatkichlari (89-migratsiya).
  // Migratsiya hali ishga tushirilmagan bo'lsa — null, karta eski hisobga qaytadi.
  const [support, calibration, engagement] = await Promise.all([
    supabase.rpc('ai_support_state', { p_user: user.id }),
    supabase.rpc('calibration_summary', { p_user: user.id }),
    supabase.rpc('engagement_summary', { p_user: user.id }),
  ]);

  // Eski soddalashtirilgan kunlik hisob (zaxira)
  const autonomous = Math.max(0, (submissionsToday ?? 0) - stats.used);
  const totalActions = stats.used + autonomous;
  const dailyScore = totalActions === 0 ? 0 : Math.round((stats.used / totalActions) * 100);
  const weekly = support.data as { index?: number | null; interpretable?: boolean } | null;

  return NextResponse.json({
    daily: stats,
    submissionsToday: submissionsToday ?? 0,
    autonomousToday: autonomous,
    dependencyScore: weekly?.interpretable && weekly.index != null ? weekly.index : dailyScore,
    support: support.error ? null : support.data,
    calibration: calibration.error ? null : calibration.data,
    engagement: engagement.error ? null : engagement.data,
    trend: trend ?? [],
  });
}
