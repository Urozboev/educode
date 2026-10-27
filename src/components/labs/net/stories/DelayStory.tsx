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
    say: "Talaba Nyu-Yorkdagi serverga 10 MB fayl yuboradi, kanal 100 Mbit/s. Vaqt ikki qismdan iborat: bitlarni kabelga «itarish» (uzatish) va signalning yo'lni bosib o'tishi (tarqalish).",
    flights: [{ from: "pc", to: "srv", label: "10 MB" }],
  },
  {
    say: "Uzatish vaqti = hajm ÷ tezlik. 10 MB = 80 Mbit; 80 ÷ 100 = 0,8 s. Shuncha vaqt kompyuter bitlarni birin-ketin chiqarib turadi.",
    ask: { q: "10 MB faylni 100 Mbit/s kanalga uzatish qancha vaqt oladi?", options: ["0,1 s", "0,8 s", "8 s", "80 s"], answer: 1, hint: "Avval MB ni Mbit ga o'tkazing: × 8.", explain: "10 × 8 = 80 Mbit; 80 ÷ 100 = 0,8 s." },
    panel: <Bars tx={0.8} prop={0.05} note="Katta fayl: asosiy vaqt uzatishga ketadi." />,
  },
  {
    say: "Tarqalish vaqti = masofa ÷ signal tezligi. Optik tolada yorug'lik ~200 000 km/s yuradi: 10 000 km ÷ 200 000 km/s = 0,05 s = 50 ms. Bu vaqtni hech qanday tezroq kanal qisqartira olmaydi.",
    ask: { q: "10 000 km optik kabelda signal qancha vaqt yuradi?", options: ["5 ms", "50 ms", "500 ms"], answer: 1, explain: "10 000 ÷ 200 000 = 0,05 s = 50 ms." },
    panel: <Bars tx={0.8} prop={0.05} note="Jami ≈ 0,85 s." />,
  },
  {
    say: "Endi kichik xabar — 100 baytli chat xabari. Uni 1 Gbit/s kanalga itarish atigi 0,8 mikrosekund, lekin yo'l baribir 50 ms. Bu yerda vaqtning deyarli hammasi tarqalishga ketadi.",
    flights: [{ from: "pc", to: "srv", label: "salom!", tone: "green" }],
    panel: <Bars tx={0.0000008} prop={0.05} note="Kichik xabar: asosiy vaqt yo'lda." />,
    ask: { q: "Kanal tezligini 10 baravar oshirsak, qaysi holatda vaqt sezilarli qisqaradi?", options: ["10 MB fayl", "100 baytli chat xabari", "Ikkalasida bir xil"], answer: 0, explain: "Katta faylda asosiy qism — uzatish, u tezlikka bog'liq. Kichik xabarda esa vaqt yo'lda ketadi, tezroq kanal yordam bermaydi." },
  },
  { say: "Xulosa: jami kechikish ≈ uzatish (hajm ÷ tezlik) + tarqalish (masofa ÷ signal tezligi). Katta fayllar uchun tezroq kanal, uzoq masofali o'yin va qo'ng'iroqlar uchun esa yaqinroq server muhim." },
];

export default function DelayStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={290} title="Paket Nyu-Yorkka qancha vaqtda yetadi?" />;
}
