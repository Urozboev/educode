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
  { id: "db", kind: "server", x: 680, y: 300, label: "Maʼlumotlar bazasi", sub: ":5432" },
];
const links: SceneLink[] = [{ a: "h", b: "net" }, { a: "x", b: "net" }, { a: "net", b: "fw" }, { a: "fw", b: "sw" }, { a: "sw", b: "web" }, { a: "sw", b: "db" }];

const rules = (hl?: number) => (
  <MiniTable title="Brandmauer qoidalari (yuqoridan pastga)" head={["#", "Port", "Amal"]} highlight={hl}
    rows={[["1", "443 (HTTPS)", "Ruxsat"], ["2", "22 (SSH) — faqat 10.0.0.0/8", "Ruxsat"], ["3", "Qolgan hammasi", "Taqiqlash"]]} />
);

const FW: Step[] = [
  { say: "Brandmauer — binoning qöriqçisi. Har kirayotgan paketning manzili va portiga qarab, qoidalar röyxatini yuqoridan pastga tekşiradi. Birinçi mos kelgan qoida işlaydi.", panel: rules() },
  {
    say: "Talaba uyidan saytga kirdi: port 443. 1-qoida mos keldi — ruxsat.",
    flights: [{ from: "h", to: "web", label: ":443" }],
    marks: { fw: { text: "#1 ruxsat", tone: "ok", at: 2.2 } },
    panel: rules(0),
  },
  {
    say: "Hujumçi Internetdan töğridan-töğri maʼlumotlar bazasiga ulanmoqçi: port 5432.",
    flights: [{ from: "x", to: "db", label: ":5432", tone: "red", lostAt: "fw" }],
    marks: { fw: { text: "#3 taqiq", tone: "drop", at: 2.2 } },
    panel: rules(),
    panelDuringAsk: true,
    ask: { q: "5432-portga kelgan paketga qaysi qoida işlaydi?", options: ["1-qoida", "2-qoida", "3-qoida — qolgan hammasi taqiqlanadi"], answer: 2, explain: "1 va 2-qoidalar mos kelmadi, şuning uçun oxirgi «qolgan hammasi — taqiq» işladi." },
  },
  {
    say: "Hujumçi SSH (22) ni sinab kördi. 2-qoida faqat içki 10.x tarmoğidan ruxsat beradi; hujumçi Internetdan keldi — mos emas, 3-qoidaga tuşdi.",
    flights: [{ from: "x", to: "web", label: ":22", tone: "red", lostAt: "fw" }],
    marks: { fw: { text: "#3 taqiq", tone: "drop", at: 2.2 } },
    panel: rules(2),
  },
  {
    say: "Agar administrator «Hammasini taqiqlaş» qoidasini birinçi qatorga qöyib qöysa-çi?",
    ask: { q: "«Hammasini taqiqlaş» 1-qatorda tursa nima böladi?", options: ["Heç narsa özgarmaydi", "Sayt ham işlamay qoladi — keyingi qoidalarga navbat kelmaydi", "Faqat hujumçilar töxtaydi"], answer: 1, explain: "Birinçi mos qoida işlaydi: barça paketlar 1-qatorda töxtaydi. Aniq ruxsatlar yuqorida, umumiy taqiq — eng pastda." },
  },
  { say: "Xulosa: «keragini ruxsat et, qolganini taqiqla» tamoyili; aniq qoidalar tepada; maʼlumotlar bazasi kabi içki xizmatlar Internetga heç qaçon oçilmaydi.", panel: rules() },
];

const vn: SceneNode[] = [
  { id: "h", kind: "laptop", x: 90, y: 200, label: "Talaba", sub: "kafe Wi-Fi" },
  { id: "ap", kind: "ap", x: 230, y: 90, label: "Oçiq Wi-Fi" },
  { id: "x", kind: "laptop", x: 230, y: 320, label: "Tinglovchi" },
  { id: "net", kind: "cloud", x: 400, y: 200, label: "Internet" },
  { id: "vpn", kind: "firewall", x: 560, y: 200, label: "VPN şlyuz" },
  { id: "lib", kind: "server", x: 690, y: 200, label: "Kutubxona", sub: "içki tarmoq" },
];
const vl: SceneLink[] = [{ a: "h", b: "ap", wireless: true }, { a: "x", b: "ap", wireless: true }, { a: "ap", b: "net" }, { a: "net", b: "vpn" }, { a: "vpn", b: "lib" }];
const VPN: Step[] = [
  {
    say: "Talaba kafedagi oçiq Wi-Fi dan universitet kutubxonasiga kirmoqçi. Şifrlanmagan trafikni şu Wi-Fi ga ulangan har kim körişi mumkin.",
    flights: [{ from: "h", to: "net", label: "login: ali / parol: 1234", tone: "red" }, { from: "h", to: "x", label: "nusxa", tone: "red", via: ["ap"] }],
    marks: { x: { text: "Parolni kördim!", tone: "drop", at: 2.2 } },
  },
  {
    say: "Kutubxona umuman Internetga oçiq emas — u faqat içki tarmoqda. Brandmauer taşqi sörovni ötkazmaydi.",
    flights: [{ from: "h", to: "lib", label: "kutubxona?", lostAt: "vpn" }],
    marks: { vpn: { text: "Taşqaridan kiriş yöq", tone: "drop", at: 3.3 } },
  },
  {
    say: "VPN yoqildi: talaba va VPN şlyuz örtasida şifrlangan «tunnel» qurildi. Tinglovçi faqat maʼnosiz baytlarni köradi. Şlyuz tunnelni oçib, sörovni içki tarmoqqa uzatadi.",
    flights: [{ from: "h", to: "lib", label: "🔒 a7f3…e9", tone: "green" }, { from: "h", to: "x", label: "🔒 a7f3…", tone: "green", via: ["ap"] }],
    marks: { x: { text: "Heç narsa tuşunmadim", tone: "info", at: 2.2 }, lib: { text: "Kirdi ✓", tone: "ok", at: 4.4 } },
    ask: { q: "VPN talabaga nima beradi?", options: ["Internetni tezlaştiradi", "Şifrlangan tunnel va içki tarmoqqa xuddi binoda turgandek kiriş", "Viruslardan töliq himoya"], answer: 1, explain: "VPN yöldagi trafikni şifrlaydi va masofadagi foydalanuvçini içki tarmoqqa qöşadi. Virusga qarşi himoya emas." },
  },
  { say: "Xulosa: brandmauer — kim kirişini hal qiladi, VPN — ruxsat etilgan foydalanuvçini xavfsiz kanal orqali olib kiradi. Ular birga işlaydi: VPN şlyuz odatda brandmauer içida böladi." },
];

export default function FirewallStory({ initial = "fw" }: { initial?: string }) {
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "fw", label: "Brandmauer", render: () => <Story nodes={nodes} links={links} steps={FW} height={390} title="Brandmauer: kimni kiritamiz?" /> },
      { key: "vpn", label: "VPN", render: () => <Story nodes={vn} links={vl} steps={VPN} height={390} title="VPN: oçiq tarmoqda yopiq tunnel" /> },
    ]} />
  );
}
