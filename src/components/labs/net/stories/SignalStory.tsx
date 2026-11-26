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
  { id: "B", kind: "pc", x: 660, y: 150, label: "Qabul qiluvçi" },
];
const links: SceneLink[] = [{ a: "A", b: "B", label: "mis kabel" }];

const CODING: Step[] = [
  { say: "Kompyuter 10110010 bitlarini yubormoqçi. Kabelda bit yöq — faqat elektr kuçlanişi bor. Eng sodda kod (NRZ): 1 — yuqori kuçlaniş, 0 — past.", panel: <Wave bits="10110010" code="nrz" caption="NRZ: 1 — yuqori, 0 — past" /> },
  { say: "Signal kabel böylab ketdi. Qabul qiluvçi har bit vaqtida kuçlanişni ölçab, bitlarni tiklaydi.", flights: [{ from: "A", to: "B", label: "10110010" }], marks: { B: { text: "10110010 — oldim", tone: "ok" } } },
  {
    say: "Endi sakkizta nol ketma-ket. NRZ da signal butun vaqt bir xil — tekis çiziq. Qabul qiluvçi soati sal şoşsa yoki keçiksa, neçta nol kelganini adaşib sanaydi.",
    panel: <Wave bits="00000000" code="nrz" caption="NRZ: 00000000 — tekis çiziq" />,
    ask: { q: "Uzun 00000000 ketma-ketlikda NRZ kodining muammosi nimada?", options: ["Signal tezlaşib ketadi", "Signal özgarmaydi — bitlarni sanaşda adaşiş mumkin", "Kabel qiziydi"], answer: 1, explain: "Signalda özgariş bölmasa, qabul qiluvçi bit çegaralarini yöqotadi (sinxronizatsiya buziladi)." },
  },
  { say: "Manchester kodi buni hal qiladi: har bit örtasida signal albatta özgaradi (0 — yuqoridan pastga, 1 — pastdan yuqoriga). Signal öz «soati»ni özi olib yuradi. 10 Mbit/s Ethernet aynan şu kodni işlatgan.", panel: <Wave bits="00000000" code="manchester" caption="Manchester: 00000000 — har bitda ötiş bor" /> },
  {
    say: "Yölda elektromagnit xalaqit bitta bitni buzdi: 10110010 örniga 10100010 yetib keldi. Qabul qiluvçi kadr oxiridagi tekşiruv qiymatini (FCS, CRC asosida) qayta hisobladi — mos kelmadi. Kadr taşlab yuborildi.",
    flights: [{ from: "A", to: "B", label: "10100010 ⚡", tone: "red" }],
    marks: { B: { text: "FCS mos emas — taşladim", tone: "drop" } },
    ask: { q: "Qabul qiluvçi kadr buzilganini qanday biladi?", options: ["IP manzildan", "Kadr oxiridagi tekşiruv qiymati (FCS/CRC) mos kelmaydi", "Kabel rangi özgaradi"], answer: 1, explain: "Yuboruvçi kadr bitlaridan CRC hisoblab, oxiriga qöşadi. Qabul qiluvçi qayta hisoblaydi: mos kelmasa — kadr buzilgan." },
  },
  { say: "Buzilgan kadr yöqoldi, lekin yuqori poğona (TCP) tasdiq kelmaganini sezib, maʼlumotni qayta yubordi. Bu safar töğri yetib keldi.", flights: [{ from: "A", to: "B", label: "10110010 (qayta)", tone: "green" }], marks: { B: { text: "FCS töğri — qabul qildim", tone: "ok" } } },
  { say: "Xulosa: bitlar kod qoidasi bilan signalga aylanadi (NRZ, Manchester…). Xalaqit bitlarni buzişi mumkin — CRC buni aniqlaydi, buzilgan kadr taşlanadi va qayta yuboriladi." },
];

// ---------- Muhitlar ----------
const MN: SceneNode[] = [
  { id: "a1", kind: "pc", x: 90, y: 70, label: "Mis kabel" }, { id: "b1", kind: "pc", x: 670, y: 70 },
  { id: "a2", kind: "pc", x: 90, y: 200, label: "Optik tola" }, { id: "b2", kind: "server", x: 670, y: 200 },
  { id: "a3", kind: "laptop", x: 90, y: 320, label: "Wi-Fi" }, { id: "ap", kind: "ap", x: 670, y: 320 },
];
const ML: SceneLink[] = [
  { a: "a1", b: "b1", label: "Cat6: 1 Gbit/s, 100 m gaça" },
  { a: "a2", b: "b2", label: "Optika: 10–100 Gbit/s, önlab km" },
  { a: "a3", b: "ap", wireless: true, label: "Radio: yuzlab Mbit/s, ~30 m" },
];
const MEDIA: Step[] = [
  { say: "Uç xil yöl: mis kabel (elektr), optik tola (yoruğlik) va Wi-Fi (radiotölqin). Har biri öz tezligi va masofasiga ega.", flights: [{ from: "a1", to: "b1", label: "elektr" }, { from: "a2", to: "b2", label: "yoruğlik", tone: "amber" }, { from: "a3", to: "ap", label: "radio", tone: "green" }] },
  {
    say: "Yaqin atrofda kuçli elektr dvigatel işga tuşdi. Mis kabel va Wi-Fi da xalaqit paydo böldi, optik tolaga esa heç narsa bölmadi — unda elektr signali yöq, yoruğlik bor.",
    flights: [{ from: "a1", to: "b1", label: "elektr", lostAt: "b1" }, { from: "a2", to: "b2", label: "yoruğlik", tone: "amber" }, { from: "a3", to: "ap", label: "radio", tone: "green", lostAt: "ap" }],
    marks: { b2: { text: "Toza keldi", tone: "ok" } },
    ask: { q: "Qaysi muhit elektromagnit xalaqitga befarq? Qabul qiluvçi qurilmasini bosing.", pick: "b2", hint: "Qaysi yölda elektr emas, yoruğlik ketadi?", explain: "Optik tola — unda yoruğlik uzatiladi, elektr xalaqit taʼsir qilmaydi. Şuning uçun uzoq masofa va magistrallar optikada." },
  },
  {
    say: "Bino içida kompyuterni kommutatorgaça 100 metrgaça mis kabel bilan ulaş arzon va qulay. Şaharlar orasida esa faqat optika.",
    ask: { q: "Ikki bino orasidagi 2 km masofaga qaysi muhitni tanlaysiz?", options: ["Mis kabel (Cat6)", "Optik tola", "Wi-Fi"], answer: 1, explain: "Mis kabel segmenti 100 m gaça, Wi-Fi ~30 m bino içida. 2 km uçun optik tola kerak." },
  },
];

export default function SignalStory({ initial = "coding" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "coding", label: "Kodlaş va xatolar", render: () => <Story nodes={nodes} links={links} steps={CODING} height={260} title="Bitlar kabelda qanday yuradi?" /> },
      { key: "media", label: "Uzatiş muhitlari", render: () => <Story nodes={MN} links={ML} steps={MEDIA} height={400} title="Mis, optika va radio" /> },
    ]} />
  );
}
