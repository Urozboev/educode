import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Service role client — API route ichida cookie kerak emas
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, task_id, task_type, code, language, test_results, passed_tests, total_tests } = await request.json();

    if (!user_id || !task_id) {
      return NextResponse.json({ error: 'user_id va task_id kerak' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const allPassed = passed_tests === total_tests;
    const status = allPassed ? 'accepted' : 'wrong_answer';

    // Submission saqlash
    const { data: submission, error: subError } = await supabase.from('submissions').insert({
      user_id, task_id, task_type: task_type || 'topic_task',
      code, language: language || 'python', status,
      passed_tests: passed_tests || 0, total_tests: total_tests || 0,
      test_results: test_results || [],
    }).select().single();

    if (subError) {
      console.error('Submission save error:', subError);
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    // Agar challenge va accepted bo'lsa — coin/xp berish
    if (allPassed && task_type === 'challenge') {
      const { data: challenge } = await supabase.from('challenges').select('coin_reward, xp_reward, solved_count').eq('id', task_id).single();
      if (challenge) {
        // Oldin yechganmi tekshirish
        const { count } = await supabase.from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user_id).eq('task_id', task_id).eq('status', 'accepted');

        if (count === 1) { // Birinchi marta yechdi
          const { data: profile } = await supabase.from('profiles').select('coins, xp').eq('id', user_id).single();
          if (profile) {
            const newCoins = profile.coins + challenge.coin_reward;
            const newXp = profile.xp + challenge.xp_reward;
            await supabase.from('profiles').update({ coins: newCoins, xp: newXp }).eq('id', user_id);
            await supabase.from('coin_transactions').insert({
              user_id, amount: challenge.coin_reward, type: 'challenge_complete',
              reference_id: task_id, description: `Topshiriq bajarildi (+${challenge.coin_reward} coin)`,
              balance_after: newCoins,
            });
          }
          await supabase.from('challenges').update({ solved_count: (challenge.solved_count || 0) + 1 }).eq('id', task_id);
        }
      }
    }

    return NextResponse.json({ submission, status });
  } catch (error: any) {
    console.error('Execute error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/execute' });
}
