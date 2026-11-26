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
  { say: "Token Ring: halqa böylab bitta maxsus kiçik xabar — marker (token) aylanib yuradi. Uni xuddi sinfdagi «gapiriş tayoqçasi» deb tasavvur qiling: kimning qölida bölsa, faqat öşa gapiradi.", flights: [{ from: "A", to: "B", label: "MARKER", tone: "amber" }, { from: "B", to: "C", label: "MARKER", tone: "amber", delay: 1.1 }] },
  {
    say: "Marker hozir C da. C da yuboradigan maʼlumot yöq — u markerni D ga uzatadi.",
    marks: { C: { text: "Marker menda", at: 0.1 } },
    flights: [{ from: "C", to: "D", label: "MARKER", tone: "amber" }],
    ask: { q: "Marker C da turibdi. Hozir halqada kim maʼlumot uzata oladi? Qurilmani bosing.", pick: "C", hint: "Faqat marker egasi gapiradi.", explain: "Faqat C — marker unda. Boşqalar kutadi, şuning uçun töqnaşuv bölmaydi." },
  },
  {
    say: "Marker D ga keldi. D da F uçun xabar bor: u markerni «uşlab», uning örniga maʼlumot kadrini yubordi. Endi halqada marker yöq — heç kim boşqa uzata olmaydi.",
    marks: { D: { text: "Marker oldim — uzataman", tone: "ok", at: 0.1 } },
    flights: [{ from: "D", to: next("D"), label: "D → F kadr" }],
  },
  {
    say: "E kadrni öqidi — manzil unga emas, şunçaki keyingisiga uzatdi. F kadr öziga ekanini kördi: nusxasini oldi va «qabul qilindi» belgisini qöydi.",
    flights: [{ from: "E", to: "F", label: "D → F kadr" }],
    marks: { E: { text: "Menga emas — uzataman", at: 0.1 }, F: { text: "Menga! Nusxa oldim", tone: "ok" } },
  },
  {
    say: "Kadr aylanişni davom ettirib, D ga qaytdi. D belgini körib, xabar yetkazilganini bildi, kadrni halqadan olib taşladi va yangi böş marker çiqardi.",
    flights: [{ from: "F", to: "D", label: "qabul qilindi ✓", tone: "green", via: ["A", "B", "C"] }],
    marks: { D: { text: "Yetkazildi — markerni qöyib yuboraman", tone: "ok" } },
    ask: { q: "Kadrni halqadan kim olib taşlaydi?", options: ["Qabul qiluvçi F", "Yuboruvçi D", "Har bir keyingi kompyuter"], answer: 1, explain: "Yuboruvçi D: kadr aylanib unga qaytadi, u belgini tekşirib kadrni oladi va markerni qöyib yuboradi." },
  },
  {
    say: "Natija: bir vaqtda faqat bitta kompyuter uzatadi, har birining navbati albatta keladi — yuklama köp bölsa ham töqnaşuv bölmaydi.",
    flights: [{ from: "D", to: "E", label: "MARKER", tone: "amber" }],
    ask: { q: "Nega Token Ring da töqnaşuv bölmaydi?", options: ["Kabel qalin", "Bir vaqtda faqat marker egasi uzatadi", "Kompyuterlar kam"], answer: 1, explain: "Markerli kiriş: uzatiş huquqi faqat bitta stansiyada. FDDI ham şu tamoyilda, lekin ikki optik halqa bilan işlaydi." },
  },
];

export default function TokenRingStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="Token Ring: marker kimda bölsa, öşa gapiradi" />;
}
