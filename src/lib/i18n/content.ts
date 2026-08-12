"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_LOCALE, type Locale } from "./config";

/**
 * Baza kontentini tarjima bilan almashtirish.
 *
 * Tarjimalar `content_translations` jadvalida saqlanadi va bu yerda asl
 * qatorlar ustiga qo'yiladi. Tarjima yo'q maydon o'zbekcha qoladi —
 * yarim tarjima qilingan kurs ham ishlashda davom etadi, bo'sh matn
 * ko'rsatilmaydi.
 *
 * Ishlatilishi:
 *   const topics = await supabase.from("topics").select("*")...;
 *   const shown = await withTranslations(supabase, "topics", topics, locale);
 */

/** Tarjima qilinadigan jadvallar — `translatable_fields` reyestriga mos */
export type TranslatableResource =
  | "courses" | "topics" | "quizzes" | "topic_tasks" | "challenges"
  | "glossary_terms" | "teaching_methods" | "books" | "lesson_games" | "contests";

/**
 * Yagona talab — `id`. `Record<string, unknown>` qo'shilsa `Course`,
 * `Topic` kabi aniq interfeyslar bu shartga tushmay qoladi (ularda
 * indeks imzosi yo'q) va har chaqiruvda `as any` yozishga to'g'ri kelardi.
 */
type Row = { id: string };

/**
 * Bir nechta qator uchun tarjimani bitta so'rovda oladi va ustiga qo'yadi.
 *
 * Sukut tilda hech qanday so'rov yubormaydi — sahifalarning katta qismi
 * o'zbekcha ochiladi va ularga qo'shimcha yuk tushmasligi kerak.
 */
export async function withTranslations<T extends Row>(
  supabase: SupabaseClient,
  resource: TranslatableResource,
  rows: T[],
  locale: Locale
): Promise<T[]> {
  if (locale === DEFAULT_LOCALE || rows.length === 0) return rows;

  const { data, error } = await supabase.rpc("get_translations", {
    p_resource: resource,
    p_row_ids: rows.map(r => r.id),
    p_locale: locale,
  });

  // Tarjima olinmasa asl matn ko'rsatiladi — sahifa baribir ishlaydi
  if (error || !data) return rows;

  const byId = new Map<string, Record<string, unknown>>(
    (data as { row_id: string; fields: Record<string, unknown> }[])
      .map(d => [d.row_id, d.fields])
  );

  return rows.map(r => {
    const fields = byId.get(r.id);
    if (!fields) return r;
    // Faqat bo'sh bo'lmagan tarjimalar qo'yiladi
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== null && v !== undefined && v !== "") patch[k] = v;
    }
    return { ...r, ...patch };
  });
}

/** Bitta qator uchun qisqartma */
export async function withTranslation<T extends Row>(
  supabase: SupabaseClient,
  resource: TranslatableResource,
  row: T | null,
  locale: Locale
): Promise<T | null> {
  if (!row) return null;
  const [out] = await withTranslations(supabase, resource, [row], locale);
  return out ?? row;
}

/**
 * Tarjima qilinadigan maydon ta'rifi — admin interfeysi shundan
 * qaysi tahrirlagichni ko'rsatishni biladi.
 */
export interface TranslatableField {
  resource: string;
  field: string;
  kind: "text" | "long" | "html" | "json";
  label: string;
  order_index: number;
}

export const RESOURCE_LABEL: Record<TranslatableResource, string> = {
  courses: "Kurslar",
  topics: "Mavzular",
  quizzes: "Testlar",
  topic_tasks: "Mavzu topshiriqlari",
  challenges: "Masalalar",
  glossary_terms: "Terminlar",
  teaching_methods: "Metodlar",
  books: "Kitoblar",
  lesson_games: "Dars o'yinlari",
  contests: "Olimpiadalar",
};

/**
 * Ro'yxatda qatorni tanish uchun ishlatiladigan ustun.
 * Har jadvalda "sarlavha" boshqacha atalgan.
 */
export const RESOURCE_TITLE_FIELD: Record<TranslatableResource, string> = {
  courses: "title",
  topics: "title",
  quizzes: "question",
  topic_tasks: "title",
  challenges: "title",
  glossary_terms: "term",
  teaching_methods: "title",
  books: "title",
  lesson_games: "title",
  contests: "title",
};
