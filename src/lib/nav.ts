import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

/**
 * Mehmon (login qilmagan foydalanuvchi) uchun navigatsiya.
 *
 * Ilgari bu ro'yxat uch joyda alohida yozilgan edi — bosh sahifada,
 * `explore` layout'ida va o'quvchi layout'idagi mehmon menyusida. Yangi
 * bo'lim qo'shilganda faqat bittasi yangilanib, menyular bir-biridan
 * farq qilib qolardi. Endi manba bitta.
 *
 * Matnlar endi lug'atdan olinadi: ro'yxat tarjima kalitini saqlaydi,
 * ko'rinadigan yorliqni esa `navLinks(t)` yasab beradi.
 */

export type NavKey =
  | "courses" | "challenges" | "playground" | "contests"
  | "books" | "glossary" | "labs" | "lessonGames" | "games" | "methods" | "portfolios"
  | "blog" | "about" | "guide";

export type NavLink = { href: string; label: string };
export type ResourceLink = NavLink & { hint: string };

const PRIMARY: { href: string; key: NavKey }[] = [
  { href: "/explore/courses", key: "courses" },
  { href: "/explore/challenges", key: "challenges" },
  { href: "/playground", key: "playground" },
  { href: "/explore/contests", key: "contests" },
];

const RESOURCES: { href: string; key: Exclude<NavKey, "courses" | "challenges" | "playground" | "contests" | "about" | "guide"> }[] = [
  { href: "/explore/books", key: "books" },
  { href: "/explore/glossary", key: "glossary" },
  { href: "/explore/labs", key: "labs" },
  { href: "/explore/lesson-games", key: "lessonGames" },
  { href: "/explore/games", key: "games" },
  { href: "/explore/methods", key: "methods" },
  { href: "/explore/portfolios", key: "portfolios" },
  // Blog ilgari yuqori panelda alohida turardi. Yo'riqnoma qo'shilgach
  // panel 1280–1440px ekranlarda sig'may qoldi — blog shu ro'yxatga o'tdi.
  { href: "/blog", key: "blog" },
];

// Yo'riqnoma yuqori panelda doim ko'rinadi — yangi foydalanuvchi uni birinchi qidiradi
const TAIL: { href: string; key: NavKey }[] = [
  { href: "/explore/guide", key: "guide" },
];
const EXTRA: { href: string; key: NavKey }[] = [{ href: "/explore/about", key: "about" }];

/** Yuqori panelda doim ko'rinadigan asosiy bosqichlar */
export const primaryLinks = (t: Dictionary): NavLink[] =>
  PRIMARY.map(l => ({ href: l.href, label: t.nav[l.key] }));

/** "Resurslar" ochiladigan ro'yxati */
export const resourceLinks = (t: Dictionary): ResourceLink[] =>
  RESOURCES.map(l => ({ href: l.href, label: t.nav[l.key], hint: t.nav.hints[l.key] }));

/** Yuqori panelda "Resurslar" dan keyin */
export const tailLinks = (t: Dictionary): NavLink[] =>
  TAIL.map(l => ({ href: l.href, label: t.nav[l.key] }));

/** Yuqori panelga sig'magani — mobil menyu va footerda ko'rinadi */
export const extraLinks = (t: Dictionary): NavLink[] =>
  EXTRA.map(l => ({ href: l.href, label: t.nav[l.key] }));

/** Mobil menyu va footer uchun — hammasi bitta ro'yxatda */
export const allGuestLinks = (t: Dictionary): NavLink[] => [
  ...primaryLinks(t),
  ...resourceLinks(t).map(({ href, label }) => ({ href, label })),
  ...tailLinks(t),
  ...extraLinks(t),
];
