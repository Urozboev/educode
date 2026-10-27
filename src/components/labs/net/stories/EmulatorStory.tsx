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
    say: "Emulyator — haqiqiy uskunasiz tarmoq qurish va sinash dasturi (Cisco Packet Tracer, GNS3). Bo'sh maydonga avval kommutator qo'yamiz.",
    hide: ["p1", "p2", "p3", "p4", ...ALL_LINKS],
  },
  {
    say: "To'rtta oxirgi qurilma qo'shildi. Ular hali hech narsaga ulanmagan — bir-birini ko'rmaydi.",
    hide: ALL_LINKS,
    ask: { q: "Kompyuterni kommutatorga qaysi kabel bilan ulaymiz?", options: ["To'g'ri (straight-through)", "Kesishgan (crossover)", "Konsol kabeli"], answer: 0, explain: "Har xil turdagi qurilmalar (PC ↔ switch) — to'g'ri kabel. Bir xillar (PC ↔ PC, switch ↔ switch) — kesishgan; konsol kabeli — sozlash uchun." },
  },
  {
    say: "Kabellar ulandi. Port chiroqlari avval to'q sariq, bir necha soniyadan so'ng yashil bo'ladi — kommutator portni tekshirib, ishga tushirdi.",
    marks: { sw: { text: "4 port yashil", tone: "ok", at: 0.8 } },
  },
  {
    say: "Har kompyuterga IP manzil berildi: Desktop → IP Configuration. Hammasi 192.168.1.0/24 tarmog'ida.",
    subs: { p1: IPS.p1, p2: IPS.p2, p3: IPS.p3 },
    ask: { q: "Laptop0 ga qaysi manzil to'g'ri keladi (maska 255.255.255.0)?", options: ["192.168.2.13", "192.168.1.13", "192.168.1.255", "192.168.1.10"], answer: 1, explain: ".2.13 — boshqa tarmoq, .255 — broadcast, .10 — PC0 da band. To'g'risi 192.168.1.13." },
  },
  {
    say: "Tekshiruv: PC0 dan Laptop0 ga ping. Birinchi marta ARP ishlaydi (MAC so'raladi), keyin ICMP so'rov va javob.",
    subs: IPS,
    flights: [{ from: "p1", to: "p4", label: "ARP?", tone: "amber" }, { from: "p4", to: "p1", label: "MAC", tone: "amber", delay: 2.4 }, { from: "p1", to: "p4", label: "ping", delay: 4.8 }, { from: "p4", to: "p1", label: "javob", tone: "green", delay: 7.2 }],
    marks: { p1: { text: "Reply ✓", tone: "ok", at: 9.4 } },
    panel: <Console lines={["PC> ping 192.168.1.13", "Reply from 192.168.1.13: bytes=32 time<1ms TTL=128", "Reply from 192.168.1.13: bytes=32 time<1ms TTL=128"]} />,
  },
  {
    say: "Xato sinab ko'ramiz: PC2 ga adashib 192.168.1.12 o'rniga 192.168.10.12 yozildi. Endi PC0 undan javob olmaydi.",
    subs: { ...IPS, p3: "192.168.10.12 ✗" },
    flights: [{ from: "p1", to: "p3", label: "ping", lostAt: "p3" }],
    marks: { p3: { text: "Boshqa tarmoq", tone: "drop", at: 2.2 } },
    ask: { q: "PC0 (192.168.1.10/24) dan PC2 (192.168.10.12/24) ga ping o'tmayapti, kabel va kommutator joyida. Sabab?", options: ["Kommutator portlari yetmaydi", "PC2 boshqa tarmoqda: 192.168.10.x ≠ 192.168.1.x", "PC0 ning kabeli noto'g'ri"], answer: 1, explain: "PC2 — manzili 192.168.10.x, qolganlari 192.168.1.x. Bitta kommutatorda ham turli tarmoqlar bir-birini ko'rmaydi." },
  },
  { say: "Emulyatorda xato qilish bepul: qurilmani qo'yish → kabel → IP → ping. Simulation rejimida har paketning qadamlarini xuddi shunday ko'rish mumkin.", subs: IPS },
];

export default function EmulatorStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={390} title="Tarmoqni emulyatorda yig'amiz" />;
}
