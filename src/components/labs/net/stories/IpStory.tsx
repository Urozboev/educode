"use client";

import { Story, Bits, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** IP manzil: "bir tarmoqdami?" degan savolga maska javob beradi. */

const b = (ip: string) => ip.split(".").map((x) => (+x).toString(2).padStart(8, "0")).join(".");

const nodes: SceneNode[] = [
  { id: "A", kind: "pc", x: 90, y: 90, label: "A", sub: "192.168.1.10 /24" },
  { id: "B", kind: "pc", x: 90, y: 290, label: "B", sub: "192.168.1.20 /24" },
  { id: "s1", kind: "switch", x: 255, y: 190, label: "1-xona" },
  { id: "r", kind: "router", x: 420, y: 190, label: "Router", sub: ".1.1 | .2.1" },
  { id: "s2", kind: "switch", x: 585, y: 190, label: "2-xona" },
  { id: "C", kind: "pc", x: 690, y: 300, label: "C", sub: "192.168.2.30 /24" },
];
const links: SceneLink[] = [{ a: "A", b: "s1" }, { a: "B", b: "s1" }, { a: "s1", b: "r" }, { a: "r", b: "s2" }, { a: "s2", b: "C" }];

const steps: Step[] = [
  {
    say: "IP manzil ikki qismdan iborat — xuddi «köça + uy raqami» kabi. /24 maska aytadi: birinçi 24 bit — tarmoq (köça), qolgan 8 bit — kompyuter (uy).",
    focus: ["A"],
    panel: (
      <div className="space-y-1">
        <Bits label="A: 192.168.1.10" bits={b("192.168.1.10")} split={24} />
        <Bits label="Maska /24" bits={b("255.255.255.0")} split={24} />
        <p className="text-xs text-muted-foreground">Binafşa — tarmoq qismi (192.168.1), yaşil — kompyuter raqami (10).</p>
      </div>
    ),
  },
  {
    say: "A va B ning tarmoq qismi bir xil — 192.168.1. Demak bir «köçada»: A xabarni töğridan-töğri, kommutator orqali yuboradi. Router kerak emas.",
    flights: [{ from: "A", to: "B", label: "A → B" }],
    marks: { B: { text: "Keldi", tone: "ok" } },
    panel: (
      <div className="space-y-1">
        <Bits label="A: .1.10" bits={b("192.168.1.10")} split={24} />
        <Bits label="B: .1.20" bits={b("192.168.1.20")} split={24} />
      </div>
    ),
    ask: { q: "A (192.168.1.10/24) va B (192.168.1.20/24) bir tarmoqdami?", options: ["Ha — tarmoq qismi bir xil (192.168.1)", "Yo'q"], answer: 0, explain: "Birinçi 24 bit (192.168.1) bir xil — bitta tarmoq, router kerak emas." },
  },
  {
    say: "C ning tarmoği 192.168.2 — boşqa «köça». A buni köradi va xabarni öz şlyuziga — routerga beradi. Router uni 2-xona tarmoğiga ötkazadi.",
    flights: [{ from: "A", to: "C", label: "A → C" }],
    marks: { r: { text: "2-tarmoqqa ötkazaman", at: 1.6 }, C: { text: "Keldi", tone: "ok" } },
    panel: (
      <div className="space-y-1">
        <Bits label="A: .1.10" bits={b("192.168.1.10")} split={24} />
        <Bits label="C: .2.30" bits={b("192.168.2.30")} split={24} tone="amber" />
      </div>
    ),
    ask: { q: "A xabarni C ga (192.168.2.30) yubormoqçi. Xabar avval qaysi qurilmaga boradi (kommutatordan keyin)?", pick: "r", hint: "C boşqa tarmoqda. Tarmoqlar orasini nima boğlaydi?", explain: "Router (şlyuz) ga. Boşqa tarmoqqa faqat router orqali ötiladi." },
  },
  {
    say: "Har tarmoqda ikki manzil kompyuterga berilmaydi: tarmoqning özi (192.168.1.0) va broadcast — «hammaga» (192.168.1.255). Şuning uçun /24 tarmoqda 256 emas, 254 ta kompyuter böladi.",
    ask: { q: "/24 tarmoqda nechta kompyuterga manzil berish mumkin?", options: ["256", "255", "254", "24"], answer: 2, explain: "2⁸ − 2 = 254: tarmoq manzili (.0) va broadcast (.255) band." },
  },
  {
    say: "Maxsus manzillar: 127.0.0.1 — kompyuterning özi; 169.254.x.x — DHCP topilmaganda öziga özi bergan manzil; 10.x, 172.16–31.x, 192.168.x — içki (xususiy) tarmoqlar, Internetga router NAT orqali çiqadi.",
    ask: { q: "Kompyuter 169.254.7.12 manzil oldi. Bu nimani bildiradi?", options: ["Internet zör işlayapti", "DHCP serverdan javob kelmagan", "Bu Google manzili"], answer: 1, explain: "169.254.x.x (APIPA) — kompyuter DHCP topolmay, öziga özi manzil bergan. Internetga çiqa olmaydi." },
  },
];

export default function IpStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={380} title="IP manzil: bir tarmoqdami yoki yöq?" />;
}
