"use client";

import { cn } from "@/lib/utils";
import { Story, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/**
 * OSI: xat va konvert o'xshatishi. Har pog'ona xabarni yangi
 * "konvert"ga soladi (sarlavha qo'shadi); qabul qiluvchi konvertlarni
 * teskari tartibda ochadi. Router faqat 3-pog'onagacha ochadi.
 */

const CHIP: Record<string, string> = {
  Eth: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50",
  IP: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50",
  TCP: "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/50",
  Data: "bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/50",
  FCS: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50",
};
const NAME: Record<string, string> = { Eth: "Ethernet: MAC manzillar", IP: "IP: 192.168.1.10 → 93.184.216.34", TCP: "TCP: port 51034 → 80", Data: "GET /index.html", FCS: "FCS" };

function Pack({ parts, layer, note }: { parts: string[]; layer: string; note?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs text-muted-foreground"><b className="text-foreground">{layer}</b>{note ? ` — ${note}` : ""}</div>
      <div className="flex flex-wrap items-stretch gap-1 font-mono text-[12px]">
        {parts.map((p, k) => (
          <span key={k} className={cn("px-2.5 py-2 rounded-lg border font-semibold", CHIP[p])}>{NAME[p]}</span>
        ))}
      </div>
    </div>
  );
}

const nodes: SceneNode[] = [
  { id: "pc", kind: "pc", x: 95, y: 175, label: "Ali (brauzer)", sub: "192.168.1.10" },
  { id: "r", kind: "router", x: 380, y: 175, label: "Router" },
  { id: "srv", kind: "server", x: 665, y: 175, label: "Veb-server", sub: "93.184.216.34" },
];
const links: SceneLink[] = [{ a: "pc", b: "r" }, { a: "r", b: "srv" }];

const steps: Step[] = [
  {
    say: "7–5 pog'onalar (amaliy, taqdimot, seans): brauzer so'rov tuzdi — «GET /index.html». Hozircha bu oddiy matn, xat qog'ozi kabi.",
    focus: ["pc"],
    panel: <Pack parts={["Data"]} layer="Amaliy pog'ona" note="ma'lumot" />,
  },
  {
    say: "4-pog'ona (transport) xabarni konvertga soldi: TCP sarlavhasi. Unda port raqamlari bor — serverda qaysi dasturga (80 — veb-server) va javob kompyuterning qaysi dasturiga qaytishi kerak.",
    focus: ["pc"],
    panel: <Pack parts={["TCP", "Data"]} layer="Transport" note="segment" />,
    ask: { q: "Qaysi pog'ona port raqamini (80) qo'shadi?", options: ["Tarmoq (IP)", "Transport (TCP)", "Kanal (Ethernet)"], answer: 1, explain: "Transport pog'onasi — TCP/UDP. Port xabar qaysi DASTURGA ekanini bildiradi." },
  },
  {
    say: "3-pog'ona (tarmoq) yana bir konvert qo'shdi: IP sarlavha — kimdan kimga (IP manzillar). Endi bu paket.",
    focus: ["pc"],
    panel: <Pack parts={["IP", "TCP", "Data"]} layer="Tarmoq" note="paket" />,
    ask: { q: "Endi qaysi manzil qo'shiladi?", options: ["MAC manzil", "IP manzil", "Port"], answer: 1, explain: "Tarmoq pog'onasi IP manzillarni qo'shadi — paket shu bo'yicha boshqa tarmoqlarga yo'naltiriladi." },
  },
  {
    say: "2-pog'ona (kanal) eng tashqi konvertni qo'shdi: Ethernet sarlavha (MAC manzillar — keyingi qurilmagacha) va oxiriga FCS — buzilishni tekshirish uchun. Endi bu kadr.",
    focus: ["pc"],
    panel: <Pack parts={["Eth", "IP", "TCP", "Data", "FCS"]} layer="Kanal" note="kadr" />,
  },
  {
    say: "1-pog'ona (fizik) kadrni bitlarga — kabeldagi elektr signaliga aylantirdi. Kadr routerga ketdi.",
    flights: [{ from: "pc", to: "r", label: "0110 1001…" }],
    panel: <div className="font-mono text-[13px] text-neon-purple break-all">0100 0111 0100 0101 0101 0100 0010 0000 0010 1111 …</div>,
  },
  {
    say: "Router konvertlarni ochadi: Ethernet (2) — «kadr menga keldi», IP (3) — «manzil 93.184.216.34, o'ng tomonga uzataman». TCP va ichidagi ma'lumotni u OCHMAYDI — bu uning ishi emas.",
    marks: { r: { text: "IP gacha ochdim", at: 0.1 } },
    focus: ["r"],
    panel: <Pack parts={["IP", "TCP", "Data"]} layer="Router" note="yangi Ethernet konvert bilan qayta o'raydi" />,
    ask: { q: "Router paketni qaysi pog'onagacha ochib o'qiydi?", options: ["2 — kanal", "3 — tarmoq", "4 — transport", "7 — amaliy"], answer: 1, explain: "3-pog'onagacha: IP manzilga qarab yo'l tanlaydi. Shuning uchun router — 3-pog'ona qurilmasi." },
  },
  {
    say: "Router yangi Ethernet konvert bilan o'rab, serverga uzatdi.",
    flights: [{ from: "r", to: "srv", label: "0110 1001…" }],
  },
  {
    say: "Server konvertlarni teskari tartibda ochadi: Ethernet → IP → TCP (port 80 — veb-server dasturiga) → «GET /index.html». Bu dekapsulyatsiya. Javob xuddi shu yo'l bilan qaytadi.",
    focus: ["srv"],
    marks: { srv: { text: "Port 80 — menga!", tone: "ok", at: 0.1 } },
    panel: <Pack parts={["Data"]} layer="Server, amaliy pog'ona" note="xat o'qildi" />,
  },
  { say: "Xulosa: yuborishda har pog'ona konvert qo'shadi (inkapsulyatsiya), qabul qilishda ochadi (dekapsulyatsiya). Switch 2-pog'onagacha, router 3-pog'onagacha, server esa hammasini ochadi." },
];

export default function OsiStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={300} title="OSI: xabar qanday konvertlarga o'raladi" />;
}
