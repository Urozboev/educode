import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin kurs/kontent saqlaganda public cache'larni darhol tozalaydi.
 * Aks holda bosh sahifa 60s gacha eski ma'lumot ko'rsatishi mumkin.
 */
export async function POST() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  // O'qituvchi ham dars o'yinlarini tahrirlaydi — keshni tozalash xavfsiz amal
  if (profile?.role !== 'admin' && profile?.role !== 'teacher') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  revalidatePath('/api/public/home');
  revalidatePath('/');
  revalidatePath('/explore/courses');

  // Ma'lumotlar keshi (lib/cache.ts) teg bo'yicha tozalanadi — aks holda
  // kurs yoki blog saqlangandan keyin 5-30 daqiqa eski matn ko'rinardi.
  for (const tag of Object.values(CACHE_TAGS)) revalidateTag(tag);

  return NextResponse.json({ ok: true, revalidated: ['/api/public/home', '/', '/explore/courses'], tags: Object.values(CACHE_TAGS) });
}
