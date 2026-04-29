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

  // Bugungi mustaqil topshiriqlar (AI feedback ishlatilmagan submissions)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: submissionsToday } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'accepted')
    .gte('created_at', todayStart.toISOString());

  // AI bog'liqlik indeksi (oddiy hisob): used / (used + autonomous_solved)
  // 0 = 100% mustaqil, 100 = har topshiriqda AI
  const autonomous = Math.max(0, (submissionsToday ?? 0) - stats.used);
  const totalActions = stats.used + autonomous;
  const dependencyScore = totalActions === 0
    ? 0
    : Math.round((stats.used / totalActions) * 100);

  return NextResponse.json({
    daily: stats,
    submissionsToday: submissionsToday ?? 0,
    autonomousToday: autonomous,
    dependencyScore,
    trend: trend ?? [],
  });
}
