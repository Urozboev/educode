import { getDifficultyConfig } from "@/lib/utils";

/**
 * Kurs/topshiriq darajasi.
 *
 * Rangli "pill" o'rniga uch bosqichli ustuncha ko'rsatkichi: daraja tartibli
 * qiymat (boshlang'ich → o'rta → yuqori), shuning uchun ustunchalar uni
 * to'g'ridan-to'g'ri ko'rsatadi va bir qarashda taqqoslash mumkin.
 * Yorliq mono shriftda, kichik va bosiq — kurs sarlavhasi bilan raqobatlashmaydi.
 */

const TONE: Record<number, string> = {
  1: "text-neon-green",
  2: "text-neon-yellow",
  3: "text-neon-red",
};

/** Rasm/gradient banner ustida — tema tokenlari emas, qat'iy och ranglar */
const TONE_ON_DARK: Record<number, string> = {
  1: "text-[#4ade80]",
  2: "text-[#fbbf24]",
  3: "text-[#fb7185]",
};

const BAR_H = ["4px", "7px", "10px"];

export function LevelBadge({
  difficulty,
  variant = "plain",
  className = "",
}: {
  difficulty: string;
  /** `onDark` — doim qorong'i fon (kurs banneri) ustida ishlatiladi */
  variant?: "plain" | "onDark";
  className?: string;
}) {
  const { label, level } = getDifficultyConfig(difficulty || "beginner");
  const onDark = variant === "onDark";
  const tone = (onDark ? TONE_ON_DARK : TONE)[level] || "text-muted-foreground";
  const shell = onDark
    ? "bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full"
    : "";

  return (
    <span className={`inline-flex items-center gap-1.5 ${tone} ${shell} ${className}`}>
      <span aria-hidden className="flex items-end gap-[2px]">
        {BAR_H.map((h, i) => (
          <span
            key={h}
            className={`w-[3px] rounded-[1px] ${
              i < level ? "bg-current" : "bg-current opacity-20"
            }`}
            style={{ height: h }}
          />
        ))}
      </span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.09em]">
        {label}
      </span>
    </span>
  );
}
