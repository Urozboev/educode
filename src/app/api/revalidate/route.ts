import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  revalidatePath('/api/public/home');
  revalidatePath('/');
  revalidatePath('/explore/courses');

  return NextResponse.json({ ok: true, revalidated: ['/api/public/home', '/', '/explore/courses'] });
}
