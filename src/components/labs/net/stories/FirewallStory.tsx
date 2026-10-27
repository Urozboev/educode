"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/** Brandmauer: qoidalar yuqoridan pastga tekshiriladi. VPN: ochiq Internetda shifrlangan tunnel. */

const nodes: SceneNode[] = [
  { id: "h", kind: "laptop", x: 80, y: 100, label: "Talaba (uyda)" },
  { id: "x", kind: "laptop", x: 80, y: 300, label: "Hujumchi" },
  { id: "net", kind: "cloud", x: 230, y: 200, label: "Internet" },
  { id: "fw", kind: "firewall", x: 400, y: 200, label: "Brandmauer" },
  { id: "sw", kind: "switch", x: 540, y: 200 },
  { id: "web", kind: "server", x: 680, y: 100, label: "Web sayt", sub: ":443" },
  { id: "db", kind: "server", x: 680, y: 300, label: "Ma'lumotlar bazasi", sub: ":5432" },
];
const links: SceneLink[] = [{ a: "h", b: "net" }, { a: "x", b: "net" }, { a: "net", b: "fw" }, { a: "fw", b: "sw" }, { a: "sw", b: "web" }, { a: "sw", b: "db" }];

const rules = (hl?: number) => (
  <MiniTable title="Brandmauer qoidalari (yuqoridan pastga)" head={["#", "Port", "Amal"]} highlight={hl}
    rows={[["1", "443 (HTTPS)", "Ruxsat"], ["2", "22 (SSH) — faqat 10.0.0.0/8", "Ruxsat"], ["3", "Qolgan hammasi", "Taqiqlash"]]} />
);

const FW: Step[] = [
  { say: "Brandmauer — binoning qo'riqchisi. Har kirayotgan paketning manzili va portiga qarab, qoidalar ro'yxatini yuqoridan pastga tekshiradi. Birinchi mos kelgan qoida ishlaydi.", panel: rules() },
  {
    say: "Talaba uyidan saytga kirdi: port 443. 1-qoida mos keldi — ruxsat.",
    flights: [{ from: "h", to: "web", label: ":443" }],
    marks: { fw: { text: "#1 ruxsat", tone: "ok", at: 2.2 } },
    panel: rules(0),
  },
  {
    say: "Hujumchi Internetdan to'g'ridan-to'g'ri ma'lumotlar bazasiga ulanmoqchi: port 5432.",
    flights: [{ from: "x", to: "db", label: ":5432", tone: "red", lostAt: "fw" }],
    marks: { fw: { text: "#3 taqiq", tone: "drop", at: 2.2 } },
    panel: rules(),
    panelDuringAsk: true,
    ask: { q: "5432-portga kelgan paketga qaysi qoida ishlaydi?", options: ["1-qoida", "2-qoida", "3-qoida — qolgan hammasi taqiqlanadi"], answer: 2, explain: "1 va 2-qoidalar mos kelmadi, shuning uchun oxirgi «qolgan hammasi — taqiq» ishladi." },
  },
  {
    say: "Hujumchi SSH (22) ni sinab ko'rdi. 2-qoida faqat ichki 10.x tarmog'idan ruxsat beradi; hujumchi Internetdan keldi — mos emas, 3-qoidaga tushdi.",
    flights: [{ from: "x", to: "web", label: ":22", tone: "red", lostAt: "fw" }],
    marks: { fw: { text: "#3 taqiq", tone: "drop", at: 2.2 } },
    panel: rules(2),
  },
  {
    say: "Agar administrator «Hammasini taqiqlash» qoidasini birinchi qatorga qo'yib qo'ysa-chi?",
    ask: { q: "«Hammasini taqiqlash» 1-qatorda tursa nima bo'ladi?", options: ["Hech narsa o'zgarmaydi", "Sayt ham ishlamay qoladi — keyingi qoidalarga navbat kelmaydi", "Faqat hujumchilar to'xtaydi"], answer: 1, explain: "Birinchi mos qoida ishlaydi: barcha paketlar 1-qatorda to'xtaydi. Aniq ruxsatlar yuqorida, umumiy taqiq — eng pastda." },
  },
  { say: "Xulosa: «keragini ruxsat et, qolganini taqiqla» tamoyili; aniq qoidalar tepada; ma'lumotlar bazasi kabi ichki xizmatlar Internetga hech qachon ochilmaydi.", panel: rules() },
];

const vn: SceneNode[] = [
  { id: "h", kind: "laptop", x: 90, y: 200, label: "Talaba", sub: "kafe Wi-Fi" },
  { id: "ap", kind: "ap", x: 230, y: 90, label: "Ochiq Wi-Fi" },
  { id: "x", kind: "laptop", x: 230, y: 320, label: "Tinglovchi" },
  { id: "net", kind: "cloud", x: 400, y: 200, label: "Internet" },
  { id: "vpn", kind: "firewall", x: 560, y: 200, label: "VPN shlyuz" },
  { id: "lib", kind: "server", x: 690, y: 200, label: "Kutubxona", sub: "ichki tarmoq" },
];
const vl: SceneLink[] = [{ a: "h", b: "ap", wireless: true }, { a: "x", b: "ap", wireless: true }, { a: "ap", b: "net" }, { a: "net", b: "vpn" }, { a: "vpn", b: "lib" }];
const VPN: Step[] = [
  {
    say: "Talaba kafedagi ochiq Wi-Fi dan universitet kutubxonasiga kirmoqchi. Shifrlanmagan trafikni shu Wi-Fi ga ulangan har kim ko'rishi mumkin.",
    flights: [{ from: "h", to: "net", label: "login: ali / parol: 1234", tone: "red" }, { from: "h", to: "x", label: "nusxa", tone: "red", via: ["ap"] }],
    marks: { x: { text: "Parolni ko'rdim!", tone: "drop", at: 2.2 } },
  },
  {
    say: "Kutubxona umuman Internetga ochiq emas — u faqat ichki tarmoqda. Brandmauer tashqi so'rovni o'tkazmaydi.",
    flights: [{ from: "h", to: "lib", label: "kutubxona?", lostAt: "vpn" }],
    marks: { vpn: { text: "Tashqaridan kirish yo'q", tone: "drop", at: 3.3 } },
  },
  {
    say: "VPN yoqildi: talaba va VPN shlyuz o'rtasida shifrlangan «tunnel» qurildi. Tinglovchi faqat ma'nosiz baytlarni ko'radi. Shlyuz tunnelni ochib, so'rovni ichki tarmoqqa uzatadi.",
    flights: [{ from: "h", to: "lib", label: "🔒 a7f3…e9", tone: "green" }, { from: "h", to: "x", label: "🔒 a7f3…", tone: "green", via: ["ap"] }],
    marks: { x: { text: "Hech narsa tushunmadim", tone: "info", at: 2.2 }, lib: { text: "Kirdi ✓", tone: "ok", at: 4.4 } },
    ask: { q: "VPN talabaga nima beradi?", options: ["Internetni tezlashtiradi", "Shifrlangan tunnel va ichki tarmoqqa xuddi binoda turgandek kirish", "Viruslardan to'liq himoya"], answer: 1, explain: "VPN yo'ldagi trafikni shifrlaydi va masofadagi foydalanuvchini ichki tarmoqqa qo'shadi. Virusga qarshi himoya emas." },
  },
  { say: "Xulosa: brandmauer — kim kirishini hal qiladi, VPN — ruxsat etilgan foydalanuvchini xavfsiz kanal orqali olib kiradi. Ular birga ishlaydi: VPN shlyuz odatda brandmauer ichida bo'ladi." },
];

export default function FirewallStory({ initial = "fw" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "fw", label: "Brandmauer", render: () => <Story nodes={nodes} links={links} steps={FW} height={390} title="Brandmauer: kimni kiritamiz?" /> },
      { key: "vpn", label: "VPN", render: () => <Story nodes={vn} links={vl} steps={VPN} height={390} title="VPN: ochiq tarmoqda yopiq tunnel" /> },
    ]} />
  );
}
