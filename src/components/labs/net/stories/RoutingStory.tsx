"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Marshrutlash: router jadvalga qarab yo'l tanlaydi; liniya uzilsa — dinamik protokol aylanma yo'l topadi. */

const nodes: SceneNode[] = [
  { id: "A", kind: "pc", x: 70, y: 200, label: "A", sub: "10.1.0.5" },
  { id: "R1", kind: "router", x: 220, y: 200, label: "R1" },
  { id: "R2", kind: "router", x: 400, y: 90, label: "R2" },
  { id: "R3", kind: "router", x: 400, y: 310, label: "R3" },
  { id: "R4", kind: "router", x: 570, y: 200, label: "R4" },
  { id: "srv", kind: "server", x: 700, y: 200, label: "Server", sub: "10.4.0.10" },
];
const links: SceneLink[] = [
  { a: "A", b: "R1" }, { a: "R1", b: "R2", label: "1 Gbit" }, { a: "R1", b: "R3", label: "100 Mbit" },
  { a: "R2", b: "R4", label: "1 Gbit" }, { a: "R3", b: "R4", label: "100 Mbit" }, { a: "R4", b: "srv" },
];

const t1 = (hl?: number, down = false) => (
  <MiniTable title="R1 marshrutlash jadvali" head={["Tarmoq", "Keyingi qadam", "Narx"]} highlight={hl}
    rows={[["10.1.0.0/16", "to'g'ridan-to'g'ri", "0"], down ? ["10.4.0.0/16", "R3", "20"] : ["10.4.0.0/16", "R2", "2"], ["0.0.0.0/0", "Provayder", "—"]]} />
);

const steps: Step[] = [
  { say: "Router — chorrahadagi yo'l ko'rsatkich. Har paket kelganda u manzilga qaraydi va o'z jadvalidan «bu tarmoqqa qaysi qo'shni orqali boriladi?» degan savolga javob topadi.", panel: t1() },
  {
    say: "A server 10.4.0.10 ga paket yubordi. R1 jadvalda 10.4.0.0/16 qatorini topdi: keyingi qadam — R2. R2 esa R4 ga, R4 serverga yetkazdi.",
    flights: [{ from: "A", to: "srv", label: "→ 10.4.0.10", via: ["R1", "R2", "R4"] }],
    marks: { R1: { text: "→ R2", at: 1.1 }, srv: { text: "Keldi", tone: "ok" } },
    panel: t1(1),
    ask: { q: "R1 paketni 10.4.0.10 ga qaysi qo'shni orqali yuboradi? Routerni bosing.", pick: "R2", hint: "Jadvalda 10.4.0.0/16 qatoriga qarang.", explain: "R2 — narxi kichik (tezroq 1 Gbit yo'l)." },
  },
  {
    say: "Nega R3 emas? OSPF protokoli har liniyaga narx beradi: tezroq liniya — arzon. R2 orqali yo'l 1+1 = 2, R3 orqali 10+10 = 20. Router eng arzon yo'lni tanlaydi.",
    focus: ["R2", "R3"],
    ask: { q: "OSPF qaysi yo'lni tanlaydi?", options: ["Qaysi yo'lda routerlar kamroq bo'lsa", "Liniyalar narxi yig'indisi eng kichik yo'l", "Tasodifiy"], answer: 1, explain: "OSPF — yo'l narxi (tezlikka qarab). RIP esa faqat routerlar sonini (hop) sanaydi — bu yerda ikkala yo'l ham 2 hop bo'lardi." },
  },
  {
    say: "To'satdan R1–R2 kabeli uzildi! Routerlar bir-biriga «salom» (hello) yuborib turadi; R2 dan javob kelmay qoldi. Bu paket yo'lda yo'qoldi.",
    broken: ["R1-R2"],
    flights: [{ from: "A", to: "srv", label: "→ 10.4.0.10", via: ["R1", "R2"], lostAt: "R2" }],
    marks: { R1: { text: "R2 javob bermayapti!", tone: "warn", at: 1.4 } },
  },
  {
    say: "Routerlar yangi xaritani bir-biriga tarqatdi va R1 jadvalni yangiladi: endi 10.4.0.0/16 ga R3 orqali. Sekinroq, lekin ishlaydi — inson aralashuvisiz.",
    broken: ["R1-R2"],
    flights: [{ from: "A", to: "srv", label: "→ 10.4.0.10", via: ["R1", "R3", "R4"] }],
    marks: { srv: { text: "Keldi", tone: "ok" } },
    panel: t1(1, true),
    ask: { q: "R1–R2 uzilgandan keyin paket qaysi router orqali o'tadi?", pick: "R3", explain: "R3 orqali: dinamik marshrutlash avtomatik ravishda aylanma yo'lni topdi." },
  },
  { say: "Xulosa: statik marshrut — administrator qo'lda yozadi, oddiy, lekin uzilishni sezmaydi. Dinamik (RIP, OSPF, BGP) — routerlar o'zlari kelishib, buzilishda yo'lni o'zgartiradi. 0.0.0.0/0 — «boshqa hamma narsa» uchun default yo'l.", panel: t1(2) },
];

export default function RoutingStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={400} title="Router yo'lni qanday tanlaydi?" />;
}
