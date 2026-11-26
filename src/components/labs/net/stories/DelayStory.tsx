"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Kechikish ikki qismdan: bitlarni "itarish" (uzatish) va yo'lda yurish (tarqalish). */

function Bars({ tx, prop, note }: { tx: number; prop: number; note: string }) {
  const total = tx + prop;
  const fmt = (s: number) => (s >= 1 ? `${s.toFixed(2)} s` : `${(s * 1000).toFixed(s < 0.001 ? 3 : 1)} ms`);
  return (
    <div className="space-y-1.5 max-w-xl">
      {[["Uzatish", tx, "bg-neon-purple"], ["Tarqalish", prop, "bg-sky-500"]].map(([k, v, c]) => (
        <div key={k as string} className="grid grid-cols-[80px,1fr,80px] items-center gap-2 text-xs">
          <span className="text-muted-foreground">{k as string}</span>
          <div className="h-4 rounded-full bg-surface overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: `${Math.max(1.5, ((v as number) / total) * 100)}%` }} /></div>
          <span className="font-mono text-right">{fmt(v as number)}</span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

const nodes: SceneNode[] = [
  { id: "pc", kind: "pc", x: 85, y: 175, label: "Toshkent", sub: "talaba" },
  { id: "r1", kind: "router", x: 240, y: 175, label: "Provayder" },
  { id: "sea", kind: "cloud", x: 430, y: 175, label: "Okean osti kabeli", sub: "~10 000 km" },
  { id: "r2", kind: "router", x: 610, y: 175 },
  { id: "srv", kind: "server", x: 700, y: 175, label: "Nyu-York" },
];
const links: SceneLink[] = [{ a: "pc", b: "r1" }, { a: "r1", b: "sea" }, { a: "sea", b: "r2" }, { a: "r2", b: "srv" }];

const steps: Step[] = [
  {
    say: "Talaba Nyu-Yorkdagi serverga 10 MB fayl yuboradi, kanal 100 Mbit/s. Vaqt ikki qismdan iborat: bitlarni kabelga «itariş» (uzatiş) va signalning yölni bosib ötişi (tarqaliş).",
    flights: [{ from: "pc", to: "srv", label: "10 MB" }],
  },
  {
    say: "Uzatiş vaqti = hajm ÷ tezlik. 10 MB = 80 Mbit; 80 ÷ 100 = 0,8 s. Şunça vaqt kompyuter bitlarni birin-ketin çiqarib turadi.",
    ask: { q: "10 MB faylni 100 Mbit/s kanalga uzatiş qança vaqt oladi?", options: ["0,1 s", "0,8 s", "8 s", "80 s"], answer: 1, hint: "Avval MB ni Mbit ga ötkazing: × 8.", explain: "10 × 8 = 80 Mbit; 80 ÷ 100 = 0,8 s." },
    panel: <Bars tx={0.8} prop={0.05} note="Katta fayl: asosiy vaqt uzatişga ketadi." />,
  },
  {
    say: "Tarqaliş vaqti = masofa ÷ signal tezligi. Optik tolada yoruğlik ~200 000 km/s yuradi: 10 000 km ÷ 200 000 km/s = 0,05 s = 50 ms. Bu vaqtni heç qanday tezroq kanal qisqartira olmaydi.",
    ask: { q: "10 000 km optik kabelda signal qança vaqt yuradi?", options: ["5 ms", "50 ms", "500 ms"], answer: 1, explain: "10 000 ÷ 200 000 = 0,05 s = 50 ms." },
    panel: <Bars tx={0.8} prop={0.05} note="Jami ≈ 0,85 s." />,
  },
  {
    say: "Endi kiçik xabar — 100 baytli çat xabari. Uni 1 Gbit/s kanalga itariş atigi 0,8 mikrosekund, lekin yöl baribir 50 ms. Bu yerda vaqtning deyarli hammasi tarqalişga ketadi.",
    flights: [{ from: "pc", to: "srv", label: "salom!", tone: "green" }],
    panel: <Bars tx={0.0000008} prop={0.05} note="Kiçik xabar: asosiy vaqt yölda." />,
    ask: { q: "Kanal tezligini 10 baravar oşirsak, qaysi holatda vaqt sezilarli qisqaradi?", options: ["10 MB fayl", "100 baytli çat xabari", "Ikkalasida bir xil"], answer: 0, explain: "Katta faylda asosiy qism — uzatiş, u tezlikka boğliq. Kiçik xabarda esa vaqt yölda ketadi, tezroq kanal yordam bermaydi." },
  },
  { say: "Xulosa: jami keçikiş ≈ uzatiş (hajm ÷ tezlik) + tarqaliş (masofa ÷ signal tezligi). Katta fayllar uçun tezroq kanal, uzoq masofali öyin va qönğiroqlar uçun esa yaqinroq server muhim." },
];

export default function DelayStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={290} title="Paket Nyu-Yorkka qança vaqtda yetadi?" />;
}
