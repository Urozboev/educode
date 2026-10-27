"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Umumiy papka va printer: tarmoq ruxsati + NTFS ruxsati — eng qattiq cheklov yutadi. */

const nodes: SceneNode[] = [
  { id: "ali", kind: "pc", x: 100, y: 80, label: "Ali", sub: "Talabalar" },
  { id: "ok", kind: "pc", x: 100, y: 310, label: "O'qituvchi", sub: "O'qituvchilar" },
  { id: "sw", kind: "switch", x: 330, y: 195 },
  { id: "fs", kind: "server", x: 560, y: 110, label: "Fayl server", sub: "\\\\fs\\Topshiriqlar" },
  { id: "pr", kind: "server", x: 560, y: 300, label: "Printer", sub: "\\\\fs\\HP-201" },
];
const links: SceneLink[] = [{ a: "ali", b: "sw" }, { a: "ok", b: "sw" }, { a: "sw", b: "fs" }, { a: "sw", b: "pr" }];

const perms = (hl?: number) => (
  <MiniTable title="Topshiriqlar papkasi ruxsatlari" head={["Guruh", "Tarmoq (Share)", "NTFS"]} highlight={hl}
    rows={[["Talabalar", "O'zgartirish", "O'qish"], ["O'qituvchilar", "To'liq", "To'liq"]]} />
);

const steps: Step[] = [
  {
    say: "Kafedra serverida «Topshiriqlar» papkasi umumiy qilingan. Unga tarmoq orqali \\\\fs\\Topshiriqlar manzili bilan kiriladi. Kim nima qila olishini ikki qatlam belgilaydi: tarmoq ruxsati va NTFS (disk) ruxsati.",
    panel: perms(),
  },
  {
    say: "O'qituvchi papkaga yangi topshiriq faylini qo'ydi. Ikkala qatlamda ham «To'liq» — ruxsat berildi.",
    flights: [{ from: "ok", to: "fs", label: "yozish: lab5.docx" }],
    marks: { fs: { text: "Saqlandi ✓", tone: "ok", at: 2.2 } },
    panel: perms(1),
  },
  {
    say: "Ali faylni o'qidi — ruxsat bor. Endi u faylni o'zgartirmoqchi. Tarmoq ruxsati «O'zgartirish», lekin NTFS faqat «O'qish».",
    flights: [{ from: "ali", to: "fs", label: "o'qish", tone: "green" }, { from: "ali", to: "fs", label: "o'zgartirish", tone: "red", delay: 2.6, lostAt: "fs" }],
    marks: { fs: { text: "Kirish rad etildi", tone: "drop", at: 4.8 } },
    panel: perms(0),
    panelDuringAsk: true,
    ask: { q: "Ali tarmoq orqali faylni o'zgartira oladimi?", options: ["Ha — tarmoq ruxsati «O'zgartirish»", "Yo'q — ikki ruxsatdan qattiqrog'i ishlaydi (O'qish)", "Faqat administrator ruxsat bersa"], answer: 1, explain: "Tarmoq orqali kirishda ikkala ruxsat birga tekshiriladi va eng cheklanganiga amal qilinadi: O'qish." },
  },
  {
    say: "Ruxsatlarni har talabaga emas, guruhga beriladi. Yangi talaba keldi — uni «Talabalar» guruhiga qo'shish kifoya, kerakli ruxsatlar avtomatik keladi.",
    panel: perms(0),
  },
  {
    say: "Printer ham umumiy resurs. Ali chop etishga yubordi: hujjat printer navbatiga tushadi va tartib bilan chiqadi.",
    flights: [{ from: "ali", to: "pr", label: "chop et", tone: "purple" }, { from: "ok", to: "pr", label: "chop et", tone: "purple", delay: 0.6 }],
    marks: { pr: { text: "Navbat: 2 ta hujjat", tone: "info", at: 2.8 } },
    ask: { q: "Ali boshqa talabaning hujjatini navbatdan o'chirishi kerakmi?", options: ["Ha, hamma o'chira olsin", "Yo'q — buni faqat «Hujjatlarni boshqarish» ruxsati bor guruh qiladi"], answer: 1, explain: "Talabaga «Chop etish», o'qituvchi yoki administratorga «Hujjatlarni boshqarish» ruxsati beriladi." },
  },
  { say: "Xulosa: umumiy papka tarmoq ruxsati + NTFS ruxsati bilan himoyalanadi va qattiqrog'i yutadi; ruxsatlar guruhlarga beriladi; «Hamma uchun to'liq» — eng xavfli xato." },
];

export default function ShareStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="Umumiy papka: kim nima qila oladi?" />;
}
