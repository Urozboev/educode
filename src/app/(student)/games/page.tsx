"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Puzzle, Bug, Keyboard, Swords, ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Clock, Zap, MapPin, Feather } from "lucide-react";

type GameType = null | "puzzle" | "bugfix" | "typing" | "battle" | "maze" | "bird";

const gameCards = [
  { type: "puzzle" as const, title: "Code Puzzle", desc: "Kod qatorlarini to'g'ri tartibga qo'ying", icon: Puzzle, color: "#6C5CE7", diff: "Oson" },
  { type: "bugfix" as const, title: "Bug Fix", desc: "Xatoli kodni toping va tuzating", icon: Bug, color: "#FF5252", diff: "O'rta" },
  { type: "typing" as const, title: "Type Racer", desc: "Kod yozish tezligini sinab ko'ring", icon: Keyboard, color: "#00D2FF", diff: "Oson" },
  { type: "battle" as const, title: "Code Battle", desc: "Vaqt bilan musobaqa qiling", icon: Swords, color: "#00E676", diff: "Qiyin" },
  { type: "maze" as const, title: "Maze Runner", desc: "Kodni yozib labirintdan o'ting", icon: MapPin, color: "#FFD600", diff: "O'rta" },
  { type: "bird" as const, title: "Code Bird", desc: "Qushni kodlab boshqaring", icon: Feather, color: "#FF6B9D", diff: "O'rta" },
];

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; }

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">O'yinlar</h1>
        <p className="text-muted-foreground">6 ta o'yin — dasturlashni o'ynab o'rganing</p>
      </motion.div>
      {!activeGame ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gameCards.map((g, i) => (
            <motion.button key={g.type} onClick={() => setActiveGame(g.type)} className="glass-card-hover p-6 text-left group w-full"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${g.color}15`, border: `1px solid ${g.color}30` }}>
                  <g.icon className="w-7 h-7" style={{ color: g.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-lg group-hover:text-neon-purple transition-colors">{g.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted-foreground">{g.diff}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{g.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setActiveGame(null)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4" /> O'yinlarga qaytish</button>
          {activeGame === "puzzle" && <PuzzleGame />}
          {activeGame === "bugfix" && <BugFixGame />}
          {activeGame === "typing" && <TypingGame />}
          {activeGame === "battle" && <BattleGame />}
          {activeGame === "maze" && <MazeGame />}
          {activeGame === "bird" && <BirdGame />}
        </div>
      )}
    </div>
  );
}

// ===== 1. CODE PUZZLE (kengaytirilgan) =====
const puzzles = [
  { title: "Fibonacci", lines: ["def fibonacci(n):", "    if n <= 1:", "        return n", "    return fibonacci(n-1) + fibonacci(n-2)"] },
  { title: "Eng katta element", lines: ["def max_el(arr):", "    m = arr[0]", "    for x in arr:", "        if x > m:", "            m = x", "    return m"] },
  { title: "Teskari satr", lines: ["def reverse(s):", "    result = ''", "    for c in s:", "        result = c + result", "    return result"] },
  { title: "Faktorial", lines: ["def factorial(n):", "    if n == 0:", "        return 1", "    return n * factorial(n-1)"] },
  { title: "Sonlar yig'indisi", lines: ["total = 0", "for i in range(1, 11):", "    total += i", "print(total)"] },
  { title: "Bubble Sort", lines: ["for i in range(len(arr)):", "    for j in range(len(arr)-i-1):", "        if arr[j] > arr[j+1]:", "            arr[j], arr[j+1] = arr[j+1], arr[j]"] },
  { title: "Binary Search", lines: ["def search(arr, x):", "    lo, hi = 0, len(arr)-1", "    while lo <= hi:", "        mid = (lo + hi) // 2", "        if arr[mid] == x: return mid", "        elif arr[mid] < x: lo = mid + 1", "        else: hi = mid - 1", "    return -1"] },
];

function PuzzleGame() {
  const [idx, setIdx] = useState(0);
  const [lines, setLines] = useState(() => shuffle([...puzzles[0].lines]));
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const p = puzzles[idx];

  function next() { const n = (idx+1)%puzzles.length; setIdx(n); setLines(shuffle([...puzzles[n].lines])); setChecked(false); }
  function move(i: number, d: number) { if (checked) return; const n=i+d; if(n<0||n>=lines.length) return; const a=[...lines]; [a[i],a[n]]=[a[n],a[i]]; setLines(a); }
  const isCorrect = lines.every((l,i) => l === p.lines[i]);

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl flex items-center gap-2"><Puzzle className="w-5 h-5 text-neon-purple" /> {p.title}</h2>
        <span className="text-sm text-muted-foreground">Skor: {score} · {idx+1}/{puzzles.length}</span></div>
      <div className="glass-card p-4 space-y-2">
        {lines.map((line, i) => (
          <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl font-mono text-sm transition-all",
            checked && line === p.lines[i] ? "bg-neon-green/10 border border-neon-green/20" :
            checked ? "bg-neon-red/10 border border-neon-red/20" : "bg-surface border border-transparent hover:border-neon-purple/20")}>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => move(i,-1)} disabled={checked} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▲</button>
              <button onClick={() => move(i,1)} disabled={checked} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▼</button>
            </div>
            <code className="flex-1 whitespace-pre">{line}</code>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => { setChecked(true); if(isCorrect) setScore(s=>s+1); }} disabled={checked} className="btn-primary py-2.5 px-5 text-sm disabled:opacity-50">Tekshirish</button>
        <button onClick={() => { setLines(shuffle([...p.lines])); setChecked(false); }} className="btn-ghost py-2.5 px-5 text-sm"><RotateCcw className="w-4 h-4 inline mr-1" /> Aralashtirish</button>
        {checked && <button onClick={next} className="btn-neon py-2.5 px-5 text-sm">Keyingi →</button>}
      </div>
      {checked && <div className={cn("glass-card p-4 text-center", isCorrect ? "border-neon-green/20" : "border-neon-red/20")}>
        {isCorrect ? <p className="text-neon-green font-semibold">To'g'ri! 🎉</p> : <p className="text-neon-red font-semibold">Noto'g'ri. Qayta urinib ko'ring!</p>}
      </div>}
    </div>
  );
}

// ===== 2. BUG FIX (yaxshilangan) =====
const bugs = [
  { title: "Taqqoslash operatori", code: "x = 10\nif x % 2 = 0:\n    print('Juft')", fixed: "x = 10\nif x % 2 == 0:\n    print('Juft')", bugLine: 1, hint: "'=' o'rniga '==' kerak (taqqoslash)" },
  { title: "Index xatosi", code: "arr = [1, 2, 3]\nfor i in range(len(arr)):\n    print(arr[i + 1])", fixed: "arr = [1, 2, 3]\nfor i in range(len(arr)):\n    print(arr[i])", bugLine: 2, hint: "i+1 oxirgi elementda chegaradan chiqadi" },
  { title: "Faktorial bazaviy holat", code: "def factorial(n):\n    if n == 0:\n        return 0\n    return n * factorial(n-1)", fixed: "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n-1)", bugLine: 2, hint: "0! = 1, 0 emas" },
  { title: "Cheksiz tsikl", code: "i = 0\nwhile i < 10:\n    print(i)", fixed: "i = 0\nwhile i < 10:\n    print(i)\n    i += 1", bugLine: 2, hint: "i qiymati o'zgarmaydi — cheksiz tsikl" },
  { title: "Return xatosi", code: "def add(a, b):\n    result = a + b\n\nprint(add(3, 5))", fixed: "def add(a, b):\n    result = a + b\n    return result\nprint(add(3, 5))", bugLine: 2, hint: "Funksiya hech narsa qaytarmaydi" },
  { title: "String concatenation", code: "name = 'Ali'\nage = 25\nprint('Ism: ' + name + ', Yosh: ' + age)", fixed: "name = 'Ali'\nage = 25\nprint('Ism: ' + name + ', Yosh: ' + str(age))", bugLine: 2, hint: "str va int ni qo'shib bo'lmaydi" },
  { title: "List append", code: "fruits = ['olma']\nfruits = fruits.append('banan')\nprint(fruits)", fixed: "fruits = ['olma']\nfruits.append('banan')\nprint(fruits)", bugLine: 1, hint: "append() None qaytaradi, o'zini o'zgartiradi" },
  { title: "Scope xatosi", code: "def greet():\n    msg = 'Salom'\ngreet()\nprint(msg)", fixed: "def greet():\n    msg = 'Salom'\n    return msg\nresult = greet()\nprint(result)", bugLine: 3, hint: "msg faqat funksiya ichida mavjud" },
];

function BugFixGame() {
  const [idx, setIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const bug = bugs[idx];

  function checkAnswer() {
    const isCorrect = userAnswer.trim().replace(/\s+/g, ' ') === bug.fixed.split('\n')[bug.bugLine].trim().replace(/\s+/g, ' ');
    if (isCorrect) setScore(s => s + 1);
    setChecked(true);
    setShowAnswer(true);
  }

  function next() { setIdx((idx+1)%bugs.length); setUserAnswer(""); setShowHint(false); setShowAnswer(false); setChecked(false); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl flex items-center gap-2"><Bug className="w-5 h-5 text-neon-red" /> {bug.title}</h2>
        <span className="text-sm text-muted-foreground">Skor: {score} · {idx+1}/{bugs.length}</span></div>
      <p className="text-sm text-muted-foreground">Quyidagi kodda xatolik bor. Xato qatorni tuzating!</p>

      <div className="glass-card overflow-hidden">
        <div className="px-4 py-2 bg-surface border-b border-border flex items-center gap-2 text-xs">
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neon-red/60" /><div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/60" /><div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" /></div>
          <span className="text-muted-foreground font-mono ml-2">buggy.py</span>
        </div>
        <div className="p-4 font-mono text-sm">
          {bug.code.split("\n").map((line, i) => (
            <div key={i} className={cn("flex gap-3 px-2 py-1 rounded", i === bug.bugLine && "bg-neon-red/10 border-l-2 border-neon-red")}>
              <span className="text-muted-foreground w-6 text-right text-xs">{i+1}</span>
              <span className={i === bug.bugLine ? "text-neon-red" : ""}>{line}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Tuzatilgan qator ({bug.bugLine + 1}-qator):</label>
        <input value={userAnswer} onChange={e => setUserAnswer(e.target.value)} className="input-field font-mono text-sm" placeholder={`${bug.bugLine + 1}-qatorni to'g'ri yozing...`} disabled={checked} />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setShowHint(!showHint)} className="btn-ghost py-2.5 px-4 text-sm">💡 Maslahat</button>
        {!checked && <button onClick={checkAnswer} disabled={!userAnswer.trim()} className="btn-primary py-2.5 px-5 text-sm disabled:opacity-50">Tekshirish</button>}
        {!checked && <button onClick={() => { setShowAnswer(true); setChecked(true); }} className="text-xs text-muted-foreground hover:text-foreground py-2.5 px-4">Javobni ko'rish</button>}
        <button onClick={next} className="btn-neon py-2.5 px-5 text-sm">Keyingi →</button>
      </div>

      {showHint && <div className="glass-card p-4 bg-neon-yellow/5 border-neon-yellow/10"><p className="text-sm text-neon-yellow">💡 {bug.hint}</p></div>}
      {showAnswer && (
        <div className="glass-card p-4 bg-neon-green/5 border-neon-green/10">
          <p className="text-sm font-semibold text-neon-green mb-2">✅ To'g'ri kod:</p>
          <pre className="font-mono text-sm text-muted-foreground whitespace-pre">{bug.fixed}</pre>
        </div>
      )}
    </div>
  );
}

// ===== 3. TYPING RACE =====
const codeSnippets = [
  "def hello(name):\n    return f\"Hello, {name}!\"\n\nprint(hello(\"World\"))",
  "for i in range(10):\n    if i % 2 == 0:\n        print(i)",
  "numbers = [1, 2, 3, 4, 5]\ntotal = sum(numbers)\nprint(f\"Sum: {total}\")",
  "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
  "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f\"{self.name} says Woof!\"",
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
    if (val === target) { setWpm(Math.round(target.split(/\s+/).length / ((Date.now()-startTime)/60000))); setFinished(true); }
  }

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => setElapsed(Math.round((Date.now()-startTime)/1000)), 100);
    return () => clearInterval(t);
  }, [started, finished, startTime]);

  function restart() { setInput(""); setStarted(false); setFinished(false); setAccuracy(100); setElapsed(0); ref.current?.focus(); }
  function next() { setSIdx((sIdx+1)%codeSnippets.length); restart(); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl flex items-center gap-2"><Keyboard className="w-5 h-5 text-neon-blue" /> Type Racer</h2>
        <div className="flex items-center gap-4 text-sm">{started && !finished && <span className="text-neon-yellow"><Clock className="w-4 h-4 inline mr-1" />{elapsed}s</span>}<span className="text-muted-foreground">Aniqlik: {accuracy}%</span></div></div>
      <div className="glass-card p-4 font-mono text-sm leading-relaxed">
        {target.split("").map((ch, i) => {
          let c = "text-muted-foreground/40"; if (i<input.length) c = input[i]===ch ? "text-neon-green" : "text-neon-red bg-neon-red/10"; else if (i===input.length) c = "text-foreground bg-neon-purple/20";
          return <span key={i} className={cn("transition-colors", c)}>{ch === "\n" ? "↵\n" : ch}</span>;
        })}
      </div>
      <textarea ref={ref} value={input} onChange={e => handleChange(e.target.value)} disabled={finished} className="input-field font-mono text-sm min-h-[100px] resize-none" placeholder="Bu yerda yozing..." autoFocus spellCheck={false} />
      {finished && (
        <motion.div className="glass-card p-6 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Trophy className="w-12 h-12 text-neon-yellow mx-auto mb-3" /><h3 className="font-bold text-xl mb-2">Tugatildi! 🎉</h3>
          <div className="flex items-center justify-center gap-6 text-lg">
            <div><span className="font-bold text-neon-blue">{wpm}</span> <span className="text-sm text-muted-foreground">WPM</span></div>
            <div><span className="font-bold text-neon-green">{accuracy}%</span> <span className="text-sm text-muted-foreground">aniqlik</span></div>
            <div><span className="font-bold text-neon-yellow">{elapsed}s</span> <span className="text-sm text-muted-foreground">vaqt</span></div>
          </div>
        </motion.div>
      )}
      <div className="flex gap-3"><button onClick={restart} className="btn-ghost py-2.5 px-5 text-sm"><RotateCcw className="w-4 h-4 inline mr-1" /> Qayta</button>
        <button onClick={next} className="btn-neon py-2.5 px-5 text-sm">Keyingi →</button></div>
    </div>
  );
}

// ===== 4. CODE BATTLE (yaxshilangan) =====
const battleProblems = [
  { title: "Ikki sonni qo'shish", desc: "a + b ni hisoblang", input: "5 3", expected: "8", hint: "a, b = map(int, input().split())" },
  { title: "Juft/Toq", desc: "Son juft bo'lsa 'Juft', toq bo'lsa 'Toq'", input: "4", expected: "Juft", hint: "n % 2 == 0" },
  { title: "Eng katta son", desc: "3 ta sondan eng kattasi", input: "3 7 5", expected: "7", hint: "max() funksiyasi" },
  { title: "Satr uzunligi", desc: "So'z uzunligi", input: "salom", expected: "5", hint: "len()" },
  { title: "Teskari son", desc: "Sonni teskari yozing", input: "123", expected: "321", hint: "str[::-1]" },
  { title: "Harflar soni", desc: "'a' harfi nechta?", input: "banana", expected: "3", hint: ".count('a')" },
  { title: "Kattaharf", desc: "So'zni kattaharfga", input: "salom", expected: "SALOM", hint: ".upper()" },
  { title: "Yig'indi", desc: "1 dan n gacha yig'indi", input: "5", expected: "15", hint: "n*(n+1)//2" },
];

function BattleGame() {
  const [pIdx, setPIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<"win"|"lose"|null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const p = battleProblems[pIdx];

  useEffect(() => {
    if (!started || result) return;
    if (timeLeft <= 0) { setResult("lose"); setStreak(0); return; }
    const t = setInterval(() => setTimeLeft(v => v-1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft, result]);

  function start() { setStarted(true); setTimeLeft(30); setResult(null); setAnswer(""); }
  function submit() {
    if (answer.trim() === p.expected) { setScore(s=>s+1); setStreak(s=>s+1); setResult("win"); }
    else { setStreak(0); setResult("lose"); }
  }
  function next() { setPIdx((pIdx+1)%battleProblems.length); setStarted(true); setTimeLeft(30); setResult(null); setAnswer(""); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl flex items-center gap-2"><Swords className="w-5 h-5 text-neon-green" /> Code Battle</h2>
        <div className="flex items-center gap-4 text-sm"><span className="text-neon-yellow font-bold">Skor: {score}</span>{streak > 1 && <span className="text-neon-red"><Zap className="w-4 h-4 inline" /> {streak}x</span>}</div></div>
      {!started && !result ? (
        <div className="glass-card p-8 text-center"><Swords className="w-16 h-16 text-neon-green/30 mx-auto mb-4" /><h3 className="font-bold text-xl mb-4">30 soniya. Tezkor javob.</h3>
          <button onClick={start} className="btn-primary py-3 px-8">Boshlash!</button></div>
      ) : (<>
        <div className="flex items-center gap-3"><div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-colors", timeLeft>10 ? "bg-neon-green" : timeLeft>5 ? "bg-neon-yellow" : "bg-neon-red")} style={{ width: `${(timeLeft/30)*100}%` }} /></div>
          <span className={cn("font-mono font-bold text-lg", timeLeft<=5 ? "text-neon-red animate-pulse" : "")}>{timeLeft}s</span></div>
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-2">{p.title}</h3><p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
          <div className="flex gap-4 text-xs font-mono bg-surface rounded-lg px-3 py-2 mb-3"><span>Kirish: <strong>{p.input}</strong></span><span>Kutilgan: <strong className="text-neon-green">{p.expected}</strong></span></div>
          <p className="text-xs text-neon-yellow">💡 {p.hint}</p>
        </div>
        {!result && <div className="flex gap-3"><input value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} className="input-field flex-1 font-mono" placeholder="Javob..." autoFocus />
          <button onClick={submit} className="btn-primary py-3 px-6">Yuborish</button></div>}
        {result && (
          <motion.div className={cn("glass-card p-6 text-center", result==="win" ? "border-neon-green/20" : "border-neon-red/20")} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {result==="win" ? <><Trophy className="w-12 h-12 text-neon-green mx-auto mb-2" /><p className="font-bold text-neon-green text-lg">To'g'ri! 🎉</p></> :
              <><XCircle className="w-12 h-12 text-neon-red mx-auto mb-2" /><p className="font-bold text-neon-red text-lg">{timeLeft<=0 ? "Vaqt tugadi!" : "Noto'g'ri!"}</p><p className="text-sm text-muted-foreground mt-1">Javob: <strong className="text-neon-green">{p.expected}</strong></p></>}
            <button onClick={next} className="btn-primary py-2.5 px-6 mt-4">Keyingi →</button>
          </motion.div>
        )}
      </>)}
    </div>
  );
}

// ===== 5. MAZE GAME =====
const mazes = [
  { level: 1, grid: [[0,0,0,0,0],[0,1,1,1,0],[0,0,0,1,0],[0,1,0,0,0],[0,0,0,1,0]], start: [0,0], end: [4,2], moves: "DDRRDDLL", desc: "pastga 2, o'ngga 2, pastga 2" },
  { level: 2, grid: [[0,0,1,0,0],[1,0,1,0,1],[0,0,0,0,0],[0,1,1,0,1],[0,0,0,0,0]], start: [0,0], end: [4,4], moves: "DDRRRDDDR", desc: "labirintdan chiqish yo'lini toping" },
  { level: 3, grid: [[0,0,0,0,0,0],[0,1,1,1,1,0],[0,0,0,0,1,0],[1,1,1,0,1,0],[0,0,0,0,0,0],[0,1,1,1,0,0]], start: [0,0], end: [5,5], moves: "DDDRRRUURRRDDD", desc: "murakkab labirint" },
];

function MazeGame() {
  const [level, setLevel] = useState(0);
  const [pos, setPos] = useState<[number,number]>([...mazes[0].start] as [number,number]);
  const [path, setPath] = useState<[number,number][]>([[...mazes[0].start] as [number,number]]);
  const [won, setWon] = useState(false);
  const [commands, setCommands] = useState("");
  const maze = mazes[level];

  function reset() { setPos([...maze.start] as [number,number]); setPath([[...maze.start] as [number,number]]); setWon(false); setCommands(""); }

  function run() {
    const dirs: Record<string, [number,number]> = { U: [-1,0], D: [1,0], L: [0,-1], R: [0,1] };
    let [r,c] = [...maze.start];
    const trail: [number,number][] = [[r,c]];
    for (const ch of commands.toUpperCase()) {
      const d = dirs[ch]; if (!d) continue;
      const nr = r+d[0], nc = c+d[1];
      if (nr<0 || nr>=maze.grid.length || nc<0 || nc>=maze.grid[0].length || maze.grid[nr][nc]===1) break;
      r = nr; c = nc; trail.push([r,c]);
    }
    setPos([r,c]); setPath(trail);
    if (r===maze.end[0] && c===maze.end[1]) { setWon(true); }
  }

  function nextLevel() {
    const n = (level+1) % mazes.length;
    setLevel(n);
    setPos([...mazes[n].start] as [number,number]);
    setPath([[...mazes[n].start] as [number,number]]);
    setWon(false); setCommands("");
  }

  const cellSize = 48;
  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl flex items-center gap-2"><MapPin className="w-5 h-5 text-neon-yellow" /> Maze Runner</h2>
        <span className="text-sm text-muted-foreground">Bosqich {level+1}/{mazes.length}</span></div>
      <p className="text-sm text-muted-foreground">{maze.desc}. Buyruqlar: U(yuqori), D(past), L(chap), R(o'ng)</p>

      <div className="glass-card p-4 flex justify-center overflow-auto">
        <svg width={maze.grid[0].length * cellSize} height={maze.grid.length * cellSize} className="block">
          {maze.grid.map((row, r) => row.map((cell, c) => (
            <rect key={`${r}-${c}`} x={c*cellSize} y={r*cellSize} width={cellSize} height={cellSize}
              fill={cell === 1 ? "var(--color-surface)" : "transparent"} stroke="var(--color-border)" strokeWidth="0.5" rx="4" />
          )))}
          {/* Path */}
          {path.map(([r,c], i) => i > 0 && (
            <line key={i} x1={(path[i-1][1]+0.5)*cellSize} y1={(path[i-1][0]+0.5)*cellSize}
              x2={(c+0.5)*cellSize} y2={(r+0.5)*cellSize} stroke="#6C5CE7" strokeWidth="3" opacity="0.4" />
          ))}
          {/* Start */}
          <circle cx={(maze.start[1]+0.5)*cellSize} cy={(maze.start[0]+0.5)*cellSize} r="10" fill="#00E676" />
          {/* End */}
          <circle cx={(maze.end[1]+0.5)*cellSize} cy={(maze.end[0]+0.5)*cellSize} r="10" fill="#FFD600" />
          {/* Player */}
          <circle cx={(pos[1]+0.5)*cellSize} cy={(pos[0]+0.5)*cellSize} r="14" fill="#6C5CE7" opacity="0.9">
            <animate attributeName="r" values="14;16;14" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x={(pos[1]+0.5)*cellSize} y={(pos[0]+0.5)*cellSize+5} textAnchor="middle" fill="white" fontSize="14">🤖</text>
        </svg>
      </div>

      <div className="flex gap-3">
        <input value={commands} onChange={e => setCommands(e.target.value.toUpperCase())} className="input-field font-mono flex-1" placeholder="DDRR..." disabled={won} />
        <button onClick={run} disabled={won} className="btn-primary py-3 px-6 disabled:opacity-50">Ishga tushirish</button>
        <button onClick={reset} className="btn-ghost py-3 px-4"><RotateCcw className="w-4 h-4" /></button>
      </div>

      {won && (
        <motion.div className="glass-card p-6 text-center bg-neon-green/5 border-neon-green/10" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Trophy className="w-12 h-12 text-neon-green mx-auto mb-2" /><p className="font-bold text-neon-green text-lg">Labirint yechildi! 🎉</p>
          <button onClick={nextLevel} className="btn-primary py-2.5 px-6 mt-4">Keyingi bosqich →</button>
        </motion.div>
      )}
    </div>
  );
}

// ===== 6. CODE BIRD =====
const birdLevels = [
  { level: 1, targets: [[150, 100]], obstacles: [], desc: "Qushni nishonga olib boring. fly(x, y)" },
  { level: 2, targets: [[250, 80]], obstacles: [[150, 0, 20, 120]], desc: "To'siqdan aylanib o'ting" },
  { level: 3, targets: [[100, 200], [300, 80]], obstacles: [[200, 50, 20, 150], [150, 180, 150, 20]], desc: "2 ta nishon, 2 ta to'siq" },
];

function BirdGame() {
  const [level, setLevel] = useState(0);
  const [birdPos, setBirdPos] = useState<[number,number]>([30, 150]);
  const [trail, setTrail] = useState<[number,number][]>([[30, 150]]);
  const [code, setCode] = useState("fly(150, 100)");
  const [won, setWon] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const lv = birdLevels[level];

  function reset() { setBirdPos([30, 150]); setTrail([[30, 150]]); setWon(false); setCrashed(false); }

  function run() {
    reset();
    const moves: [number,number][] = [];
    const flyFn = (x: number, y: number) => { moves.push([x, y]); };
    try { new Function("fly", code)(flyFn); } catch (_e) { return; }

    let pos: [number,number] = [30, 150];
    const fullTrail: [number,number][] = [pos];
    let hitTarget = new Set<number>();
    let hit = false;

    for (const [mx, my] of moves) {
      // Check obstacles
      for (const [ox, oy, ow, oh] of lv.obstacles) {
        if (mx >= ox && mx <= ox+ow && my >= oy && my <= oy+oh) { hit = true; break; }
      }
      if (hit) { setCrashed(true); break; }

      pos = [mx, my];
      fullTrail.push(pos);

      // Check targets
      lv.targets.forEach((t, i) => {
        if (Math.abs(mx - t[0]) < 20 && Math.abs(my - t[1]) < 20) hitTarget.add(i);
      });
    }

    setBirdPos(pos);
    setTrail(fullTrail);
    if (hitTarget.size === lv.targets.length && !hit) setWon(true);
  }

  function nextLevel() { const n = (level+1)%birdLevels.length; setLevel(n); setCode("fly(150, 100)"); reset(); }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-display font-bold text-xl flex items-center gap-2"><Feather className="w-5 h-5 text-[#FF6B9D]" /> Code Bird</h2>
        <span className="text-sm text-muted-foreground">Bosqich {level+1}/{birdLevels.length}</span></div>
      <p className="text-sm text-muted-foreground">{lv.desc}</p>

      <div className="glass-card p-4 flex justify-center">
        <svg width="400" height="300" className="block bg-gradient-to-b from-[#1a1a3e]/50 to-[#0d0d2b]/50 rounded-xl">
          {/* Obstacles */}
          {lv.obstacles.map(([x,y,w,h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="var(--color-surface)" rx="4" stroke="#FF5252" strokeWidth="1" />)}
          {/* Targets */}
          {lv.targets.map(([x,y], i) => (
            <g key={i}><circle cx={x} cy={y} r="15" fill="#FFD600" opacity="0.2"><animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" /></circle>
              <text x={x} y={y+5} textAnchor="middle" fontSize="16">⭐</text></g>
          ))}
          {/* Trail */}
          {trail.map((p, i) => i > 0 && <line key={i} x1={trail[i-1][0]} y1={trail[i-1][1]} x2={p[0]} y2={p[1]} stroke="#6C5CE7" strokeWidth="2" opacity="0.4" strokeDasharray="4" />)}
          {/* Bird */}
          <text x={birdPos[0]} y={birdPos[1]+6} textAnchor="middle" fontSize="24">{crashed ? "💥" : "🐦"}</text>
        </svg>
      </div>

      <div><label className="text-sm font-medium mb-1 block">Kod (fly(x, y) funksiyasini chaqiring):</label>
        <textarea value={code} onChange={e => setCode(e.target.value)} className="input-field font-mono text-sm min-h-[60px]" disabled={won} /></div>

      <div className="flex gap-3">
        <button onClick={run} disabled={won} className="btn-primary py-2.5 px-6 disabled:opacity-50">Ishga tushirish</button>
        <button onClick={reset} className="btn-ghost py-2.5 px-4"><RotateCcw className="w-4 h-4" /></button>
      </div>

      {won && (
        <motion.div className="glass-card p-6 text-center bg-neon-green/5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Trophy className="w-12 h-12 text-neon-green mx-auto mb-2" /><p className="font-bold text-neon-green">Bosqich o'tdi! 🎉</p>
          <button onClick={nextLevel} className="btn-primary py-2.5 px-6 mt-4">Keyingi bosqich →</button>
        </motion.div>
      )}
      {crashed && !won && <div className="glass-card p-4 text-center text-neon-red"><p className="font-bold">💥 To'siqqa urildi! Qayta urinib ko'ring.</p></div>}
    </div>
  );
}
