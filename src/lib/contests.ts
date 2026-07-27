export type ContestStatus = "upcoming" | "running" | "ended";

export function contestStatus(startsAt: string, endsAt: string, now = Date.now()): ContestStatus {
  const s = new Date(startsAt).getTime();
  const e = new Date(endsAt).getTime();
  if (now < s) return "upcoming";
  if (now > e) return "ended";
  return "running";
}

export const STATUS_LABEL: Record<ContestStatus, string> = {
  upcoming: "Boshlanmagan",
  running: "Davom etmoqda",
  ended: "Tugagan",
};

/** Musobaqagacha / tugashigacha qolgan vaqt: "2 kun 4 soat", "12:34:56" */
export function countdown(target: string, now = Date.now()): string {
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return "00:00:00";

  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (days > 0) return `${days} kun ${h} soat`;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Jarima vaqtini o'qiladigan ko'rinishga: 145 → "2:25" */
export function formatPenalty(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}` : `${m}`;
}

/** Musobaqa davomiyligi: "3 soat", "1 kun 2 soat" */
export function contestDuration(startsAt: string, endsAt: string): string {
  const mins = Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000
  );
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const rest = mins % 60;
  if (days > 0) return hours > 0 ? `${days} kun ${hours} soat` : `${days} kun`;
  if (hours > 0) return rest > 0 ? `${hours} soat ${rest} daq` : `${hours} soat`;
  return `${rest} daqiqa`;
}

/** Sana va vaqt: "12-avgust, 15:00" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("uz-UZ", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
