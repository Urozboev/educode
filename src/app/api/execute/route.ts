import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { user_id, task_id, task_type, passed_tests, total_tests } = await request.json();

    if (!user_id || !task_id) {
      return NextResponse.json({ error: 'user_id va task_id kerak' }, { status: 400 });
    }

    const allPassed = passed_tests > 0 && passed_tests === total_tests;
    if (!allPassed || task_type !== 'challenge') {
      return NextResponse.json({ success: true, rewarded: false });
    }

    // Service role client yaratish
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceKey || !supabaseUrl || !serviceKey.startsWith('eyJ')) {
      // Service role key noto'g'ri — xatolik emas, faqat mukofot berilmaydi
      console.warn('SUPABASE_SERVICE_ROLE_KEY noto\'g\'ri yoki yo\'q. Coin/XP berilmadi.');
      return NextResponse.json({ success: true, rewarded: false, reason: 'no_service_key' });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Oldin yechganmi tekshirish
    const { count } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('task_id', task_id)
      .eq('status', 'accepted');

    if ((count || 0) > 1) {
      // Allaqachon yechgan — qayta mukofot bermaslik
      return NextResponse.json({ success: true, rewarded: false, reason: 'already_solved' });
    }

    // Challenge ma'lumotlari
    const { data: challenge } = await supabase
      .from('challenges')
      .select('coin_reward, xp_reward, solved_count, attempt_count, title')
      .eq('id', task_id)
      .single();

    if (!challenge) {
      return NextResponse.json({ success: true, rewarded: false, reason: 'challenge_not_found' });
    }

    // Profil ma'lumotlari
    const { data: profile } = await supabase
      .from('profiles')
      .select('coins, xp')
      .eq('id', user_id)
      .single();

    if (!profile) {
      return NextResponse.json({ success: true, rewarded: false, reason: 'profile_not_found' });
    }

    const coinReward = challenge.coin_reward || 5;
    const xpReward = challenge.xp_reward || 15;
    const newCoins = profile.coins + coinReward;
    const newXp = profile.xp + xpReward;

    // Profil yangilash
    await supabase.from('profiles').update({ coins: newCoins, xp: newXp }).eq('id', user_id);

    // Coin tranzaksiya
    await supabase.from('coin_transactions').insert({
      user_id, amount: coinReward, type: 'challenge_complete',
      reference_id: task_id,
      description: `"${challenge.title}" topshirig'i bajarildi`,
      balance_after: newCoins,
    });

    // Challenge statistika yangilash
    await supabase.from('challenges').update({
      solved_count: (challenge.solved_count || 0) + 1,
      attempt_count: (challenge.attempt_count || 0) + 1,
    }).eq('id', task_id);

    return NextResponse.json({
      success: true, rewarded: true,
      coins_earned: coinReward, xp_earned: xpReward,
    });
  } catch (error: any) {
    console.error('Execute xatolik:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const hasKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ') || false;
  return NextResponse.json({ status: 'ok', route: '/api/execute', hasValidServiceKey: hasKey });
}
