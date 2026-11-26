"use client";

import { Story, Console, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/**
 * DNS: "miracademy.uz" qanday qilib raqamga aylanadi.
 * Kundalik o'xshatish: ma'lumotnoma xizmati — u o'zi bilmasa,
 * bilganidan so'rab, javobni sizga olib keladi va eslab qoladi.
 */

const nodes: SceneNode[] = [
  { id: "pc", kind: "laptop", x: 85, y: 215, label: "Sizning brauzer" },
  { id: "dns", kind: "server", x: 275, y: 215, label: "Provayder DNS", sub: "ma'lumotnoma" },
  { id: "root", kind: "server", x: 480, y: 80, label: "Ildiz server", sub: "( . )" },
  { id: "tld", kind: "server", x: 670, y: 200, label: ".uz serveri" },
  { id: "auth", kind: "server", x: 480, y: 340, label: "miracademy.uz DNS", sub: "ns1" },
  { id: "web", kind: "server", x: 670, y: 370, label: "Sayt serveri", sub: "76.76.21.21" },
];
const links: SceneLink[] = [{ a: "pc", b: "dns" }, { a: "dns", b: "root" }, { a: "dns", b: "tld" }, { a: "dns", b: "auth" }];

const steps: Step[] = [
  {
    say: "Siz brauzerga miracademy.uz deb yozdingiz. Lekin kompyuterlar nomlarni emas, raqamlarni (IP manzilni) tuşunadi. Nomni raqamga aylantiriş kerak.",
    focus: ["pc"],
  },
  {
    say: "Kompyuter provayderning DNS serveridan söraydi: «miracademy.uz ning manzili qanday?» Bu xuddi maʼlumotnoma xizmatiga qönğiroq qilişdek.",
    flights: [{ from: "pc", to: "dns", label: "miracademy.uz ?" }],
    marks: { dns: { text: "Xotiramda yöq — sörab beraman" } },
  },
  {
    say: "DNS server eng tepadagi — ildiz serverdan söraydi. Ildiz hamma saytni bilmaydi, lekin .uz domenlari bilan kim şuğullanişini biladi.",
    flights: [{ from: "dns", to: "root", label: "miracademy.uz ?" }, { from: "root", to: "dns", label: "→ .uz ga söra", tone: "amber", delay: 1.3 }],
    focus: ["dns", "root"],
    ask: {
      q: "Provayder DNS serveri javobni bilmaydi. U birinçi navbatda kimdan söraydi?",
      pick: "root",
      hint: "Nomlar daraxtining eng tepasidan boşlanadi.",
      explain: "Eng yuqoridagi — ildiz serverdan. U .uz domenlari qaysi serverda ekanini aytib beradi.",
    },
  },
  {
    say: ".uz serveri ham aniq manzilni bilmaydi, lekin miracademy.uz uchun kimning serveri javobgar ekanini aytadi.",
    flights: [{ from: "dns", to: "tld", label: "miracademy.uz ?" }, { from: "tld", to: "dns", label: "→ ns1 ga söra", tone: "amber", delay: 1.3 }],
    focus: ["dns", "tld"],
  },
  {
    say: "Nihoyat saytning öz DNS serveri aniq javob beradi: 76.76.21.21.",
    flights: [{ from: "dns", to: "auth", label: "miracademy.uz ?" }, { from: "auth", to: "dns", label: "76.76.21.21", tone: "green", delay: 1.3 }],
    marks: { auth: { text: "Buni aniq bilaman!", tone: "ok", at: 1.1 } },
    focus: ["dns", "auth"],
  },
  {
    say: "Javob kompyuterga yetkaziladi va provayder serveri uni eslab qoladi.",
    flights: [{ from: "dns", to: "pc", label: "76.76.21.21", tone: "green" }],
    marks: { dns: { text: "5 daqiqa eslab qoldim", at: 0.2 }, pc: { text: "Manzil topildi", tone: "ok" } },
    ask: {
      q: "5 daqiqadan keyin qöşningiz ham miracademy.uz ni oçdi. Provayder DNS serveri nima qiladi?",
      options: ["Yana ildiz serverdan söraydi", "Xotiradagi javobni darhol beradi", "Javob bermaydi"],
      answer: 1,
      explain: "Javob 5 daqiqa (TTL = 300 s) eslab qolinadi, şu muddat içida sörovlar darhol javob oladi. Muddat tugagaç yana söraladi.",
    },
    panel: <MiniTable title="DNS xotirasi (keş)" head={["Nom", "IP", "Muddat"]} rows={[["miracademy.uz", "76.76.21.21", "300 s"]]} highlight={0} />,
  },
  {
    say: "Endi brauzer saytning öziga murojaat qiladi va sahifa oçiladi. Bularning hammasi bir soniyaning kiçik uluşida sodir böladi.",
    flights: [{ from: "pc", to: "web", label: "sahifani ber", via: [] }, { from: "web", to: "pc", label: "sahifa", tone: "green", via: [], delay: 1.4 }],
    focus: ["pc", "web"],
    marks: { pc: { text: "Sayt oçildi!", tone: "ok", at: 2.6 } },
  },
  {
    say: "Özingiz tekşiring: buyruq qatorida nslookup miracademy.uz yozing — DNS qaytargan manzilni körasiz.",
    panel: <Console lines={["C:\\> nslookup miracademy.uz", "Non-authoritative answer:", "Name:    miracademy.uz", "Address:  76.76.21.21"]} />,
  },
];

export default function DnsStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={470} title="DNS: nom qanday qilib manzilga aylanadi?" />;
}
