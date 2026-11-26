"use client";

import { Story, Bits, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/**
 * Subnetting va VLSM: bitta katta tarmoqni bo'limlarga "kesish".
 * Har bo'lim sahnada kommutator; unga ajratilgan tarmoq qadamma-qadam
 * yoziladi, talaba keyingi qiymatni o'zi topadi.
 */

const nodes = (names: string[]): SceneNode[] => [
  { id: "r", kind: "router", x: 380, y: 195, label: "Kafedra routeri" },
  { id: "s1", kind: "switch", x: 145, y: 85, label: names[0] },
  { id: "s2", kind: "switch", x: 615, y: 85, label: names[1] },
  { id: "s3", kind: "switch", x: 145, y: 305, label: names[2] },
  { id: "s4", kind: "switch", x: 615, y: 305, label: names[3] },
];
const links: SceneLink[] = ["s1", "s2", "s3", "s4"].map((s) => ({ a: s, b: "r" }));
const b = (ip: string) => ip.split(".").map((x) => (+x).toString(2).padStart(8, "0")).join(".");
const q4 = { s1: "?", s2: "?", s3: "?", s4: "?" };

const FLSM: Step[] = [
  { say: "Kafedraga 192.168.10.0/24 tarmoği berildi — 254 ta manzil. Uni 4 ta bölimga teng böliş kerak: har bölim öz tarmoğida bölsin (bir bölimning broadcastʼi boşqasini bezovta qilmasin).", subs: q4 },
  {
    say: "4 ta tarmoq uçun xost qismidan 2 bit «qarzga» olamiz: 2² = 4. Prefiks /24 dan /26 ga özgaradi, maska — 255.255.255.192. Har tarmoqda 2⁶ = 64 manzil, 62 ta kompyuter.",
    subs: q4,
    panel: (
      <div className="space-y-1">
        <Bits label="/24" bits={b("255.255.255.0")} split={24} />
        <Bits label="/26" bits={b("255.255.255.192")} split={26} />
      </div>
    ),
    ask: { q: "Tarmoqni 4 ta teng qismga böliş uçun xost qismidan neçta bit olinadi?", options: ["1", "2", "3", "4"], answer: 1, hint: "2 ning neçançi darajasi 4 ga teng?", explain: "2 bit: 2² = 4 ta tarmoq. Yangi prefiks /24 + 2 = /26." },
  },
  {
    say: "Har tarmoq 64 manzildan iborat, şuning uçun ular 64 qadam bilan boşlanadi: .0, .64, .128, .192.",
    subs: { s1: "192.168.10.0/26", s2: "192.168.10.64/26", s3: "?", s4: "?" },
    ask: { q: "1-bölim .0/26, 2-bölim .64/26. 3-bölim tarmoği qaysi manzildan boşlanadi?", options: ["192.168.10.96", "192.168.10.128", "192.168.10.192", "192.168.10.65"], answer: 1, hint: "Qadam — 64.", explain: "64 + 64 = 128. 3-bölim — 192.168.10.128/26, 4-bölim — 192.168.10.192/26." },
  },
  {
    say: "Har tarmoqning oxirgi manzili — broadcast: keyingi tarmoq boşidan bitta oldin. 1-bölim: tarmoq .0, kompyuterlar .1 – .62, broadcast .63.",
    subs: { s1: "192.168.10.0/26", s2: "192.168.10.64/26", s3: "192.168.10.128/26", s4: "192.168.10.192/26" },
    ask: { q: "1-bölim (192.168.10.0/26) ning broadcast manzili?", options: ["192.168.10.62", "192.168.10.63", "192.168.10.64", "192.168.10.255"], answer: 1, explain: "Keyingi tarmoq .64 dan boşlanadi — demak 1-bölimning oxirgisi .63." },
  },
  {
    say: "1-bölimdagi kompyuter 192.168.10.130 ga xabar yubordi. Router manzilga qarab köradi: .130 → .128/26 tarmoği, yaʼni 3-bölim.",
    subs: { s1: "192.168.10.0/26", s2: "192.168.10.64/26", s3: "192.168.10.128/26", s4: "192.168.10.192/26" },
    flights: [{ from: "s1", to: "s3", label: "→ .130" }],
    marks: { r: { text: ".130 → 3-bo'lim", at: 1.2 } },
    ask: { q: "192.168.10.130 qaysi bölimga tegişli? Kommutatorni bosing.", pick: "s3", hint: "128 ≤ 130 < 192.", explain: "3-bölim: 192.168.10.128 – 192.168.10.191." },
  },
  { say: "Xulosa: 2ⁿ ≥ kerakli bölimlar → n bit olinadi; blok = 2^(32 − yangi prefiks); tarmoqlar blok qadami bilan boşlanadi, broadcast — keyingi tarmoqdan bitta oldin.", subs: { s1: "192.168.10.0/26", s2: "192.168.10.64/26", s3: "192.168.10.128/26", s4: "192.168.10.192/26" } },
];

const V = { s1: "100 ta kompyuter", s2: "50 ta", s3: "20 ta", s4: "2 ta (router–router)" };
const VLSM: Step[] = [
  { say: "Endi bölimlar har xil: laboratoriyaga 100 ta, kafedraga 50 ta, maʼmuriyatga 20 ta manzil, ikki router orasidagi liniyaga 2 ta. Teng /26 bölsak, laboratoriyaga 62 ta yetmaydi, liniyada esa 60 ta manzil bekor ketadi.", subs: V },
  {
    say: "VLSM: har bölimga keragiça. Eng kattasidan boşlaymiz. 100 kompyuter uçun 2⁷ − 2 = 126 yetadi — /25.",
    subs: { ...V, s1: "192.168.10.0/25" },
    ask: { q: "100 ta kompyuter uçun eng kiçik yetarli prefiks?", options: ["/24 (254)", "/25 (126)", "/26 (62)", "/27 (30)"], answer: 1, explain: "/26 da 62 — yetmaydi. /25 da 126 — yetadi va eng tejamkor." },
  },
  {
    say: "Laboratoriya .0 – .127 ni oldi. Keyingi böş joy .128 dan. Kafedraga 50 ta: /26 (62 ta) — 192.168.10.128/26.",
    subs: { ...V, s1: "192.168.10.0/25", s2: "192.168.10.128/26" },
    ask: { q: "Kafedra (50 ta) qaysi manzildan boşlanadi?", options: ["192.168.10.100", "192.168.10.128", "192.168.10.64"], answer: 1, explain: "Laboratoriya .127 gaça band — keyingi böş blok .128." },
  },
  {
    say: "Maʼmuriyatga 20 ta: /27 (30 ta) — 192.168.10.192/27. Router–router liniyasiga 2 ta: /30 — 192.168.10.224/30.",
    subs: { s1: "192.168.10.0/25", s2: "192.168.10.128/26", s3: "192.168.10.192/27", s4: "192.168.10.224/30" },
    ask: { q: "Ikki router orasidagi liniyaga (2 ta manzil) qaysi prefiks?", options: ["/28", "/29", "/30", "/32"], answer: 2, explain: "/30: 4 manzil, 2 tasi kompyuterlarga (tarmoq va broadcast — qolgan 2 tasi)." },
  },
  { say: "Natija: 256 manzildan 228 tasi işlatildi, .228 dan keyingisi kelajak uçun zaxirada. Har doim kattadan boşlang — şunda bloklar bir-biriga töqnaşmaydi.", subs: { s1: "192.168.10.0/25", s2: "192.168.10.128/26", s3: "192.168.10.192/27", s4: "192.168.10.224/30" } },
];

export default function SubnetStory({ mode = "flsm" }: { mode?: "flsm" | "vlsm" }) {
  return mode === "flsm"
    ? <Story nodes={nodes(["1-bo'lim", "2-bo'lim", "3-bo'lim", "4-bo'lim"])} links={links} steps={FLSM} height={390} title="Tarmoqni 4 ta teng bölimga böliş" />
    : <Story nodes={nodes(["Laboratoriya", "Kafedra", "Ma'muriyat", "Liniya"])} links={links} steps={VLSM} height={390} title="VLSM: har bölimga keragiça" />;
}
