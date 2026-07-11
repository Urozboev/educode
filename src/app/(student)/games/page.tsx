"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

// Three.js og'ir — faqat o'yin ochilganda yuklanadi
const QuizBattle3D = dynamic(() => import("@/components/games/QuizBattle3D"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] rounded-3xl border border-border/50 bg-[#0a0a14] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">⚔️</div>
        <p className="text-white/60 text-sm">3D sahna yuklanmoqda...</p>
      </div>
    </div>
  ),
});
import {
  Puzzle,
  Bug,
  Keyboard,
  Swords,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Clock,
  Zap,
  Map,
  Bird,
  GripVertical,
  Trash2,
  Play,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  ArrowLeft as ALeft,
  ArrowRight as ARight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

type GameType = null | "puzzle" | "bugfix" | "typing" | "battle" | "maze" | "bird" | "quiz3d";

const gameCards = [
  {
    type: "quiz3d" as const,
    title: "Quiz Battle 3D",
    desc: "3D arenada 45 soniya — kublardan to'g'ri javobni tanlang, combo yig'ing!",
    Icon: Swords,
    color: "#B388FF",
    diff: "3D · Yangi",
  },
  {
    type: "puzzle" as const,
    title: "Code Puzzle",
    desc: "Kod qatorlarini drag-and-drop bilan to'g'ri tartibga qo'ying.",
    Icon: Puzzle,
    color: "#6C5CE7",
    diff: "Oson",
  },
  {
    type: "bugfix" as const,
    title: "Bug Fix",
    desc: "Xatoli kodni toping va tuzating.",
    Icon: Bug,
    color: "#FF5252",
    diff: "O'rta",
  },
  {
    type: "typing" as const,
    title: "Type Racer",
    desc: "Kod yozish tezligi va aniqligini sinang.",
    Icon: Keyboard,
    color: "#00D2FF",
    diff: "Oson",
  },
  {
    type: "battle" as const,
    title: "Code Battle",
    desc: "30 soniya — tezkor javob va streak bonusi.",
    Icon: Swords,
    color: "#00E676",
    diff: "Qiyin",
  },
  {
    type: "maze" as const,
    title: "Maze Runner",
    desc: "Buyruq bloklari bilan labirintdan o'ting.",
    Icon: Map,
    color: "#FFD600",
    diff: "O'rta",
  },
  {
    type: "bird" as const,
    title: "Code Bird",
    desc: "Bloklarni joylashtirib qushni boshqaring.",
    Icon: Bird,
    color: "#FF6B9D",
    diff: "O'rta",
  },
];

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export default function GamesPage() {
  const [game, setGame] = useState<GameType>(null);

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-semibold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Interaktiv o'yinlar
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
          O'yin bilan o'rganing
        </h1>
        <p className="text-[15px] md:text-base text-muted-foreground max-w-2xl">
          Dasturlash ko'nikmalarini mustahkamlovchi 7 ta interaktiv o'yin — jumladan 3D arena.
          Tartib, mantiq, tezlik va algoritmik fikrlashni rivojlantiring.
        </p>
      </motion.div>

      {!game ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gameCards.map((g, i) => {
            const Icon = g.Icon;
            return (
              <motion.button
                key={g.type}
                onClick={() => setGame(g.type)}
                className="group relative text-left p-6 rounded-3xl border border-border/50 bg-card/40 hover:bg-card/80 hover:border-border transition-all overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: g.color }}
                />
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border"
                    style={{
                      backgroundColor: `${g.color}14`,
                      borderColor: `${g.color}33`,
                      color: g.color,
                    }}
                  >
                    <Icon className="w-7 h-7" strokeWidth={2} />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg tracking-tight group-hover:text-neon-purple transition-colors">
                      {g.title}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface/60 text-muted-foreground font-medium">
                      {g.diff}
                    </span>
                  </div>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{g.desc}</p>

                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-foreground/70 group-hover:text-neon-purple transition-colors">
                    O'ynash
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setGame(null)}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> O'yinlarga qaytish
          </button>
          {game === "quiz3d" && <QuizBattle3D />}
          {game === "puzzle" && <PuzzleGame />}
          {game === "bugfix" && <BugFixGame />}
          {game === "typing" && <TypingGame />}
          {game === "battle" && <BattleGame />}
          {game === "maze" && <MazeGame />}
          {game === "bird" && <BirdGame />}
        </div>
      )}
    </div>
  );
}

// ===== Shared =====
function GameHeader({
  Icon,
  title,
  meta,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight">{title}</h2>
      </div>
      {meta && <div className="text-sm text-muted-foreground">{meta}</div>}
    </div>
  );
}

// ===== 1. CODE PUZZLE =====
const puzzles = [
  { title: "Fibonacci", lines: ["def fibonacci(n):", "    if n <= 1:", "        return n", "    return fibonacci(n-1) + fibonacci(n-2)"] },
  { title: "Eng katta element", lines: ["def max_el(arr):", "    m = arr[0]", "    for x in arr:", "        if x > m:", "            m = x", "    return m"] },
  { title: "Teskari satr", lines: ["def reverse(s):", "    result = ''", "    for c in s:", "        result = c + result", "    return result"] },
  { title: "Faktorial", lines: ["def factorial(n):", "    if n == 0:", "        return 1", "    return n * factorial(n-1)"] },
  { title: "Sonlar yig'indisi", lines: ["total = 0", "for i in range(1, 11):", "    total += i", "print(total)"] },
  { title: "Bubble Sort", lines: ["for i in range(len(arr)):", "    for j in range(len(arr)-i-1):", "        if arr[j] > arr[j+1]:", "            arr[j], arr[j+1] = arr[j+1], arr[j]"] },
  { title: "Binary Search", lines: ["def search(arr, x):", "    lo, hi = 0, len(arr)-1", "    while lo <= hi:", "        mid = (lo + hi) // 2", "        if arr[mid] == x: return mid", "        elif arr[mid] < x: lo = mid + 1", "        else: hi = mid - 1", "    return -1"] },
  { title: "Juft sonlar filtri", lines: ["numbers = [1, 2, 3, 4, 5, 6]", "evens = []", "for n in numbers:", "    if n % 2 == 0:", "        evens.append(n)", "print(evens)"] },
  { title: "Lug'at yaratish", lines: ["students = {}", "students['Ali'] = 90", "students['Vali'] = 85", "for name, score in students.items():", "    print(f'{name}: {score}')"] },
];

function PuzzleGame() {
  const [idx, setIdx] = useState(0);
  const [lines, setLines] = useState(() => shuffle([...puzzles[0].lines]));
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const pz = puzzles[idx];
  const isCorrect = lines.every((l, i) => l === pz.lines[i]);

  function next() {
    const n = (idx + 1) % puzzles.length;
    setIdx(n);
    setLines(shuffle([...puzzles[n].lines]));
    setChecked(false);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <GameHeader
        Icon={Puzzle}
        title={pz.title}
        meta={
          <span>
            Skor: <strong className="text-foreground">{score}</strong> · {idx + 1}/{puzzles.length}
          </span>
        }
      />
      <p className="text-[15px] text-muted-foreground">
        Qatorlarni surib to'g'ri tartibga qo'ying, so'ng tekshiring.
      </p>

      <Reorder.Group
        axis="y"
        values={lines}
        onReorder={checked ? () => {} : setLines}
        className="space-y-2"
      >
        {lines.map((line, i) => (
          <Reorder.Item
            key={line}
            value={line}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl font-mono cursor-grab active:cursor-grabbing select-none transition-all border",
              checked && line === pz.lines[i]
                ? "bg-neon-green/10 border-neon-green/30"
                : checked
                ? "bg-neon-red/10 border-neon-red/30"
                : "bg-surface/60 border-border/60 hover:border-neon-purple/40 hover:bg-surface"
            )}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
            <span className="text-muted-foreground/40 w-5 text-right text-xs flex-shrink-0">
              {i + 1}
            </span>
            <code className="flex-1 whitespace-pre text-sm">{line}</code>
            {checked &&
              (line === pz.lines[i] ? (
                <CheckCircle2 className="w-4 h-4 text-neon-green flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-neon-red flex-shrink-0" />
              ))}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => {
            setChecked(true);
            if (isCorrect) setScore((s) => s + 1);
          }}
          disabled={checked}
          className="py-2.5 px-5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          Tekshirish
        </button>
        <button
          onClick={() => {
            setLines(shuffle([...pz.lines]));
            setChecked(false);
          }}
          className="py-2.5 px-5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Aralashtirish
        </button>
        {checked && (
          <button
            onClick={next}
            className="py-2.5 px-5 rounded-xl bg-neon-purple text-white font-semibold text-sm hover:opacity-90 transition inline-flex items-center gap-2"
          >
            Keyingi <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {checked && (
        <div
          className={cn(
            "p-4 rounded-2xl border text-center",
            isCorrect
              ? "border-neon-green/30 bg-neon-green/5"
              : "border-neon-red/30 bg-neon-red/5"
          )}
        >
          {isCorrect ? (
            <p className="inline-flex items-center gap-2 text-neon-green font-semibold text-lg">
              <CheckCircle2 className="w-5 h-5" /> To'g'ri tartib!
            </p>
          ) : (
            <p className="inline-flex items-center gap-2 text-neon-red font-semibold">
              <XCircle className="w-5 h-5" /> Noto'g'ri. Qayta urinib ko'ring.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ===== 2. BUG FIX =====
const bugs = [
  { title: "Taqqoslash operatori", code: "x = 10\nif x % 2 = 0:\n    print('Juft')", fixed: "if x % 2 == 0:", bugLine: 1, hint: "'=' o'rniga '==' kerak" },
  { title: "Index xatosi", code: "arr = [1, 2, 3]\nfor i in range(len(arr)):\n    print(arr[i + 1])", fixed: "    print(arr[i])", bugLine: 2, hint: "i+1 chegaradan chiqadi" },
  { title: "Faktorial", code: "def factorial(n):\n    if n == 0:\n        return 0\n    return n * factorial(n-1)", fixed: "        return 1", bugLine: 2, hint: "0! = 1, 0 emas" },
  { title: "Cheksiz tsikl", code: "i = 0\nwhile i < 10:\n    print(i)", fixed: "    print(i)\n    i += 1", bugLine: 2, hint: "i qiymati o'zgarmaydi" },
  { title: "Return xatosi", code: "def add(a, b):\n    result = a + b\n\nprint(add(3, 5))", fixed: "    return result", bugLine: 2, hint: "Funksiya hech narsa qaytarmaydi" },
  { title: "String + int", code: "name = 'Ali'\nage = 25\nprint('Yosh: ' + age)", fixed: "print('Yosh: ' + str(age))", bugLine: 2, hint: "str va int ni qo'shib bo'lmaydi" },
  { title: "List append", code: "fruits = ['olma']\nfruits = fruits.append('banan')\nprint(fruits)", fixed: "fruits.append('banan')", bugLine: 1, hint: "append() None qaytaradi" },
  { title: "Scope xatosi", code: "def greet():\n    msg = 'Salom'\ngreet()\nprint(msg)", fixed: "    return msg\nresult = greet()\nprint(result)", bugLine: 3, hint: "msg faqat funksiya ichida" },
  { title: "Ro'yxat nusxasi", code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)", fixed: "b = a.copy()", bugLine: 1, hint: "b = a nusxa emas, havola" },
  { title: "F-string xato", code: "name = 'Ali'\nprint(f'Salom {name!}')", fixed: "print(f'Salom {name}!')", bugLine: 1, hint: "! belgisi {} ichida emas tashqarida" },
];

function BugFixGame() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const bug = bugs[idx];

  function check() {
    const isOk = answer.trim().replace(/\s+/g, " ") === bug.fixed.trim().replace(/\s+/g, " ");
    if (isOk) setScore((s) => s + 1);
    setChecked(true);
    setShowAnswer(true);
  }
  function next() {
    setIdx((idx + 1) % bugs.length);
    setAnswer("");
    setShowHint(false);
    setShowAnswer(false);
    setChecked(false);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <GameHeader
        Icon={Bug}
        title={bug.title}
        meta={
          <span>
            Skor: <strong className="text-foreground">{score}</strong> · {idx + 1}/{bugs.length}
          </span>
        }
      />
      <p className="text-[15px] text-muted-foreground">
        Xato qatorni topib, to'g'ri variantini yozing.
      </p>

      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
        <div className="px-4 py-2 bg-surface/60 border-b border-border/50 flex items-center gap-2 text-xs">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-neon-red/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
          </div>
          <span className="text-muted-foreground font-mono ml-2">buggy.py</span>
        </div>
        <div className="p-4 font-mono text-sm">
          {bug.code.split("\n").map((line, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 px-2 py-1.5 rounded-lg transition-all",
                i === bug.bugLine && "bg-neon-red/10 border-l-2 border-neon-red"
              )}
            >
              <span className="text-muted-foreground/40 w-5 text-right text-xs">{i + 1}</span>
              <span className={i === bug.bugLine ? "text-neon-red font-medium" : ""}>{line}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">Tuzatilgan kod:</label>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full bg-surface/60 border border-border rounded-xl px-4 py-3 text-[15px] font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition"
          placeholder="To'g'ri variantni yozing..."
          disabled={checked}
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setShowHint(!showHint)}
          className="py-2.5 px-4 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition inline-flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4 text-neon-yellow" /> Maslahat
        </button>
        {!checked && (
          <button
            onClick={check}
            disabled={!answer.trim()}
            className="py-2.5 px-5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            Tekshirish
          </button>
        )}
        <button
          onClick={next}
          className="py-2.5 px-5 rounded-xl bg-neon-purple text-white font-semibold text-sm hover:opacity-90 transition inline-flex items-center gap-2"
        >
          Keyingi <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {showHint && (
        <div className="p-4 rounded-2xl bg-neon-yellow/5 border border-neon-yellow/20 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-neon-yellow flex-shrink-0 mt-0.5" />
          <p className="text-[15px] text-neon-yellow">{bug.hint}</p>
        </div>
      )}
      {showAnswer && (
        <div className="p-4 rounded-2xl bg-neon-green/5 border border-neon-green/20">
          <p className="inline-flex items-center gap-2 font-semibold text-neon-green mb-2">
            <CheckCircle2 className="w-4 h-4" /> To'g'ri javob
          </p>
          <pre className="font-mono text-sm text-muted-foreground whitespace-pre">{bug.fixed}</pre>
        </div>
      )}
    </div>
  );
}

// ===== 3. TYPE RACER =====
const codeSnippets = [
  "def hello(name):\n    return f\"Hello, {name}!\"\nprint(hello(\"World\"))",
  "for i in range(10):\n    if i % 2 == 0:\n        print(i)",
  "numbers = [1, 2, 3, 4, 5]\ntotal = sum(numbers)\nprint(f\"Sum: {total}\")",
  "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
  "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return \"Woof!\"",
  "data = {\"a\": 1, \"b\": 2}\nfor key, val in data.items():\n    print(f\"{key}: {val}\")",
];

function TypingGame() {
  const [sIdx, setSIdx] = useState(0);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);
  const target = codeSnippets[sIdx];

  function handleChange(val: string) {
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(val);
    let err = 0;
    for (let i = 0; i < val.length; i++) if (val[i] !== target[i]) err++;
    setAccuracy(val.length > 0 ? Math.round(((val.length - err) / val.length) * 100) : 100);
    if (val === target) {
      setWpm(Math.round(target.split(/\s+/).length / ((Date.now() - startTime) / 60000)));
      setFinished(true);
    }
  }

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => setElapsed(Math.round((Date.now() - startTime) / 1000)), 100);
    return () => clearInterval(t);
  }, [started, finished, startTime]);

  function restart() {
    setInput("");
    setStarted(false);
    setFinished(false);
    setAccuracy(100);
    setElapsed(0);
    ref.current?.focus();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <GameHeader
        Icon={Keyboard}
        title="Type Racer"
        meta={
          <div className="flex gap-4 text-muted-foreground">
            {started && !finished && (
              <span className="inline-flex items-center gap-1 text-neon-yellow">
                <Clock className="w-4 h-4" /> {elapsed}s
              </span>
            )}
            <span>
              Aniqlik: <strong className="text-foreground">{accuracy}%</strong>
            </span>
          </div>
        }
      />

      <div className="rounded-2xl border border-border/60 bg-card/40 p-5 font-mono leading-relaxed text-[15px]">
        {target.split("").map((ch, i) => {
          let c = "text-muted-foreground/30";
          if (i < input.length)
            c = input[i] === ch ? "text-neon-green" : "text-neon-red bg-neon-red/10";
          else if (i === input.length) c = "text-foreground bg-neon-purple/20 rounded";
          return (
            <span key={i} className={cn("transition-colors", c)}>
              {ch === "\n" ? "↵\n" : ch}
            </span>
          );
        })}
      </div>

      <textarea
        ref={ref}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        disabled={finished}
        className="w-full bg-surface/60 border border-border rounded-xl px-4 py-3 text-[15px] font-mono min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition"
        placeholder="Bu yerda yozing..."
        autoFocus
        spellCheck={false}
      />

      {finished && (
        <motion.div
          className="rounded-2xl border border-border/60 bg-card/40 p-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-7 h-7 text-neon-yellow" />
          </div>
          <h3 className="font-display font-bold text-xl mb-4">Tugatildi</h3>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div>
              <span className="font-bold text-neon-blue text-2xl">{wpm}</span>
              <span className="text-muted-foreground text-sm ml-1">WPM</span>
            </div>
            <div>
              <span className="font-bold text-neon-green text-2xl">{accuracy}%</span>
              <span className="text-muted-foreground text-sm ml-1">aniqlik</span>
            </div>
            <div>
              <span className="font-bold text-neon-yellow text-2xl">{elapsed}s</span>
              <span className="text-muted-foreground text-sm ml-1">vaqt</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button
          onClick={restart}
          className="py-2.5 px-5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Qayta
        </button>
        <button
          onClick={() => {
            setSIdx((sIdx + 1) % codeSnippets.length);
            restart();
          }}
          className="py-2.5 px-5 rounded-xl bg-neon-purple text-white font-semibold text-sm hover:opacity-90 transition inline-flex items-center gap-2"
        >
          Keyingi <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===== 4. CODE BATTLE =====
const battleProblems = [
  { title: "Ikki sonni qo'shish", desc: "a + b = ?", input: "5 3", expected: "8", hint: "a, b = map(int, input().split())" },
  { title: "Juft/Toq", desc: "Son juft bo'lsa 'Juft', toq bo'lsa 'Toq'", input: "4", expected: "Juft", hint: "n % 2 == 0" },
  { title: "Eng katta son", desc: "3 ta sondan eng kattasi", input: "3 7 5", expected: "7", hint: "max()" },
  { title: "Satr uzunligi", desc: "So'z uzunligi", input: "salom", expected: "5", hint: "len()" },
  { title: "Teskari son", desc: "Sonni teskari yozing", input: "123", expected: "321", hint: "str[::-1]" },
  { title: "Harflar soni", desc: "'a' harfi nechta?", input: "banana", expected: "3", hint: ".count('a')" },
  { title: "Kattaharf", desc: "So'zni kattaharfga", input: "salom", expected: "SALOM", hint: ".upper()" },
  { title: "Yig'indi 1..n", desc: "1 dan n gacha yig'indi", input: "5", expected: "15", hint: "n*(n+1)//2" },
  { title: "Absolut qiymat", desc: "|n| ni toping", input: "-7", expected: "7", hint: "abs()" },
  { title: "Min element", desc: "Ro'yxatdagi eng kichik", input: "4 1 7 2", expected: "1", hint: "min()" },
];

function BattleGame() {
  const [pIdx, setPIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const prob = battleProblems[pIdx];

  useEffect(() => {
    if (!started || result) return;
    if (timeLeft <= 0) {
      setResult("lose");
      setStreak(0);
      return;
    }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft, result]);

  function start() {
    setStarted(true);
    setTimeLeft(30);
    setResult(null);
    setAnswer("");
  }
  function submit() {
    if (answer.trim() === prob.expected) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setResult("win");
    } else {
      setStreak(0);
      setResult("lose");
    }
  }
  function next() {
    setPIdx((pIdx + 1) % battleProblems.length);
    start();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <GameHeader
        Icon={Swords}
        title="Code Battle"
        meta={
          <div className="flex gap-4">
            <span className="text-neon-yellow font-bold">Skor: {score}</span>
            {streak > 1 && (
              <span className="inline-flex items-center gap-1 text-neon-red">
                <Zap className="w-4 h-4" /> {streak}x
              </span>
            )}
          </div>
        }
      />

      {!started && !result ? (
        <div className="rounded-3xl border border-border/60 bg-card/40 p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-4">
            <Swords className="w-8 h-8 text-neon-green" />
          </div>
          <h3 className="font-display font-bold text-2xl mb-2">30 soniya. Tezkor javob.</h3>
          <p className="text-muted-foreground mb-6">
            Har bir to'g'ri javob streakni oshiradi. Tezkor fikrlang!
          </p>
          <button
            onClick={start}
            className="py-3 px-10 rounded-xl bg-foreground text-background font-display font-bold text-base hover:opacity-90 transition"
          >
            Boshlash
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  timeLeft > 10
                    ? "bg-neon-green"
                    : timeLeft > 5
                    ? "bg-neon-yellow"
                    : "bg-neon-red animate-pulse"
                )}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
            <span
              className={cn(
                "font-mono font-bold text-lg w-10 text-right",
                timeLeft <= 5 && "text-neon-red"
              )}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h3 className="font-display font-bold text-lg mb-2">{prob.title}</h3>
            <p className="text-[15px] text-muted-foreground mb-4">{prob.desc}</p>
            <div className="flex gap-4 font-mono bg-surface/60 rounded-xl px-4 py-3 mb-3 text-sm">
              <span>
                Kirish: <strong>{prob.input}</strong>
              </span>
              <span>
                Kutilgan: <strong className="text-neon-green">{prob.expected}</strong>
              </span>
            </div>
            <p className="inline-flex items-center gap-2 text-xs text-neon-yellow">
              <Lightbulb className="w-3.5 h-3.5" /> {prob.hint}
            </p>
          </div>
          {!result && (
            <div className="flex gap-3">
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="flex-1 bg-surface/60 border border-border rounded-xl px-4 py-3 text-[15px] font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition"
                placeholder="Javob..."
                autoFocus
              />
              <button
                onClick={submit}
                className="py-3 px-8 rounded-xl bg-foreground text-background font-display font-bold text-base hover:opacity-90 transition inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          )}
          {result && (
            <motion.div
              className={cn(
                "rounded-2xl border p-6 text-center",
                result === "win"
                  ? "border-neon-green/30 bg-neon-green/5"
                  : "border-neon-red/30 bg-neon-red/5"
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {result === "win" ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7 text-neon-green" />
                  </div>
                  <p className="font-display font-bold text-neon-green text-xl">To'g'ri!</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center mx-auto mb-3">
                    <XCircle className="w-7 h-7 text-neon-red" />
                  </div>
                  <p className="font-display font-bold text-neon-red text-xl">
                    {timeLeft <= 0 ? "Vaqt tugadi!" : "Noto'g'ri!"}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Javob: <strong className="text-neon-green">{prob.expected}</strong>
                  </p>
                </>
              )}
              <button
                onClick={next}
                className="py-2.5 px-8 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition mt-4 inline-flex items-center gap-2"
              >
                Keyingi <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

// ===== 5. MAZE — SVG robot =====
const mazes = [
  { level: 1, grid: [[0,0,0,0,0],[0,1,1,1,0],[0,0,0,1,0],[0,1,0,0,0],[0,0,0,1,0]], start: [0,0] as [number,number], end: [4,2] as [number,number], desc: "Robotni maqsadga olib boring" },
  { level: 2, grid: [[0,0,1,0,0],[1,0,1,0,1],[0,0,0,0,0],[0,1,1,0,1],[0,0,0,0,0]], start: [0,0] as [number,number], end: [4,4] as [number,number], desc: "Murakkab labirint" },
  { level: 3, grid: [[0,0,0,0,0,0],[0,1,1,1,1,0],[0,0,0,0,1,0],[1,1,1,0,1,0],[0,0,0,0,0,0],[0,1,1,1,0,0]], start: [0,0] as [number,number], end: [5,5] as [number,number], desc: "Eng murakkab labirint" },
];

const DIR_BLOCKS = [
  { id: "up", label: "Yuqori", Icon: ArrowUp, dx: -1, dy: 0, color: "#6C5CE7" },
  { id: "down", label: "Pastga", Icon: ArrowDown, dx: 1, dy: 0, color: "#00E676" },
  { id: "left", label: "Chapga", Icon: ALeft, dx: 0, dy: -1, color: "#00D2FF" },
  { id: "right", label: "O'ngga", Icon: ARight, dx: 0, dy: 1, color: "#FFD600" },
];

function RobotSprite({ x, y, size = 28 }: { x: number; y: number; size?: number }) {
  const s = size;
  return (
    <g transform={`translate(${x - s / 2}, ${y - s / 2})`}>
      {/* Body */}
      <rect x={s * 0.15} y={s * 0.3} width={s * 0.7} height={s * 0.55} rx={s * 0.12} fill="#6C5CE7" />
      <rect x={s * 0.15} y={s * 0.3} width={s * 0.7} height={s * 0.55} rx={s * 0.12} fill="url(#robotGrad)" opacity="0.4" />
      {/* Head antenna */}
      <line x1={s / 2} y1={s * 0.15} x2={s / 2} y2={s * 0.3} stroke="#FFD600" strokeWidth="1.5" />
      <circle cx={s / 2} cy={s * 0.13} r={s * 0.07} fill="#FFD600" />
      {/* Eyes */}
      <circle cx={s * 0.37} cy={s * 0.5} r={s * 0.08} fill="#00D2FF" />
      <circle cx={s * 0.63} cy={s * 0.5} r={s * 0.08} fill="#00D2FF" />
      <circle cx={s * 0.37} cy={s * 0.5} r={s * 0.04} fill="#fff" />
      <circle cx={s * 0.63} cy={s * 0.5} r={s * 0.04} fill="#fff" />
      {/* Mouth */}
      <rect x={s * 0.38} y={s * 0.68} width={s * 0.24} height={s * 0.05} rx={s * 0.02} fill="#00E676" />
      <defs>
        <linearGradient id="robotGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
    </g>
  );
}

function MazeGame() {
  const [level, setLevel] = useState(0);
  const [commands, setCommands] = useState<string[]>([]);
  const [pos, setPos] = useState<[number, number]>([...mazes[0].start]);
  const [path, setPath] = useState<[number, number][]>([[...mazes[0].start]]);
  const [won, setWon] = useState(false);
  const [animating, setAnimating] = useState(false);
  const maze = mazes[level];
  const CS = 52;

  function addCmd(id: string) {
    if (!won && !animating) setCommands([...commands, id]);
  }
  function removeCmd(i: number) {
    if (!won && !animating) setCommands(commands.filter((_, j) => j !== i));
  }
  function reset() {
    setPos([...maze.start]);
    setPath([[...maze.start]]);
    setWon(false);
    setCommands([]);
    setAnimating(false);
  }

  async function run() {
    if (commands.length === 0) return;
    setAnimating(true);
    let [r, c] = [...maze.start];
    const trail: [number, number][] = [[r, c]];
    setPos([r, c]);
    setPath([[r, c]]);

    for (const cmdId of commands) {
      const dir = DIR_BLOCKS.find((d) => d.id === cmdId);
      if (!dir) continue;
      const nr = r + dir.dx,
        nc = c + dir.dy;
      if (
        nr < 0 ||
        nr >= maze.grid.length ||
        nc < 0 ||
        nc >= maze.grid[0].length ||
        maze.grid[nr][nc] === 1
      )
        break;
      r = nr;
      c = nc;
      trail.push([r, c]);
      setPos([r, c]);
      setPath([...trail]);
      await new Promise((res) => setTimeout(res, 300));
    }

    if (r === maze.end[0] && c === maze.end[1]) {
      setWon(true);
      toast.success("Labirint yechildi!");
    }
    setAnimating(false);
  }

  function nextLevel() {
    const n = (level + 1) % mazes.length;
    setLevel(n);
    setPos([...mazes[n].start]);
    setPath([[...mazes[n].start]]);
    setWon(false);
    setCommands([]);
  }

  return (
    <div className="max-w-3xl space-y-5">
      <GameHeader
        Icon={Map}
        title={`Maze Runner — ${level + 1}-bosqich`}
        meta={<span>{maze.desc}</span>}
      />
      <p className="text-[15px] text-muted-foreground">
        Buyruq bloklarini joylashtirib robotni sariq maqsadga yetkazing.
      </p>

      <div className="grid lg:grid-cols-[1fr,240px] gap-5">
        {/* Maze */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 flex justify-center">
          <svg width={maze.grid[0].length * CS + 4} height={maze.grid.length * CS + 4} className="block">
            {maze.grid.map((row, r) =>
              row.map((cell, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={c * CS + 2}
                  y={r * CS + 2}
                  width={CS - 2}
                  height={CS - 2}
                  fill={cell === 1 ? "hsl(var(--surface))" : "transparent"}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  rx="6"
                />
              ))
            )}
            {path.map(
              ([r, c], i) =>
                i > 0 && (
                  <line
                    key={i}
                    x1={(path[i - 1][1] + 0.5) * CS + 2}
                    y1={(path[i - 1][0] + 0.5) * CS + 2}
                    x2={(c + 0.5) * CS + 2}
                    y2={(r + 0.5) * CS + 2}
                    stroke="#6C5CE7"
                    strokeWidth="3"
                    opacity="0.4"
                  />
                )
            )}
            {/* Start */}
            <circle
              cx={(maze.start[1] + 0.5) * CS + 2}
              cy={(maze.start[0] + 0.5) * CS + 2}
              r="9"
              fill="#00E676"
              opacity="0.3"
            />
            <circle
              cx={(maze.start[1] + 0.5) * CS + 2}
              cy={(maze.start[0] + 0.5) * CS + 2}
              r="5"
              fill="#00E676"
            />
            {/* Target */}
            <g>
              <circle
                cx={(maze.end[1] + 0.5) * CS + 2}
                cy={(maze.end[0] + 0.5) * CS + 2}
                r="14"
                fill="#FFD600"
                opacity="0.15"
              >
                <animate attributeName="r" values="12;18;12" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={(maze.end[1] + 0.5) * CS + 2}
                cy={(maze.end[0] + 0.5) * CS + 2}
                r="8"
                fill="#FFD600"
              />
              <circle
                cx={(maze.end[1] + 0.5) * CS + 2}
                cy={(maze.end[0] + 0.5) * CS + 2}
                r="3"
                fill="#fff"
              />
            </g>
            {/* Robot */}
            <RobotSprite
              x={(pos[1] + 0.5) * CS + 2}
              y={(pos[0] + 0.5) * CS + 2}
              size={36}
            />
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <p className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">
            Buyruqlar
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DIR_BLOCKS.map((d) => {
              const Icon = d.Icon;
              return (
                <button
                  key={d.id}
                  onClick={() => addCmd(d.id)}
                  disabled={won || animating}
                  className="py-2.5 px-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: d.color }}
                >
                  <Icon className="w-4 h-4" /> {d.label}
                </button>
              );
            })}
          </div>

          <p className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mt-4">
            Ketma-ketlik ({commands.length})
          </p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {commands.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Buyruq qo'shing...</p>
            ) : (
              commands.map((cmdId, i) => {
                const d = DIR_BLOCKS.find((b) => b.id === cmdId);
                const Icon = d?.Icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface/60 border border-border/50"
                  >
                    <span className="text-xs font-mono text-muted-foreground/50 w-4">{i + 1}</span>
                    {Icon && <Icon className="w-3.5 h-3.5" style={{ color: d?.color }} />}
                    <span className="text-xs font-medium flex-1">{d?.label}</span>
                    <button
                      onClick={() => removeCmd(i)}
                      className="p-0.5 text-muted-foreground hover:text-neon-red"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={run}
              disabled={won || animating || commands.length === 0}
              className="flex-1 py-2 px-4 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> {animating ? "..." : "Ishga tushirish"}
            </button>
            <button
              onClick={reset}
              className="p-2 rounded-xl border border-border bg-surface/60 hover:bg-surface transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {won && (
        <motion.div
          className="rounded-2xl border border-neon-green/30 bg-neon-green/5 p-5 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-7 h-7 text-neon-green" />
          </div>
          <p className="font-display font-bold text-neon-green text-lg">Bosqich o'tdi!</p>
          <button
            onClick={nextLevel}
            className="py-2.5 px-8 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition mt-3 inline-flex items-center gap-2"
          >
            Keyingi bosqich <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ===== 6. CODE BIRD — SVG bird =====
const birdLevels = [
  { level: 1, targets: [[200, 150]] as number[][], obstacles: [] as number[][], desc: "Qushni yulduzga olib boring (2 ta o'ngga)" },
  { level: 2, targets: [[320, 150]] as number[][], obstacles: [[200, 60, 20, 130]] as number[][], desc: "To'siqdan aylanib yulduzga yeting" },
  { level: 3, targets: [[160, 60], [320, 240]] as number[][], obstacles: [[120, 100, 160, 16], [240, 180, 16, 100]] as number[][], desc: "2 ta yulduzni yig'ing" },
];

const BIRD_MOVES = [
  { id: "right", label: "O'ngga", Icon: ARight, dx: 80, dy: 0, color: "#FFD600" },
  { id: "left", label: "Chapga", Icon: ALeft, dx: -80, dy: 0, color: "#00D2FF" },
  { id: "up", label: "Yuqori", Icon: ArrowUp, dx: 0, dy: -80, color: "#6C5CE7" },
  { id: "down", label: "Pastga", Icon: ArrowDown, dx: 0, dy: 80, color: "#00E676" },
  { id: "diag_ru", label: "O'ng-yuqori", Icon: ARight, dx: 80, dy: -80, color: "#FF6B9D" },
  { id: "diag_rd", label: "O'ng-past", Icon: ARight, dx: 80, dy: 80, color: "#FF5252" },
];

function BirdSprite({ x, y, crashed }: { x: number; y: number; crashed: boolean }) {
  if (crashed) {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle r="16" fill="#FF5252" opacity="0.2" />
        <g stroke="#FF5252" strokeWidth="2.5" strokeLinecap="round">
          <line x1="-10" y1="-10" x2="10" y2="10" />
          <line x1="10" y1="-10" x2="-10" y2="10" />
          <line x1="-14" y1="0" x2="-18" y2="0" />
          <line x1="14" y1="0" x2="18" y2="0" />
          <line x1="0" y1="-14" x2="0" y2="-18" />
          <line x1="0" y1="14" x2="0" y2="18" />
        </g>
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Body */}
      <ellipse cx="0" cy="0" rx="12" ry="10" fill="#FFD600" />
      <ellipse cx="-1" cy="-2" rx="10" ry="7" fill="#FF6B9D" opacity="0.7" />
      {/* Wing */}
      <path d="M -3 -2 Q -10 -8 -12 0 Q -8 3 -3 1 Z" fill="#6C5CE7">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="-15 -5 0"
          to="15 -5 0"
          dur="0.4s"
          repeatCount="indefinite"
          values="-15 -5 0; 15 -5 0; -15 -5 0"
        />
      </path>
      {/* Eye */}
      <circle cx="5" cy="-3" r="2.5" fill="#fff" />
      <circle cx="5.5" cy="-3" r="1.3" fill="#0D0D2B" />
      {/* Beak */}
      <polygon points="12,0 18,-1 12,2" fill="#FF5252" />
    </g>
  );
}

function StarSprite({ x, y, collected }: { x: number; y: number; collected: boolean }) {
  if (collected) {
    return (
      <g transform={`translate(${x}, ${y})`} opacity="0.35">
        <circle r="14" fill="#00E676" opacity="0.2" />
        <path
          d="M -6 0 L -2 4 L 7 -5"
          stroke="#00E676"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }
  const pts = Array.from({ length: 5 })
    .map((_, i) => {
      const a = (Math.PI / 2) + (i * 2 * Math.PI) / 5;
      const b = a + Math.PI / 5;
      const rOut = 11,
        rIn = 5;
      return `${Math.cos(a) * rOut},${-Math.sin(a) * rOut} ${Math.cos(b) * rIn},${-Math.sin(b) * rIn}`;
    })
    .join(" ");
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r="18" fill="#FFD600" opacity="0.1">
        <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
      </circle>
      <polygon points={pts} fill="#FFD600" stroke="#FFB800" strokeWidth="1" />
    </g>
  );
}

function BirdGame() {
  const [level, setLevel] = useState(0);
  const [commands, setCommands] = useState<string[]>([]);
  const [birdPos, setBirdPos] = useState<[number, number]>([40, 150]);
  const [trail, setTrail] = useState<[number, number][]>([[40, 150]]);
  const [won, setWon] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [collected, setCollected] = useState<Set<number>>(new Set());
  const lv = birdLevels[level];

  function addCmd(id: string) {
    if (!won && !animating) setCommands([...commands, id]);
  }
  function removeCmd(i: number) {
    if (!won && !animating) setCommands(commands.filter((_, j) => j !== i));
  }
  function reset() {
    setBirdPos([40, 150]);
    setTrail([[40, 150]]);
    setWon(false);
    setCrashed(false);
    setCommands([]);
    setAnimating(false);
    setCollected(new Set());
  }

  function hitsObstacle(px: number, py: number): boolean {
    for (const [ox, oy, ow, oh] of lv.obstacles) {
      if (px >= ox - 12 && px <= ox + ow + 12 && py >= oy - 12 && py <= oy + oh + 12) return true;
    }
    if (px < 10 || px > 390 || py < 10 || py > 290) return true;
    return false;
  }

  function hitsTarget(px: number, py: number): number {
    for (let i = 0; i < lv.targets.length; i++) {
      const [tx, ty] = lv.targets[i];
      const dist = Math.sqrt((px - tx) ** 2 + (py - ty) ** 2);
      if (dist < 35) return i;
    }
    return -1;
  }

  async function run() {
    if (commands.length === 0) return;
    setAnimating(true);
    setCrashed(false);
    setCollected(new Set());
    let x = 40,
      y = 150;
    const tr: [number, number][] = [[x, y]];
    const hits = new Set<number>();
    setBirdPos([x, y]);
    setTrail([[x, y]]);

    for (const cmdId of commands) {
      const mv = BIRD_MOVES.find((m) => m.id === cmdId);
      if (!mv) continue;
      const nx = x + mv.dx,
        ny = y + mv.dy;
      if (hitsObstacle(nx, ny)) {
        setBirdPos([nx, ny]);
        setCrashed(true);
        await new Promise((r) => setTimeout(r, 300));
        break;
      }
      x = nx;
      y = ny;
      tr.push([x, y]);
      setBirdPos([x, y]);
      setTrail([...tr]);
      const ti = hitsTarget(x, y);
      if (ti >= 0) {
        hits.add(ti);
        setCollected(new Set(hits));
      }
      await new Promise((r) => setTimeout(r, 350));
    }

    if (hits.size === lv.targets.length) {
      setWon(true);
      toast.success("Bosqich o'tdi!");
    }
    setAnimating(false);
  }

  function nextLevel() {
    const n = (level + 1) % birdLevels.length;
    setLevel(n);
    reset();
  }

  return (
    <div className="max-w-3xl space-y-5">
      <GameHeader
        Icon={Bird}
        title={`Code Bird — ${level + 1}/${birdLevels.length}`}
        meta={<span>{lv.desc}</span>}
      />

      <div className="grid lg:grid-cols-[1fr,240px] gap-5">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 flex justify-center">
          <svg
            width="400"
            height="300"
            className="block rounded-xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(108,92,231,0.08) 0%, rgba(0,210,255,0.04) 100%)",
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`vg${i}`}
                x1={(i + 1) * 80}
                y1="0"
                x2={(i + 1) * 80}
                y2="300"
                stroke="rgba(255,255,255,0.04)"
              />
            ))}
            {Array.from({ length: 3 }).map((_, i) => (
              <line
                key={`hg${i}`}
                x1="0"
                y1={(i + 1) * 80}
                x2="400"
                y2={(i + 1) * 80}
                stroke="rgba(255,255,255,0.04)"
              />
            ))}

            {lv.obstacles.map(([x, y, w, h], i) => (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} fill="#FF5252" opacity="0.25" rx="4" />
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill="none"
                  stroke="#FF5252"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  rx="4"
                />
              </g>
            ))}

            {lv.targets.map(([x, y], i) => (
              <StarSprite key={i} x={x} y={y} collected={collected.has(i)} />
            ))}

            {trail.map(
              (pt, i) =>
                i > 0 && (
                  <line
                    key={i}
                    x1={trail[i - 1][0]}
                    y1={trail[i - 1][1]}
                    x2={pt[0]}
                    y2={pt[1]}
                    stroke="#6C5CE7"
                    strokeWidth="2.5"
                    opacity="0.5"
                    strokeDasharray="6 3"
                  />
                )
            )}

            {/* Start marker */}
            <circle cx={40} cy={150} r="10" fill="#00E676" opacity="0.25" />
            <circle cx={40} cy={150} r="5" fill="#00E676" />

            <BirdSprite x={birdPos[0]} y={birdPos[1]} crashed={crashed} />
          </svg>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">
            Buyruqlar
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {BIRD_MOVES.map((m) => {
              const Icon = m.Icon;
              return (
                <button
                  key={m.id}
                  onClick={() => addCmd(m.id)}
                  disabled={won || animating}
                  className="py-2 px-2 rounded-lg font-semibold text-white text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-1"
                  style={{ backgroundColor: m.color }}
                >
                  <Icon className="w-3.5 h-3.5" /> {m.label}
                </button>
              );
            })}
          </div>

          <p className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mt-4">
            Ketma-ketlik ({commands.length})
          </p>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {commands.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Buyruq qo'shing...</p>
            ) : (
              commands.map((cmdId, i) => {
                const m = BIRD_MOVES.find((b) => b.id === cmdId);
                const Icon = m?.Icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface/60 border border-border/50"
                  >
                    <span className="text-xs font-mono text-muted-foreground/50 w-4">{i + 1}</span>
                    {Icon && <Icon className="w-3.5 h-3.5" style={{ color: m?.color }} />}
                    <span className="text-xs flex-1">{m?.label}</span>
                    <button
                      onClick={() => removeCmd(i)}
                      className="p-0.5 text-muted-foreground hover:text-neon-red"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={run}
              disabled={won || animating || commands.length === 0}
              className="flex-1 py-2 px-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> {animating ? "..." : "Boshlash"}
            </button>
            <button
              onClick={reset}
              className="p-2 rounded-xl border border-border bg-surface/60 hover:bg-surface transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {won && (
        <motion.div
          className="rounded-2xl border border-neon-green/30 bg-neon-green/5 p-5 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-7 h-7 text-neon-green" />
          </div>
          <p className="font-display font-bold text-neon-green text-lg">Bosqich o'tdi!</p>
          <button
            onClick={nextLevel}
            className="py-2.5 px-8 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition mt-3 inline-flex items-center gap-2"
          >
            Keyingi bosqich <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
      {crashed && !won && (
        <div className="rounded-2xl border border-neon-red/30 bg-neon-red/5 p-4 text-center">
          <div className="inline-flex items-center gap-2 text-neon-red font-semibold">
            <AlertTriangle className="w-5 h-5" /> To'siqqa urildi yoki chegaradan chiqdi
          </div>
          <p className="text-sm text-muted-foreground mt-1">Qayta urinib ko'ring.</p>
        </div>
      )}
    </div>
  );
}
