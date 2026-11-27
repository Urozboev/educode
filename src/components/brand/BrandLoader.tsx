/**
 * Logo asosidagi yuklanish animatsiyasi (route loading.tsx va PWA splash).
 *
 * Ketma-ketlik (bir sikl ~2,6 s, yuklanish davom etsa takrorlanadi):
 *   1. Ikki kod qavsi markazdan chiqib, X o'qi atrofida qarama-qarshi
 *      tomonlarga aylanadi
 *   2. "M" chizilib paydo bo'ladi
 *   3. Pastdagi "MirAcademy" yozuvi xira turadi va chapdan o'ngga brend
 *      rangi bilan to'lib boradi
 *
 * Qavslar va M alohida <svg> qatlamlar: SVG ichidagi <g> larga 3D
 * aylantirish brauzerlarda tekis chiqadi, alohida element esa haqiqiy
 * perspektiva bilan aylanadi. Yo'llar BrandMark bilan bir xil.
 *
 * Server komponent — JavaScript yo'q, faqat CSS (globals.css: .brand-loader).
 * "Kamroq harakat" sozlamasida animatsiyalar o'chadi, logo to'liq turadi.
 */
export default function BrandLoader({ className = "" }: { className?: string }) {
  const svg = { viewBox: "0 0 512 512", fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div className={`brand-loader ${className}`} role="status" aria-label="Yuklanmoqda">
      <div className="brand-loader__tile">
        <svg {...svg} className="brand-loader__part brand-loader__left" aria-hidden="true">
          <path strokeWidth={34} opacity={0.85} d="M152 176 L96 256 L152 336" />
        </svg>
        <svg {...svg} className="brand-loader__part brand-loader__right" aria-hidden="true">
          <path strokeWidth={34} opacity={0.85} d="M360 176 L416 256 L360 336" />
        </svg>
        <svg {...svg} className="brand-loader__part" aria-hidden="true">
          <path className="brand-loader__m" strokeWidth={46} pathLength={1} d="M196 340 L196 172 L256 268 L316 172 L316 340" />
        </svg>
      </div>
      <div className="brand-loader__name" aria-hidden="true">
        <span>MirAcademy</span>
        <span className="brand-loader__fill">MirAcademy</span>
      </div>
    </div>
  );
}
