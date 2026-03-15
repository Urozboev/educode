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

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'beginner': return "Boshlang'ich";
    case 'elementary': return 'Elementar';
    case 'intermediate': return "O'rta";
    case 'advanced': return 'Yuqori';
    default: return level;
  }
}

export function getDifficultyConfig(difficulty: string) {
  switch (difficulty) {
    case 'easy': return { label: 'Oson', class: 'badge-easy', color: '#00E676' };
    case 'medium': return { label: "O'rta", class: 'badge-medium', color: '#FFD600' };
    case 'hard': return { label: 'Qiyin', class: 'badge-hard', color: '#FF5252' };
    default: return { label: difficulty, class: '', color: '#94A3B8' };
  }
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    programming: 'Dasturlash',
    frontend: 'Frontend',
    computer_literacy: 'Kompyuter savodxonligi',
    prompt_engineering: 'Prompt Engineering',
    python: 'Python',
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
