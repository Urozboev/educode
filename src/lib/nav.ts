/**
 * Mehmon (login qilmagan foydalanuvchi) uchun navigatsiya.
 *
 * Ilgari bu ro'yxat uch joyda alohida yozilgan edi — bosh sahifada,
 * `explore` layout'ida va o'quvchi layout'idagi mehmon menyusida. Yangi
 * bo'lim qo'shilganda faqat bittasi yangilanib, menyular bir-biridan
 * farq qilib qolardi. Endi manba bitta.
 */

export type NavLink = { href: string; label: string };
export type ResourceLink = NavLink & { hint: string };

/** Yuqori panelda doim ko'rinadigan asosiy bosqichlar */
export const PRIMARY_LINKS: NavLink[] = [
  { href: "/explore/courses", label: "Kurslar" },
  { href: "/explore/challenges", label: "Topshiriqlar" },
  { href: "/playground", label: "Playground" },
  { href: "/explore/contests", label: "Olimpiada" },
];

/** "Resurslar" ochiladigan ro'yxati */
export const RESOURCE_LINKS: ResourceLink[] = [
  { href: "/explore/books", label: "Kitoblar", hint: "Bepul PDF kitoblar" },
  { href: "/explore/glossary", label: "Terminlar", hint: "Lug'at va flash-cardlar" },
  { href: "/explore/labs", label: "Laboratoriya", hint: "Interaktiv vizualizatorlar" },
  { href: "/explore/lesson-games", label: "Dars o'yinlari", hint: "Viktorina, krossvord" },
  { href: "/explore/games", label: "O'yinlar", hint: "Arkada mashqlar" },
  { href: "/explore/methods", label: "Metodlar", hint: "O'qituvchiga yo'riqnoma" },
  { href: "/explore/portfolios", label: "Portfoliolar", hint: "Talabalar ishlari" },
];

/** Yuqori panelda "Resurslar" dan keyin */
export const TAIL_LINKS: NavLink[] = [
  { href: "/blog", label: "Blog" },
];

/** Yuqori panelga sig'magani — mobil menyu va footerda ko'rinadi */
export const EXTRA_LINKS: NavLink[] = [
  { href: "/explore/about", label: "Platforma haqida" },
];

/** Mobil menyu va footer uchun — hammasi bitta ro'yxatda */
export const ALL_GUEST_LINKS: NavLink[] = [
  ...PRIMARY_LINKS,
  ...RESOURCE_LINKS.map(({ href, label }) => ({ href, label })),
  ...TAIL_LINKS,
  ...EXTRA_LINKS,
];
