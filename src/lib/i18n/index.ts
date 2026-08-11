"use client";

import { createContext, useContext } from "react";
import { uz, type Dictionary } from "./dictionaries/uz";
import { ru } from "./dictionaries/ru";
import { en } from "./dictionaries/en";
import { kaa } from "./dictionaries/kaa";
import { DEFAULT_LOCALE, type Locale } from "./config";

export const DICTIONARIES: Record<Locale, Dictionary> = { uz, ru, en, kaa };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

interface I18nValue {
  locale: Locale;
  t: Dictionary;
  /** Manzilni joriy tilda yasaydi — ichki havolalar shundan foydalanadi */
  href: (path: string) => string;
}

export const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  t: uz,
  href: p => p,
});

/**
 * Tarjimalarga kirish.
 *
 * Kalitlar `Dictionary` turi bilan tekshiriladi: mavjud bo'lmagan
 * kalitni yozsangiz TypeScript darhol xato beradi va tarjima
 * "yo'qolib qolgan matn" holatiga tushmaydi.
 */
export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export type { Dictionary };
export * from "./config";
