"use client";

import { Story, Console, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/**
 * "ping 8.8.8.8" — paket kompyuterdan Internetdagi servergacha.
 * Bitta voqeada uchta asosiy g'oya: o'z tarmog'i yoki boshqa tarmoq,
 * ARP (MAC ni topish) va router orqali uzatish.
 */

const nodes: SceneNode[] = [
  { id: "pc", kind: "pc", x: 90, y: 250, label: "Sizning kompyuter", sub: "192.168.1.10" },
  { id: "nb", kind: "laptop", x: 90, y: 85, label: "Qöşni noutbuk", sub: "192.168.1.20" },
  { id: "sw", kind: "switch", x: 245, y: 170, label: "Kommutator" },
  { id: "r", kind: "router", x: 420, y: 170, label: "Router (şlyuz)", sub: "192.168.1.1" },
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
    say: "Kompyuter avval öylaydi: «8.8.8.8 mening tarmoğimdami? Mening tarmoğim — 192.168.1.x. Yöq, bu boşqa tarmoq. Demak paketni routerga (şlyuzga) berişim kerak.»",
    focus: ["pc", "r"],
    marks: { pc: { text: "Boşqa tarmoq → routerga", at: 0.2 } },
    ask: {
      q: "Kompyuter 192.168.1.10, server 8.8.8.8. Kompyuter paketni birinçi navbatda kimga beradi?",
      pick: "r",
      hint: "8.8.8.8 kompyuter tarmoğida (192.168.1.x) emas. Boşqa tarmoqqa kim olib çiqadi?",
      explain: "Manzil boşqa tarmoqda — paket şlyuzga, yaʼni routerga beriladi. Kommutator faqat öz tarmoği içida yetkazadi.",
    },
  },
  {
    say: "Lekin kabel orqali yuboriş uçun routerning MAC manzili kerak, kompyuter esa uni bilmaydi. U butun tarmoqqa söroq yuboradi: «IP manzili 192.168.1.1 bölgan kim?» — bu ARP sörovi.",
    flights: [{ from: "pc", to: "nb", label: "ARP: 192.168.1.1 kim?", tone: "amber" }, { from: "pc", to: "r", label: "ARP: 192.168.1.1 kim?", tone: "amber" }],
    marks: { nb: { text: "Men emas", tone: "drop" }, r: { text: "Men!", tone: "ok" } },
    ask: {
      q: "ARP sörovi qanday yuboriladi?",
      options: ["Faqat routerga", "Tarmoqdagi hammaga (broadcast)", "Internetga"],
      answer: 1,
      hint: "Kompyuter routerning MAC manzilini bilmaydi — demak töğridan-töğri unga yubora olmaydi.",
      explain: "MAC nomaʼlum bölgani uçun sörov hammaga ketadi. Faqat 192.168.1.1 egasi — router — javob beradi.",
    },
  },
  {
    say: "Router javob beradi: «Men! MAC manzilim — 3C-84-6A-11-0F-20». Kompyuter buni eslab qoladi, keyingi safar söramaydi.",
    flights: [{ from: "r", to: "pc", label: "ARP javob", tone: "amber" }],
    marks: { pc: { text: "Router MAC — eslab qoldim", tone: "ok" } },
    panel: <MiniTable title="Kompyuterning ARP xotirasi (arp -a)" head={["IP", "MAC"]} rows={[["192.168.1.1", "3c-84-6a-11-0f-20"]]} highlight={0} />,
  },
  {
    say: "Endi ping paketi routerga ketadi. Router manzilga qaraydi va paketni Internetga — provayderga uzatadi. Yöldagi har bir router paketning TTL hisoblagiçini 1 ga kamaytiradi.",
    flights: [{ from: "pc", to: "srv", label: "ping", tone: "blue" }],
    marks: { r: { text: "TTL 128 → 127", at: 2.2 }, srv: { text: "Sörov keldi", tone: "ok" } },
    ask: {
      q: "Paket routerdan ötganda TTL qiymati qanday özgaradi?",
      options: ["Oshadi", "1 ga kamayadi", "O'zgarmaydi", "Nolga tuşadi"],
      answer: 1,
      explain: "Har router TTL ni 1 ga kamaytiradi. TTL 0 bölsa paket taşlanadi — bu paketlarning tarmoqda abadiy aylanib qolişiga yöl qöymaydi.",
    },
  },
  {
    say: "Google serveri javob qaytardi. Javob ham xuddi şu yöl bilan orqaga keldi — hammasi taxminan 28 millisekundda.",
    flights: [{ from: "srv", to: "pc", label: "javob", tone: "green" }],
    marks: { pc: { text: "Javob keldi!", tone: "ok" } },
    panel: <Console lines={["C:\\> ping 8.8.8.8", "Reply from 8.8.8.8: bytes=32 time=28ms TTL=117"]} />,
  },
  {
    say: "Xulosa: öz tarmoğidagi qurilmaga kompyuter töğridan-töğri yuboradi, boşqa tarmoqqa esa — router (şlyuz) orqali. MAC manzilni ARP topadi. IP manzillar yöl böyi özgarmaydi.",
  },
];

export default function PingStory() {
  return <Story nodes={nodes} links={links} steps={steps} title="ping 8.8.8.8 — paket qayerlardan ötadi?" />;
}
