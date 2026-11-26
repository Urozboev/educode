"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Wireshark: tarmoqdagi paketlarni ushlab, qatlamma-qatlam o'qish va filtrlash. */

const nodes: SceneNode[] = [
  { id: "pc", kind: "laptop", x: 100, y: 190, label: "Talaba", sub: "Wireshark işlayapti" },
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
const list = (rows: string[][], hl?: number, title = "Wireshark: uşlangan paketlar") => <MiniTable title={title} head={HEAD} rows={rows} highlight={hl} />;

const steps: Step[] = [
  {
    say: "Wireshark tarmoq kartasidan ötayotgan har bir paketni uşlab, röyxatga yozadi. Talaba brauzerda tatu.uz ni oçdi — keling, nima bölganini «köramiz».",
    flights: [{ from: "pc", to: "dns", label: "DNS", tone: "amber" }, { from: "pc", to: "web", label: "TCP", delay: 0.8 }],
    marks: { tap: { text: "Hammasini yozyapman", tone: "info", at: 0.4 } },
    panel: list([]),
  },
  { say: "Bir soniyada önlab paket yiğildi. Har qator — bitta paket: kimdan, kimga, qaysi protokol va qisqaça mazmun.", panel: list(ROWS) },
  {
    say: "Eng birinçi — ARP: kompyuter şlyuzning MAC manzilini söradi. Keyin DNS sörov va javob, söng TCP salomlaşuvi.",
    panel: list(ROWS),
    panelDuringAsk: true,
    ask: { q: "Qaysi paketda tatu.uz ning IP manzili aniqlangan?", options: ["1-paket (ARP)", "3-paket (DNS javobi)", "4-paket (SYN)"], answer: 1, explain: "3-paket: DNS javobi — «tatu.uz = 195.158.1.5»." },
  },
  {
    say: "Paketni bossangiz, Wireshark uni qatlamlarga ajratadi: Ethernet (MAC lar) → IP (manzillar, TTL) → TCP (portlar, bayroqlar) → maʼlumot. Bu OSI modelining jonli körinişi.",
    panel: (
      <div className="rounded-xl border border-border bg-card text-xs font-mono p-3 space-y-1 max-w-xl">
        <div>▸ Ethernet II, Src: AA:11:…, Dst: 00:1A:… (router)</div>
        <div>▸ Internet Protocol v4, Src: 192.168.1.23, Dst: 195.158.1.5, TTL: 128</div>
        <div className="text-neon-purple font-semibold">▸ TCP, Src Port: 50123, Dst Port: 443, Flags: [SYN]</div>
      </div>
    ),
    ask: { q: "4-paketdagi server porti 443. Bu qaysi xizmat?", options: ["DNS", "HTTPS", "SSH", "FTP"], answer: 1, explain: "443 — HTTPS. Şuning uçun keyingi paket TLS (şifrlaş) bilan boşlanadi." },
  },
  {
    say: "Paketlar minglab bölsa, filtr kerak. «dns» yozsangiz — faqat DNS paketlar qoladi.",
    panel: list(ROWS.filter((r) => r[3] === "DNS"), undefined, "Filtr: dns"),
    ask: { q: "Faqat web serverga yuborilgan HTTPS paketlarni köriş uçun filtr:", options: ["dns", "tcp.port == 443", "arp", "ip.addr == 8.8.8.8"], answer: 1, explain: "tcp.port == 443 — HTTPS trafik. ip.addr == … — bitta manzil bilan almaşilgan barça paketlar." },
  },
  {
    say: "HTTPS paketlari içini öqib bölmaydi — TLS şifrlagan. Oddiy HTTP yoki FTP da esa login-parol oçiq körinadi. Şuning uçun oçiq protokollar xavfli.",
    panel: list(ROWS.slice(5), 0, "TLS: Application Data — şifrlangan"),
  },
  { say: "Xulosa: Wireshark — tarmoqning «rentgeni». Paket röyxati, qatlamlar daraxti va filtrlar (dns, arp, tcp.port == 80, ip.addr == …) bilan muammolarni topiş va protokollarni örganiş mumkin. Faqat özingizga ruxsat berilgan tarmoqda işlating." },
];

export default function SnifferStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={380} title="Wireshark: paketlarni köramiz" />;
}
