"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Story, MiniTable, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/**
 * Hub va kommutator: bir xil voqea, ikki xil qurilma.
 * Talaba farqni jadvaldan emas, xabar kimga borayotganidan ko'radi.
 */

const pcs = (center: "hub" | "switch"): SceneNode[] => [
  { id: "A", kind: "pc", x: 110, y: 85, label: "Ali", sub: "1-port" },
  { id: "B", kind: "pc", x: 650, y: 85, label: "Bobur", sub: "2-port" },
  { id: "C", kind: "pc", x: 110, y: 280, label: "Vali", sub: "3-port" },
  { id: "D", kind: "pc", x: 650, y: 280, label: "Dilnoza", sub: "4-port" },
  { id: "X", kind: center, x: 380, y: 175, label: center === "hub" ? "Konsentrator (hub)" : "Kommutator (switch)" },
];
const links: SceneLink[] = ["A", "B", "C", "D"].map((p) => ({ a: p, b: "X" }));

const table = (rows: string[][], hi?: number) => <MiniTable title="Kommutator xotirasi (MAC jadvali)" head={["Kim", "Port"]} rows={rows} highlight={hi} />;

const SWITCH: Step[] = [
  { say: "Ali Valiga xabar yubormoqçi. Hamma kompyuter kommutatorga kabel bilan ulangan. Kommutatorning xotirasi hozirça böş — u heç kimni tanimaydi.", focus: ["A", "C", "X"], panel: table([]) },
  {
    say: "Xabar kommutatorga keldi. Kommutator birinçi navbatda jönatuvçini eslab qoladi: «Ali — 1-portda».",
    flights: [{ from: "A", to: "X", label: "Ali → Vali" }],
    marks: { X: { text: "Ali 1-portda — eslab qoldim" } },
    panel: table([["Ali", "1"]], 0),
  },
  {
    say: "Vali qaysi portda ekanini kommutator hali bilmaydi. Şuning uçun xabarni hamma portga yuboradi. Faqat Vali qabul qiladi, Bobur va Dilnoza taşlab yuboradi.",
    flights: [{ from: "X", to: "B", label: "Ali → Vali" }, { from: "X", to: "C", label: "Ali → Vali" }, { from: "X", to: "D", label: "Ali → Vali" }],
    marks: { B: { text: "Menga emas", tone: "drop" }, C: { text: "Menga!", tone: "ok" }, D: { text: "Menga emas", tone: "drop" } },
    panel: table([["Ali", "1"]]),
    ask: {
      q: "Kommutator Vali qaysi portda ekanini hali bilmaydi. Xabar qaysi kompyuterlarga yuboriladi?",
      pick: ["B", "C", "D"],
      hint: "Kommutator manzilni bilmasa, xabarni kelgan portdan taşqari BARÇA portlarga yuboradi.",
      explain: "Jadvalda Vali yöq — kommutator xabarni Alidan boşqa hammaga yuboradi (flooding). Faqat Vali uni qabul qiladi.",
    },
  },
  {
    say: "Vali javob yozdi. Kommutator yana jönatuvçini eslab qoladi: «Vali — 3-portda».",
    flights: [{ from: "C", to: "X", label: "Vali → Ali", tone: "green" }],
    marks: { X: { text: "Vali 3-portda — eslab qoldim" } },
    panel: table([["Ali", "1"], ["Vali", "3"]], 1),
  },
  {
    say: "Ali qayerdaligini kommutator endi biladi — javob FAQAT Aliga ketdi. Bobur va Dilnoza bezovta qilinmadi.",
    flights: [{ from: "X", to: "A", label: "Vali → Ali", tone: "green" }],
    marks: { A: { text: "Javob keldi", tone: "ok" } },
    focus: ["A", "C", "X"],
    ask: {
      q: "Vali javob yozdi. Endi kommutator javobni qaysi kompyuterga yuboradi?",
      pick: "A",
      hint: "Jadvalga qarang: Ali qaysi portda yozilgan?",
      explain: "Ali jadvalda bor (1-port) — javob faqat Aliga boradi, boşqalar bezovta qilinmaydi.",
    },
    panel: table([["Ali", "1"], ["Vali", "3"]], 0),
  },
  {
    say: "Bundan keyin Ali va Vali orasidagi barça xabarlar töğridan-töğri boradi. Kommutator bir marta örganadi — keyin faqat kerakli eşikni oçadi. Bobur va Dilnoza ham şu paytda bemalol gaplaşa oladi.",
    flights: [{ from: "A", to: "C", label: "Ali → Vali" }, { from: "B", to: "D", label: "Bobur → Dilnoza", tone: "purple" }],
    marks: { C: { text: "Menga!", tone: "ok" }, D: { text: "Menga!", tone: "ok" } },
    panel: table([["Ali", "1"], ["Bobur", "2"], ["Vali", "3"], ["Dilnoza", "4"]]),
  },
];

const HUB: Step[] = [
  { say: "Endi markazda hub (konsentrator). U heç narsani eslab qolmaydi — kelgan signalni şunçaki barça portlarga takrorlaydi.", focus: ["A", "C", "X"] },
  { say: "Ali Valiga xabar yubordi.", flights: [{ from: "A", to: "X", label: "Ali → Vali" }] },
  {
    say: "Hub xabarni oldi. U nima qiladi?",
    ask: {
      q: "Hub xabarni qaysi kompyuterlarga yuboradi?",
      pick: ["B", "C", "D"],
      hint: "Hub manzilni öqimaydi ham — signalni şunçaki takrorlaydi.",
      explain: "Hub xabarni hamma portga takrorladi. Faqat Vali oladi, lekin kabel butun tarmoqda band böldi.",
    },
    flights: [{ from: "X", to: "B", label: "Ali → Vali" }, { from: "X", to: "C", label: "Ali → Vali" }, { from: "X", to: "D", label: "Ali → Vali" }],
    marks: { B: { text: "Menga emas", tone: "drop" }, C: { text: "Menga!", tone: "ok" }, D: { text: "Menga emas", tone: "drop" } },
  },
  {
    say: "Vali javob yozdi — u ham hammaga ketdi. Hub örganmaydi: har bir xabar bilan hamma bezovta qilinadi.",
    flights: [{ from: "C", to: "A", label: "Vali → Ali", tone: "green" }, { from: "C", to: "B", label: "Vali → Ali", tone: "green" }, { from: "C", to: "D", label: "Vali → Ali", tone: "green" }],
    marks: { A: { text: "Menga!", tone: "ok" }, B: { text: "Menga emas", tone: "drop" }, D: { text: "Menga emas", tone: "drop" } },
  },
  {
    say: "Ali va Dilnoza bir vaqtda yuborişdi. Hub içida signallar ustma-ust tuşdi — töqnaşuv! Ikkalasi ham kutib, qayta yuborişga majbur.",
    flights: [{ from: "A", to: "X", label: "Ali → Vali" }, { from: "D", to: "X", label: "Dilnoza → Bobur", tone: "purple" }],
    marks: { X: { text: "Töqnaşuv!", tone: "warn" } },
  },
  { say: "Xulosa: hub — bitta umumiy «yölak», unda bir vaqtda faqat bitta odam gapira oladi. Kompyuterlar köpaygan sari tarmoq sekinlaşadi. Şuning uçun bugun hamma joyda kommutator işlatiladi." },
];

export default function SwitchStory({ initial = "switch" }: { initial?: "hub" | "switch" }) {
  const [mode, setMode] = useState(initial);
  return (
    <div className="space-y-3">
      <div className="inline-flex p-1 rounded-2xl border border-border/60 bg-card/60">
        {(["switch", "hub"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-all", mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
            {m === "switch" ? "Kommutator" : "Hub"}
          </button>
        ))}
      </div>
      <Story key={mode} nodes={pcs(mode)} links={links} steps={mode === "switch" ? SWITCH : HUB}
        title={mode === "switch" ? "Kommutator xabarni kimga yuboradi?" : "Hub xabarni kimga yuboradi?"} />
    </div>
  );
}
