"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Tone = "amber" | "coral";

const TONE = {
  amber: {
    text: "text-[#e3a008]",
    dot: "bg-[#e3a008]",
    halo: "hsl(35 90% 52% / 0.18)",
  },
  coral: {
    text: "text-[#f0655c]",
    dot: "bg-[#f0655c]",
    halo: "hsl(3 80% 60% / 0.18)",
  },
} satisfies Record<Tone, { text: string; dot: string; halo: string }>;

export type ErrorTerminalProps = {
  /** HTTP kodi — terminalda va sahifa ustida ko'rinadi */
  code: string;
  /** Mashina o'qiydigan xato nomi, masalan ROUTE_NOT_FOUND */
  token: string;
  /** Terminalga "yozilgan" buyruq */
  command: string;
  /** Buyruqdan keyingi bajarilish qatorlari */
  steps: string[];
  /** Qo'shimcha texnik qator (masalan digest) */
  detail?: string;
  title: string;
  description: string;
  tone?: Tone;
  /** Harakat tugmalari */
  children: ReactNode;
};

/**
 * Xato sahifalarining imzo elementi: xatoni terminal chiqishi sifatida
 * ko'rsatadi. Platforma dasturlashni o'rgatgani uchun xato xabari ham
 * o'quvchi kundalik ko'radigan tilda — stack trace ko'rinishida.
 */
export function ErrorTerminal({
  code,
  token,
  command,
  steps,
  detail,
  title,
  description,
  tone = "amber",
  children,
}: ErrorTerminalProps) {
  const t = TONE[tone];
  const line = (i: number) => ({
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, delay: 0.25 + i * 0.28, ease: "easeOut" as const },
  });

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Muharrir katakchalari — juda past kontrastli fon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-2xl">
        {/* ===== Terminal ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden shadow-terminal border border-black/10 dark:border-white/10"
          style={{ boxShadow: `0 0 0 1px ${t.halo}, 0 28px 70px -20px rgba(10,12,24,0.45)` }}
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/[0.07]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-[#7d8590]">
              educode — bash
            </span>
            <span
              className={`ml-auto font-mono text-xs font-semibold ${t.text}`}
            >
              exit {code}
            </span>
          </div>

          <div className="bg-[#0d1117] px-4 py-5 sm:px-6 sm:py-6 font-mono text-[13px] sm:text-sm leading-[1.9]">
            <motion.p {...line(0)} className="text-[#c9d1d9] break-all">
              <span className={`${t.text} select-none`}>$</span>{" "}
              <span className="text-[#79c0ff]">{command}</span>
            </motion.p>

            {steps.map((s, i) => (
              <motion.p key={s} {...line(i + 1)} className="text-[#7d8590]">
                <span className="select-none">→ </span>
                {s}
              </motion.p>
            ))}

            <motion.p
              {...line(steps.length + 1)}
              className={`${t.text} font-semibold mt-2`}
            >
              <span className="select-none">✖ </span>
              {code} — {token}
            </motion.p>

            {detail && (
              <motion.p
                {...line(steps.length + 2)}
                className="text-[#484f58] break-all pl-4"
              >
                {detail}
              </motion.p>
            )}

            <motion.p
              {...line(steps.length + (detail ? 3 : 2))}
              className="text-[#c9d1d9] mt-2"
            >
              <span className={`${t.text} select-none`}>$</span>{" "}
              <span className={`inline-block w-[9px] h-[1.05em] align-[-0.18em] ${t.dot} animate-caret`} />
            </motion.p>
          </div>
        </motion.div>

        {/* ===== Tushuntirish va harakatlar ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 + (steps.length + 3) * 0.28 }}
          className="mt-10 text-center"
        >
          <p className="eyebrow">{token.toLowerCase().replace(/_/g, " ")}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto text-balance">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
