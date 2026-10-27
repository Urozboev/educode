"use client";

import { Story, Console, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/**
 * "ping 8.8.8.8" — paket kompyuterdan Internetdagi servergacha.
 * Bitta voqeada uchta asosiy g'oya: o'z tarmog'i yoki boshqa tarmoq,
 * ARP (MAC ni topish) va router orqali uzatish.
 */

const nodes: SceneNode[] = [
  { id: "pc", kind: "pc", x: 90, y: 250, label: "Sizning kompyuter", sub: "192.168.1.10" },
  { id: "nb", kind: "laptop", x: 90, y: 85, label: "Qo'shni noutbuk", sub: "192.168.1.20" },
  { id: "sw", kind: "switch", x: 245, y: 170, label: "Kommutator" },
  { id: "r", kind: "router", x: 420, y: 170, label: "Router (shlyuz)", sub: "192.168.1.1" },
  { id: "net", kind: "cloud", x: 565, y: 170, label: "Internet", sub: "provayderlar" },
  { id: "srv", kind: "server", x: 690, y: 170, label: "Google DNS", sub: "8.8.8.8" },
];
const links: SceneLink[] = [
  { a: "pc", b: "sw" }, { a: "nb", b: "sw" }, { a: "sw", b: "r" }, { a: "r", b: "net" }, { a: "net", b: "srv" },
];

const steps: Step[] = [
  {
    say: "Siz buyruq qatoriga ping 8.8.8.8 yozdingiz: «Google serveri, javob ber!»",
    focus: ["pc"],
    panel: <Console lines={["C:\\> ping 8.8.8.8"]} />,
  },
  {
    say: "Kompyuter avval o'ylaydi: «8.8.8.8 mening tarmog'imdami? Mening tarmog'im — 192.168.1.x. Yo'q, bu boshqa tarmoq. Demak paketni routerga (shlyuzga) berishim kerak.»",
    focus: ["pc", "r"],
    marks: { pc: { text: "Boshqa tarmoq → routerga", at: 0.2 } },
    ask: {
      q: "Kompyuter 192.168.1.10, server 8.8.8.8. Kompyuter paketni birinchi navbatda kimga beradi?",
      pick: "r",
      hint: "8.8.8.8 kompyuter tarmog'ida (192.168.1.x) emas. Boshqa tarmoqqa kim olib chiqadi?",
      explain: "Manzil boshqa tarmoqda — paket shlyuzga, ya'ni routerga beriladi. Kommutator faqat o'z tarmog'i ichida yetkazadi.",
    },
  },
  {
    say: "Lekin kabel orqali yuborish uchun routerning MAC manzili kerak, kompyuter esa uni bilmaydi. U butun tarmoqqa so'roq yuboradi: «IP manzili 192.168.1.1 bo'lgan kim?» — bu ARP so'rovi.",
    flights: [{ from: "pc", to: "nb", label: "ARP: 192.168.1.1 kim?", tone: "amber" }, { from: "pc", to: "r", label: "ARP: 192.168.1.1 kim?", tone: "amber" }],
    marks: { nb: { text: "Men emas", tone: "drop" }, r: { text: "Men!", tone: "ok" } },
    ask: {
      q: "ARP so'rovi qanday yuboriladi?",
      options: ["Faqat routerga", "Tarmoqdagi hammaga (broadcast)", "Internetga"],
      answer: 1,
      hint: "Kompyuter routerning MAC manzilini bilmaydi — demak to'g'ridan-to'g'ri unga yubora olmaydi.",
      explain: "MAC noma'lum bo'lgani uchun so'rov hammaga ketadi. Faqat 192.168.1.1 egasi — router — javob beradi.",
    },
  },
  {
    say: "Router javob beradi: «Men! MAC manzilim — 3C-84-6A-11-0F-20». Kompyuter buni eslab qoladi, keyingi safar so'ramaydi.",
    flights: [{ from: "r", to: "pc", label: "ARP javob", tone: "amber" }],
    marks: { pc: { text: "Router MAC — eslab qoldim", tone: "ok" } },
    panel: <MiniTable title="Kompyuterning ARP xotirasi (arp -a)" head={["IP", "MAC"]} rows={[["192.168.1.1", "3c-84-6a-11-0f-20"]]} highlight={0} />,
  },
  {
    say: "Endi ping paketi routerga ketadi. Router manzilga qaraydi va paketni Internetga — provayderga uzatadi. Yo'ldagi har bir router paketning TTL hisoblagichini 1 ga kamaytiradi.",
    flights: [{ from: "pc", to: "srv", label: "ping", tone: "blue" }],
    marks: { r: { text: "TTL 128 → 127", at: 2.2 }, srv: { text: "So'rov keldi", tone: "ok" } },
    ask: {
      q: "Paket routerdan o'tganda TTL qiymati qanday o'zgaradi?",
      options: ["Oshadi", "1 ga kamayadi", "O'zgarmaydi", "Nolga tushadi"],
      answer: 1,
      explain: "Har router TTL ni 1 ga kamaytiradi. TTL 0 bo'lsa paket tashlanadi — bu paketlarning tarmoqda abadiy aylanib qolishiga yo'l qo'ymaydi.",
    },
  },
  {
    say: "Google serveri javob qaytardi. Javob ham xuddi shu yo'l bilan orqaga keldi — hammasi taxminan 28 millisekundda.",
    flights: [{ from: "srv", to: "pc", label: "javob", tone: "green" }],
    marks: { pc: { text: "Javob keldi!", tone: "ok" } },
    panel: <Console lines={["C:\\> ping 8.8.8.8", "Reply from 8.8.8.8: bytes=32 time=28ms TTL=117"]} />,
  },
  {
    say: "Xulosa: o'z tarmog'idagi qurilmaga kompyuter to'g'ridan-to'g'ri yuboradi, boshqa tarmoqqa esa — router (shlyuz) orqali. MAC manzilni ARP topadi. IP manzillar yo'l bo'yi o'zgarmaydi.",
  },
];

export default function PingStory() {
  return <Story nodes={nodes} links={links} steps={steps} title="ping 8.8.8.8 — paket qayerlardan o'tadi?" />;
}
