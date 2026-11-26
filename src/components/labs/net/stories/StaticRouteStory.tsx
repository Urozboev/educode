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
  { say: "Ikki filial: çapda 192.168.1.0/24, öngda 192.168.2.0/24, routerlar orasida kiçik 10.0.0.0/30 liniya. Router öziga ulangan tarmoqlarni özi biladi, boşqalarini — yöq.", panel: r1(false) },
  {
    say: "PC-A dan PC-B ga ping. R1 jadvalda 192.168.2.0 ni topmadi va paketni taşlab yubordi: «Destination host unreachable».",
    flights: [{ from: "A", to: "B", label: "ping .2.20", via: ["R1"], lostAt: "R1" }],
    marks: { R1: { text: "Bu tarmoqni bilmayman", tone: "drop", at: 1.1 } },
    panel: <div className="flex flex-wrap gap-3">{r1(false)}<Console lines={["C:\\> ping 192.168.2.20", "Reply from 192.168.1.1: Destination host unreachable."]} /></div>,
    ask: { q: "PC-A → PC-B ping: R1 «Destination host unreachable» deb qaytardi. Sabab?", options: ["Kabel uzilgan", "R1 192.168.2.0/24 tarmoğiga yölni bilmaydi", "PC-B öçiq"], answer: 1, explain: "Javobni R1 (.1.1) qaytardi — demak kabel butun, faqat R1 jadvalida bu tarmoq yöq." },
  },
  {
    say: "Administrator R1 ga yöl yozadi: «192.168.2.0/24 ga boriş uçun 10.0.0.2 ga (R2 ga) ber».",
    panel: <div className="flex flex-wrap gap-3">{r1(true, 2)}<Console lines={["R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2"]} /></div>,
    ask: { q: "Buyruqdagi oxirgi manzil (keyingi qadam) qaysi bölişi kerak?", options: ["192.168.2.1", "10.0.0.2", "192.168.1.1"], answer: 1, explain: "Keyingi qadam — R1 töğridan-töğri köradigan qöşni interfeysi: R2 ning 10.0.0.2." },
  },
  {
    say: "Yana ping. Sörov endi B ga yetdi! Lekin javob qaytmadi: R2 da 192.168.1.0 ga yöl yöq. Ping ikki tomonlama — yöl ham ikki tomonga kerak.",
    flights: [{ from: "A", to: "B", label: "ping" }, { from: "B", to: "A", label: "javob", tone: "green", delay: 3.3, via: ["R2"], lostAt: "R2" }],
    marks: { B: { text: "Sörov keldi", tone: "ok", at: 3.3 }, R2: { text: "192.168.1.0 ni bilmayman", tone: "drop", at: 4.5 } },
    panel: <Console lines={["C:\\> ping 192.168.2.20", "Request timed out."]} />,
    ask: { q: "R1 ga yöl yozildi, sörov PC-B ga yetadi, lekin javob qaytmayapti. Yana qaysi routerga yöl yoziş kerak? Bosing.", pick: "R2", explain: "R2 ga: ip route 192.168.1.0 255.255.255.0 10.0.0.1." },
  },
  {
    say: "R2 ga ham teskari yöl yozildi. Endi sörov ham, javob ham ötadi.",
    flights: [{ from: "A", to: "B", label: "ping" }, { from: "B", to: "A", label: "javob", tone: "green", delay: 3.3 }],
    marks: { A: { text: "Reply ✓", tone: "ok", at: 6.6 } },
    panel: <Console lines={["R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1", "", "C:\\> ping 192.168.2.20", "Reply from 192.168.2.20: bytes=32 time=2ms TTL=126"]} />,
  },
  { say: "Xulosa: statik marşrut kiçik tarmoq uçun oddiy va işonçli, lekin har yangi tarmoqni har routerga qölda yoziş kerak va liniya uzilsa özi aylanma yöl topmaydi. TTL=126: paket 2 ta routerdan ötdi (128 − 2)." },
];

export default function StaticRouteStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={300} title="Statik marşrut: ping nega ötmayapti?" />;
}
