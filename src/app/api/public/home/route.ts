import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const runtime = 'nodejs';
// 5 daqiqa server cache — bosh sahifa statistikasi tez-tez o'zgarmaydi.
// Bitta so'rov 6 ta alohida client-side roundtrip o'rnini bosadi.
export const revalidate = 300;

function anonClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: () => undefined, set: () => {}, remove: () => {} } },
  );
}

export async function GET() {
  try {
    const supabase = anonClient();

    const [users, courses, challenges, submissions, courseList, testimonials] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('challenges').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase
        .from('courses')
        .select('id,title,slug,description,category,total_topics,total_enrolled,is_free,price_coins,difficulty')
        .eq('is_published', true)
        .order('order_index')
        .limit(6),
      supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    return NextResponse.json(
      {
        stats: {
          users: users.count || 0,
          courses: courses.count || 0,
          challenges: challenges.count || 0,
          submissions: submissions.count || 0,
        },
        courses: courseList.data || [],
        testimonials: testimonials.data || [],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error: any) {
    console.error('public/home error:', error);
    return NextResponse.json({ stats: null, courses: [], testimonials: [] }, { status: 500 });
  }
}
