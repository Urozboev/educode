import type { Dictionary } from "@/lib/i18n/dictionaries/uz";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} daqiqa`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} soat ${mins} daqiqa` : `${hours} soat`;
}

/**
 * O'zbekcha oy nomlari.
 * `toLocaleDateString('uz-UZ')` Chrome va Node'da oyni "M01" ko'rinishida
 * qaytaradi ("2026 M01 15"), shuning uchun nomlarni o'zimiz beramiz.
 */
export const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

/**
 * Qoraqalpoqcha oy nomlari. Ruscha va inglizcha uchun `Intl` ishlatiladi —
 * u bu ikki tilni to'g'ri beradi; `uz-UZ` va `kaa` ni esa bermaydi,
 * shuning uchun ular qo'lda yozilgan.
 */
const KAA_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr",
];

/** Oy nomini tilga qarab beradi */
function monthName(date: Date, locale?: string): string {
  if (locale === "ru" || locale === "en") {
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
  }
  return locale === "kaa" ? KAA_MONTHS[date.getMonth()] : UZ_MONTHS[date.getMonth()];
}

/** "15-yanvar, 2026" */
export function formatDate(dateStr: string, locale?: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return `${date.getDate()}-${monthName(date, locale)}, ${date.getFullYear()}`;
}

/** "15-yanvar, 14:30" — yil ko'rsatilmaydi (joriy yil nazarda tutiladi) */
export function formatDateTime(dateStr: string, locale?: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()}-${monthName(date, locale)}, ${hh}:${mm}`;
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "hozirgina";
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  if (hours < 24) return `${hours} soat oldin`;
  if (days < 7) return `${days} kun oldin`;
  return formatDate(dateStr);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getLevelColor(level: string): string {
  switch (level) {
    case 'beginner': return 'text-neon-green';
    case 'elementary': return 'text-neon-blue';
    case 'intermediate': return 'text-neon-yellow';
    case 'advanced': return 'text-neon-red';
    default: return 'text-muted-foreground';
  }
}

/**
 * `t` berilsa lug'atdan, berilmasa o'zbekchadan qaytaradi. Ixtiyoriy
 * parametr — chaqiruv joylari (13 ta) bosqichma-bosqich ko'chirilyapti,
 * ko'chirilmaganlari eski xatti-harakatda qoladi.
 */
export function getLevelLabel(level: string, t?: Dictionary): string {
  if (t) {
    switch (level) {
      case 'beginner': return t.difficulty.beginner;
      case 'elementary': return t.difficulty.elementary;
      case 'intermediate': return t.difficulty.intermediate;
      case 'advanced': return t.difficulty.advanced;
      default: return level;
    }
  }
  switch (level) {
    case 'beginner': return "Boshlang'ich";
    case 'elementary': return 'Elementar';
    case 'intermediate': return "O'rta";
    case 'advanced': return 'Yuqori';
    default: return level;
  }
}

/**
 * Ikki xil shkala bitta joyda: topshiriqlar `easy/medium/hard`,
 * kurslar `beginner/intermediate/advanced` qiymatlarini ishlatadi.
 * `level` — 1..3 tartib raqami (LevelBadge ustunchalari uchun).
 */
export function getDifficultyConfig(difficulty: string) {
  switch (difficulty) {
    case 'easy': return { label: 'Oson', class: 'badge-easy', color: '#00E676', level: 1 };
    case 'medium': return { label: "O'rta", class: 'badge-medium', color: '#FFD600', level: 2 };
    case 'hard': return { label: 'Qiyin', class: 'badge-hard', color: '#FF5252', level: 3 };
    case 'beginner': return { label: "Boshlang'ich", class: 'badge-easy', color: '#00E676', level: 1 };
    case 'intermediate': return { label: "O'rta", class: 'badge-medium', color: '#FFD600', level: 2 };
    case 'advanced': return { label: 'Yuqori', class: 'badge-hard', color: '#FF5252', level: 3 };
    default: return { label: difficulty, class: '', color: '#94A3B8', level: 1 };
  }
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    programming: 'Dasturlash',
    frontend: 'Frontend',
    computer_literacy: 'Kompyuter savodxonligi',
    prompt_engineering: 'Prompt Engineering',
    python: 'Python',
    basics: 'Asoslar',
    algorithms: 'Algoritmlar',
    data_structures: "Ma'lumotlar tuzilmasi",
    arrays: 'Massivlar',
    strings: 'Satrlar',
    math: 'Matematika',
  };
  return map[category] || category;
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `CERT-${year}-${random}`;
}

export function calculateXpLevel(xp: number): { level: string; progress: number; nextThreshold: number } {
  if (xp >= 1000) return { level: 'advanced', progress: 100, nextThreshold: 1000 };
  if (xp >= 500) return { level: 'intermediate', progress: ((xp - 500) / 500) * 100, nextThreshold: 1000 };
  if (xp >= 200) return { level: 'elementary', progress: ((xp - 200) / 300) * 100, nextThreshold: 500 };
  return { level: 'beginner', progress: (xp / 200) * 100, nextThreshold: 200 };
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Fayl hajmini o'qiladigan ko'rinishga o'tkazadi: 5242880 → "5.0 MB" */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}
