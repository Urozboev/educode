import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Mavzu tugatilganda chaqiriladi.
 * Barcha mavzular tugatilganmi tekshiradi va kursni tugatilgan deb belgilaydi.
 * Sertifikat va coin/XP beradi.
 */
export async function checkAndCompleteCourse(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
) {
  // 1. Kurs mavzulari sonini olish
  const { data: topics } = await supabase
    .from("topics")
    .select("id")
    .eq("course_id", courseId)
    .eq("is_published", true);

  if (!topics || topics.length === 0) return false;

  // 2. Tugatilgan mavzular sonini olish
  const { data: completed } = await supabase
    .from("topic_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("is_completed", true);

  const completedCount = completed?.length || 0;
  const totalCount = topics.length;

  // 3. Progress yangilash
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  await supabase
    .from("enrollments")
    .update({
      progress_percent: progressPercent,
      completed_topics: completedCount,
      total_topics: totalCount,
      last_accessed_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("course_id", courseId);

  // 4. Agar barcha mavzular tugatilgan bo'lsa
  if (completedCount >= totalCount) {
    // Enrollment ni tugatilgan deb belgilash
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("is_completed")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (enrollment?.is_completed) return true; // Allaqachon tugatilgan

    await supabase
      .from("enrollments")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        progress_percent: 100,
        completed_topics: totalCount,
      })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    // 5. Coin va XP berish
    const { data: course } = await supabase
      .from("courses")
      .select("title, coin_reward")
      .eq("id", courseId)
      .single();

    if (course) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins, xp, full_name")
        .eq("id", userId)
        .single();

      if (profile) {
        const newCoins = profile.coins + (course.coin_reward || 50);
        const newXp = profile.xp + 100;

        await supabase
          .from("profiles")
          .update({ coins: newCoins, xp: newXp })
          .eq("id", userId);

        await supabase.from("coin_transactions").insert({
          user_id: userId,
          amount: course.coin_reward || 50,
          type: "course_complete",
          reference_id: courseId,
          description: `"${course.title}" kursi tugatildi`,
          balance_after: newCoins,
        });

        // 6. Sertifikat yaratish
        const certNumber = `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, "0")}`;

        // O'rtacha test ballini hisoblash
        const { data: quizResults } = await supabase
          .from("quiz_results")
          .select("percentage")
          .eq("user_id", userId)
          .in("topic_id", topics.map(t => t.id));

        const avgScore = quizResults && quizResults.length > 0
          ? Math.round(quizResults.reduce((s, q) => s + Number(q.percentage), 0) / quizResults.length)
          : null;

        await supabase.from("certificates").insert({
          user_id: userId,
          course_id: courseId,
          certificate_number: certNumber,
          full_name: profile.full_name,
          course_title: course.title,
          completion_date: new Date().toISOString().split("T")[0],
          score_percentage: avgScore,
        });
      }
    }

    return true; // Kurs tugatildi
  }

  return false;
}

/**
 * Mavzuni tugatilgan deb belgilaydi va kurs progressini yangilaydi.
 */
export async function completeTopic(
  supabase: SupabaseClient,
  userId: string,
  topicId: string,
  courseId: string
) {
  // Progress ni yangilash
  const { data: progress } = await supabase
    .from("topic_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .single();

  if (!progress) return;

  // Matn o'qilgan + test o'tgan + topshiriq bajarilgan = tugatildi
  const isComplete = progress.content_read && progress.quiz_passed && progress.tasks_completed;

  if (isComplete && !progress.is_completed) {
    await supabase
      .from("topic_progress")
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq("id", progress.id);

    // Coin va XP berish
    const { data: topic } = await supabase
      .from("topics")
      .select("coin_reward, xp_reward, title")
      .eq("id", topicId)
      .single();

    if (topic) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins, xp")
        .eq("id", userId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            coins: profile.coins + topic.coin_reward,
            xp: profile.xp + topic.xp_reward,
          })
          .eq("id", userId);

        await supabase.from("coin_transactions").insert({
          user_id: userId,
          amount: topic.coin_reward,
          type: "topic_complete",
          reference_id: topicId,
          description: `"${topic.title}" mavzusi tugatildi`,
          balance_after: profile.coins + topic.coin_reward,
        });
      }
    }

    // Kurs tugatilishini tekshirish
    await checkAndCompleteCourse(supabase, userId, courseId);
  }
}
