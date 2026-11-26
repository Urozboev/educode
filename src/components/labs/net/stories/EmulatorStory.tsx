"use client";

import { Story, Console, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Emulyatorda (Packet Tracer) tarmoqni qadamma-qadam yig'ish: qurilma → kabel → IP → tekshiruv. */

const nodes: SceneNode[] = [
  { id: "p1", kind: "pc", x: 100, y: 90, label: "PC0" },
  { id: "p2", kind: "pc", x: 100, y: 300, label: "PC1" },
  { id: "sw", kind: "switch", x: 380, y: 195, label: "Switch 2960" },
  { id: "p3", kind: "pc", x: 660, y: 90, label: "PC2" },
  { id: "p4", kind: "laptop", x: 660, y: 300, label: "Laptop0" },
];
const links: SceneLink[] = [{ a: "p1", b: "sw" }, { a: "p2", b: "sw" }, { a: "p3", b: "sw" }, { a: "p4", b: "sw" }];
const ALL_LINKS = ["p1-sw", "p2-sw", "p3-sw", "p4-sw"];
const IPS = { p1: "192.168.1.10", p2: "192.168.1.11", p3: "192.168.1.12", p4: "192.168.1.13" };

const steps: Step[] = [
  {
    say: "Emulyator — haqiqiy uskunasiz tarmoq quriş va sinaş dasturi (Cisco Packet Tracer, GNS3). Böş maydonga avval kommutator qöyamiz.",
    hide: ["p1", "p2", "p3", "p4", ...ALL_LINKS],
  },
  {
    say: "Törtta oxirgi qurilma qöşildi. Ular hali heç narsaga ulanmagan — bir-birini körmaydi.",
    hide: ALL_LINKS,
    ask: { q: "Kompyuterni kommutatorga qaysi kabel bilan ulaymiz?", options: ["Töğri (straight-through)", "Kesişgan (crossover)", "Konsol kabeli"], answer: 0, explain: "Har xil turdagi qurilmalar (PC ↔ switch) — töğri kabel. Bir xillar (PC ↔ PC, switch ↔ switch) — kesişgan; konsol kabeli — sozlaş uçun." },
  },
  {
    say: "Kabellar ulandi. Port çiroqlari avval töq sariq, bir neça soniyadan söng yaşil böladi — kommutator portni tekşirib, işga tuşirdi.",
    marks: { sw: { text: "4 port yaşil", tone: "ok", at: 0.8 } },
  },
  {
    say: "Har kompyuterga IP manzil berildi: Desktop → IP Configuration. Hammasi 192.168.1.0/24 tarmoğida.",
    subs: { p1: IPS.p1, p2: IPS.p2, p3: IPS.p3 },
    ask: { q: "Laptop0 ga qaysi manzil töğri keladi (maska 255.255.255.0)?", options: ["192.168.2.13", "192.168.1.13", "192.168.1.255", "192.168.1.10"], answer: 1, explain: ".2.13 — boshqa tarmoq, .255 — broadcast, .10 — PC0 da band. To'g'risi 192.168.1.13." },
  },
  {
    say: "Tekşiruv: PC0 dan Laptop0 ga ping. Birinçi marta ARP işlaydi (MAC söraladi), keyin ICMP sörov va javob.",
    subs: IPS,
    flights: [{ from: "p1", to: "p4", label: "ARP?", tone: "amber" }, { from: "p4", to: "p1", label: "MAC", tone: "amber", delay: 2.4 }, { from: "p1", to: "p4", label: "ping", delay: 4.8 }, { from: "p4", to: "p1", label: "javob", tone: "green", delay: 7.2 }],
    marks: { p1: { text: "Reply ✓", tone: "ok", at: 9.4 } },
    panel: <Console lines={["PC> ping 192.168.1.13", "Reply from 192.168.1.13: bytes=32 time<1ms TTL=128", "Reply from 192.168.1.13: bytes=32 time<1ms TTL=128"]} />,
  },
  {
    say: "Xato sinab köramiz: PC2 ga adaşib 192.168.1.12 örniga 192.168.10.12 yozildi. Endi PC0 undan javob olmaydi.",
    subs: { ...IPS, p3: "192.168.10.12 ✗" },
    flights: [{ from: "p1", to: "p3", label: "ping", lostAt: "p3" }],
    marks: { p3: { text: "Boşqa tarmoq", tone: "drop", at: 2.2 } },
    ask: { q: "PC0 (192.168.1.10/24) dan PC2 (192.168.10.12/24) ga ping ötmayapti, kabel va kommutator joyida. Sabab?", options: ["Kommutator portlari yetmaydi", "PC2 boşqa tarmoqda: 192.168.10.x ≠ 192.168.1.x", "PC0 ning kabeli notöğri"], answer: 1, explain: "PC2 — manzili 192.168.10.x, qolganlari 192.168.1.x. Bitta kommutatorda ham turli tarmoqlar bir-birini körmaydi." },
  },
  { say: "Emulyatorda xato qiliş bepul: qurilmani qöyiş → kabel → IP → ping. Simulation rejimida har paketning qadamlarini xuddi şunday köriş mumkin.", subs: IPS },
];

export default function EmulatorStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="Tarmoqni emulyatorda yiğamiz" />;
}
