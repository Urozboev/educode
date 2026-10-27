"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/** Fizik pog'ona: bitlar signalga aylanadi, shovqin bitni buzadi, CRC buni ushlaydi. */

function Wave({ bits, code, caption }: { bits: string; code: "nrz" | "manchester"; caption: string }) {
  const n = bits.length, bw = 44, W = n * bw + 20, H = 90;
  const halves: number[] = [];
  bits.split("").forEach((b) => {
    if (code === "nrz") halves.push(b === "1" ? 1 : -1, b === "1" ? 1 : -1);
    else halves.push(b === "1" ? -1 : 1, b === "1" ? 1 : -1);
  });
  const y = (v: number) => (v === 1 ? 18 : 62);
  let d = `M 10 ${y(halves[0])}`;
  halves.forEach((v, i) => {
    const x0 = 10 + (i * bw) / 2;
    if (i > 0 && v !== halves[i - 1]) d += ` L ${x0} ${y(v)}`;
    d += ` L ${x0 + bw / 2} ${y(v)}`;
  });
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{caption}</div>
      <div className="rounded-xl bg-surface/60 p-2 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-auto min-w-full" role="img" aria-label={caption}>
          {Array.from({ length: n + 1 }, (_, i) => <line key={i} x1={10 + i * bw} y1={6} x2={10 + i * bw} y2={72} className="stroke-border" strokeDasharray="3 3" />)}
          <path d={d} fill="none" strokeWidth={3} className="stroke-neon-purple" strokeLinejoin="round" />
          {bits.split("").map((b, i) => <text key={i} x={10 + i * bw + bw / 2} y={86} textAnchor="middle" fontSize="13" fontWeight={800} className="fill-foreground">{b}</text>)}
        </svg>
      </div>
    </div>
  );
}

const nodes: SceneNode[] = [
  { id: "A", kind: "pc", x: 100, y: 150, label: "Yuboruvchi" },
  { id: "B", kind: "pc", x: 660, y: 150, label: "Qabul qiluvchi" },
];
const links: SceneLink[] = [{ a: "A", b: "B", label: "mis kabel" }];

const CODING: Step[] = [
  { say: "Kompyuter 10110010 bitlarini yubormoqchi. Kabelda bit yo'q — faqat elektr kuchlanishi bor. Eng sodda kod (NRZ): 1 — yuqori kuchlanish, 0 — past.", panel: <Wave bits="10110010" code="nrz" caption="NRZ: 1 — yuqori, 0 — past" /> },
  { say: "Signal kabel bo'ylab ketdi. Qabul qiluvchi har bit vaqtida kuchlanishni o'lchab, bitlarni tiklaydi.", flights: [{ from: "A", to: "B", label: "10110010" }], marks: { B: { text: "10110010 — oldim", tone: "ok" } } },
  {
    say: "Endi sakkizta nol ketma-ket. NRZ da signal butun vaqt bir xil — tekis chiziq. Qabul qiluvchi soati sal shoshsa yoki kechiksa, nechta nol kelganini adashib sanaydi.",
    panel: <Wave bits="00000000" code="nrz" caption="NRZ: 00000000 — tekis chiziq" />,
    ask: { q: "Uzun 00000000 ketma-ketlikda NRZ kodining muammosi nimada?", options: ["Signal tezlashib ketadi", "Signal o'zgarmaydi — bitlarni sanashda adashish mumkin", "Kabel qiziydi"], answer: 1, explain: "Signalda o'zgarish bo'lmasa, qabul qiluvchi bit chegaralarini yo'qotadi (sinxronizatsiya buziladi)." },
  },
  { say: "Manchester kodi buni hal qiladi: har bit o'rtasida signal albatta o'zgaradi (0 — yuqoridan pastga, 1 — pastdan yuqoriga). Signal o'z «soati»ni o'zi olib yuradi. 10 Mbit/s Ethernet aynan shu kodni ishlatgan.", panel: <Wave bits="00000000" code="manchester" caption="Manchester: 00000000 — har bitda o'tish bor" /> },
  {
    say: "Yo'lda elektromagnit xalaqit bitta bitni buzdi: 10110010 o'rniga 10100010 yetib keldi. Qabul qiluvchi kadr oxiridagi tekshiruv qiymatini (FCS, CRC asosida) qayta hisobladi — mos kelmadi. Kadr tashlab yuborildi.",
    flights: [{ from: "A", to: "B", label: "10100010 ⚡", tone: "red" }],
    marks: { B: { text: "FCS mos emas — tashladim", tone: "drop" } },
    ask: { q: "Qabul qiluvchi kadr buzilganini qanday biladi?", options: ["IP manzildan", "Kadr oxiridagi tekshiruv qiymati (FCS/CRC) mos kelmaydi", "Kabel rangi o'zgaradi"], answer: 1, explain: "Yuboruvchi kadr bitlaridan CRC hisoblab, oxiriga qo'shadi. Qabul qiluvchi qayta hisoblaydi: mos kelmasa — kadr buzilgan." },
  },
  { say: "Buzilgan kadr yo'qoldi, lekin yuqori pog'ona (TCP) tasdiq kelmaganini sezib, ma'lumotni qayta yubordi. Bu safar to'g'ri yetib keldi.", flights: [{ from: "A", to: "B", label: "10110010 (qayta)", tone: "green" }], marks: { B: { text: "FCS to'g'ri — qabul qildim", tone: "ok" } } },
  { say: "Xulosa: bitlar kod qoidasi bilan signalga aylanadi (NRZ, Manchester…). Xalaqit bitlarni buzishi mumkin — CRC buni aniqlaydi, buzilgan kadr tashlanadi va qayta yuboriladi." },
];

// ---------- Muhitlar ----------
const MN: SceneNode[] = [
  { id: "a1", kind: "pc", x: 90, y: 70, label: "Mis kabel" }, { id: "b1", kind: "pc", x: 670, y: 70 },
  { id: "a2", kind: "pc", x: 90, y: 200, label: "Optik tola" }, { id: "b2", kind: "server", x: 670, y: 200 },
  { id: "a3", kind: "laptop", x: 90, y: 320, label: "Wi-Fi" }, { id: "ap", kind: "ap", x: 670, y: 320 },
];
const ML: SceneLink[] = [
  { a: "a1", b: "b1", label: "Cat6: 1 Gbit/s, 100 m gacha" },
  { a: "a2", b: "b2", label: "Optika: 10–100 Gbit/s, o'nlab km" },
  { a: "a3", b: "ap", wireless: true, label: "Radio: yuzlab Mbit/s, ~30 m" },
];
const MEDIA: Step[] = [
  { say: "Uch xil yo'l: mis kabel (elektr), optik tola (yorug'lik) va Wi-Fi (radioto'lqin). Har biri o'z tezligi va masofasiga ega.", flights: [{ from: "a1", to: "b1", label: "elektr" }, { from: "a2", to: "b2", label: "yorug'lik", tone: "amber" }, { from: "a3", to: "ap", label: "radio", tone: "green" }] },
  {
    say: "Yaqin atrofda kuchli elektr dvigatel ishga tushdi. Mis kabel va Wi-Fi da xalaqit paydo bo'ldi, optik tolaga esa hech narsa bo'lmadi — unda elektr signali yo'q, yorug'lik bor.",
    flights: [{ from: "a1", to: "b1", label: "elektr", lostAt: "b1" }, { from: "a2", to: "b2", label: "yorug'lik", tone: "amber" }, { from: "a3", to: "ap", label: "radio", tone: "green", lostAt: "ap" }],
    marks: { b2: { text: "Toza keldi", tone: "ok" } },
    ask: { q: "Qaysi muhit elektromagnit xalaqitga befarq? Qabul qiluvchi qurilmasini bosing.", pick: "b2", hint: "Qaysi yo'lda elektr emas, yorug'lik ketadi?", explain: "Optik tola — unda yorug'lik uzatiladi, elektr xalaqit ta'sir qilmaydi. Shuning uchun uzoq masofa va magistrallar optikada." },
  },
  {
    say: "Bino ichida kompyuterni kommutatorgacha 100 metrgacha mis kabel bilan ulash arzon va qulay. Shaharlar orasida esa faqat optika.",
    ask: { q: "Ikki bino orasidagi 2 km masofaga qaysi muhitni tanlaysiz?", options: ["Mis kabel (Cat6)", "Optik tola", "Wi-Fi"], answer: 1, explain: "Mis kabel segmenti 100 m gacha, Wi-Fi ~30 m bino ichida. 2 km uchun optik tola kerak." },
  },
];

export default function SignalStory({ initial = "coding" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "coding", label: "Kodlash va xatolar", render: () => <Story nodes={nodes} links={links} steps={CODING} height={260} title="Bitlar kabelda qanday yuradi?" /> },
      { key: "media", label: "Uzatish muhitlari", render: () => <Story nodes={MN} links={ML} steps={MEDIA} height={400} title="Mis, optika va radio" /> },
    ]} />
  );
}
