"use client";

import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/** TCP — kafolatli yetkazish (salomlashish, tasdiq, qayta yuborish); UDP — tez, kafolatsiz. */

const nodes: SceneNode[] = [
  { id: "c", kind: "laptop", x: 100, y: 170, label: "Talaba", sub: "port 50123" },
  { id: "net", kind: "cloud", x: 380, y: 170, label: "Internet" },
  { id: "s", kind: "server", x: 660, y: 170, label: "Server", sub: "port 443" },
];
const links: SceneLink[] = [{ a: "c", b: "net" }, { a: "net", b: "s" }];

const TCP: Step[] = [
  {
    say: "TCP maʼlumot yuborişdan oldin «salomlaşadi» — uç qadamli qöl beriş. 1) SYN: «Ulanaylikmi?»",
    flights: [{ from: "c", to: "s", label: "SYN", tone: "amber" }],
  },
  {
    say: "2) SYN-ACK: «Ha, tayyorman». 3) ACK: «Qabul qildim». Endi ulaniş örnatildi.",
    flights: [{ from: "s", to: "c", label: "SYN-ACK", tone: "amber" }, { from: "c", to: "s", label: "ACK", tone: "green", delay: 2.4 }],
    marks: { c: { text: "Ulandi", tone: "ok", at: 4.6 }, s: { text: "Ulandi", tone: "ok", at: 4.6 } },
    ask: { q: "TCP ulanişi örnatilişining töğri tartibi:", options: ["ACK → SYN → SYN-ACK", "SYN → SYN-ACK → ACK", "SYN → ACK → FIN"], answer: 1, explain: "Uç qadamli qöl beriş: SYN → SYN-ACK → ACK." },
  },
  {
    say: "Fayl bölaklarga (segmentlarga) bölinib, har biriga tartib raqami qöyiladi. Server har biriga «oldim» (ACK) deb javob beradi.",
    flights: [{ from: "c", to: "s", label: "#1" }, { from: "c", to: "s", label: "#2", delay: 0.6 }, { from: "s", to: "c", label: "ACK 1,2", tone: "green", delay: 2.8 }],
  },
  {
    say: "#3 segment yo'lda yo'qoldi. Server #4 ni oldi, lekin #3 yo'q — u hali ham «#3 ni kutyapman» deb javob beradi.",
    flights: [{ from: "c", to: "s", label: "#3", lostAt: "net" }, { from: "c", to: "s", label: "#4", delay: 0.6 }, { from: "s", to: "c", label: "ACK: #3 kerak", tone: "amber", delay: 2.8 }],
    marks: { net: { text: "#3 yo'qoldi", tone: "drop", at: 1.2 } },
    ask: { q: "Mijoz «#3 kerak» degan javobni oldi. Nima qiladi?", options: ["Hamma faylni boşidan yuboradi", "Faqat #3 ni qayta yuboradi", "Heç narsa — #3 siz ham böladi"], answer: 1, explain: "Faqat yöqolgan segment qayta yuboriladi. Server #4 ni saqlab turgan, #3 kelgaç ularni tartib bilan yiğadi." },
  },
  {
    say: "#3 qayta yuborildi. Server endi #1–#4 ni tartib bilan yig'ib, faylni to'liq oldi. TCP kafolati: hech narsa yo'qolmaydi va tartib buzilmaydi.",
    flights: [{ from: "c", to: "s", label: "#3 (qayta)", tone: "purple" }, { from: "s", to: "c", label: "ACK 4", tone: "green", delay: 2.4 }],
    marks: { s: { text: "Fayl töliq ✓", tone: "ok", at: 2.3 } },
  },
  { say: "Iş tugagaç, ikki tomon FIN bilan xayrlaşadi. TCP işlatiladi: web sahifalar (HTTP/HTTPS), poçta, fayl yuklaş — bitta bayt ham yöqolmasligi kerak bölgan joylarda.", flights: [{ from: "c", to: "s", label: "FIN", tone: "pink" }, { from: "s", to: "c", label: "FIN-ACK", tone: "pink", delay: 2.4 }] },
];

const vnodes: SceneNode[] = [
  { id: "c", kind: "laptop", x: 100, y: 170, label: "Talaba", sub: "video qönğiroq" },
  { id: "net", kind: "cloud", x: 380, y: 170, label: "Internet" },
  { id: "s", kind: "laptop", x: 660, y: 170, label: "Dösti" },
];
const UDP: Step[] = [
  {
    say: "UDP salomlaşmaydi va tasdiq kutmaydi — şunçaki yuboraveradi. Video qönğiroqda har soniyada önlab kadr ketadi.",
    flights: [1, 2, 3, 4].map((k) => ({ from: "c", to: "s", label: `kadr ${k}`, tone: "pink" as const, delay: (k - 1) * 0.55 })),
  },
  {
    say: "3-kadr yöqoldi. UDP uni qayta yubormaydi — ekranda bir lahza tasvir qotadi, keyin suhbat davom etadi. Keçikib kelgan eski kadr baribir kerak emas edi.",
    flights: [1, 2, 3, 4].map((k) => ({ from: "c", to: "s", label: `kadr ${k}`, tone: "pink" as const, delay: (k - 1) * 0.55, lostAt: k === 3 ? "net" : undefined })),
    marks: { s: { text: "Bir lahza qotdi", tone: "warn", at: 3.4 } },
    ask: { q: "Nega video qönğiroq UDP işlatadi?", options: ["UDP xavfsizroq", "Keçikkan kadrni qayta kutgandan köra, ötkazib yuborgan yaxşi", "UDP har doim yetkazadi"], answer: 1, explain: "Jonli ovoz/videoda tezlik muhim: 1 soniya keçikkan kadrni kutiş suhbatni buzadi." },
  },
  {
    say: "Har ilova öz işiga mosini tanlaydi.",
    ask: { q: "Qaysi biri UDP ga mos?", options: ["Bank ötkazmasi", "Onlayn öyin (öyinçi joylaşuvi)", "Elektron poçta", "Dastur yuklab oliş"], answer: 1, explain: "Öyinda eng yangi holat muhim, eski paketni qayta kutiş foydasiz. Qolganlari — TCP: bitta bayt ham yöqolmasligi kerak." },
  },
  { say: "Xulosa: TCP — buyurtma xati (kafolatli, tartibli, sekinroq). UDP — oçiq xat (tez, kafolatsiz). DNS sörovlari, video, ovoz, öyinlar — UDP; web, poçta, fayllar — TCP." },
];

export default function TcpStory({ initial = "tcp" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "tcp", label: "TCP: kafolatli", render: () => <Story nodes={nodes} links={links} steps={TCP} height={300} title="TCP: salomlaşiş, tasdiq, qayta yuboriş" /> },
      { key: "udp", label: "UDP: tez", render: () => <Story nodes={vnodes} links={links} steps={UDP} height={300} title="UDP: tez, lekin kafolatsiz" /> },
    ]} />
  );
}
