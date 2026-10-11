import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { CACHE_TAGS } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Kunlik avtomatik xizmat — Vercel Cron har kecha chaqiradi (vercel.json).
 *
 * Bajariladigan ishlar `run_daily_maintenance()` funksiyasi ichida
 * (65_kunlik_xizmat_cron.sql): faollik kunlarini yig'ish, streak'larni
 * qayta hisoblash, yutuqlarni berish.
 *
 * Shu bilan birga ikkita yon foyda bor:
 *   · kesh tozalanadi, ya'ni ertalab birinchi tashrif eski ma'lumot
 *     ko'rmaydi
 *   · bazaga har kuni so'rov tushadi — Supabase bepul tarifida loyiha
 *     7 kun faolsizlikdan keyin uyquga ketadi, bu esa buni oldini oladi
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  // Maxfiy so'z sozlanmagan bo'lsa ishlamaydi: ochiq qolgan uchliknuqta
  // har kimga coin tarqatish imkonini berardi.
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET sozlanmagan" },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("run_daily_maintenance");

  if (error) {
    console.error("[cron/daily] run_daily_maintenance:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  for (const tag of Object.values(CACHE_TAGS)) revalidateTag(tag);

  const result = { ok: true, ms: Date.now() - started, ...(data as object) };
  console.log("[cron/daily]", JSON.stringify(result));
  return NextResponse.json(result);
}
