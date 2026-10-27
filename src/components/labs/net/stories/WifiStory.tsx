"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/** Wi-Fi: havoni bo'lishish (CSMA/CA), yashirin stansiya, kanallar va xavfsizlik. */

const nodes: SceneNode[] = [
  { id: "A", kind: "laptop", x: 110, y: 230, label: "Ali", sub: "yotoqxona, 1-xona" },
  { id: "ap", kind: "ap", x: 380, y: 120, label: "Kirish nuqtasi (AP)" },
  { id: "C", kind: "laptop", x: 650, y: 230, label: "Vali", sub: "devor orqasida" },
  { id: "r", kind: "router", x: 380, y: 290, label: "Router → Internet" },
];
const links: SceneLink[] = [{ a: "A", b: "ap", wireless: true }, { a: "C", b: "ap", wireless: true }, { a: "ap", b: "r" }];

const AIR: Step[] = [
  { say: "Wi-Fi da hamma bitta havoni (radiokanalni) bo'lishadi. Ali avval quloq soladi: kanal bo'shmi? Bo'sh — u kadrni yubordi. AP qabul qilib, darhol «oldim» (ACK) deb javob berdi.", flights: [{ from: "A", to: "ap", label: "ma'lumot" }, { from: "ap", to: "A", label: "ACK", tone: "green", delay: 1.3 }] },
  {
    say: "Radioda kompyuter o'zi gapirayotganda boshqalarni eshitmaydi, shuning uchun to'qnashuvni sezolmaydi. Shuning uchun Wi-Fi har bir kadrni tasdiqlaydi: ACK kelmasa — qayta yuboradi.",
    ask: { q: "Nega Wi-Fi da har bir kadrga ACK (tasdiq) yuboriladi?", options: ["Tezlikni oshirish uchun", "Radioda to'qnashuvni sezib bo'lmaydi — yetib borganini tasdiqlash kerak", "Parol uchun"], answer: 1, explain: "Simli Ethernet to'qnashuvni ANIQLAYDI (CD), Wi-Fi esa undan QOCHADI (CA) va har kadrni tasdiq bilan tekshiradi." },
  },
  {
    say: "Ali va Vali bir-birini «eshitmaydi» — orada qalin devor. Ikkalasi ham kanalni bo'sh deb o'ylab, bir vaqtda yubordi. AP da signallar ustma-ust tushdi — to'qnashuv! Bu «yashirin stansiya» muammosi.",
    flights: [{ from: "A", to: "ap", label: "Ali kadri", lostAt: "ap" }, { from: "C", to: "ap", label: "Vali kadri", tone: "purple", lostAt: "ap" }],
    marks: { ap: { text: "To'qnashuv!", tone: "warn" } },
  },
  {
    say: "Yechim — RTS/CTS. Ali avval qisqa so'rov yuboradi: «Menga kanal kerak» (RTS). AP hammaga eshittiradi: «Kanal Aliga berildi» (CTS).",
    flights: [{ from: "A", to: "ap", label: "RTS", tone: "amber" }, { from: "ap", to: "A", label: "CTS", tone: "amber", delay: 1.3 }, { from: "ap", to: "C", label: "CTS", tone: "amber", delay: 1.3 }],
    marks: { C: { text: "Kutaman", tone: "warn" } },
    ask: { q: "AP ning CTS xabarini kimlar eshitadi? Barchasini belgilang.", pick: ["A", "C"], hint: "Ali va Vali bir-birini eshitmaydi, lekin ikkalasi ham AP ni eshitadi.", explain: "Ikkalasi ham. Vali CTS ni eshitib, belgilangan vaqt jim turadi — to'qnashuvning oldi olinadi." },
  },
  { say: "Endi Ali bemalol yuboradi, Vali kutyapti. AP tasdiq yubordi. Vali navbati keyin keladi.", flights: [{ from: "A", to: "ap", label: "ma'lumot" }, { from: "ap", to: "A", label: "ACK", tone: "green", delay: 1.3 }], marks: { C: { text: "Kutyapman", tone: "warn", at: 0.1 } } },
];

// ---------- Kanallar va xavfsizlik ----------
const CN: SceneNode[] = [
  { id: "ap1", kind: "ap", x: 130, y: 140, label: "201-xona", sub: "kanal 1" },
  { id: "ap2", kind: "ap", x: 380, y: 140, label: "202-xona", sub: "kanal 3" },
  { id: "ap3", kind: "ap", x: 630, y: 140, label: "203-xona", sub: "kanal 6" },
  { id: "nb", kind: "laptop", x: 380, y: 290, label: "Talaba" },
];
const CL: SceneLink[] = [{ a: "nb", b: "ap2", wireless: true }];
const CHAN: Step[] = [
  { say: "Uch qo'shni xonada uchta kirish nuqtasi: 1, 3 va 6-kanallarda. 2,4 GHz da kanallar orasi juda tor — qo'shni kanallar bir-birining ustiga tushadi. 3-kanal 1 ga ham, 6 ga ham xalaqit beradi.", flights: [{ from: "nb", to: "ap2", label: "ma'lumot", lostAt: "ap2" }], marks: { ap2: { text: "Xalaqit!", tone: "warn" } } },
  {
    say: "2,4 GHz da bir-birini qoplamaydigan kanallar faqat uchta: 1, 6 va 11. Endi har xona o'z «yo'lagida».",
    subs: { ap2: "kanal 6", ap3: "kanal 11" },
    flights: [{ from: "nb", to: "ap2", label: "ma'lumot" }],
    marks: { ap2: { text: "Toza kanal", tone: "ok" } },
    ask: { q: "Uchta qo'shni kirish nuqtasiga qaysi kanallarni berasiz?", options: ["1, 2, 3", "1, 6, 11", "6, 6, 6", "3, 7, 9"], answer: 1, explain: "1, 6, 11 — 2,4 GHz da bir-birini qoplamaydigan yagona uchlik." },
  },
  {
    say: "Xavfsizlik: tarmoq ochiq bo'lsa, yaqindagi har kim trafikni ko'radi. WEP bir necha daqiqada buziladi. Bugun WPA2 (AES) yoki WPA3 va kamida 12 belgili parol kerak, WPS esa o'chiriladi.",
    ask: { q: "Kafedra Wi-Fi tarmog'i uchun qaysi himoyani tanlaysiz?", options: ["Ochiq tarmoq", "WEP", "WPA3 (yoki WPA2-AES)"], answer: 2, explain: "WPA3 eng ishonchli; qurilmalar qo'llamasa — WPA2 (AES). WEP va ochiq tarmoq xavfli." },
  },
];

export default function WifiStory({ initial = "air" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "air", label: "Havoni bo'lishish (CSMA/CA)", render: () => <Story nodes={nodes} links={links} steps={AIR} height={360} title="Wi-Fi: kim qachon gapiradi?" /> },
      { key: "chan", label: "Kanallar va xavfsizlik", render: () => <Story nodes={CN} links={CL} steps={CHAN} height={360} title="Kanal tanlash va himoya" /> },
    ]} />
  );
}
