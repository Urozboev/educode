"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/** Ishchi guruh: har kompyuter o'z hisoblarini saqlaydi. Domen: hamma hisob bitta serverda (AD). */

const nodes: SceneNode[] = [
  { id: "p1", kind: "pc", x: 110, y: 90, label: "201-xona PC" },
  { id: "p2", kind: "pc", x: 110, y: 300, label: "202-xona PC" },
  { id: "sw", kind: "switch", x: 380, y: 195, label: "Kommutator" },
  { id: "p3", kind: "pc", x: 650, y: 300, label: "203-xona PC" },
  { id: "dc", kind: "server", x: 650, y: 90, label: "Domen kontrolleri", sub: "kafedra.local" },
];
const links: SceneLink[] = [{ a: "p1", b: "sw" }, { a: "p2", b: "sw" }, { a: "p3", b: "sw" }, { a: "dc", b: "sw" }];

const WG: Step[] = [
  {
    say: "Ishchi guruh (workgroup): har kompyuter mustaqil, foydalanuvchilar ro'yxati har birining ichida. Talaba Ali 201-xonada ishlashi uchun u yerda «ali» hisobi ochilgan.",
    hide: ["dc"],
    subs: { p1: "hisoblar: admin, ali", p2: "hisoblar: admin", p3: "hisoblar: admin" },
    marks: { p1: { text: "ali ✓ kirdi", tone: "ok" } },
  },
  {
    say: "Ali 202-xonaga o'tdi va o'sha login-parol bilan kirmoqchi. Bu kompyuter «ali» ni tanimaydi — kirish rad etildi.",
    hide: ["dc"],
    subs: { p1: "hisoblar: admin, ali", p2: "hisoblar: admin", p3: "hisoblar: admin" },
    marks: { p2: { text: "ali? Tanimayman", tone: "drop" } },
    ask: { q: "Ali hamma 3 xonada ishlashi uchun ishchi guruhda nechta hisob ochish kerak?", options: ["1 ta", "3 ta — har kompyuterda alohida", "Hisob kerak emas"], answer: 1, explain: "Ishchi guruhda markaz yo'q: har kompyuterda alohida hisob. Parol o'zgarsa — uchala joyda ham qo'lda o'zgartiriladi." },
  },
  {
    say: "100 ta talaba va 30 ta kompyuter bo'lsa — 3000 ta hisob! Ishchi guruh 10–15 kompyutergacha qulay: uy, kichik ofis.",
    hide: ["dc"],
    subs: { p1: "hisoblar: 100 ta", p2: "hisoblar: 100 ta", p3: "hisoblar: 100 ta" },
  },
];

const DOM: Step[] = [
  {
    say: "Domen: barcha foydalanuvchilar bitta serverda — domen kontrollerida (Active Directory). Kompyuterlar domenga qo'shilgan; ularning o'zida talabalar hisobi yo'q.",
    subs: { dc: "AD: 100 ta hisob" },
    panel: <MiniTable title="Active Directory: kafedra.local" head={["Foydalanuvchi", "Guruh"]} rows={[["ali", "Talabalar"], ["vali", "Talabalar"], ["o.karimov", "O'qituvchilar"]]} />,
  },
  {
    say: "Ali 202-xonada kirmoqchi. Kompyuter login-parolni o'zi tekshirmaydi — domen kontrolleridan so'raydi (Kerberos).",
    subs: { dc: "AD: 100 ta hisob" },
    flights: [{ from: "p2", to: "dc", label: "ali + parol?", tone: "amber" }, { from: "dc", to: "p2", label: "To'g'ri ✓", tone: "green", delay: 2.4 }],
    marks: { p2: { text: "ali ✓ kirdi", tone: "ok", at: 4.6 } },
    ask: { q: "Domenda Ali parolini qayerda tekshiradi? Qurilmani bosing.", pick: "dc", explain: "Domen kontrollerida — hamma hisoblar va parollar o'sha yerda." },
  },
  {
    say: "Ali parolini almashtirdi — bir marta, serverda. Endi u istalgan xonada yangi parol bilan kiradi. Administrator bitta joyda yangi talaba qo'shadi yoki bloklaydi.",
    subs: { dc: "AD: 100 ta hisob" },
    flights: [{ from: "p3", to: "dc", label: "ali + yangi parol?", tone: "amber" }, { from: "dc", to: "p3", label: "To'g'ri ✓", tone: "green", delay: 2.4 }],
    marks: { p3: { text: "ali ✓ kirdi", tone: "ok", at: 4.6 } },
  },
  {
    say: "Guruh siyosati (GPO): bir qoida — butun domenga. Masalan, «Talabalar guruhiga boshqaruv panelini yopish» — barcha kompyuterlarga avtomatik qo'llanadi.",
    subs: { dc: "GPO: Talabalar" },
    flights: [{ from: "dc", to: "p1", label: "GPO", tone: "purple" }, { from: "dc", to: "p2", label: "GPO", tone: "purple" }, { from: "dc", to: "p3", label: "GPO", tone: "purple" }],
    ask: { q: "Kafedrada 40 ta kompyuter va 300 ta talaba. Nimani tanlaysiz?", options: ["Ishchi guruh", "Domen (Active Directory)"], answer: 1, explain: "Ko'p foydalanuvchi va kompyuter — markaziy boshqaruv kerak: domen." },
  },
  {
    say: "Domen kontrolleri o'chsa, yangi kirishlar tekshirilmaydi. Shuning uchun katta tashkilotlarda kamida ikkita kontroller bo'ladi.",
    broken: ["dc"],
    flights: [{ from: "p1", to: "dc", label: "ali + parol?", tone: "amber", lostAt: "dc" }],
    marks: { p1: { text: "Server topilmadi", tone: "warn", at: 2.4 } },
  },
];

export default function DomainStory({ initial = "dom" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "wg", label: "Ishchi guruh", render: () => <Story nodes={nodes} links={links} steps={WG} height={390} title="Ishchi guruh: har kompyuter o'zicha" /> },
      { key: "dom", label: "Domen (Active Directory)", render: () => <Story nodes={nodes} links={links} steps={DOM} height={390} title="Domen: bitta markaz" /> },
    ]} />
  );
}
