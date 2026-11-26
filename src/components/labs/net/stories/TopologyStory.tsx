"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/** Topologiyalar: har birida kabel yoki qurilma "uziladi" — zaif nuqta o'zi ko'rinadi. */

// ---------- Yulduz ----------
const STAR_N: SceneNode[] = [
  { id: "S", kind: "switch", x: 380, y: 185, label: "Kommutator" },
  { id: "A", kind: "pc", x: 110, y: 85, label: "A" }, { id: "B", kind: "pc", x: 380, y: 60, label: "B" },
  { id: "C", kind: "pc", x: 650, y: 85, label: "C" }, { id: "D", kind: "pc", x: 170, y: 300, label: "D" },
  { id: "E", kind: "pc", x: 590, y: 300, label: "E" },
];
const STAR_L: SceneLink[] = ["A", "B", "C", "D", "E"].map((p) => ({ a: p, b: "S" }));
const STAR: Step[] = [
  { say: "Yulduz: har kompyuter öz kabeli bilan markazdagi kommutatorga ulangan. Bugungi ofis va kompyuter sinflari şunday.", flights: [{ from: "A", to: "C", label: "A → C" }] },
  {
    say: "E ning kabeli uzildi. Faqat E aloqasiz qoldi — qolganlar bemalol işlayveradi.",
    broken: ["E-S"],
    flights: [{ from: "A", to: "D", label: "A → D" }, { from: "B", to: "E", label: "B → E", lostAt: "S", tone: "purple" }],
    marks: { E: { text: "Aloqa yöq", tone: "drop" }, D: { text: "Keldi", tone: "ok" } },
    ask: { q: "E kompyuterining kabeli uzildi. Kimlar aloqasiz qoladi? Barçasini belgilang.", pick: ["E"], hint: "Har kompyuterning kabeli alohida.", explain: "Faqat E. Yulduzda har kompyuterning öz kabeli bor — bitta kabel faqat bitta kompyuterga taʼsir qiladi." },
  },
  {
    say: "Endi markazdagi kommutator işdan çiqdi. Butun tarmoq töxtadi — heç kim heç kimga yubora olmaydi.",
    broken: ["S"],
    flights: [{ from: "A", to: "C", label: "A → C", lostAt: "S" }],
    marks: { A: { text: "Heç kimga yetmayapti", tone: "drop" } },
    ask: { q: "Markaziy kommutator işdan çiqdi. Kimlar aloqasiz qoladi?", pick: ["A", "B", "C", "D", "E"], hint: "Barça yöllar qayerdan ötadi?", explain: "Hammasi. Markaziy qurilma — yulduzning yagona zaif nuqtasi. Şuning uçun muhim tarmoqlarda zaxira kommutator qöyiladi." },
  },
  { say: "Xulosa: yulduzda bitta kabel — bitta kompyuter muammosi, markaz esa — butun tarmoq muammosi. Nosozlikni topiş oson, kengaytiriş oson." },
];

// ---------- Shina ----------
const BUS_N: SceneNode[] = [
  ...[0, 1, 2, 3, 4].map((k) => ({ id: `t${k}`, kind: "tap" as const, x: 90 + k * 145, y: 195 })),
  { id: "A", kind: "pc", x: 90, y: 80, label: "A" }, { id: "B", kind: "pc", x: 235, y: 310, label: "B" },
  { id: "C", kind: "pc", x: 380, y: 80, label: "C" }, { id: "D", kind: "pc", x: 525, y: 310, label: "D" },
  { id: "E", kind: "pc", x: 670, y: 80, label: "E" },
];
const BUS_L: SceneLink[] = [
  ...[0, 1, 2, 3].map((k) => ({ a: `t${k}`, b: `t${k + 1}` })),
  { a: "A", b: "t0" }, { a: "B", b: "t1" }, { a: "C", b: "t2" }, { a: "D", b: "t3" }, { a: "E", b: "t4" },
];
const BUS: Step[] = [
  { say: "Şina: hamma kompyuter bitta umumiy kabelga (magistralga) ulangan. A yuborgan signal kabel böylab hammaga yetadi, lekin faqat C qabul qiladi.", flights: [{ from: "A", to: "C", label: "A → C" }, { from: "A", to: "E", label: "A → C" }, { from: "A", to: "B", label: "A → C" }, { from: "A", to: "D", label: "A → C" }], marks: { C: { text: "Menga!", tone: "ok" }, E: { text: "Menga emas", tone: "drop" } } },
  {
    say: "B va D bir vaqtda gapirdi — umumiy kabelda signallar töqnaşdi. Şinada bir vaqtda faqat bittasi uzata oladi.",
    flights: [{ from: "B", to: "t2", label: "B", via: ["t1"] }, { from: "D", to: "t2", label: "D", via: ["t3"], tone: "purple" }],
    marks: { t2: { text: "Töqnaşuv!", tone: "warn" } },
  },
  {
    say: "Magistral kabel B va C orasida uzildi. Tarmoq ikki qismga bölindi: A–B bir tomonda, C–D–E boşqa tomonda.",
    broken: ["t1-t2"],
    flights: [{ from: "A", to: "B", label: "A → B" }, { from: "A", to: "E", label: "A → E", lostAt: "t1", tone: "purple" }],
    marks: { B: { text: "Keldi", tone: "ok" } },
    ask: { q: "Magistral kabel B va C orasida uzildi. A endi kim bilan gaplaşa oladi?", pick: ["B"], hint: "Uzilgan joydan ötib bölmaydi.", explain: "Faqat B bilan — ular uzilişning bir tomonida. Şinada magistral kabelning istalgan joyi butun tarmoq uçun xavfli." },
  },
  { say: "Xulosa: şina arzon (kabel kam), lekin töqnaşuvlar köp va magistral uzilsa tarmoq bölinadi. Bugun deyarli işlatilmaydi." },
];

// ---------- Halqa ----------
const R = 125, CX = 380, CY = 185;
const RING_IDS = ["A", "B", "C", "D", "E", "F"];
const RING_N: SceneNode[] = RING_IDS.map((id, k) => {
  const a = -Math.PI / 2 + (k * 2 * Math.PI) / 6;
  return { id, kind: "pc" as const, x: CX + R * 1.6 * Math.cos(a), y: CY + R * Math.sin(a), label: id };
});
const RING_L: SceneLink[] = RING_IDS.map((id, k) => ({ a: id, b: RING_IDS[(k + 1) % 6] }));
const RING: Step[] = [
  { say: "Halqa: har kompyuter ikki qöşnisiga ulangan, maʼlumot aylana böylab bir yönalişda boradi. A dan D ga xabar B va C orqali ötadi.", flights: [{ from: "A", to: "D", label: "A → D", via: ["B", "C"] }], marks: { B: { text: "Uzatdim" }, C: { text: "Uzatdim" }, D: { text: "Menga!", tone: "ok" } } },
  {
    say: "B va C orasidagi kabel uzildi. Bitta halqada aylana buzildi — A ning xabari D ga yetib bormaydi.",
    broken: ["B-C"],
    flights: [{ from: "A", to: "D", label: "A → D", via: ["B", "C"], lostAt: "C" }],
    marks: { B: { text: "Oldinga yöl yöq", tone: "drop" } },
    ask: { q: "Bitta halqada B–C kabeli uzildi. A dan D ga xabar yetib boradimi?", options: ["Ha, aylanib boradi", "Yöq — bir yönalişli halqa uzildi", "Faqat yarmi yetadi"], answer: 1, explain: "Oddiy halqada maʼlumot bir yönalişda yuradi, bitta uziliş butun aylanani buzadi. FDDI şuning uçun IKKI halqa işlatadi: uzilganda ikkinçi halqa orqali qaytib boradi." },
  },
  { say: "Xulosa: halqada navbat bilan uzatiladi (töqnaşuv yöq), lekin bitta halqa işonçsiz. Ikki qarama-qarşi halqa (FDDI) bu muammoni hal qiladi." },
];

// ---------- To'liq bog'langan ----------
const MESH_N: SceneNode[] = [
  { id: "A", kind: "router", x: 160, y: 90, label: "Toshkent" }, { id: "B", kind: "router", x: 600, y: 90, label: "Samarqand" },
  { id: "C", kind: "router", x: 160, y: 290, label: "Buxoro" }, { id: "D", kind: "router", x: 600, y: 290, label: "Namangan" },
];
const MESH_L: SceneLink[] = [["A", "B"], ["A", "C"], ["A", "D"], ["B", "C"], ["B", "D"], ["C", "D"]].map(([a, b]) => ({ a, b }));
const MESH: Step[] = [
  { say: "Töliq boğlangan (mesh): har şahar har biri bilan töğridan-töğri ulangan. Toşkentdan Samarqandga — bevosita.", flights: [{ from: "A", to: "B", label: "maʼlumot" }] },
  {
    say: "Toşkent–Samarqand kabeli uzildi. Maʼlumot boşqa yöl bilan — Namangan orqali ketdi. Aloqa uzilmadi!",
    broken: ["A-B"],
    flights: [{ from: "A", to: "B", label: "maʼlumot", via: ["D"] }],
    marks: { D: { text: "Aylanib ötaman" }, B: { text: "Keldi", tone: "ok" } },
    ask: { q: "Toşkent–Samarqand kabeli uzildi. Maʼlumot yetib boradimi?", options: ["Yo'q", "Ha, boşqa şahar orqali", "Faqat ertaga"], answer: 1, explain: "Ha. Mesh tarmoğida bir neçta zaxira yöl bor — eng işonçli topologiya." },
  },
  {
    say: "Narxi: n ta tugun uçun n·(n−1)/2 ta kabel. 4 şahar — 6 kabel, 10 şahar — 45 kabel. Şuning uçun mesh faqat eng muhim tugunlar (provayder magistrallari) uçun.",
    ask: { q: "4 ta şaharni töliq boğlaş uçun neçta kabel kerak?", options: ["4", "6", "8", "12"], answer: 1, explain: "4·3/2 = 6. Sahnadagi kabellarni sanab tekşiring." },
  },
];

export default function TopologyStory({ initial = "star" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "star", label: "Yulduz", render: () => <Story nodes={STAR_N} links={STAR_L} steps={STAR} title="Yulduz topologiyasi" /> },
      { key: "bus", label: "Shina", render: () => <Story nodes={BUS_N} links={BUS_L} steps={BUS} title="Şina topologiyasi" height={380} /> },
      { key: "ring", label: "Halqa", render: () => <Story nodes={RING_N} links={RING_L} steps={RING} title="Halqa topologiyasi" height={380} /> },
      { key: "mesh", label: "Töliq boğlangan", render: () => <Story nodes={MESH_N} links={MESH_L} steps={MESH} title="Töliq boğlangan topologiya" height={380} /> },
    ]} />
  );
}
