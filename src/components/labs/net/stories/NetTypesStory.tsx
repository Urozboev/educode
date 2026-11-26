"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Tarmoq turlari: kichigidan kattasigacha, bitta universitet misolida. */

const nodes: SceneNode[] = [
  { id: "ph", kind: "phone", x: 70, y: 95, label: "Telefon" },
  { id: "nb", kind: "laptop", x: 120, y: 270, label: "Noutbuk" },
  { id: "sw", kind: "switch", x: 300, y: 270, label: "Kafedra kommutatori" },
  { id: "pc", kind: "pc", x: 300, y: 100, label: "Öqituvçi PC" },
  { id: "fs", kind: "server", x: 455, y: 285, label: "Fayl server" },
  { id: "r1", kind: "router", x: 470, y: 120, label: "Universitet routeri" },
  { id: "r2", kind: "router", x: 660, y: 290, label: "Filial", sub: "şahar içida" },
  { id: "net", kind: "cloud", x: 655, y: 100, label: "Internet" },
];
const links: SceneLink[] = [
  { a: "ph", b: "nb", wireless: true, label: "Bluetooth" },
  { a: "nb", b: "sw" }, { a: "pc", b: "sw" }, { a: "fs", b: "sw" }, { a: "sw", b: "r1" },
  { a: "r1", b: "r2", label: "şahar tarmoği" }, { a: "r1", b: "net" },
];
const TYPES = ["PAN", "LAN", "MAN", "WAN"];

const steps: Step[] = [
  {
    say: "Telefon va noutbuk Bluetooth orqali boğlandi — bir neça metr, bitta odamning qurilmalari. Bu PAN — şaxsiy tarmoq.",
    focus: ["ph", "nb"],
    flights: [{ from: "ph", to: "nb", label: "musiqa", tone: "pink" }],
    ask: { q: "Telefon va noutbuk Bluetooth orqali boğlandi. Bu qaysi tarmoq turi?", options: TYPES, answer: 0, explain: "PAN — şaxsiy tarmoq: bir neça metr, bitta odamning qurilmalari." },
  },
  {
    say: "Kafedradagi kompyuterlar va server bitta kommutatorga ulangan. Bitta bino, bitta taşkilot — bu LAN, lokal tarmoq.",
    focus: ["nb", "sw", "pc", "fs"],
    flights: [{ from: "nb", to: "fs", label: "hujjat" }],
    ask: { q: "Kafedra kompyuterlari bitta binoda kommutatorga ulangan. Bu qaysi tur?", options: TYPES, answer: 1, explain: "LAN — lokal tarmoq: xona, bino yoki kampus." },
  },
  {
    say: "Öqituvçi fayl serverdan maʼruza matnini oldi. Xizmatni alohida kompyuter — server beradi, qolganlari uning mijozlari. Bu mijoz-server arxitekturasi.",
    focus: ["pc", "sw", "fs"],
    flights: [{ from: "pc", to: "fs", label: "sörov" }, { from: "fs", to: "pc", label: "maʼruza.pdf", tone: "green", delay: 2.3 }],
    marks: { fs: { text: "Men xizmat beraman", tone: "ok", at: 2.2 } },
    ask: { q: "Bu tarmoqda xizmatni (faylni) kim beradi? Qurilmani bosing.", pick: "fs", explain: "Fayl server. Xizmat beruvçi alohida kompyuter bölsa — bu mijoz-server arxitekturasi." },
  },
  {
    say: "Talaba noutbukdan öqituvçi kompyuteridagi umumiy papkani oçdi — serversiz, töğridan-töğri. Ikki kompyuter teng huquqli: bu bir rangli (peer-to-peer) aloqa.",
    focus: ["nb", "sw", "pc"],
    flights: [{ from: "nb", to: "pc", label: "papka", tone: "purple" }],
  },
  {
    say: "Universitet şahar boşqa çekkasidagi filiali bilan provayderning şahar tarmoği orqali boğlangan. Bu MAN — şahar tarmoği.",
    focus: ["fs", "sw", "r1", "r2"],
    flights: [{ from: "fs", to: "r2", label: "hisobot" }],
    ask: { q: "Universitet va şahar içidagi filial orasidagi tarmoq qaysi tur?", options: TYPES, answer: 2, explain: "MAN — şahar miqyosidagi tarmoq." },
  },
  {
    say: "Talaba noutbukdan xorijdagi saytni oçdi — sörov Internet orqali boşqa mamlakatga ketdi. Mamlakatlar va qitʼalarni boğlovçi tarmoq — WAN. Internet — eng katta WAN.",
    focus: ["nb", "sw", "r1", "net"],
    flights: [{ from: "nb", to: "net", label: "sayt" }],
    ask: { q: "Internet orqali boşqa mamlakatdagi sayt oçildi. Bu qaysi tarmoq?", options: TYPES, answer: 3, explain: "WAN — global tarmoq. Internet eng katta WAN." },
  },
  { say: "Xulosa: PAN (metrlar) → LAN (bino) → MAN (şahar) → WAN (mamlakat, dunyo). Xizmatni server bersa — mijoz-server, kompyuterlar teng bölsa — bir rangli tarmoq." },
];

export default function NetTypesStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={370} title="Tarmoq turlari — kiçigidan kattasigaça" />;
}
