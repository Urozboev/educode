"use client";

import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Windows Server rollari: bitta server tarmoqqa DHCP, DNS va IIS (web) xizmatlarini beradi. */

const nodes: SceneNode[] = [
  { id: "p1", kind: "pc", x: 100, y: 90, label: "Talaba PC", sub: "IP: yöq" },
  { id: "p2", kind: "laptop", x: 100, y: 300, label: "Öqituvçi" },
  { id: "sw", kind: "switch", x: 340, y: 195 },
  { id: "srv", kind: "server", x: 600, y: 195, label: "Windows Server", sub: "192.168.1.2 (statik)" },
];
const links: SceneLink[] = [{ a: "p1", b: "sw" }, { a: "p2", b: "sw" }, { a: "sw", b: "srv" }];

const roles = (on: string[]) => (
  <MiniTable title="Server Manager → Rollar" head={["Rol", "Holat"]}
    rows={[["DHCP Server", on.includes("dhcp") ? "örnatilgan ✓" : "—"], ["DNS Server", on.includes("dns") ? "örnatilgan ✓" : "—"], ["Web Server (IIS)", on.includes("iis") ? "örnatilgan ✓" : "—"]]} />
);

const steps: Step[] = [
  {
    say: "Yangi Windows Server örnatildi. Birinçi iş — unga statik IP beriş: xizmat körsatadigan serverning manzili heç qaçon özgarmasligi kerak.",
    panel: roles([]),
    ask: { q: "Nega serverga DHCP orqali emas, qölda (statik) IP beriladi?", options: ["Tezroq işlaşi uçun", "Mijozlar uni doim bitta manzilda topişi kerak", "Windows şuni talab qiladi"], answer: 1, explain: "Agar server manzili özgarsa, kompyuterlardagi DNS, şlyuz va ulaniş sozlamalari işlamay qoladi." },
  },
  {
    say: "1-rol: DHCP. Server Manager → Add Roles → DHCP Server. Hudud (scope) yaratiladi: 192.168.1.100 – .200, şlyuz .1, DNS .2. Talaba PC yoqildi va manzil oldi.",
    flights: [{ from: "p1", to: "srv", label: "DISCOVER", tone: "amber" }, { from: "srv", to: "p1", label: "ACK .100", tone: "green", delay: 2.4 }],
    subs: { p1: "192.168.1.100" },
    panel: roles(["dhcp"]),
    ask: { q: "Scope: 192.168.1.100 – 192.168.1.200. Uçinçi ulangan kompyuter qaysi manzilni oladi?", options: ["192.168.1.3", "192.168.1.102", "192.168.1.200"], answer: 1, explain: "Manzillar hudud boşidan beriladi: .100, .101, .102." },
  },
  {
    say: "2-rol: DNS. kafedra.local zonasi yaratilib, A yozuv qöşildi: portal.kafedra.local → 192.168.1.2. Endi foydalanuvçi raqam emas, nom yozadi.",
    subs: { p1: "192.168.1.100" },
    flights: [{ from: "p2", to: "srv", label: "portal.kafedra.local?", tone: "amber" }, { from: "srv", to: "p2", label: "192.168.1.2", tone: "amber", delay: 2.4 }],
    panel: <div className="flex flex-wrap gap-3">{roles(["dhcp", "dns"])}<MiniTable title="Zona: kafedra.local" head={["Nom", "Tur", "Qiymat"]} rows={[["portal", "A", "192.168.1.2"], ["fs", "A", "192.168.1.2"]]} highlight={0} /></div>,
    ask: { q: "Nomni IP manzilga boğlaydigan DNS yozuvi:", options: ["MX", "A", "PTR", "NS"], answer: 1, explain: "A — nom → IPv4. PTR — teskarisi (IP → nom), MX — poçta, NS — zona serveri." },
  },
  {
    say: "3-rol: IIS (web server). C:\\inetpub\\wwwroot ga kafedra sahifasi qöyildi. Öqituvçi brauzerda http://portal.kafedra.local ni oçdi.",
    subs: { p1: "192.168.1.100" },
    flights: [{ from: "p2", to: "srv", label: "GET /" }, { from: "srv", to: "p2", label: "200 OK", tone: "green", delay: 2.4 }],
    marks: { p2: { text: "Sahifa oçildi ✓", tone: "ok", at: 4.6 } },
    panel: roles(["dhcp", "dns", "iis"]),
  },
  {
    say: "Talaba sahifani oçolmayapti. Tekşiruv körsatdi: uning DNS sozlamasida 8.8.8.8 yozilgan — Google kafedra.local ni bilmaydi.",
    subs: { p1: "192.168.1.100 | DNS 8.8.8.8" },
    flights: [{ from: "p1", to: "srv", label: "portal…?", tone: "red", lostAt: "sw" }],
    marks: { p1: { text: "Sayt topilmadi", tone: "drop", at: 1.2 } },
    ask: { q: "Talaba PC da DNS sifatida 8.8.8.8 yozilgan va u portal.kafedra.local ni oçolmayapti. Eng töğri yeçim:", options: ["Talaba kompyuteriga IIS örnatiş", "DHCP scopeʼda DNS sifatida 192.168.1.2 ni beriş", "Serverni qayta yuklaş"], answer: 1, explain: "DHCP orqali DNS = 192.168.1.2 tarqatilsa, hamma kompyuterlar içki nomlarni avtomatik taniydi." },
  },
  { say: "Xulosa: server statik IP bilan; DHCP — manzil tarqatadi, DNS — nomlarni manzilga aylantiradi, IIS — web sahifalar beradi. Rollar bir-biriga boğliq: DHCP mijozlarga töğri DNS ni aytişi kerak.", subs: { p1: "192.168.1.100" }, panel: roles(["dhcp", "dns", "iis"]) },
];

export default function ServerStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="Windows Server: DHCP, DNS va IIS" />;
}
