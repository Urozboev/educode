import * as React from "react";

/**
 * Kurs kategoriyalari uchun chizma ikonkalar.
 * Emoji (🐍 💻 ⚛️) o'rniga — emoji har OS'da boshqacha ko'rinadi, rangini
 * temaga moslay olmaydi va tugma matni bilan bir uslubda turmaydi.
 *
 * Barchasi bitta uslubda: 24×24 to'r, faqat kontur, `currentColor`.
 * Shu sababli ular joylashgan tugmaning matn rangini meros qilib oladi va
 * ikkala temada ham to'g'ri ko'rinadi.
 */

type Props = React.SVGProps<SVGSVGElement> & {
  size?: number;
  category: string;
};

export function CategoryIcon({ category, size = 18, ...rest }: Props) {
  const common: React.SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...rest,
  };

  switch (category) {
    case "all":
      return <AllIcon {...common} />;
    case "python":
      return <PythonIcon {...common} />;
    case "programming":
      return <ProgrammingIcon {...common} />;
    case "frontend":
      return <FrontendIcon {...common} />;
    case "computer_literacy":
      return <ComputerIcon {...common} />;
    case "algorithms":
      return <AlgorithmsIcon {...common} />;
    case "prompt_engineering":
      return <PromptIcon {...common} />;
    default:
      return <BookIcon {...common} />;
  }
}

/** Barchasi — to'rtta kartochka, biri to'ldirilgan (tanlangan to'plam) */
function AllIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" stroke="none" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

/**
 * Python — ilon. Rasmiy ikki halqali logo 17px'da loyqa ko'rinadi,
 * shuning uchun soddalashtirilgan S-tanali ilon chizildi.
 */
function PythonIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <path d="M5 20.2h7a4.35 4.35 0 0 0 0-8.7H9.2a3.85 3.85 0 0 1 0-7.7h5.4" />
      <circle cx="16.4" cy="3.8" r="2" />
      <circle cx="17.1" cy="3.3" r="0.6" fill="currentColor" stroke="none" />
      <path d="m18.3 5.1 1.9.8m-1.9-.8 1 1.7" />
    </svg>
  );
}

/** Dasturlash — burchak qavslar va kursor bloki */
function ProgrammingIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <path d="m7.5 8-4 4 4 4" />
      <path d="m16.5 8 4 4-4 4" />
      <path d="M13.5 6.5 10.5 17.5" />
    </svg>
  );
}

/** Frontend — brauzer oynasi, ichida orbit (komponent daraxti) */
function FrontendIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M2.5 8.5h19" />
      <circle cx="5.4" cy="6.2" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.2" r="1.6" />
      <ellipse cx="12" cy="14.2" rx="6" ry="2.6" />
    </svg>
  );
}

/** Kompyuter savodxonligi — monitor va sichqoncha ko'rsatkichi */
function ComputerIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <rect x="2.5" y="3.5" width="19" height="13" rx="2.5" />
      <path d="M9 20.5h6M12 16.5v4" />
      <path d="m9.5 7 2.2 6.2 1.2-2.4 2.4-1.2z" fill="currentColor" />
    </svg>
  );
}

/** Algoritmlar — qaror daraxti: bitta kirish, ikkiga tarmoqlanish */
function AlgorithmsIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <circle cx="12" cy="4.5" r="2.2" />
      <circle cx="5.5" cy="19.5" r="2.2" />
      <circle cx="18.5" cy="19.5" r="2.2" />
      <path d="M12 6.7v3.1a2 2 0 0 1-.6 1.5l-4 4a2 2 0 0 0-.6 1.4v.6" />
      <path d="M12 6.7v3.1a2 2 0 0 0 .6 1.5l4 4a2 2 0 0 1 .6 1.4v.6" />
    </svg>
  );
}

/** Prompt muhandisligi — suhbat oynasi ichida kursor */
function PromptIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <path d="M21 12.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 3v-3.9A7.5 7.5 0 0 1 8 5.5h5.5A7.5 7.5 0 0 1 21 12.5Z" />
      <path d="M9 12.5h1.5M14 9.5v6" />
    </svg>
  );
}

/** Zaxira — ochiq kitob */
function BookIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <path d="M12 6.5C10.5 5 8.4 4.3 4.5 4.3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1c3.9 0 6 .7 7.5 2.2 1.5-1.5 3.6-2.2 7.5-2.2a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1c-3.9 0-6 .7-7.5 2.2Z" />
      <path d="M12 6.5v14" />
    </svg>
  );
}
