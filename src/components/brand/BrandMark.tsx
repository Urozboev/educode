/**
 * MirAcademy belgisi — kod qavslari orasidagi "M".
 *
 * Bitta manba: brauzer yorlig'i (public/icon.svg), sayt sarlavhalari,
 * yon panel va Open Graph rasmi — hammasi shu shaklni ko'rsatadi.
 * Ilgari har joyda boshqa belgi turardi: yorliqda "M", sarlavhada
 * lucide `</>` ikonkasi, OG rasmida esa roketa emoji.
 *
 * Belgi joriy rangda (`currentColor`) chiziladi, shuning uchun uni
 * gradient plitka ichiga qo'yish yetarli — rang ota elementdan keladi.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g strokeWidth={34} opacity={0.85}>
        <path d="M152 176 L96 256 L152 336" />
        <path d="M360 176 L416 256 L360 336" />
      </g>
      <path strokeWidth={46} d="M196 340 L196 172 L256 268 L316 172 L316 340" />
    </svg>
  );
}
