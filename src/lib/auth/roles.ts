/**
 * Rol bo'yicha marshrutlashning YAGONA manbasi.
 *
 * Ilgari har bir sahifa ("login", "register", "placement-test", OAuth
 * callback) o'zicha qaror qabul qilardi va ba'zilari faqat 'student' va
 * 'parent' ni bilardi. Natijada o'qituvchi darajani aniqlash testiga
 * tushib, undan keyin o'quvchi kabinetiga o'tib ketardi.
 */

export const APP_ROLES = ["student", "teacher", "parent", "admin"] as const;
export type AppRole = (typeof APP_ROLES)[number];

/** Noma'lum qiymat kelsa 'student' — eng kam huquqli rol. */
export function normalizeRole(value: unknown): AppRole {
  return (APP_ROLES as readonly string[]).includes(String(value))
    ? (value as AppRole)
    : "student";
}

/** Shu rol uchun kabinetning bosh sahifasi. */
export function roleHome(role: unknown): string {
  switch (normalizeRole(role)) {
    case "admin": return "/a-dashboard";
    case "teacher": return "/t-dashboard";
    case "parent": return "/p-dashboard";
    default: return "/dashboard";
  }
}

/** Darajani aniqlash testi faqat o'quvchiga tegishli. */
export function needsPlacement(role: unknown): boolean {
  return normalizeRole(role) === "student";
}

/** Rolning o'z hududi: teacher → /t-*, parent → /p-*, admin → hammasi. */
export function isPathAllowedForRole(role: unknown, pathname: string): boolean {
  const r = normalizeRole(role);
  if (r === "admin") return true;

  const isAdminPath = pathname.startsWith("/a-");
  const isTeacherPath = pathname.startsWith("/t-");
  const isParentPath = pathname.startsWith("/p-");

  if (r === "teacher") return isTeacherPath;
  if (r === "parent") return isParentPath;
  return !isAdminPath && !isTeacherPath && !isParentPath;
}

/**
 * Middleware rolni shu cookie'da keshlaydi: `<user_id>:<role>`.
 * ID ga bog'lanadi — bitta brauzerda boshqa hisobga kirgan odam eski
 * rolni meros qilib olmasligi uchun.
 */
export const ROLE_COOKIE = "user-role";

/**
 * Kesh muddati (soniya).
 *
 * Rol OSHIRILGANDA (masalan talaba → o'qituvchi) bu muddat ahamiyatsiz:
 * middleware ruxsat bermasdan oldin bazani qayta tekshiradi va yangi rolni
 * darhol oladi. Muddat faqat rol PASAYTIRILGAN holatni cheklaydi.
 *
 * 60 soniya juda qisqa edi: har daqiqada navigatsiya bazaga borish
 * uchun to'xtardi (Supabase'gacha ~0,6 s) va sayt sezilarli sekinlashdi.
 */
export const ROLE_COOKIE_MAX_AGE = 10 * 60;

export function buildRoleCookie(userId: string, role: AppRole): string {
  return `${userId}:${role}`;
}

export function parseRoleCookie(
  raw: string | undefined,
  userId: string,
): AppRole | null {
  if (!raw || !raw.includes(":")) return null;
  const idx = raw.indexOf(":");
  const uid = raw.slice(0, idx);
  const role = raw.slice(idx + 1);
  if (uid !== userId) return null;
  return (APP_ROLES as readonly string[]).includes(role) ? (role as AppRole) : null;
}
