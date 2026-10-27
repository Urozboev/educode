"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Marker (token) — navbat tayoqchasi: kimda bo'lsa, o'sha gapiradi. */

const IDS = ["A", "B", "C", "D", "E", "F"];
const nodes: SceneNode[] = IDS.map((id, k) => {
  const a = -Math.PI / 2 + (k * 2 * Math.PI) / 6;
  return { id, kind: "pc" as const, x: 380 + 210 * Math.cos(a), y: 190 + 128 * Math.sin(a), label: id };
});
const links: SceneLink[] = IDS.map((id, k) => ({ a: id, b: IDS[(k + 1) % 6] }));
const next = (id: string) => IDS[(IDS.indexOf(id) + 1) % 6];

const steps: Step[] = [
  { say: "Token Ring: halqa bo'ylab bitta maxsus kichik xabar — marker (token) aylanib yuradi. Uni xuddi sinfdagi «gapirish tayoqchasi» deb tasavvur qiling: kimning qo'lida bo'lsa, faqat o'sha gapiradi.", flights: [{ from: "A", to: "B", label: "MARKER", tone: "amber" }, { from: "B", to: "C", label: "MARKER", tone: "amber", delay: 1.1 }] },
  {
    say: "Marker hozir C da. C da yuboradigan ma'lumot yo'q — u markerni D ga uzatadi.",
    marks: { C: { text: "Marker menda", at: 0.1 } },
    flights: [{ from: "C", to: "D", label: "MARKER", tone: "amber" }],
    ask: { q: "Marker C da turibdi. Hozir halqada kim ma'lumot uzata oladi? Qurilmani bosing.", pick: "C", hint: "Faqat marker egasi gapiradi.", explain: "Faqat C — marker unda. Boshqalar kutadi, shuning uchun to'qnashuv bo'lmaydi." },
  },
  {
    say: "Marker D ga keldi. D da F uchun xabar bor: u markerni «ushlab», uning o'rniga ma'lumot kadrini yubordi. Endi halqada marker yo'q — hech kim boshqa uzata olmaydi.",
    marks: { D: { text: "Marker oldim — uzataman", tone: "ok", at: 0.1 } },
    flights: [{ from: "D", to: next("D"), label: "D → F kadr" }],
  },
  {
    say: "E kadrni o'qidi — manzil unga emas, shunchaki keyingisiga uzatdi. F kadr o'ziga ekanini ko'rdi: nusxasini oldi va «qabul qilindi» belgisini qo'ydi.",
    flights: [{ from: "E", to: "F", label: "D → F kadr" }],
    marks: { E: { text: "Menga emas — uzataman", at: 0.1 }, F: { text: "Menga! Nusxa oldim", tone: "ok" } },
  },
  {
    say: "Kadr aylanishni davom ettirib, D ga qaytdi. D belgini ko'rib, xabar yetkazilganini bildi, kadrni halqadan olib tashladi va yangi bo'sh marker chiqardi.",
    flights: [{ from: "F", to: "D", label: "qabul qilindi ✓", tone: "green", via: ["A", "B", "C"] }],
    marks: { D: { text: "Yetkazildi — markerni qo'yib yuboraman", tone: "ok" } },
    ask: { q: "Kadrni halqadan kim olib tashlaydi?", options: ["Qabul qiluvchi F", "Yuboruvchi D", "Har bir keyingi kompyuter"], answer: 1, explain: "Yuboruvchi D: kadr aylanib unga qaytadi, u belgini tekshirib kadrni oladi va markerni qo'yib yuboradi." },
  },
  {
    say: "Natija: bir vaqtda faqat bitta kompyuter uzatadi, har birining navbati albatta keladi — yuklama ko'p bo'lsa ham to'qnashuv bo'lmaydi.",
    flights: [{ from: "D", to: "E", label: "MARKER", tone: "amber" }],
    ask: { q: "Nega Token Ring da to'qnashuv bo'lmaydi?", options: ["Kabel qalin", "Bir vaqtda faqat marker egasi uzatadi", "Kompyuterlar kam"], answer: 1, explain: "Markerli kirish: uzatish huquqi faqat bitta stansiyada. FDDI ham shu tamoyilda, lekin ikki optik halqa bilan ishlaydi." },
  },
];

export default function TokenRingStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="Token Ring: marker kimda bo'lsa, o'sha gapiradi" />;
}
