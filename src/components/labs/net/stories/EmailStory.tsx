"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Elektron pochta: SMTP bilan jo'natiladi, MX orqali topiladi, IMAP bilan o'qiladi. */

const nodes: SceneNode[] = [
  { id: "ali", kind: "laptop", x: 80, y: 120, label: "Ali", sub: "ali@tatu.uz" },
  { id: "m1", kind: "server", x: 260, y: 120, label: "tatu.uz pochtasi" },
  { id: "dns", kind: "server", x: 420, y: 300, label: "DNS" },
  { id: "net", kind: "cloud", x: 420, y: 120, label: "Internet" },
  { id: "m2", kind: "server", x: 580, y: 120, label: "gmail.com pochtasi" },
  { id: "vali", kind: "phone", x: 700, y: 280, label: "Vali", sub: "vali@gmail.com" },
];
const links: SceneLink[] = [{ a: "ali", b: "m1" }, { a: "m1", b: "net" }, { a: "net", b: "m2" }, { a: "m1", b: "dns" }, { a: "m2", b: "vali" }];

const steps: Step[] = [
  {
    say: "Ali Valiga xat yozdi va «Yuborish» ni bosdi. Xat avval Alining o'z pochta serveriga SMTP protokoli bilan ketadi — xuddi xatni mahalla pochta bo'limiga topshirgandek.",
    flights: [{ from: "ali", to: "m1", label: "SMTP: xat" }],
    ask: { q: "Xat jo'natish uchun qaysi protokol ishlatiladi?", options: ["IMAP", "SMTP", "HTTP", "DHCP"], answer: 1, explain: "SMTP (Simple Mail Transfer Protocol) — xat yuborish va serverlar orasida uzatish uchun." },
  },
  {
    say: "tatu.uz serveri gmail.com pochtasi qayerda ekanini bilmaydi. U DNS dan so'raydi: «gmail.com ning MX yozuvi qanday?» MX — shu domen xatlarini qabul qiluvchi server.",
    flights: [{ from: "m1", to: "dns", label: "gmail.com MX?", tone: "amber" }, { from: "dns", to: "m1", label: "MX: gmail-smtp-in…", tone: "amber", delay: 1.4 }],
    ask: { q: "Domenning pochta serverini qaysi DNS yozuvi ko'rsatadi?", options: ["A", "MX", "CNAME", "TXT"], answer: 1, explain: "MX (Mail eXchanger) — xatlar qaysi serverga yetkazilishini aytadi." },
  },
  {
    say: "Endi serverlar o'zaro gaplashadi: tatu.uz xatni SMTP bilan gmail serveriga uzatadi. Gmail spam va virusga tekshirib, xatni Valining qutisiga qo'yadi.",
    flights: [{ from: "m1", to: "m2", label: "SMTP: xat" }],
    marks: { m2: { text: "Valining qutisiga", tone: "ok", at: 2.2 } },
  },
  {
    say: "Vali telefonni ochdi. Pochta ilovasi serverdan IMAP orqali yangi xatlarni so'raydi. Xat serverda qoladi — kompyuterdan ham, telefondan ham ko'rinadi.",
    flights: [{ from: "vali", to: "m2", label: "IMAP: yangi bormi?", tone: "purple" }, { from: "m2", to: "vali", label: "1 ta yangi xat", tone: "green", delay: 1.3 }],
    marks: { vali: { text: "Xat keldi ✉", tone: "ok", at: 2.4 } },
    ask: { q: "Vali xatni hamma qurilmasida ko'rishi uchun qaysi protokol qulay?", options: ["POP3 — yuklab olib serverdan o'chiradi", "IMAP — xat serverda qoladi, sinxronlanadi"], answer: 1, explain: "IMAP xatlarni serverda saqlab, barcha qurilmalarni sinxron ushlaydi. POP3 odatda bitta qurilmaga yuklab oladi." },
  },
  {
    say: "Agar Ali manzilni xato yozsa (vali@gmial.com), DNS bunday domen uchun MX topa olmaydi va tatu.uz serveri Aliga «yetkazilmadi» degan xat qaytaradi.",
    flights: [{ from: "m1", to: "ali", label: "Undeliverable", tone: "red" }],
    marks: { ali: { text: "Xat qaytdi", tone: "drop", at: 1.1 } },
  },
  { say: "Xulosa: jo'natish — SMTP (25/587), qabul qilish — IMAP (993) yoki POP3 (995), qaysi serverga — DNS dagi MX yozuvi. Xat yo'lda bir necha server orqali o'tadi, xuddi oddiy pochta kabi." },
];

export default function EmailStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={380} title="Xat Alidan Valiga qanday boradi?" />;
}
