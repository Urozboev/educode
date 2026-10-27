"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Wireshark: tarmoqdagi paketlarni ushlab, qatlamma-qatlam o'qish va filtrlash. */

const nodes: SceneNode[] = [
  { id: "pc", kind: "laptop", x: 100, y: 190, label: "Talaba", sub: "Wireshark ishlayapti" },
  { id: "tap", kind: "tap", x: 250, y: 190 },
  { id: "r", kind: "router", x: 400, y: 190, label: "Router" },
  { id: "dns", kind: "server", x: 640, y: 80, label: "DNS" },
  { id: "web", kind: "server", x: 640, y: 300, label: "Web server" },
];
const links: SceneLink[] = [{ a: "pc", b: "tap" }, { a: "tap", b: "r" }, { a: "r", b: "dns" }, { a: "r", b: "web" }];

const ROWS = [
  ["1", "192.168.1.23", "192.168.1.1", "ARP", "Who has 192.168.1.1?"],
  ["2", "192.168.1.23", "8.8.8.8", "DNS", "Query A tatu.uz"],
  ["3", "8.8.8.8", "192.168.1.23", "DNS", "Response A 195.158.1.5"],
  ["4", "192.168.1.23", "195.158.1.5", "TCP", "50123 → 443 [SYN]"],
  ["5", "195.158.1.5", "192.168.1.23", "TCP", "443 → 50123 [SYN, ACK]"],
  ["6", "192.168.1.23", "195.158.1.5", "TLS", "Client Hello"],
];
const HEAD = ["№", "Manba", "Manzil", "Protokol", "Ma'lumot"];
const list = (rows: string[][], hl?: number, title = "Wireshark: ushlangan paketlar") => <MiniTable title={title} head={HEAD} rows={rows} highlight={hl} />;

const steps: Step[] = [
  {
    say: "Wireshark tarmoq kartasidan o'tayotgan har bir paketni ushlab, ro'yxatga yozadi. Talaba brauzerda tatu.uz ni ochdi — keling, nima bo'lganini «ko'ramiz».",
    flights: [{ from: "pc", to: "dns", label: "DNS", tone: "amber" }, { from: "pc", to: "web", label: "TCP", delay: 0.8 }],
    marks: { tap: { text: "Hammasini yozyapman", tone: "info", at: 0.4 } },
    panel: list([]),
  },
  { say: "Bir soniyada o'nlab paket yig'ildi. Har qator — bitta paket: kimdan, kimga, qaysi protokol va qisqacha mazmun.", panel: list(ROWS) },
  {
    say: "Eng birinchi — ARP: kompyuter shlyuzning MAC manzilini so'radi. Keyin DNS so'rov va javob, so'ng TCP salomlashuvi.",
    panel: list(ROWS),
    panelDuringAsk: true,
    ask: { q: "Qaysi paketda tatu.uz ning IP manzili aniqlangan?", options: ["1-paket (ARP)", "3-paket (DNS javobi)", "4-paket (SYN)"], answer: 1, explain: "3-paket: DNS javobi — «tatu.uz = 195.158.1.5»." },
  },
  {
    say: "Paketni bossangiz, Wireshark uni qatlamlarga ajratadi: Ethernet (MAC lar) → IP (manzillar, TTL) → TCP (portlar, bayroqlar) → ma'lumot. Bu OSI modelining jonli ko'rinishi.",
    panel: (
      <div className="rounded-xl border border-border bg-card text-xs font-mono p-3 space-y-1 max-w-xl">
        <div>▸ Ethernet II, Src: AA:11:…, Dst: 00:1A:… (router)</div>
        <div>▸ Internet Protocol v4, Src: 192.168.1.23, Dst: 195.158.1.5, TTL: 128</div>
        <div className="text-neon-purple font-semibold">▸ TCP, Src Port: 50123, Dst Port: 443, Flags: [SYN]</div>
      </div>
    ),
    ask: { q: "4-paketdagi server porti 443. Bu qaysi xizmat?", options: ["DNS", "HTTPS", "SSH", "FTP"], answer: 1, explain: "443 — HTTPS. Shuning uchun keyingi paket TLS (shifrlash) bilan boshlanadi." },
  },
  {
    say: "Paketlar minglab bo'lsa, filtr kerak. «dns» yozsangiz — faqat DNS paketlar qoladi.",
    panel: list(ROWS.filter((r) => r[3] === "DNS"), undefined, "Filtr: dns"),
    ask: { q: "Faqat web serverga yuborilgan HTTPS paketlarni ko'rish uchun filtr:", options: ["dns", "tcp.port == 443", "arp", "ip.addr == 8.8.8.8"], answer: 1, explain: "tcp.port == 443 — HTTPS trafik. ip.addr == … — bitta manzil bilan almashilgan barcha paketlar." },
  },
  {
    say: "HTTPS paketlari ichini o'qib bo'lmaydi — TLS shifrlagan. Oddiy HTTP yoki FTP da esa login-parol ochiq ko'rinadi. Shuning uchun ochiq protokollar xavfli.",
    panel: list(ROWS.slice(5), 0, "TLS: Application Data — shifrlangan"),
  },
  { say: "Xulosa: Wireshark — tarmoqning «rentgeni». Paket ro'yxati, qatlamlar daraxti va filtrlar (dns, arp, tcp.port == 80, ip.addr == …) bilan muammolarni topish va protokollarni o'rganish mumkin. Faqat o'zingizga ruxsat berilgan tarmoqda ishlating." },
];

export default function SnifferStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={380} title="Wireshark: paketlarni ko'ramiz" />;
}
