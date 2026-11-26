"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Umumiy papka va printer: tarmoq ruxsati + NTFS ruxsati — eng qattiq cheklov yutadi. */

const nodes: SceneNode[] = [
  { id: "ali", kind: "pc", x: 100, y: 80, label: "Ali", sub: "Talabalar" },
  { id: "ok", kind: "pc", x: 100, y: 310, label: "Öqituvçi", sub: "O'qituvchilar" },
  { id: "sw", kind: "switch", x: 330, y: 195 },
  { id: "fs", kind: "server", x: 560, y: 110, label: "Fayl server", sub: "\\\\fs\\Topshiriqlar" },
  { id: "pr", kind: "server", x: 560, y: 300, label: "Printer", sub: "\\\\fs\\HP-201" },
];
const links: SceneLink[] = [{ a: "ali", b: "sw" }, { a: "ok", b: "sw" }, { a: "sw", b: "fs" }, { a: "sw", b: "pr" }];

const perms = (hl?: number) => (
  <MiniTable title="Topşiriqlar papkasi ruxsatlari" head={["Guruh", "Tarmoq (Share)", "NTFS"]} highlight={hl}
    rows={[["Talabalar", "O'zgartirish", "O'qish"], ["O'qituvchilar", "To'liq", "To'liq"]]} />
);

const steps: Step[] = [
  {
    say: "Kafedra serverida «Topşiriqlar» papkasi umumiy qilingan. Unga tarmoq orqali \\\\fs\\Topşiriqlar manzili bilan kiriladi. Kim nima qila olişini ikki qatlam belgilaydi: tarmoq ruxsati va NTFS (disk) ruxsati.",
    panel: perms(),
  },
  {
    say: "Öqituvçi papkaga yangi topşiriq faylini qöydi. Ikkala qatlamda ham «Töliq» — ruxsat berildi.",
    flights: [{ from: "ok", to: "fs", label: "yoziş: lab5.docx" }],
    marks: { fs: { text: "Saqlandi ✓", tone: "ok", at: 2.2 } },
    panel: perms(1),
  },
  {
    say: "Ali faylni öqidi — ruxsat bor. Endi u faylni özgartirmoqçi. Tarmoq ruxsati «Özgartiriş», lekin NTFS faqat «Öqiş».",
    flights: [{ from: "ali", to: "fs", label: "öqiş", tone: "green" }, { from: "ali", to: "fs", label: "özgartiriş", tone: "red", delay: 2.6, lostAt: "fs" }],
    marks: { fs: { text: "Kiriş rad etildi", tone: "drop", at: 4.8 } },
    panel: perms(0),
    panelDuringAsk: true,
    ask: { q: "Ali tarmoq orqali faylni özgartira oladimi?", options: ["Ha — tarmoq ruxsati «Özgartiriş»", "Yöq — ikki ruxsatdan qattiqroği işlaydi (Öqiş)", "Faqat administrator ruxsat bersa"], answer: 1, explain: "Tarmoq orqali kirişda ikkala ruxsat birga tekşiriladi va eng çeklanganiga amal qilinadi: Öqiş." },
  },
  {
    say: "Ruxsatlarni har talabaga emas, guruhga beriladi. Yangi talaba keldi — uni «Talabalar» guruhiga qöşiş kifoya, kerakli ruxsatlar avtomatik keladi.",
    panel: perms(0),
  },
  {
    say: "Printer ham umumiy resurs. Ali çop etişga yubordi: hujjat printer navbatiga tuşadi va tartib bilan çiqadi.",
    flights: [{ from: "ali", to: "pr", label: "çop et", tone: "purple" }, { from: "ok", to: "pr", label: "çop et", tone: "purple", delay: 0.6 }],
    marks: { pr: { text: "Navbat: 2 ta hujjat", tone: "info", at: 2.8 } },
    ask: { q: "Ali boşqa talabaning hujjatini navbatdan öçirişi kerakmi?", options: ["Ha, hamma öçira olsin", "Yöq — buni faqat «Hujjatlarni boşqariş» ruxsati bor guruh qiladi"], answer: 1, explain: "Talabaga «Çop etiş», öqituvçi yoki administratorga «Hujjatlarni boşqariş» ruxsati beriladi." },
  },
  { say: "Xulosa: umumiy papka tarmoq ruxsati + NTFS ruxsati bilan himoyalanadi va qattiqroği yutadi; ruxsatlar guruhlarga beriladi; «Hamma uçun töliq» — eng xavfli xato." },
];

export default function ShareStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="Umumiy papka: kim nima qila oladi?" />;
}
