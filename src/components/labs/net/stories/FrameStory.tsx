"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Ethernet kadri: maydonlar ketma-ket, keyin kommutator va qabul qiluvchi ularni qanday ishlatadi. */

const FIELDS = [
  { k: "pre", t: "Preambula", n: "8 B", c: "bg-slate-500/15" },
  { k: "dst", t: "Qabul qiluvchi MAC", n: "6 B", c: "bg-sky-500/20" },
  { k: "src", t: "Yuboruvchi MAC", n: "6 B", c: "bg-indigo-500/20" },
  { k: "type", t: "Turi", n: "2 B", c: "bg-amber-500/20" },
  { k: "data", t: "Ma'lumot", n: "46–1500 B", c: "bg-emerald-500/20" },
  { k: "fcs", t: "FCS (CRC)", n: "4 B", c: "bg-rose-500/20" },
];

function Frame({ on, values }: { on?: string; values?: Partial<Record<string, string>> }) {
  return (
    <div className="flex flex-wrap gap-1 text-xs">
      {FIELDS.map((f) => (
        <div key={f.k} className={`rounded-lg px-2 py-1.5 ${f.c} ${on === f.k ? "ring-2 ring-neon-purple font-semibold" : on ? "opacity-50" : ""} ${f.k === "data" ? "grow min-w-[110px]" : ""}`}>
          <div>{f.t}</div>
          <div className="font-mono text-[11px] text-muted-foreground">{values?.[f.k] ?? f.n}</div>
        </div>
      ))}
    </div>
  );
}

const V = { dst: "BB:22:…", src: "AA:11:…", type: "0x0800 (IPv4)", data: "IP paket", fcs: "3F A1 9C 07" };

const nodes: SceneNode[] = [
  { id: "A", kind: "pc", x: 90, y: 160, label: "A", sub: "AA:11:…" },
  { id: "sw", kind: "switch", x: 380, y: 160, label: "Kommutator" },
  { id: "B", kind: "pc", x: 670, y: 90, label: "B", sub: "BB:22:…" },
  { id: "C", kind: "pc", x: 670, y: 240, label: "C", sub: "CC:33:…" },
];
const links: SceneLink[] = [{ a: "A", b: "sw" }, { a: "sw", b: "B" }, { a: "sw", b: "C" }];

const steps: Step[] = [
  { say: "Ethernet da ma'lumot «kadr» deb ataladigan konvertda yuboriladi. Konvertning har bo'lagi o'z vazifasini bajaradi.", panel: <Frame values={V} /> },
  { say: "Preambula — 10101010… ketma-ketligi: qabul qiluvchiga «kadr boshlanyapti, soatingni moslab ol» deydi.", panel: <Frame on="pre" values={{ ...V, pre: "1010…1011" }} /> },
  {
    say: "Birinchi navbatda qabul qiluvchi MAC turadi. Kommutator kadrning boshini o'qishi bilanoq qaysi portga yuborishni biladi.",
    flights: [{ from: "A", to: "B", label: "→ BB:22" }],
    panel: <Frame on="dst" values={V} />,
    ask: { q: "Kommutator kadrni qaysi portga yuborishni qaysi maydonga qarab hal qiladi?", options: ["Yuboruvchi MAC", "Qabul qiluvchi MAC", "Turi", "FCS"], answer: 1, explain: "Qabul qiluvchi MAC — u kadr boshida turadi, shuning uchun kommutator tez qaror qiladi." },
  },
  {
    say: "Yuboruvchi MAC — kommutator undan «A shu portda» deb o'rganadi. «Turi» 0x0800 — ichida IPv4 paket bor (0x0806 bo'lsa — ARP).",
    panel: <Frame on="type" values={V} />,
    ask: { q: "Kadrda 0x0806 turi bor. Ichida nima?", options: ["IPv4", "ARP", "IPv6"], answer: 1, explain: "0x0800 — IPv4, 0x0806 — ARP, 0x86DD — IPv6." },
  },
  {
    say: "Ma'lumot maydoni kamida 46 bayt bo'ladi (kam bo'lsa to'ldiriladi) va ko'pi bilan 1500 bayt (MTU). Undan katta paket bo'laklarga bo'linadi.",
    panel: <Frame on="data" values={V} />,
    ask: { q: "Ethernet kadrining minimal umumiy uzunligi (preambulasiz)?", options: ["46 B", "64 B", "1500 B", "1518 B"], answer: 1, explain: "6 + 6 + 2 + 46 + 4 = 64 bayt. Maksimal — 1518 bayt." },
  },
  {
    say: "FCS — oxirgi 4 bayt, kadrdan hisoblangan CRC. Yo'lda shovqin bitta bitni o'zgartirdi: B o'zi hisoblagan CRC bilan FCS mos kelmadi va kadrni tashladi.",
    flights: [{ from: "A", to: "B", label: "kadr ⚡", tone: "red" }],
    marks: { B: { text: "CRC mos emas → tashlandi", tone: "drop", at: 2.2 } },
    panel: <Frame on="fcs" values={{ ...V, fcs: "3F A1 9C 07 ≠ 81 0D 22 E4" }} />,
  },
  { say: "Xulosa: Qabul qiluvchi MAC (6) + Yuboruvchi MAC (6) + Turi (2) + Ma'lumot (46–1500) + FCS (4) = 64–1518 bayt. Kommutator MAC larni o'qiydi, qabul qiluvchi FCS bilan butunligini tekshiradi.", panel: <Frame values={V} /> },
];

export default function FrameStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={310} title="Ethernet kadri ichida nima bor?" />;
}
