"use client";

import { Story, Console, type SceneNode, type SceneLink, type Step } from "../scene/Story";
import { StoryTabs } from "../scene/Tabs";

/**
 * Nosozlik qidirish: pastdan yuqoriga (kabel → IP → shlyuz → DNS).
 * Har ssenariyda talaba buyruq natijasini o'qib, aybdor qurilmani topadi.
 */

const nodes: SceneNode[] = [
  { id: "pc", kind: "pc", x: 80, y: 200, label: "Talaba PC" },
  { id: "sw", kind: "switch", x: 230, y: 200 },
  { id: "r", kind: "router", x: 380, y: 200, label: "Shlyuz", sub: "192.168.1.1" },
  { id: "dns", kind: "server", x: 530, y: 80, label: "DNS", sub: "8.8.8.8" },
  { id: "net", kind: "cloud", x: 530, y: 290, label: "Internet" },
  { id: "web", kind: "server", x: 690, y: 200, label: "tatu.uz" },
];
const links: SceneLink[] = [{ a: "pc", b: "sw" }, { a: "sw", b: "r" }, { a: "r", b: "dns" }, { a: "r", b: "net" }, { a: "net", b: "web" }];

const CABLE: Step[] = [
  {
    say: "Shikoyat: «Internet yo'q». Tartib bilan, pastdan boshlaymiz. Birinchi qadam — ipconfig: kompyuterda manzil bormi?",
    broken: ["pc-sw"],
    panel: <Console lines={["C:\\> ipconfig", "Ethernet adapter:", "   Media State . . . : Media disconnected"]} />,
    ask: { q: "«Media disconnected» qayerdagi muammoni bildiradi? Aybdor qurilmani bosing.", pick: "sw", hint: "Kompyuter bilan birinchi qurilma orasidagi kabel.", explain: "Kabel yoki kommutator porti: kompyuter tarmoqqa fizik ulanmagan (1-pog'ona)." },
  },
  {
    say: "Kabel qayta ulandi, kommutatordagi port chirog'i yondi. Endi kompyuter manzil oldi.",
    flights: [{ from: "pc", to: "r", label: "ping shlyuz", tone: "green" }],
    marks: { pc: { text: "Ulangan ✓", tone: "ok", at: 2.2 } },
    panel: <Console lines={["C:\\> ipconfig", "   IPv4 Address. . : 192.168.1.23", "   Default Gateway : 192.168.1.1"]} />,
  },
];

const DHCP: Step[] = [
  {
    say: "Boshqa kompyuter. ipconfig manzilni ko'rsatdi, lekin u g'alati.",
    panel: <Console lines={["C:\\> ipconfig", "   IPv4 Address. . : 169.254.88.4", "   Default Gateway : "]} />,
    ask: { q: "169.254.x.x manzil va bo'sh shlyuz nimani bildiradi?", options: ["Hammasi joyida", "DHCP serverdan manzil olinmagan", "DNS ishlamayapti"], answer: 1, explain: "APIPA: kompyuter DHCP topolmay, o'ziga manzil bergan. Shlyuz yo'q — tarmoqdan chiqolmaydi." },
  },
  {
    say: "Routerdagi DHCP xizmati o'chib qolgan ekan. Yoqildi; ipconfig /renew bilan manzil qayta so'raldi.",
    flights: [{ from: "pc", to: "r", label: "DISCOVER", tone: "amber" }, { from: "r", to: "pc", label: "ACK .1.23", tone: "green", delay: 2.4 }],
    panel: <Console lines={["C:\\> ipconfig /renew", "   IPv4 Address. . : 192.168.1.23", "   Default Gateway : 192.168.1.1"]} />,
  },
];

const DNS: Step[] = [
  {
    say: "Uchinchi holat: manzil bor, shlyuzga ping o'tyapti. Lekin brauzer «sayt topilmadi» deydi. Keyingi qadam — Internetdagi manzilga raqam bilan ping.",
    flights: [{ from: "pc", to: "web", label: "ping 195.158.1.5", tone: "green" }],
    marks: { web: { text: "Reply ✓", tone: "ok", at: 4.4 } },
    panel: <Console lines={["C:\\> ping 195.158.1.5", "Reply from 195.158.1.5: time=18ms", "", "C:\\> ping tatu.uz", "Ping request could not find host tatu.uz."]} />,
  },
  {
    say: "Raqam bilan bo'ladi, nom bilan — yo'q. Demak yo'l butun, nomni manzilga aylantirish ishlamayapti.",
    broken: ["dns"],
    flights: [{ from: "pc", to: "dns", label: "tatu.uz?", tone: "amber", lostAt: "dns" }],
    ask: { q: "IP bo'yicha ping o'tadi, nom bo'yicha — yo'q. Muammo qaysi qurilmada? Bosing.", pick: "dns", explain: "DNS: IP orqali ulanish bor, faqat nomlar aniqlanmayapti. nslookup bilan tekshiring yoki boshqa DNS (masalan 1.1.1.1) yozing." },
  },
  {
    say: "Kompyuterdagi DNS 1.1.1.1 ga o'zgartirildi — sayt ochildi.",
    flights: [{ from: "pc", to: "web", label: "tatu.uz", tone: "green" }],
    marks: { web: { text: "Ochildi ✓", tone: "ok", at: 4.4 } },
    panel: <Console lines={["C:\\> nslookup tatu.uz 1.1.1.1", "Address: 195.158.1.5"]} />,
  },
];

const TRACE: Step[] = [
  {
    say: "To'rtinchi holat: sayt juda sekin ochiladi. tracert paketning yo'lini routerma-router ko'rsatadi va qaysi bo'g'inda kechikish borligini aniqlaydi.",
    flights: [{ from: "pc", to: "web", label: "tracert" }],
    panel: <Console lines={["C:\\> tracert tatu.uz", " 1    1 ms   192.168.1.1", " 2    4 ms   10.20.0.1  (provayder)", " 3  890 ms   82.215.x.x (Internet)", " 4  895 ms   195.158.1.5"]} />,
    panelDuringAsk: true,
    ask: { q: "Kechikish qayerda paydo bo'ldi?", options: ["Uy routerida (1-qadam)", "Provayderda (2-qadam)", "Provayderdan keyin, Internetda (3-qadam)"], answer: 2, explain: "2-qadamgacha 4 ms, 3-qadamda birdan 890 ms. Muammo provayderdan tashqarida — sizning tarmog'ingiz joyida." },
  },
  { say: "Umumiy tartib: 1) ipconfig — manzil bormi; 2) ping shlyuz — lokal tarmoq; 3) ping IP — Internet yo'li; 4) nslookup — DNS; 5) tracert — qayerda to'xtaydi/sekinlashadi. Pastdan yuqoriga — tez va aniq." },
];

export default function TroubleshootStory({ initial = "cable" }: { initial?: string }) {
  const s = (steps: Step[], title: string) => () => <Story nodes={nodes} links={links} steps={steps} height={370} title={title} />;
  return (
    <StoryTabs initial={initial} tabs={[
      { key: "cable", label: "1. Kabel", render: s(CABLE, "«Internet yo'q»: kabel") },
      { key: "dhcp", label: "2. Manzil", render: s(DHCP, "«Internet yo'q»: 169.254…") },
      { key: "dns", label: "3. DNS", render: s(DNS, "«Sayt topilmadi»") },
      { key: "trace", label: "4. Sekinlik", render: s(TRACE, "«Juda sekin»: tracert") },
    ]} />
  );
}
