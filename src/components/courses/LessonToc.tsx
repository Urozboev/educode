"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem { id: string; text: string; level: 2 | 3 }

/**
 * Dars HTML'idagi h2/h3 larga barqaror `id` qo'yadi va mundarija ro'yxatini
 * qaytaradi. Mavjud id saqlanadi. HTML bazadan keladi (admin yozgan),
 * shuning uchun faqat ochiluvchi tegga atribut qo'shiladi — matnga tegilmaydi.
 */
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let n = 0;
  const out = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi, (m, lvl: string, attrs = "", inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    if (!text) return m;
    const existing = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
    const id = existing || `bolim-${++n}`;
    toc.push({ id, text, level: Number(lvl) as 2 | 3 });
    return existing ? m : `<h${lvl} id="${id}"${attrs}>${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

/** Qaysi bo'lim o'qilyapti — ekranning yuqori uchdan biriga kirgan oxirgi sarlavha */
export function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    if (!ids.length) return;
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [ids]);
  return active;
}

export function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

/** Mundarija ro'yxati — o'ng ustunda ham, telefondagi ochiluvchi blokda ham */
export default function LessonToc({
  items, active, onPick, className,
}: { items: TocItem[]; active: string | null; onPick?: () => void; className?: string }) {
  return (
    <ol className={cn("space-y-0.5 border-l border-border", className)}>
      {items.map((it) => (
        <li key={it.id}>
          <a
            href={`#${it.id}`}
            onClick={(e) => { e.preventDefault(); scrollToHeading(it.id); onPick?.(); }}
            aria-current={active === it.id ? "location" : undefined}
            className={cn(
              "-ml-px block border-l-2 py-1.5 pr-2 text-[0.85rem] leading-snug transition-colors",
              it.level === 3 ? "pl-6 text-[0.8rem]" : "pl-3.5",
              active === it.id
                ? "border-neon-purple text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30",
            )}
          >
            {it.text}
          </a>
        </li>
      ))}
    </ol>
  );
}
