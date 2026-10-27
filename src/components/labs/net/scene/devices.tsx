"use client";

/**
 * Tarmoq qurilmalarining SVG chizmalari.
 *
 * Har qurilma (0, 0) markaz atrofida chiziladi — sahna uni `translate`
 * bilan joyiga qo'yadi. Ko'rinish atayin tanish: monitor, portli
 * kommutator, antennali router, server shkafi. Talaba ekranda nimani
 * ko'rsa, laboratoriyada ham shuni ko'rishi kerak.
 *
 * `active` — qurilma hozir ishlayapti (chiroqlar yonadi, chegarasi
 * ajralib turadi); `dim` — bu qadamda qurilma rol o'ynamaydi.
 */

export type DeviceKind = "pc" | "laptop" | "phone" | "server" | "switch" | "hub" | "router" | "cloud" | "ap" | "firewall" | "tap";

const BODY = "fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600";
const DARK = "fill-slate-700 dark:fill-slate-900";
const SCREEN = "fill-sky-900 dark:fill-slate-950";

export function deviceHalfHeight(kind: DeviceKind): number {
  return { pc: 30, laptop: 24, phone: 26, server: 40, switch: 16, hub: 16, router: 24, cloud: 32, ap: 18, firewall: 26, tap: 5 }[kind];
}

export function Device({ kind, active, dim }: { kind: DeviceKind; active?: boolean; dim?: boolean }) {
  const led = active ? "fill-emerald-400" : "fill-slate-300 dark:fill-slate-600";
  const ring = active ? "stroke-neon-purple" : "";
  return (
    <g opacity={dim ? 0.35 : 1} style={{ transition: "opacity .3s" }}>
      {kind === "pc" && (
        <>
          <rect x={-30} y={-30} width={60} height={42} rx={4} strokeWidth={active ? 3 : 1.5} className={`${BODY} ${ring}`} />
          <rect x={-25} y={-25} width={50} height={31} rx={2} className={SCREEN} />
          <rect x={-25} y={-25} width={50} height={8} rx={2} className="fill-sky-700/60 dark:fill-slate-800" />
          <rect x={-6} y={12} width={12} height={9} className={DARK} />
          <rect x={-17} y={20} width={34} height={5} rx={2} className={DARK} />
          {active && <circle cx={22} cy={8} r={2} className="fill-emerald-400" />}
        </>
      )}
      {kind === "laptop" && (
        <>
          <rect x={-26} y={-24} width={52} height={34} rx={4} strokeWidth={active ? 3 : 1.5} className={`${BODY} ${ring}`} />
          <rect x={-21} y={-19} width={42} height={24} rx={2} className={SCREEN} />
          <path d="M -34 12 L 34 12 L 30 20 L -30 20 Z" className={DARK} />
        </>
      )}
      {kind === "phone" && (
        <>
          <rect x={-14} y={-26} width={28} height={52} rx={6} strokeWidth={active ? 3 : 1.5} className={`${DARK} ${active ? "stroke-neon-purple" : "stroke-slate-500"}`} />
          <rect x={-11} y={-20} width={22} height={38} rx={2} className="fill-sky-900" />
        </>
      )}
      {kind === "server" && (
        <>
          <rect x={-24} y={-40} width={48} height={80} rx={5} strokeWidth={active ? 3 : 1.5} className={`fill-slate-700 dark:fill-slate-900 ${active ? "stroke-neon-purple" : "stroke-slate-500"}`} />
          {[-28, -10, 8].map((y) => (
            <g key={y}>
              <rect x={-18} y={y} width={36} height={13} rx={2} className="fill-slate-600 dark:fill-slate-800" />
              <circle cx={12} cy={y + 6.5} r={2} className={led} />
              <rect x={-14} y={y + 5} width={16} height={3} rx={1} className="fill-slate-500" />
            </g>
          ))}
        </>
      )}
      {(kind === "switch" || kind === "hub") && (
        <>
          <rect x={-62} y={-16} width={124} height={32} rx={5} strokeWidth={active ? 3 : 1.5}
            className={`${kind === "hub" ? "fill-amber-50 stroke-amber-400 dark:fill-amber-950/60" : "fill-sky-50 stroke-sky-400 dark:fill-sky-950/60"} ${active ? "!stroke-neon-purple" : ""}`} />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <rect x={-54 + i * 13} y={-5} width={10} height={9} rx={1} className="fill-slate-700 dark:fill-slate-950" />
              <circle cx={-49 + i * 13} cy={-10} r={1.6} className={active ? (kind === "hub" ? "fill-amber-400" : "fill-emerald-400") : "fill-slate-300 dark:fill-slate-600"} />
            </g>
          ))}
          <text x={56} y={11} textAnchor="end" fontSize="7" fontWeight={800} className={kind === "hub" ? "fill-amber-600" : "fill-sky-600"}>{kind === "hub" ? "HUB" : "SWITCH"}</text>
        </>
      )}
      {kind === "router" && (
        <>
          <line x1={-26} y1={-14} x2={-34} y2={-34} strokeWidth={3} strokeLinecap="round" className="stroke-slate-500" />
          <line x1={26} y1={-14} x2={34} y2={-34} strokeWidth={3} strokeLinecap="round" className="stroke-slate-500" />
          <rect x={-42} y={-14} width={84} height={34} rx={8} strokeWidth={active ? 3 : 1.5}
            className={`fill-violet-50 stroke-violet-400 dark:fill-violet-950/60 ${active ? "!stroke-neon-purple" : ""}`} />
          {[-24, -14, -4, 6].map((x, i) => <circle key={x} cx={x} cy={3} r={2.2} className={active && i < 3 ? "fill-emerald-400" : led} />)}
          <text x={34} y={8} textAnchor="end" fontSize="7" fontWeight={800} className="fill-violet-600">ROUTER</text>
        </>
      )}
      {kind === "ap" && (
        <>
          <ellipse cx={0} cy={6} rx={28} ry={11} strokeWidth={active ? 3 : 1.5} className={`${BODY} ${ring}`} />
          {[10, 17].map((r) => (
            <path key={r} d={`M ${-r} ${-4 - r / 2} A ${r} ${r} 0 0 1 ${r} ${-4 - r / 2}`} fill="none" strokeWidth={2.5} strokeLinecap="round" className={active ? "stroke-emerald-500" : "stroke-slate-400"} />
          ))}
          <circle cx={0} cy={-6} r={2.5} className={active ? "fill-emerald-500" : "fill-slate-400"} />
        </>
      )}
      {kind === "firewall" && (
        <>
          <rect x={-30} y={-26} width={60} height={52} rx={6} strokeWidth={active ? 3 : 1.5} className={`fill-orange-50 stroke-orange-400 dark:fill-orange-950/50 ${active ? "!stroke-neon-purple" : ""}`} />
          {/* g'isht devor: toq qatorlar yarim g'ishtga siljigan */}
          {[
            [[-24, 14], [-8, 14], [8, 14]],
            [[-24, 6], [-16, 14], [0, 14], [16, 6]],
            [[-24, 14], [-8, 14], [8, 14]],
          ].map((row, r) => row.map(([x, w]) => (
            <rect key={`${r}-${x}`} x={x} y={-18 + r * 13} width={w} height={11} rx={1.5} className="fill-orange-400/80" />
          )))}
        </>
      )}
      {kind === "tap" && <circle r={5} className="fill-slate-400 dark:fill-slate-500" />}
      {kind === "cloud" && (
        <path d="M -36 22 C -58 22 -58 -6 -38 -6 C -36 -26 -10 -32 2 -18 C 12 -32 40 -26 38 -6 C 58 -4 56 22 36 22 Z"
          strokeWidth={active ? 3 : 1.5} className={`fill-sky-50 stroke-sky-300 dark:fill-sky-950/50 dark:stroke-sky-700 ${active ? "!stroke-neon-purple" : ""}`} />
      )}
    </g>
  );
}
