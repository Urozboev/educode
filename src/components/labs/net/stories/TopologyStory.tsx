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
  { say: "Yulduz: har kompyuter o'z kabeli bilan markazdagi kommutatorga ulangan. Bugungi ofis va kompyuter sinflari shunday.", flights: [{ from: "A", to: "C", label: "A → C" }] },
  {
    say: "E ning kabeli uzildi. Faqat E aloqasiz qoldi — qolganlar bemalol ishlayveradi.",
    broken: ["E-S"],
    flights: [{ from: "A", to: "D", label: "A → D" }, { from: "B", to: "E", label: "B → E", lostAt: "S", tone: "purple" }],
    marks: { E: { text: "Aloqa yo'q", tone: "drop" }, D: { text: "Keldi", tone: "ok" } },
    ask: { q: "E kompyuterining kabeli uzildi. Kimlar aloqasiz qoladi? Barchasini belgilang.", pick: ["E"], hint: "Har kompyuterning kabeli alohida.", explain: "Faqat E. Yulduzda har kompyuterning o'z kabeli bor — bitta kabel faqat bitta kompyuterga ta'sir qiladi." },
  },
  {
    say: "Endi markazdagi kommutator ishdan chiqdi. Butun tarmoq to'xtadi — hech kim hech kimga yubora olmaydi.",
    broken: ["S"],
    flights: [{ from: "A", to: "C", label: "A → C", lostAt: "S" }],
    marks: { A: { text: "Hech kimga yetmayapti", tone: "drop" } },
    ask: { q: "Markaziy kommutator ishdan chiqdi. Kimlar aloqasiz qoladi?", pick: ["A", "B", "C", "D", "E"], hint: "Barcha yo'llar qayerdan o'tadi?", explain: "Hammasi. Markaziy qurilma — yulduzning yagona zaif nuqtasi. Shuning uchun muhim tarmoqlarda zaxira kommutator qo'yiladi." },
  },
  { say: "Xulosa: yulduzda bitta kabel — bitta kompyuter muammosi, markaz esa — butun tarmoq muammosi. Nosozlikni topish oson, kengaytirish oson." },
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
  { say: "Shina: hamma kompyuter bitta umumiy kabelga (magistralga) ulangan. A yuborgan signal kabel bo'ylab hammaga yetadi, lekin faqat C qabul qiladi.", flights: [{ from: "A", to: "C", label: "A → C" }, { from: "A", to: "E", label: "A → C" }, { from: "A", to: "B", label: "A → C" }, { from: "A", to: "D", label: "A → C" }], marks: { C: { text: "Menga!", tone: "ok" }, E: { text: "Menga emas", tone: "drop" } } },
  {
    say: "B va D bir vaqtda gapirdi — umumiy kabelda signallar to'qnashdi. Shinada bir vaqtda faqat bittasi uzata oladi.",
    flights: [{ from: "B", to: "t2", label: "B", via: ["t1"] }, { from: "D", to: "t2", label: "D", via: ["t3"], tone: "purple" }],
    marks: { t2: { text: "To'qnashuv!", tone: "warn" } },
  },
  {
    say: "Magistral kabel B va C orasida uzildi. Tarmoq ikki qismga bo'lindi: A–B bir tomonda, C–D–E boshqa tomonda.",
    broken: ["t1-t2"],
    flights: [{ from: "A", to: "B", label: "A → B" }, { from: "A", to: "E", label: "A → E", lostAt: "t1", tone: "purple" }],
    marks: { B: { text: "Keldi", tone: "ok" } },
    ask: { q: "Magistral kabel B va C orasida uzildi. A endi kim bilan gaplasha oladi?", pick: ["B"], hint: "Uzilgan joydan o'tib bo'lmaydi.", explain: "Faqat B bilan — ular uzilishning bir tomonida. Shinada magistral kabelning istalgan joyi butun tarmoq uchun xavfli." },
  },
  { say: "Xulosa: shina arzon (kabel kam), lekin to'qnashuvlar ko'p va magistral uzilsa tarmoq bo'linadi. Bugun deyarli ishlatilmaydi." },
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
  { say: "Halqa: har kompyuter ikki qo'shnisiga ulangan, ma'lumot aylana bo'ylab bir yo'nalishda boradi. A dan D ga xabar B va C orqali o'tadi.", flights: [{ from: "A", to: "D", label: "A → D", via: ["B", "C"] }], marks: { B: { text: "Uzatdim" }, C: { text: "Uzatdim" }, D: { text: "Menga!", tone: "ok" } } },
  {
    say: "B va C orasidagi kabel uzildi. Bitta halqada aylana buzildi — A ning xabari D ga yetib bormaydi.",
    broken: ["B-C"],
    flights: [{ from: "A", to: "D", label: "A → D", via: ["B", "C"], lostAt: "C" }],
    marks: { B: { text: "Oldinga yo'l yo'q", tone: "drop" } },
    ask: { q: "Bitta halqada B–C kabeli uzildi. A dan D ga xabar yetib boradimi?", options: ["Ha, aylanib boradi", "Yo'q — bir yo'nalishli halqa uzildi", "Faqat yarmi yetadi"], answer: 1, explain: "Oddiy halqada ma'lumot bir yo'nalishda yuradi, bitta uzilish butun aylanani buzadi. FDDI shuning uchun IKKI halqa ishlatadi: uzilganda ikkinchi halqa orqali qaytib boradi." },
  },
  { say: "Xulosa: halqada navbat bilan uzatiladi (to'qnashuv yo'q), lekin bitta halqa ishonchsiz. Ikki qarama-qarshi halqa (FDDI) bu muammoni hal qiladi." },
];

// ---------- To'liq bog'langan ----------
const MESH_N: SceneNode[] = [
  { id: "A", kind: "router", x: 160, y: 90, label: "Toshkent" }, { id: "B", kind: "router", x: 600, y: 90, label: "Samarqand" },
  { id: "C", kind: "router", x: 160, y: 290, label: "Buxoro" }, { id: "D", kind: "router", x: 600, y: 290, label: "Namangan" },
];
const MESH_L: SceneLink[] = [["A", "B"], ["A", "C"], ["A", "D"], ["B", "C"], ["B", "D"], ["C", "D"]].map(([a, b]) => ({ a, b }));
const MESH: Step[] = [
  { say: "To'liq bog'langan (mesh): har shahar har biri bilan to'g'ridan-to'g'ri ulangan. Toshkentdan Samarqandga — bevosita.", flights: [{ from: "A", to: "B", label: "ma'lumot" }] },
  {
    say: "Toshkent–Samarqand kabeli uzildi. Ma'lumot boshqa yo'l bilan — Namangan orqali ketdi. Aloqa uzilmadi!",
    broken: ["A-B"],
    flights: [{ from: "A", to: "B", label: "ma'lumot", via: ["D"] }],
    marks: { D: { text: "Aylanib o'taman" }, B: { text: "Keldi", tone: "ok" } },
    ask: { q: "Toshkent–Samarqand kabeli uzildi. Ma'lumot yetib boradimi?", options: ["Yo'q", "Ha, boshqa shahar orqali", "Faqat ertaga"], answer: 1, explain: "Ha. Mesh tarmog'ida bir nechta zaxira yo'l bor — eng ishonchli topologiya." },
  },
  {
    say: "Narxi: n ta tugun uchun n·(n−1)/2 ta kabel. 4 shahar — 6 kabel, 10 shahar — 45 kabel. Shuning uchun mesh faqat eng muhim tugunlar (provayder magistrallari) uchun.",
    ask: { q: "4 ta shaharni to'liq bog'lash uchun nechta kabel kerak?", options: ["4", "6", "8", "12"], answer: 1, explain: "4·3/2 = 6. Sahnadagi kabellarni sanab tekshiring." },
  },
];

export default function TopologyStory({ initial = "star" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "star", label: "Yulduz", render: () => <Story nodes={STAR_N} links={STAR_L} steps={STAR} title="Yulduz topologiyasi" /> },
      { key: "bus", label: "Shina", render: () => <Story nodes={BUS_N} links={BUS_L} steps={BUS} title="Shina topologiyasi" height={380} /> },
      { key: "ring", label: "Halqa", render: () => <Story nodes={RING_N} links={RING_L} steps={RING} title="Halqa topologiyasi" height={380} /> },
      { key: "mesh", label: "To'liq bog'langan", render: () => <Story nodes={MESH_N} links={MESH_L} steps={MESH} title="To'liq bog'langan topologiya" height={380} /> },
    ]} />
  );
}
