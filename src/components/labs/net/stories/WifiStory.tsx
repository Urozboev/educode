"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/** Wi-Fi: havoni bo'lishish (CSMA/CA), yashirin stansiya, kanallar va xavfsizlik. */

const nodes: SceneNode[] = [
  { id: "A", kind: "laptop", x: 110, y: 230, label: "Ali", sub: "yotoqxona, 1-xona" },
  { id: "ap", kind: "ap", x: 380, y: 120, label: "Kiriş nuqtasi (AP)" },
  { id: "C", kind: "laptop", x: 650, y: 230, label: "Vali", sub: "devor orqasida" },
  { id: "r", kind: "router", x: 380, y: 290, label: "Router → Internet" },
];
const links: SceneLink[] = [{ a: "A", b: "ap", wireless: true }, { a: "C", b: "ap", wireless: true }, { a: "ap", b: "r" }];

const AIR: Step[] = [
  { say: "Wi-Fi da hamma bitta havoni (radiokanalni) bölişadi. Ali avval quloq soladi: kanal böşmi? Böş — u kadrni yubordi. AP qabul qilib, darhol «oldim» (ACK) deb javob berdi.", flights: [{ from: "A", to: "ap", label: "maʼlumot" }, { from: "ap", to: "A", label: "ACK", tone: "green", delay: 1.3 }] },
  {
    say: "Radioda kompyuter özi gapirayotganda boşqalarni eşitmaydi, şuning uçun töqnaşuvni sezolmaydi. Şuning uçun Wi-Fi har bir kadrni tasdiqlaydi: ACK kelmasa — qayta yuboradi.",
    ask: { q: "Nega Wi-Fi da har bir kadrga ACK (tasdiq) yuboriladi?", options: ["Tezlikni oşiriş uçun", "Radioda töqnaşuvni sezib bölmaydi — yetib borganini tasdiqlaş kerak", "Parol uçun"], answer: 1, explain: "Simli Ethernet töqnaşuvni ANIQLAYDI (CD), Wi-Fi esa undan QOÇADI (CA) va har kadrni tasdiq bilan tekşiradi." },
  },
  {
    say: "Ali va Vali bir-birini «eşitmaydi» — orada qalin devor. Ikkalasi ham kanalni böş deb öylab, bir vaqtda yubordi. AP da signallar ustma-ust tuşdi — töqnaşuv! Bu «yaşirin stansiya» muammosi.",
    flights: [{ from: "A", to: "ap", label: "Ali kadri", lostAt: "ap" }, { from: "C", to: "ap", label: "Vali kadri", tone: "purple", lostAt: "ap" }],
    marks: { ap: { text: "Töqnaşuv!", tone: "warn" } },
  },
  {
    say: "Yeçim — RTS/CTS. Ali avval qisqa sörov yuboradi: «Menga kanal kerak» (RTS). AP hammaga eşittiradi: «Kanal Aliga berildi» (CTS).",
    flights: [{ from: "A", to: "ap", label: "RTS", tone: "amber" }, { from: "ap", to: "A", label: "CTS", tone: "amber", delay: 1.3 }, { from: "ap", to: "C", label: "CTS", tone: "amber", delay: 1.3 }],
    marks: { C: { text: "Kutaman", tone: "warn" } },
    ask: { q: "AP ning CTS xabarini kimlar eşitadi? Barçasini belgilang.", pick: ["A", "C"], hint: "Ali va Vali bir-birini eşitmaydi, lekin ikkalasi ham AP ni eşitadi.", explain: "Ikkalasi ham. Vali CTS ni eşitib, belgilangan vaqt jim turadi — töqnaşuvning oldi olinadi." },
  },
  { say: "Endi Ali bemalol yuboradi, Vali kutyapti. AP tasdiq yubordi. Vali navbati keyin keladi.", flights: [{ from: "A", to: "ap", label: "maʼlumot" }, { from: "ap", to: "A", label: "ACK", tone: "green", delay: 1.3 }], marks: { C: { text: "Kutyapman", tone: "warn", at: 0.1 } } },
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
  { say: "Uç qöşni xonada uçta kiriş nuqtasi: 1, 3 va 6-kanallarda. 2,4 GHz da kanallar orasi juda tor — qöşni kanallar bir-birining ustiga tuşadi. 3-kanal 1 ga ham, 6 ga ham xalaqit beradi.", flights: [{ from: "nb", to: "ap2", label: "maʼlumot", lostAt: "ap2" }], marks: { ap2: { text: "Xalaqit!", tone: "warn" } } },
  {
    say: "2,4 GHz da bir-birini qoplamaydigan kanallar faqat uçta: 1, 6 va 11. Endi har xona öz «yölagida».",
    subs: { ap2: "kanal 6", ap3: "kanal 11" },
    flights: [{ from: "nb", to: "ap2", label: "maʼlumot" }],
    marks: { ap2: { text: "Toza kanal", tone: "ok" } },
    ask: { q: "Uçta qöşni kiriş nuqtasiga qaysi kanallarni berasiz?", options: ["1, 2, 3", "1, 6, 11", "6, 6, 6", "3, 7, 9"], answer: 1, explain: "1, 6, 11 — 2,4 GHz da bir-birini qoplamaydigan yagona uçlik." },
  },
  {
    say: "Xavfsizlik: tarmoq oçiq bölsa, yaqindagi har kim trafikni köradi. WEP bir neça daqiqada buziladi. Bugun WPA2 (AES) yoki WPA3 va kamida 12 belgili parol kerak, WPS esa öçiriladi.",
    ask: { q: "Kafedra Wi-Fi tarmoği uçun qaysi himoyani tanlaysiz?", options: ["Oçiq tarmoq", "WEP", "WPA3 (yoki WPA2-AES)"], answer: 2, explain: "WPA3 eng işonçli; qurilmalar qöllamasa — WPA2 (AES). WEP va oçiq tarmoq xavfli." },
  },
];

export default function WifiStory({ initial = "air" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "air", label: "Havoni bölişiş (CSMA/CA)", render: () => <Story nodes={nodes} links={links} steps={AIR} height={360} title="Wi-Fi: kim qaçon gapiradi?" /> },
      { key: "chan", label: "Kanallar va xavfsizlik", render: () => <Story nodes={CN} links={CL} steps={CHAN} height={360} title="Kanal tanlaş va himoya" /> },
    ]} />
  );
}
