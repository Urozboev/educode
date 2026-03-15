import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Bu API route Judge0 server bilan ishlaydi (agar mavjud bo'lsa)
// Judge0 yo'q bo'lsa, frontend Pyodide (Python) va sandboxed iframe (JS) ishlatadi
// Bu route faqat submission saqlash va test tekshirish uchun ishlatiladi

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const { code, language, task_id, task_type, test_cases, execution_result } = await request.json();

    // Agar frontend tomondan natija kelgan bo'lsa (Pyodide/iframe)
    if (execution_result) {
      const testResults = test_cases?.map((tc: any, i: number) => ({
        input: tc.input,
        expected: tc.expected_output,
        actual: execution_result.outputs?.[i] || '',
        passed: (execution_result.outputs?.[i] || '').trim() === tc.expected_output.trim(),
        time_ms: execution_result.time_ms || 0,
      })) || [];

      const passedCount = testResults.filter((r: any) => r.passed).length;
      const totalCount = testResults.length;
      const status = passedCount === totalCount ? 'accepted' : 'wrong_answer';

      // Submission saqlash
      const { data: submission, error: subError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          task_id,
          task_type,
          code,
          language,
          status,
          test_results: testResults,
          passed_tests: passedCount,
          total_tests: totalCount,
          execution_time_ms: execution_result.time_ms,
        })
        .select()
        .single();

      if (subError) throw subError;

      // Agar accepted bo'lsa — coin va XP qo'shish
      if (status === 'accepted') {
        // Avval shu topshiriqni oldin yechganmi tekshirish
        const { count } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('task_id', task_id)
          .eq('status', 'accepted')
          .neq('id', submission.id);

        if (count === 0) {
          // Birinchi marta yechildi — coin va XP berish
          let coinReward = 5;
          let xpReward = 15;

          if (task_type === 'challenge') {
            const { data: challenge } = await supabase
              .from('challenges')
              .select('coin_reward, xp_reward, solved_count')
              .eq('id', task_id)
              .single();

            if (challenge) {
              coinReward = challenge.coin_reward;
              xpReward = challenge.xp_reward;

              // solved_count ni yangilash
              await supabase
                .from('challenges')
                .update({ solved_count: (challenge.solved_count || 0) + 1 })
                .eq('id', task_id);
            }
          } else if (task_type === 'topic_task') {
            const { data: task } = await supabase
              .from('topic_tasks')
              .select('coin_reward, xp_reward')
              .eq('id', task_id)
              .single();

            if (task) {
              coinReward = task.coin_reward;
              xpReward = task.xp_reward;
            }
          }

          // Coin qo'shish
          const { data: profile } = await supabase
            .from('profiles')
            .select('coins, xp')
            .eq('id', user.id)
            .single();

          if (profile) {
            const newCoins = profile.coins + coinReward;
            const newXp = profile.xp + xpReward;

            await supabase
              .from('profiles')
              .update({ coins: newCoins, xp: newXp })
              .eq('id', user.id);

            await supabase
              .from('coin_transactions')
              .insert({
                user_id: user.id,
                amount: coinReward,
                type: task_type === 'challenge' ? 'challenge_solved' : 'topic_complete',
                reference_id: task_id,
                description: `Topshiriq bajarildi: +${coinReward} coin`,
                balance_after: newCoins,
              });
          }
        }
      }

      return NextResponse.json({
        submission,
        test_results: testResults,
        status,
        passed: passedCount,
        total: totalCount,
      });
    }

    // Judge0 server bilan ishlash (agar konfiguratsiya qilingan bo'lsa)
    const judge0Url = process.env.JUDGE0_API_URL;
    if (judge0Url) {
      // Judge0 API ga yuborish logikasi
      const languageIdMap: Record<string, number> = {
        python: 71,    // Python 3
        javascript: 63, // Node.js
        typescript: 74,
        cpp: 54,        // C++ (GCC)
        java: 62,
        go: 60,
      };

      const languageId = languageIdMap[language];
      if (!languageId) {
        return NextResponse.json({ error: `${language} tili qo'llab-quvvatlanmaydi` }, { status: 400 });
      }

      // Har bir test case uchun submission yaratish
      const submissions = test_cases.map((tc: any) => ({
        source_code: Buffer.from(code).toString('base64'),
        language_id: languageId,
        stdin: Buffer.from(tc.input).toString('base64'),
        expected_output: Buffer.from(tc.expected_output).toString('base64'),
        cpu_time_limit: 2,
        memory_limit: 256000,
      }));

      const response = await fetch(`${judge0Url}/submissions/batch?base64_encoded=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.JUDGE0_API_KEY && { 'X-Auth-Token': process.env.JUDGE0_API_KEY }),
        },
        body: JSON.stringify({ submissions }),
      });

      const tokens = await response.json();
      return NextResponse.json({ tokens, mode: 'judge0' });
    }

    // Judge0 ham yo'q — frontend Pyodide/iframe dan foydalanishi kerak
    return NextResponse.json({
      message: 'Server-side execution mavjud emas. Frontendda Pyodide/iframe ishlatilsin.',
      mode: 'browser',
    });

  } catch (error: any) {
    console.error('Execution error:', error);
    return NextResponse.json({ error: 'Kod bajarishda xatolik' }, { status: 500 });
  }
}
