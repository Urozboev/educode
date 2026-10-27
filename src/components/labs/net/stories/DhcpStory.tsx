"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** DHCP: yangi kompyuter manzilni to'rt xabarda oladi (DORA). */

const nodes: SceneNode[] = [
  { id: "nb", kind: "laptop", x: 100, y: 110, label: "Yangi noutbuk", sub: "IP: yo'q" },
  { id: "pc", kind: "pc", x: 100, y: 300, label: "Kompyuter", sub: "192.168.1.11" },
  { id: "sw", kind: "switch", x: 340, y: 205, label: "Kommutator" },
  { id: "dhcp", kind: "server", x: 590, y: 110, label: "DHCP server", sub: "192.168.1.2" },
  { id: "r", kind: "router", x: 590, y: 300, label: "Router (shlyuz)", sub: "192.168.1.1" },
];
const links: SceneLink[] = [{ a: "nb", b: "sw" }, { a: "pc", b: "sw" }, { a: "sw", b: "dhcp" }, { a: "sw", b: "r" }];

const pool = (lease: string[][], hl?: number) => <MiniTable title="DHCP server: berilgan manzillar" head={["IP", "Kimga (MAC)", "Muddat"]} rows={lease} highlight={hl} />;
const L0 = [["192.168.1.11", "AA:11", "8 soat"]];
const L1 = [...L0, ["192.168.1.12", "BB:22 (noutbuk)", "8 soat"]];

const steps: Step[] = [
  {
    say: "Talaba yangi noutbukni tarmoqqa uladi. Unda hali IP manzil yo'q va u DHCP server qayerdaligini ham bilmaydi. Nima qiladi? Hammaga baqiradi.",
    focus: ["nb"],
    panel: pool(L0),
  },
  {
    say: "1) DISCOVER: «Bu yerda DHCP server bormi?» — broadcast, ya'ni hamma oladi. Kompyuter va router e'tibor bermaydi, faqat DHCP server javob beradi.",
    flights: [{ from: "nb", to: "dhcp", label: "DISCOVER", tone: "amber" }, { from: "nb", to: "pc", label: "DISCOVER", tone: "amber" }, { from: "nb", to: "r", label: "DISCOVER", tone: "amber" }],
    marks: { pc: { text: "Menga emas", tone: "info" }, r: { text: "Menga emas", tone: "info" }, dhcp: { text: "Men bor!", tone: "ok" } },
    ask: { q: "Noutbuk DISCOVER ni kimga yuboradi?", options: ["To'g'ridan-to'g'ri DHCP serverga", "Hammaga (broadcast) — server manzilini bilmaydi", "Routerga"], answer: 1, explain: "Noutbuk hali hech kimning manzilini bilmaydi, shuning uchun broadcast (255.255.255.255) yuboradi." },
  },
  {
    say: "2) OFFER: server bo'sh manzilni tanlab taklif qiladi: «192.168.1.12 ni ol, maska /24, shlyuz .1, DNS .2, muddat 8 soat».",
    flights: [{ from: "dhcp", to: "nb", label: "OFFER .12", tone: "green" }],
    panel: pool(L0),
    ask: { q: "Serverda .11 band. Keyingi bo'sh manzilni tanlang:", options: ["192.168.1.11", "192.168.1.12", "192.168.1.255"], answer: 1, explain: ".11 band, .255 — broadcast. Bo'sh birinchi manzil — .12." },
  },
  {
    say: "3) REQUEST: noutbuk «Ha, .12 ni olaman» deydi — yana broadcast, chunki tarmoqda boshqa DHCP serverlar ham bo'lishi mumkin: ular taklifi qabul qilinmaganini bilsin.",
    flights: [{ from: "nb", to: "dhcp", label: "REQUEST .12", tone: "amber" }],
  },
  {
    say: "4) ACK: server tasdiqlaydi va manzilni jadvalga yozadi. Endi noutbuk 192.168.1.12 bilan ishlaydi.",
    flights: [{ from: "dhcp", to: "nb", label: "ACK ✓", tone: "green" }],
    subs: { nb: "192.168.1.12" },
    marks: { nb: { text: "Manzil oldim", tone: "ok" } },
    panel: pool(L1, 1),
    ask: { q: "DHCP ning 4 ta xabari to'g'ri tartibda:", options: ["Request → Offer → Discover → Ack", "Discover → Offer → Request → Ack", "Offer → Discover → Ack → Request"], answer: 1, explain: "DORA: Discover → Offer → Request → Ack." },
  },
  {
    say: "Agar DHCP server o'chiq bo'lsa, javob kelmaydi. Windows bir oz kutib, o'ziga 169.254.x.x manzil beradi — bu bilan Internetga chiqib bo'lmaydi. Bu belgi: «DHCP ni tekshiring».",
    broken: ["dhcp"],
    subs: { nb: "169.254.31.7" },
    flights: [{ from: "nb", to: "dhcp", label: "DISCOVER", tone: "amber", lostAt: "dhcp" }],
    marks: { nb: { text: "Javob yo'q → 169.254…", tone: "warn" } },
  },
  { say: "Xulosa: DHCP har kompyuterga IP, maska, shlyuz va DNS ni avtomatik beradi va muddat tugaganda manzilni qaytarib oladi. 100 ta kompyuterni qo'lda sozlash shart emas.", subs: { nb: "192.168.1.12" }, panel: pool(L1) },
];

export default function DhcpStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="DHCP: manzil qanday olinadi?" />;
}
