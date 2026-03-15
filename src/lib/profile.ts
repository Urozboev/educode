import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Foydalanuvchi profilini oladi.
 * Agar profil mavjud bo'lmasa (trigger ishlamagan), avtomatik yaratadi.
 */
export async function getOrCreateProfile(supabase: SupabaseClient, userId: string) {
  // 1. Profilni olishga urinish
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profile) return profile;

  // 2. Profil yo'q — user ma'lumotlarini olish
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Foydalanuvchi";

  const avatarUrl = user.user_metadata?.avatar_url || null;

  // 3. Profil yaratish
  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name: fullName,
      avatar_url: avatarUrl,
      role: "student",
      coins: 100,
      xp: 0,
      streak_days: 0,
      longest_streak: 0,
      level: "beginner",
    })
    .select()
    .single();

  if (insertError) {
    // Parallel insert bo'lishi mumkin — qayta o'qib ko'ramiz
    const { data: retry } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return retry;
  }

  // 4. Coin tranzaksiya yaratish
  if (newProfile) {
    await supabase.from("coin_transactions").insert({
      user_id: userId,
      amount: 100,
      type: "registration_bonus",
      description: "Registratsiya bonusi",
      balance_after: 100,
    });
  }

  return newProfile;
}
