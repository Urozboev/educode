"use client";

import { Story, MiniTable, Console, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Statik marshrut: ikki filial routeri bir-birining tarmog'ini bilmaguncha ping o'tmaydi. */

const nodes: SceneNode[] = [
  { id: "A", kind: "pc", x: 80, y: 200, label: "PC-A", sub: "192.168.1.10" },
  { id: "R1", kind: "router", x: 260, y: 200, label: "R1", sub: ".1.1 | 10.0.0.1" },
  { id: "R2", kind: "router", x: 500, y: 200, label: "R2", sub: "10.0.0.2 | .2.1" },
  { id: "B", kind: "pc", x: 680, y: 200, label: "PC-B", sub: "192.168.2.20" },
];
const links: SceneLink[] = [{ a: "A", b: "R1" }, { a: "R1", b: "R2", label: "10.0.0.0/30" }, { a: "R2", b: "B" }];

const r1 = (extra: boolean, hl?: number) => (
  <MiniTable title="R1 jadvali" head={["Tarmoq", "Qayerga"]} highlight={hl}
    rows={[["192.168.1.0/24", "Gi0/0 (ulangan)"], ["10.0.0.0/30", "Gi0/1 (ulangan)"], ...(extra ? [["192.168.2.0/24", "10.0.0.2"]] : [])]} />
);

const steps: Step[] = [
  { say: "Ikki filial: chapda 192.168.1.0/24, o'ngda 192.168.2.0/24, routerlar orasida kichik 10.0.0.0/30 liniya. Router o'ziga ulangan tarmoqlarni o'zi biladi, boshqalarini — yo'q.", panel: r1(false) },
  {
    say: "PC-A dan PC-B ga ping. R1 jadvalda 192.168.2.0 ni topmadi va paketni tashlab yubordi: «Destination host unreachable».",
    flights: [{ from: "A", to: "B", label: "ping .2.20", via: ["R1"], lostAt: "R1" }],
    marks: { R1: { text: "Bu tarmoqni bilmayman", tone: "drop", at: 1.1 } },
    panel: <div className="flex flex-wrap gap-3">{r1(false)}<Console lines={["C:\\> ping 192.168.2.20", "Reply from 192.168.1.1: Destination host unreachable."]} /></div>,
    ask: { q: "PC-A → PC-B ping: R1 «Destination host unreachable» deb qaytardi. Sabab?", options: ["Kabel uzilgan", "R1 192.168.2.0/24 tarmog'iga yo'lni bilmaydi", "PC-B o'chiq"], answer: 1, explain: "Javobni R1 (.1.1) qaytardi — demak kabel butun, faqat R1 jadvalida bu tarmoq yo'q." },
  },
  {
    say: "Administrator R1 ga yo'l yozadi: «192.168.2.0/24 ga borish uchun 10.0.0.2 ga (R2 ga) ber».",
    panel: <div className="flex flex-wrap gap-3">{r1(true, 2)}<Console lines={["R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2"]} /></div>,
    ask: { q: "Buyruqdagi oxirgi manzil (keyingi qadam) qaysi bo'lishi kerak?", options: ["192.168.2.1", "10.0.0.2", "192.168.1.1"], answer: 1, explain: "Keyingi qadam — R1 to'g'ridan-to'g'ri ko'radigan qo'shni interfeysi: R2 ning 10.0.0.2." },
  },
  {
    say: "Yana ping. So'rov endi B ga yetdi! Lekin javob qaytmadi: R2 da 192.168.1.0 ga yo'l yo'q. Ping ikki tomonlama — yo'l ham ikki tomonga kerak.",
    flights: [{ from: "A", to: "B", label: "ping" }, { from: "B", to: "A", label: "javob", tone: "green", delay: 3.3, via: ["R2"], lostAt: "R2" }],
    marks: { B: { text: "So'rov keldi", tone: "ok", at: 3.3 }, R2: { text: "192.168.1.0 ni bilmayman", tone: "drop", at: 4.5 } },
    panel: <Console lines={["C:\\> ping 192.168.2.20", "Request timed out."]} />,
    ask: { q: "R1 ga yo'l yozildi, so'rov PC-B ga yetadi, lekin javob qaytmayapti. Yana qaysi routerga yo'l yozish kerak? Bosing.", pick: "R2", explain: "R2 ga: ip route 192.168.1.0 255.255.255.0 10.0.0.1." },
  },
  {
    say: "R2 ga ham teskari yo'l yozildi. Endi so'rov ham, javob ham o'tadi.",
    flights: [{ from: "A", to: "B", label: "ping" }, { from: "B", to: "A", label: "javob", tone: "green", delay: 3.3 }],
    marks: { A: { text: "Reply ✓", tone: "ok", at: 6.6 } },
    panel: <Console lines={["R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1", "", "C:\\> ping 192.168.2.20", "Reply from 192.168.2.20: bytes=32 time=2ms TTL=126"]} />,
  },
  { say: "Xulosa: statik marshrut kichik tarmoq uchun oddiy va ishonchli, lekin har yangi tarmoqni har routerga qo'lda yozish kerak va liniya uzilsa o'zi aylanma yo'l topmaydi. TTL=126: paket 2 ta routerdan o'tdi (128 − 2)." },
];

export default function StaticRouteStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={300} title="Statik marshrut: ping nega o'tmayapti?" />;
}
