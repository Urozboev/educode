"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Elektron pochta: SMTP bilan jo'natiladi, MX orqali topiladi, IMAP bilan o'qiladi. */

const nodes: SceneNode[] = [
  { id: "ali", kind: "laptop", x: 80, y: 120, label: "Ali", sub: "ali@tatu.uz" },
  { id: "m1", kind: "server", x: 260, y: 120, label: "tatu.uz poçtasi" },
  { id: "dns", kind: "server", x: 420, y: 300, label: "DNS" },
  { id: "net", kind: "cloud", x: 420, y: 120, label: "Internet" },
  { id: "m2", kind: "server", x: 580, y: 120, label: "gmail.com poçtasi" },
  { id: "vali", kind: "phone", x: 700, y: 280, label: "Vali", sub: "vali@gmail.com" },
];
const links: SceneLink[] = [{ a: "ali", b: "m1" }, { a: "m1", b: "net" }, { a: "net", b: "m2" }, { a: "m1", b: "dns" }, { a: "m2", b: "vali" }];

const steps: Step[] = [
  {
    say: "Ali Valiga xat yozdi va «Yuboriş» ni bosdi. Xat avval Alining öz poçta serveriga SMTP protokoli bilan ketadi — xuddi xatni mahalla poçta bölimiga topşirgandek.",
    flights: [{ from: "ali", to: "m1", label: "SMTP: xat" }],
    ask: { q: "Xat jönatiş uçun qaysi protokol işlatiladi?", options: ["IMAP", "SMTP", "HTTP", "DHCP"], answer: 1, explain: "SMTP (Simple Mail Transfer Protocol) — xat yuboriş va serverlar orasida uzatiş uçun." },
  },
  {
    say: "tatu.uz serveri gmail.com poçtasi qayerda ekanini bilmaydi. U DNS dan söraydi: «gmail.com ning MX yozuvi qanday?» MX — şu domen xatlarini qabul qiluvçi server.",
    flights: [{ from: "m1", to: "dns", label: "gmail.com MX?", tone: "amber" }, { from: "dns", to: "m1", label: "MX: gmail-smtp-in…", tone: "amber", delay: 1.4 }],
    ask: { q: "Domenning poçta serverini qaysi DNS yozuvi körsatadi?", options: ["A", "MX", "CNAME", "TXT"], answer: 1, explain: "MX (Mail eXchanger) — xatlar qaysi serverga yetkazilişini aytadi." },
  },
  {
    say: "Endi serverlar özaro gaplaşadi: tatu.uz xatni SMTP bilan gmail serveriga uzatadi. Gmail spam va virusga tekşirib, xatni Valining qutisiga qöyadi.",
    flights: [{ from: "m1", to: "m2", label: "SMTP: xat" }],
    marks: { m2: { text: "Valining qutisiga", tone: "ok", at: 2.2 } },
  },
  {
    say: "Vali telefonni oçdi. Poçta ilovasi serverdan IMAP orqali yangi xatlarni söraydi. Xat serverda qoladi — kompyuterdan ham, telefondan ham körinadi.",
    flights: [{ from: "vali", to: "m2", label: "IMAP: yangi bormi?", tone: "purple" }, { from: "m2", to: "vali", label: "1 ta yangi xat", tone: "green", delay: 1.3 }],
    marks: { vali: { text: "Xat keldi ✉", tone: "ok", at: 2.4 } },
    ask: { q: "Vali xatni hamma qurilmasida körişi uçun qaysi protokol qulay?", options: ["POP3 — yuklab olib serverdan öçiradi", "IMAP — xat serverda qoladi, sinxronlanadi"], answer: 1, explain: "IMAP xatlarni serverda saqlab, barça qurilmalarni sinxron uşlaydi. POP3 odatda bitta qurilmaga yuklab oladi." },
  },
  {
    say: "Agar Ali manzilni xato yozsa (vali@gmial.com), DNS bunday domen uçun MX topa olmaydi va tatu.uz serveri Aliga «yetkazilmadi» degan xat qaytaradi.",
    flights: [{ from: "m1", to: "ali", label: "Undeliverable", tone: "red" }],
    marks: { ali: { text: "Xat qaytdi", tone: "drop", at: 1.1 } },
  },
  { say: "Xulosa: jönatiş — SMTP (25/587), qabul qiliş — IMAP (993) yoki POP3 (995), qaysi serverga — DNS dagi MX yozuvi. Xat yölda bir neça server orqali ötadi, xuddi oddiy poçta kabi." },
];

export default function EmailStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={380} title="Xat Alidan Valiga qanday boradi?" />;
}
