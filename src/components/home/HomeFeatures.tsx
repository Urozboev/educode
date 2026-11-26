"use client";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MessageCircleQuestion, CheckCheck, Terminal, Presentation, Trophy, QrCode } from "lucide-react";
import { handFont } from "./fonts";

/**
 * Imkoniyatlar — varaqqa lenta bilan yopishtirilgan kartochkalar.
 *
 * Har biri biroz qiyshiq turadi (qo'lda yopishtirilgandek), sichqoncha
 * olib borilganda to'g'rilanadi. Animatsiya faqat foydalanuvchi harakatiga
 * javob — sahifa ochilganda hech narsa "uchib kirmaydi".
 */
export default function HomeFeatures() {
  const { t } = useI18n();
  const l = t.landing;

  const items = [
    { Icon: MessageCircleQuestion, title: l.f1t, text: l.f1x, tone: "text-neon-blue", tilt: "-rotate-[1.4deg]" },
    { Icon: CheckCheck, title: l.f2t, text: l.f2x, tone: "text-neon-green", tilt: "rotate-[0.8deg]" },
    { Icon: Terminal, title: l.f3t, text: l.f3x, tone: "text-neon-purple", tilt: "-rotate-[0.6deg]" },
    { Icon: Presentation, title: l.f4t, text: l.f4x, tone: "text-neon-pink", tilt: "rotate-[1.2deg]" },
    { Icon: Trophy, title: l.f5t, text: l.f5x, tone: "text-neon-yellow", tilt: "-rotate-[1deg]" },
    { Icon: QrCode, title: l.f6t, text: l.f6x, tone: "text-neon-red", tilt: "rotate-[0.5deg]" },
  ];

  return (
    <section className={cn("py-20 md:py-28 px-5", handFont.variable)}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr,1.2fr] gap-6 md:gap-16 items-end mb-14">
          <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-[-0.04em] leading-[0.95]">
            {l.featuresTitle}
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-md">{l.featuresLead}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
          {items.map(({ Icon, title, text, tone, tilt }) => (
            <article
              key={title}
              className={cn(
                "relative rounded-xl bg-card border border-border/80 px-6 pt-8 pb-6",
                "shadow-[0_14px_30px_-22px_hsl(var(--shadow-color)/0.55)]",
                "transition-transform duration-300 hover:rotate-0 hover:-translate-y-1",
                tilt,
              )}
            >
              <span className="tape" aria-hidden />
              <Icon className={cn("w-7 h-7 mb-4", tone)} strokeWidth={1.8} />
              <h3 className="font-display font-bold text-xl tracking-tight mb-2">{title}</h3>
              <p className="text-[0.95rem] text-foreground/70 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
