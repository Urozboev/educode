"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { Puzzle, Bug, Keyboard, Swords, ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Clock, Zap, MapPin, Feather, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

type GameType = null | "puzzle" | "bugfix" | "typing" | "battle" | "maze" | "bird";

const gameCards = [
  { type: "puzzle" as const, title: "Code Puzzle", desc: "Kod qatorlarini drag-and-drop bilan to'g'ri tartibga qo'ying", icon: Puzzle, color: "#6C5CE7", diff: "Oson", emoji: "🧩" },
  { type: "bugfix" as const, title: "Bug Fix", desc: "Xatoli kodni toping va tuzating", icon: Bug, color: "#FF5252", diff: "O'rta", emoji: "🐛" },
  { type: "typing" as const, title: "Type Racer", desc: "Kod yozish tezligini sinab ko'ring", icon: Keyboard, color: "#00D2FF", diff: "Oson", emoji: "⌨️" },
  { type: "battle" as const, title: "Code Battle", desc: "30 soniya — tezkor javob!", icon: Swords, color: "#00E676", diff: "Qiyin", emoji: "⚔️" },
  { type: "maze" as const, title: "Maze Runner", desc: "Buyruq bloklari bilan labirintdan o'ting", icon: MapPin, color: "#FFD600", diff: "O'rta", emoji: "🏃" },
  { type: "bird" as const, title: "Code Bird", desc: "Bloklarni joylashtirib qushni boshqaring", icon: Feather, color: "#FF6B9D", diff: "O'rta", emoji: "🐦" },
];

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export default function GamesPage() {
  const [game, setGame] = useState<GameType>(null);
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">O'yinlar</h1>
        <p className="text-muted-foreground">Dasturlashni o'ynab o'rganing — 6 ta interaktiv o'yin</p>
      </motion.div>
      {!game ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gameCards.map((g, i) => (
            <motion.button key={g.type} onClick={() => setGame(g.type)} className="glass-card-hover p-6 text-left group w-full"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{g.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-lg group-hover:text-neon-purple transition-colors">{g.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-muted-foreground">{g.diff}</span>
                  </div>
                  <p className="text-muted-foreground">{g.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setGame(null)} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" /> O'yinlarga qaytish</button>
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

// ===== 1. CODE PUZZLE — Drag & Drop =====
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

  function next() { const n = (idx + 1) % puzzles.length; setIdx(n); setLines(shuffle([...puzzles[n].lines])); setChecked(false); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">🧩 {pz.title}</h2>
        <span className="text-muted-foreground">Skor: {score} · {idx + 1}/{puzzles.length}</span>
      </div>
      <p className="text-muted-foreground">Qatorlarni suring yoki tugmalar bilan to'g'ri tartibga qo'ying:</p>

      <Reorder.Group axis="y" values={lines} onReorder={checked ? () => {} : setLines} className="space-y-2">
        {lines.map((line, i) => (
          <Reorder.Item key={line} value={line} className={cn(
            "flex items-center gap-3 p-3 rounded-xl font-mono cursor-grab active:cursor-grabbing select-none transition-all border",
            checked && line === pz.lines[i] ? "bg-neon-green/10 border-neon-green/30" :
            checked ? "bg-neon-red/10 border-neon-red/30" :
            "bg-surface/80 border-border/50 hover:border-neon-purple/30 hover:bg-surface"
          )}>
            <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
            <span className="text-muted-foreground/40 w-5 text-right text-xs flex-shrink-0">{i + 1}</span>
            <code className="flex-1 whitespace-pre">{line}</code>
            {checked && (line === pz.lines[i] ? <CheckCircle2 className="w-4 h-4 text-neon-green flex-shrink-0" /> : <XCircle className="w-4 h-4 text-neon-red flex-shrink-0" />)}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex gap-3">
        <button onClick={() => { setChecked(true); if (isCorrect) setScore(s => s + 1); }} disabled={checked} className="btn-primary py-2.5 px-5 disabled:opacity-50">Tekshirish</button>
        <button onClick={() => { setLines(shuffle([...pz.lines])); setChecked(false); }} className="btn-ghost py-2.5 px-5"><RotateCcw className="w-4 h-4 inline mr-1" /> Aralashtirish</button>
        {checked && <button onClick={next} className="btn-neon py-2.5 px-5">Keyingi →</button>}
      </div>
      {checked && <div className={cn("glass-card p-4 text-center", isCorrect ? "border-neon-green/20" : "border-neon-red/20")}>
        {isCorrect ? <p className="text-neon-green font-semibold text-lg">To'g'ri! 🎉</p> : <p className="text-neon-red font-semibold">Noto'g'ri. Qayta urinib ko'ring!</p>}
      </div>}
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
    const isOk = answer.trim().replace(/\s+/g, ' ') === bug.fixed.trim().replace(/\s+/g, ' ');
    if (isOk) setScore(s => s + 1);
    setChecked(true); setShowAnswer(true);
  }
  function next() { setIdx((idx + 1) % bugs.length); setAnswer(""); setShowHint(false); setShowAnswer(false); setChecked(false); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl">🐛 {bug.title}</h2>
        <span className="text-muted-foreground">Skor: {score} · {idx + 1}/{bugs.length}</span></div>
      <p className="text-muted-foreground">Xato qatorni topib, to'g'ri variantini yozing:</p>

      <div className="glass-card overflow-hidden">
        <div className="px-4 py-2 bg-surface border-b border-border/50 flex items-center gap-2 text-xs">
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neon-red/60" /><div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/60" /><div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" /></div>
          <span className="text-muted-foreground font-mono ml-2">buggy.py</span>
        </div>
        <div className="p-4 font-mono">
          {bug.code.split("\n").map((line, i) => (
            <div key={i} className={cn("flex gap-3 px-2 py-1.5 rounded-lg transition-all", i === bug.bugLine && "bg-neon-red/10 border-l-3 border-neon-red")}>
              <span className="text-muted-foreground/40 w-5 text-right text-xs">{i + 1}</span>
              <span className={i === bug.bugLine ? "text-neon-red font-medium" : ""}>{line}</span>
            </div>
          ))}
        </div>
      </div>

      <div><label className="font-medium mb-2 block">Tuzatilgan kod:</label>
        <input value={answer} onChange={e => setAnswer(e.target.value)} className="input-field font-mono" placeholder="To'g'ri variantni yozing..." disabled={checked} /></div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setShowHint(!showHint)} className="btn-ghost py-2.5 px-4">💡 Maslahat</button>
        {!checked && <button onClick={check} disabled={!answer.trim()} className="btn-primary py-2.5 px-5 disabled:opacity-50">Tekshirish</button>}
        <button onClick={next} className="btn-neon py-2.5 px-5">Keyingi →</button>
      </div>

      {showHint && <div className="glass-card p-4 bg-neon-yellow/5 border-neon-yellow/10"><p className="text-neon-yellow">💡 {bug.hint}</p></div>}
      {showAnswer && <div className="glass-card p-4 bg-neon-green/5 border-neon-green/10"><p className="font-semibold text-neon-green mb-2">✅ To'g'ri javob:</p><pre className="font-mono text-muted-foreground whitespace-pre">{bug.fixed}</pre></div>}
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
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(val);
    let err = 0; for (let i = 0; i < val.length; i++) if (val[i] !== target[i]) err++;
    setAccuracy(val.length > 0 ? Math.round(((val.length - err) / val.length) * 100) : 100);
    if (val === target) { setWpm(Math.round(target.split(/\s+/).length / ((Date.now() - startTime) / 60000))); setFinished(true); }
  }

  useEffect(() => { if (!started || finished) return; const t = setInterval(() => setElapsed(Math.round((Date.now() - startTime) / 1000)), 100); return () => clearInterval(t); }, [started, finished, startTime]);

  function restart() { setInput(""); setStarted(false); setFinished(false); setAccuracy(100); setElapsed(0); ref.current?.focus(); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl">⌨️ Type Racer</h2>
        <div className="flex gap-4 text-muted-foreground">{started && !finished && <span className="text-neon-yellow"><Clock className="w-4 h-4 inline mr-1" />{elapsed}s</span>}<span>Aniqlik: {accuracy}%</span></div></div>
      <div className="glass-card p-5 font-mono leading-relaxed">{target.split("").map((ch, i) => {
        let c = "text-muted-foreground/30"; if (i < input.length) c = input[i] === ch ? "text-neon-green" : "text-neon-red bg-neon-red/10"; else if (i === input.length) c = "text-foreground bg-neon-purple/20 rounded";
        return <span key={i} className={cn("transition-colors", c)}>{ch === "\n" ? "↵\n" : ch}</span>;
      })}</div>
      <textarea ref={ref} value={input} onChange={e => handleChange(e.target.value)} disabled={finished} className="input-field font-mono min-h-[100px] resize-none" placeholder="Bu yerda yozing..." autoFocus spellCheck={false} />
      {finished && <motion.div className="glass-card p-6 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Trophy className="w-12 h-12 text-neon-yellow mx-auto mb-3" /><h3 className="font-bold text-xl mb-3">Tugatildi! 🎉</h3>
        <div className="flex items-center justify-center gap-8 text-lg"><div><span className="font-bold text-neon-blue">{wpm}</span> <span className="text-muted-foreground text-sm">WPM</span></div>
          <div><span className="font-bold text-neon-green">{accuracy}%</span> <span className="text-muted-foreground text-sm">aniqlik</span></div>
          <div><span className="font-bold text-neon-yellow">{elapsed}s</span> <span className="text-muted-foreground text-sm">vaqt</span></div></div>
      </motion.div>}
      <div className="flex gap-3"><button onClick={restart} className="btn-ghost py-2.5 px-5"><RotateCcw className="w-4 h-4 inline mr-1" /> Qayta</button>
        <button onClick={() => { setSIdx((sIdx + 1) % codeSnippets.length); restart(); }} className="btn-neon py-2.5 px-5">Keyingi →</button></div>
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

  useEffect(() => { if (!started || result) return; if (timeLeft <= 0) { setResult("lose"); setStreak(0); return; } const t = setInterval(() => setTimeLeft(v => v - 1), 1000); return () => clearInterval(t); }, [started, timeLeft, result]);

  function start() { setStarted(true); setTimeLeft(30); setResult(null); setAnswer(""); }
  function submit() { if (answer.trim() === prob.expected) { setScore(s => s + 1); setStreak(s => s + 1); setResult("win"); } else { setStreak(0); setResult("lose"); } }
  function next() { setPIdx((pIdx + 1) % battleProblems.length); start(); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl">⚔️ Code Battle</h2>
        <div className="flex gap-4"><span className="text-neon-yellow font-bold">Skor: {score}</span>{streak > 1 && <span className="text-neon-red"><Zap className="w-4 h-4 inline" /> {streak}x</span>}</div></div>
      {!started && !result ? (
        <div className="glass-card p-10 text-center"><div className="text-6xl mb-4">⚔️</div><h3 className="font-bold text-xl mb-4">30 soniya. Tezkor javob.</h3><button onClick={start} className="btn-primary py-3 px-10 text-lg">Boshlash!</button></div>
      ) : (<>
        <div className="flex items-center gap-3"><div className="flex-1 h-4 bg-surface rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all", timeLeft > 10 ? "bg-neon-green" : timeLeft > 5 ? "bg-neon-yellow" : "bg-neon-red animate-pulse")} style={{ width: `${(timeLeft / 30) * 100}%` }} /></div>
          <span className={cn("font-mono font-bold text-xl w-10", timeLeft <= 5 && "text-neon-red")}>{timeLeft}s</span></div>
        <div className="glass-card p-6"><h3 className="font-bold text-lg mb-2">{prob.title}</h3><p className="text-muted-foreground mb-3">{prob.desc}</p>
          <div className="flex gap-4 font-mono bg-surface rounded-xl px-4 py-3 mb-3"><span>Kirish: <strong>{prob.input}</strong></span><span>Kutilgan: <strong className="text-neon-green">{prob.expected}</strong></span></div>
          <p className="text-neon-yellow text-xs">💡 {prob.hint}</p></div>
        {!result && <div className="flex gap-3"><input value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} className="input-field flex-1 font-mono text-lg" placeholder="Javob..." autoFocus />
          <button onClick={submit} className="btn-primary py-3 px-8 text-lg">✓</button></div>}
        {result && <motion.div className={cn("glass-card p-6 text-center", result === "win" ? "border-neon-green/20" : "border-neon-red/20")} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          {result === "win" ? <><div className="text-5xl mb-2">🎉</div><p className="font-bold text-neon-green text-xl">To'g'ri!</p></> : <><div className="text-5xl mb-2">😔</div><p className="font-bold text-neon-red text-xl">{timeLeft <= 0 ? "Vaqt tugadi!" : "Noto'g'ri!"}</p><p className="text-muted-foreground mt-1">Javob: <strong className="text-neon-green">{prob.expected}</strong></p></>}
          <button onClick={next} className="btn-primary py-2.5 px-8 mt-4">Keyingi →</button>
        </motion.div>}
      </>)}
    </div>
  );
}

// ===== 5. MAZE — Buyruq bloklari bilan =====
const mazes = [
  { level: 1, grid: [[0,0,0,0,0],[0,1,1,1,0],[0,0,0,1,0],[0,1,0,0,0],[0,0,0,1,0]], start: [0,0] as [number,number], end: [4,2] as [number,number], desc: "Robotni maqsadga olib boring" },
  { level: 2, grid: [[0,0,1,0,0],[1,0,1,0,1],[0,0,0,0,0],[0,1,1,0,1],[0,0,0,0,0]], start: [0,0] as [number,number], end: [4,4] as [number,number], desc: "Murakkab labirint" },
  { level: 3, grid: [[0,0,0,0,0,0],[0,1,1,1,1,0],[0,0,0,0,1,0],[1,1,1,0,1,0],[0,0,0,0,0,0],[0,1,1,1,0,0]], start: [0,0] as [number,number], end: [5,5] as [number,number], desc: "Eng murakkab labirint" },
];

const DIR_BLOCKS = [
  { id: "up", label: "⬆ Yuqori", dx: -1, dy: 0, color: "#6C5CE7" },
  { id: "down", label: "⬇ Pastga", dx: 1, dy: 0, color: "#00E676" },
  { id: "left", label: "⬅ Chapga", dx: 0, dy: -1, color: "#00D2FF" },
  { id: "right", label: "➡ O'ngga", dx: 0, dy: 1, color: "#FFD600" },
];

function MazeGame() {
  const [level, setLevel] = useState(0);
  const [commands, setCommands] = useState<string[]>([]);
  const [pos, setPos] = useState<[number, number]>([...mazes[0].start]);
  const [path, setPath] = useState<[number, number][]>([[...mazes[0].start]]);
  const [won, setWon] = useState(false);
  const [animating, setAnimating] = useState(false);
  const maze = mazes[level];
  const CS = 52;

  function addCmd(id: string) { if (!won && !animating) setCommands([...commands, id]); }
  function removeCmd(i: number) { if (!won && !animating) setCommands(commands.filter((_, j) => j !== i)); }

  function reset() { setPos([...maze.start]); setPath([[...maze.start]]); setWon(false); setCommands([]); setAnimating(false); }

  async function run() {
    if (commands.length === 0) return;
    setAnimating(true);
    let [r, c] = [...maze.start];
    const trail: [number, number][] = [[r, c]];
    setPos([r, c]); setPath([[r, c]]);

    for (const cmdId of commands) {
      const dir = DIR_BLOCKS.find(d => d.id === cmdId);
      if (!dir) continue;
      const nr = r + dir.dx, nc = c + dir.dy;
      if (nr < 0 || nr >= maze.grid.length || nc < 0 || nc >= maze.grid[0].length || maze.grid[nr][nc] === 1) break;
      r = nr; c = nc;
      trail.push([r, c]);
      setPos([r, c]); setPath([...trail]);
      await new Promise(res => setTimeout(res, 300));
    }

    if (r === maze.end[0] && c === maze.end[1]) { setWon(true); toast.success("Labirint yechildi! 🎉"); }
    setAnimating(false);
  }

  function nextLevel() { const n = (level + 1) % mazes.length; setLevel(n); setPos([...mazes[n].start]); setPath([[...mazes[n].start]]); setWon(false); setCommands([]); }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl">🏃 Maze Runner — Bosqich {level + 1}</h2></div>
      <p className="text-muted-foreground">{maze.desc}. Buyruq bloklarini joylashtirib robotni 🟡 maqsadga olib boring.</p>

      <div className="grid lg:grid-cols-[1fr,auto] gap-4">
        {/* Labirint */}
        <div className="glass-card p-4 flex justify-center">
          <svg width={maze.grid[0].length * CS + 4} height={maze.grid.length * CS + 4} className="block">
            {maze.grid.map((row, r) => row.map((cell, c) => (
              <rect key={`${r}-${c}`} x={c * CS + 2} y={r * CS + 2} width={CS - 2} height={CS - 2}
                fill={cell === 1 ? "hsl(var(--surface))" : "transparent"} stroke="hsl(var(--border))" strokeWidth="0.5" rx="6" />
            )))}
            {path.map(([r, c], i) => i > 0 && (
              <line key={i} x1={(path[i-1][1] + 0.5) * CS + 2} y1={(path[i-1][0] + 0.5) * CS + 2}
                x2={(c + 0.5) * CS + 2} y2={(r + 0.5) * CS + 2} stroke="#6C5CE7" strokeWidth="3" opacity="0.4" />
            ))}
            <circle cx={(maze.start[1] + 0.5) * CS + 2} cy={(maze.start[0] + 0.5) * CS + 2} r="10" fill="#00E676" />
            <circle cx={(maze.end[1] + 0.5) * CS + 2} cy={(maze.end[0] + 0.5) * CS + 2} r="10" fill="#FFD600" />
            <text x={(pos[1] + 0.5) * CS + 2} y={(pos[0] + 0.5) * CS + 8} textAnchor="middle" fontSize="22">🤖</text>
          </svg>
        </div>

        {/* Buyruq bloklari */}
        <div className="space-y-3 min-w-[200px]">
          <p className="font-semibold text-xs text-muted-foreground">Buyruqlar:</p>
          <div className="grid grid-cols-2 gap-2">
            {DIR_BLOCKS.map(d => (
              <button key={d.id} onClick={() => addCmd(d.id)} disabled={won || animating}
                className="py-2.5 px-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: d.color }}>{d.label}</button>
            ))}
          </div>

          <p className="font-semibold text-xs text-muted-foreground mt-3">Ketma-ketlik ({commands.length}):</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {commands.length === 0 ? <p className="text-xs text-muted-foreground italic">Buyruq qo'shing...</p> :
              commands.map((cmdId, i) => {
                const d = DIR_BLOCKS.find(b => b.id === cmdId);
                return <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface/50 border border-border/50">
                  <span className="text-xs font-mono text-muted-foreground/50 w-4">{i+1}</span>
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d?.color }} />
                  <span className="text-xs font-medium flex-1">{d?.label}</span>
                  <button onClick={() => removeCmd(i)} className="p-0.5 hover:text-neon-red"><Trash2 className="w-3 h-3" /></button>
                </div>;
              })}
          </div>

          <div className="flex gap-2">
            <button onClick={run} disabled={won || animating || commands.length === 0} className="btn-primary py-2 px-4 flex-1 disabled:opacity-50">{animating ? "..." : "▶ Ishga tushirish"}</button>
            <button onClick={reset} className="btn-ghost py-2 px-3"><RotateCcw className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {won && <motion.div className="glass-card p-5 text-center bg-neon-green/5 border-neon-green/10" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-4xl mb-2">🎉</div><p className="font-bold text-neon-green text-lg">Bosqich o'tdi!</p>
        <button onClick={nextLevel} className="btn-primary py-2.5 px-8 mt-3">Keyingi bosqich →</button>
      </motion.div>}
    </div>
  );
}

// ===== 6. CODE BIRD — Buyruq bloklari bilan =====
const birdLevels = [
  { level: 1, targets: [[200, 150]] as number[][], obstacles: [] as number[][], desc: "Qushni ⭐ yulduzga olib boring (2 ta o'ngga)" },
  { level: 2, targets: [[320, 150]] as number[][], obstacles: [[200, 60, 20, 130]] as number[][], desc: "To'siqdan aylanib yulduzga yeting" },
  { level: 3, targets: [[160, 60], [320, 240]] as number[][], obstacles: [[120, 100, 160, 16], [240, 180, 16, 100]] as number[][], desc: "2 ta yulduzni yig'ing" },
];

const BIRD_MOVES = [
  { id: "right", label: "➡ O'ngga", dx: 80, dy: 0, color: "#FFD600" },
  { id: "left", label: "⬅ Chapga", dx: -80, dy: 0, color: "#00D2FF" },
  { id: "up", label: "⬆ Yuqori", dx: 0, dy: -80, color: "#6C5CE7" },
  { id: "down", label: "⬇ Pastga", dx: 0, dy: 80, color: "#00E676" },
  { id: "diag_ru", label: "↗ Diagonal", dx: 80, dy: -80, color: "#FF6B9D" },
  { id: "diag_rd", label: "↘ Diagonal", dx: 80, dy: 80, color: "#FF5252" },
];

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

  function addCmd(id: string) { if (!won && !animating) setCommands([...commands, id]); }
  function removeCmd(i: number) { if (!won && !animating) setCommands(commands.filter((_, j) => j !== i)); }

  function reset() { setBirdPos([40, 150]); setTrail([[40, 150]]); setWon(false); setCrashed(false); setCommands([]); setAnimating(false); setCollected(new Set()); }

  function hitsObstacle(px: number, py: number): boolean {
    for (const [ox, oy, ow, oh] of lv.obstacles) {
      // Kengaytirilgan to'siq chegarasi (qush radiusi 12px)
      if (px >= ox - 12 && px <= ox + ow + 12 && py >= oy - 12 && py <= oy + oh + 12) return true;
    }
    // Ekrandan chiqish
    if (px < 10 || px > 390 || py < 10 || py > 290) return true;
    return false;
  }

  function hitsTarget(px: number, py: number): number {
    for (let i = 0; i < lv.targets.length; i++) {
      const [tx, ty] = lv.targets[i];
      const dist = Math.sqrt((px - tx) ** 2 + (py - ty) ** 2);
      if (dist < 35) return i; // 35px radius — kengaytirilgan
    }
    return -1;
  }

  async function run() {
    if (commands.length === 0) return;
    setAnimating(true); setCrashed(false); setCollected(new Set());
    let x = 40, y = 150;
    const tr: [number, number][] = [[x, y]];
    const hits = new Set<number>();
    setBirdPos([x, y]); setTrail([[x, y]]);

    for (const cmdId of commands) {
      const mv = BIRD_MOVES.find(m => m.id === cmdId);
      if (!mv) continue;

      const nx = x + mv.dx, ny = y + mv.dy;

      if (hitsObstacle(nx, ny)) {
        setBirdPos([nx, ny]); setCrashed(true);
        await new Promise(r => setTimeout(r, 300));
        break;
      }

      x = nx; y = ny;
      tr.push([x, y]);
      setBirdPos([x, y]); setTrail([...tr]);

      const ti = hitsTarget(x, y);
      if (ti >= 0) { hits.add(ti); setCollected(new Set(hits)); }

      await new Promise(r => setTimeout(r, 350));
    }

    if (hits.size === lv.targets.length) { setWon(true); toast.success("Bosqich o'tdi! 🐦🎉"); }
    setAnimating(false);
  }

  function nextLevel() { const n = (level + 1) % birdLevels.length; setLevel(n); reset(); }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl">🐦 Code Bird — Bosqich {level + 1}/{birdLevels.length}</h2></div>
      <p className="text-muted-foreground">{lv.desc}</p>

      <div className="grid lg:grid-cols-[1fr,220px] gap-4">
        <div className="glass-card p-4 flex justify-center">
          <svg width="400" height="300" className="block rounded-xl" style={{ background: "linear-gradient(180deg, rgba(26,26,62,0.5) 0%, rgba(13,13,43,0.5) 100%)" }}>
            {/* Grid */}
            {Array.from({ length: 5 }).map((_, i) => <line key={`vg${i}`} x1={(i + 1) * 80} y1="0" x2={(i + 1) * 80} y2="300" stroke="rgba(255,255,255,0.03)" />)}
            {Array.from({ length: 3 }).map((_, i) => <line key={`hg${i}`} x1="0" y1={(i + 1) * 80} x2="400" y2={(i + 1) * 80} stroke="rgba(255,255,255,0.03)" />)}

            {/* To'siqlar */}
            {lv.obstacles.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#FF5252" opacity="0.3" rx="4" stroke="#FF5252" strokeWidth="1.5" />)}

            {/* Yulduzlar */}
            {lv.targets.map(([x, y], i) => (
              <g key={i}>
                {!collected.has(i) && <>
                  <circle cx={x} cy={y} r="20" fill="#FFD600" opacity="0.1"><animate attributeName="r" values="20;24;20" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx={x} cy={y} r="6" fill="#FFD600" opacity="0.3" />
                  <text x={x} y={y + 7} textAnchor="middle" fontSize="20">⭐</text>
                </>}
                {collected.has(i) && <text x={x} y={y + 7} textAnchor="middle" fontSize="20" opacity="0.3">✅</text>}
              </g>
            ))}

            {/* Trail */}
            {trail.map((pt, i) => i > 0 && <line key={i} x1={trail[i - 1][0]} y1={trail[i - 1][1]} x2={pt[0]} y2={pt[1]} stroke="#6C5CE7" strokeWidth="2.5" opacity="0.5" strokeDasharray="6" />)}

            {/* Qush */}
            <text x={birdPos[0]} y={birdPos[1] + 8} textAnchor="middle" fontSize="28">{crashed ? "💥" : "🐦"}</text>

            {/* Start marker */}
            <circle cx={40} cy={150} r="8" fill="#00E676" opacity="0.3" /><text x={40} y={155} textAnchor="middle" fontSize="10" fill="#00E676">S</text>
          </svg>
        </div>

        {/* Buyruqlar */}
        <div className="space-y-3">
          <p className="font-semibold text-xs text-muted-foreground">Buyruqlar:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {BIRD_MOVES.map(m => (
              <button key={m.id} onClick={() => addCmd(m.id)} disabled={won || animating}
                className="py-2 px-2 rounded-lg font-bold text-white text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: m.color }}>{m.label}</button>
            ))}
          </div>

          <p className="font-semibold text-xs text-muted-foreground">Ketma-ketlik ({commands.length}):</p>
          <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-hide">
            {commands.length === 0 ? <p className="text-xs text-muted-foreground italic">Buyruq qo'shing...</p> :
              commands.map((cmdId, i) => {
                const m = BIRD_MOVES.find(b => b.id === cmdId);
                return <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface/50 border border-border/50">
                  <span className="text-xs font-mono text-muted-foreground/50 w-4">{i + 1}</span>
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m?.color }} />
                  <span className="text-xs flex-1">{m?.label}</span>
                  <button onClick={() => removeCmd(i)} className="p-0.5 hover:text-neon-red"><Trash2 className="w-3 h-3" /></button>
                </div>;
              })}
          </div>

          <div className="flex gap-2">
            <button onClick={run} disabled={won || animating || commands.length === 0} className="btn-primary py-2 px-3 flex-1 text-sm disabled:opacity-50">{animating ? "..." : "▶ Boshlash"}</button>
            <button onClick={reset} className="btn-ghost py-2 px-3"><RotateCcw className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {won && <motion.div className="glass-card p-5 text-center bg-neon-green/5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-4xl mb-2">🎉</div><p className="font-bold text-neon-green">Bosqich o'tdi!</p>
        <button onClick={nextLevel} className="btn-primary py-2.5 px-8 mt-3">Keyingi bosqich →</button>
      </motion.div>}
      {crashed && !won && <div className="glass-card p-4 text-center text-neon-red"><div className="text-3xl mb-1">💥</div><p className="font-bold">To'siqqa urildi yoki chegaradan chiqdi! Qayta urinib ko'ring.</p></div>}
    </div>
  );
}
