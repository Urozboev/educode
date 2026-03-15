"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Puzzle, Bug, Keyboard, Swords, ArrowLeft, CheckCircle2, XCircle, RotateCcw, Sparkles, Trophy, Clock, Zap } from "lucide-react";

type GameType = null | "puzzle" | "bugfix" | "typing" | "battle";

const gameCards = [
  { type: "puzzle" as const, title: "Code Puzzle", desc: "Kod qatorlarini to'g'ri tartibga qo'ying", icon: Puzzle, color: "#6C5CE7", diff: "Oson" },
  { type: "bugfix" as const, title: "Bug Fix Challenge", desc: "Xatoli kodni toping va tuzating", icon: Bug, color: "#FF5252", diff: "O'rta" },
  { type: "typing" as const, title: "Code Typing Race", desc: "Kod yozish tezligini sinab ko'ring", icon: Keyboard, color: "#00D2FF", diff: "Oson" },
  { type: "battle" as const, title: "Code Battle", desc: "Vaqt bilan musobaqa — tezroq yeching", icon: Swords, color: "#00E676", diff: "Qiyin" },
];

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">O'yinlar</h1>
        <p className="text-muted-foreground">Dasturlashni o'yin orqali o'rganing</p>
      </motion.div>

      {!activeGame ? (
        <div className="grid md:grid-cols-2 gap-6">
          {gameCards.map((game, i) => (
            <motion.button key={game.type} onClick={() => setActiveGame(game.type)}
              className="glass-card-hover p-8 text-left group w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${game.color}15`, border: `1px solid ${game.color}30` }}>
                  <game.icon className="w-8 h-8" style={{ color: game.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-xl group-hover:text-neon-purple transition-colors">{game.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted-foreground">{game.diff}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{game.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setActiveGame(null)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> O'yinlarga qaytish
          </button>
          {activeGame === "puzzle" && <CodePuzzleGame />}
          {activeGame === "bugfix" && <BugFixGame />}
          {activeGame === "typing" && <TypingRaceGame />}
          {activeGame === "battle" && <CodeBattleGame />}
        </div>
      )}
    </div>
  );
}

// ===== CODE PUZZLE =====
const puzzles = [
  { title: "Fibonacci", lines: ["def fibonacci(n):", "    if n <= 1:", "        return n", "    return fibonacci(n-1) + fibonacci(n-2)", "print(fibonacci(10))"] },
  { title: "Eng katta element", lines: ["def max_element(arr):", "    maximum = arr[0]", "    for num in arr:", "        if num > maximum:", "            maximum = num", "    return maximum"] },
  { title: "Teskari satr", lines: ["def reverse(s):", "    result = ''", "    for char in s:", "        result = char + result", "    return result"] },
  { title: "Faktorial", lines: ["def factorial(n):", "    if n == 0:", "        return 1", "    return n * factorial(n-1)"] },
];

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; }

function CodePuzzleGame() {
  const [idx, setIdx] = useState(0);
  const [lines, setLines] = useState(() => shuffle([...puzzles[0].lines]));
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  function next() {
    const n = (idx + 1) % puzzles.length;
    setIdx(n); setLines(shuffle([...puzzles[n].lines])); setChecked(false);
  }
  function move(i: number, d: number) {
    if (checked) return;
    const n = i + d; if (n < 0 || n >= lines.length) return;
    const a = [...lines]; [a[i], a[n]] = [a[n], a[i]]; setLines(a);
  }
  const isCorrect = lines.every((l, i) => l === puzzles[idx].lines[i]);

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl flex items-center gap-2"><Puzzle className="w-5 h-5 text-neon-purple" /> {puzzles[idx].title}</h2>
        <span className="text-sm text-muted-foreground">Skor: {score} · {idx + 1}/{puzzles.length}</span>
      </div>
      <p className="text-sm text-muted-foreground">Qatorlarni ↑↓ tugmalari bilan to'g'ri tartibga qo'ying</p>
      <div className="glass-card p-4 space-y-2">
        {lines.map((line, i) => (
          <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl font-mono text-sm transition-all",
            checked && line === puzzles[idx].lines[i] ? "bg-neon-green/10 border border-neon-green/20" :
            checked ? "bg-neon-red/10 border border-neon-red/20" : "bg-surface border border-transparent hover:border-neon-purple/20")}>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => move(i, -1)} disabled={checked} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▲</button>
              <button onClick={() => move(i, 1)} disabled={checked} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▼</button>
            </div>
            <code className="flex-1">{line}</code>
            {checked && (line === puzzles[idx].lines[i] ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <XCircle className="w-4 h-4 text-neon-red" />)}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => { setChecked(true); if (isCorrect) setScore(s => s + 1); }} disabled={checked} className="btn-primary py-2.5 px-5 text-sm disabled:opacity-50">Tekshirish</button>
        <button onClick={() => { setLines(shuffle([...puzzles[idx].lines])); setChecked(false); }} className="btn-ghost py-2.5 px-5 text-sm"><RotateCcw className="w-4 h-4 inline mr-1" /> Aralashtirish</button>
        {checked && <button onClick={next} className="btn-neon py-2.5 px-5 text-sm">Keyingi →</button>}
      </div>
      {checked && <div className={cn("glass-card p-4 text-center", isCorrect ? "border-neon-green/20" : "border-neon-red/20")}>
        {isCorrect ? <p className="text-neon-green font-semibold">To'g'ri! 🎉</p> : <p className="text-neon-red font-semibold">Noto'g'ri. Qayta urinib ko'ring!</p>}
      </div>}
    </div>
  );
}

// ===== BUG FIX =====
const bugs = [
  { title: "Taqqoslash", buggy: 'if x % 2 = 0:', fixed: 'if x % 2 == 0:', hint: "'=' o'rniga '==' kerak", line: 0 },
  { title: "Index xatosi", buggy: 'total += arr[i + 1]', fixed: 'total += arr[i]', hint: "Index chegaradan chiqadi", line: 0 },
  { title: "Faktorial bazaviy holat", buggy: 'if n == 0: return 0', fixed: 'if n == 0: return 1', hint: "0! = 1, 0 emas", line: 0 },
  { title: "String birlashtirish", buggy: 'result = result + " " + word', fixed: 'result = result + " " + word if result else word', hint: "Bo'sh satr bilan boshlanganda ortiqcha bo'sh joy", line: 0 },
];

function BugFixGame() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const bug = bugs[idx];

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl flex items-center gap-2"><Bug className="w-5 h-5 text-neon-red" /> {bug.title}</h2>
        <span className="text-sm text-muted-foreground">Skor: {score} · {idx + 1}/{bugs.length}</span>
      </div>
      <div className="glass-card p-4">
        <div className="px-4 py-2 bg-surface rounded-lg font-mono text-sm mb-3">
          <span className="text-neon-red">{bug.buggy}</span>
        </div>
        <p className="text-sm text-muted-foreground">💡 {bug.hint}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => { setShow(true); setScore(s => s + 1); }} disabled={show} className="btn-primary py-2.5 px-5 text-sm disabled:opacity-50">Javobni ko'rish</button>
        <button onClick={() => { setIdx((idx + 1) % bugs.length); setShow(false); }} className="btn-neon py-2.5 px-5 text-sm">Keyingi</button>
      </div>
      {show && (
        <div className="glass-card p-4 bg-neon-green/5 border-neon-green/10">
          <p className="text-sm font-semibold text-neon-green mb-2">✅ To'g'ri kod:</p>
          <code className="font-mono text-sm">{bug.fixed}</code>
        </div>
      )}
    </div>
  );
}

// ===== CODE TYPING RACE =====
const codeSnippets = [
  "def hello(name):\n    return f\"Hello, {name}!\"\n\nprint(hello(\"World\"))",
  "for i in range(10):\n    if i % 2 == 0:\n        print(i)",
  "numbers = [1, 2, 3, 4, 5]\ntotal = sum(numbers)\nprint(f\"Sum: {total}\")",
  "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
];

function TypingRaceGame() {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const target = codeSnippets[snippetIdx];

  function handleChange(val: string) {
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(val);

    // Xatolik hisoblash
    let errCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== target[i]) errCount++;
    }
    setErrors(errCount);
    setAccuracy(val.length > 0 ? Math.round(((val.length - errCount) / val.length) * 100) : 100);

    if (val === target) {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const words = target.split(/\s+/).length;
      setWpm(Math.round(words / elapsed));
      setFinished(true);
    }
  }

  function restart() {
    setInput(""); setStarted(false); setFinished(false); setErrors(0); setAccuracy(100);
    inputRef.current?.focus();
  }

  function next() {
    setSnippetIdx((snippetIdx + 1) % codeSnippets.length);
    restart();
  }

  // Timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => setElapsed(Math.round((Date.now() - startTime) / 1000)), 100);
    return () => clearInterval(t);
  }, [started, finished, startTime]);

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl flex items-center gap-2"><Keyboard className="w-5 h-5 text-neon-blue" /> Code Typing Race</h2>
        <div className="flex items-center gap-4 text-sm">
          {started && !finished && <span className="flex items-center gap-1 text-neon-yellow"><Clock className="w-4 h-4" /> {elapsed}s</span>}
          <span className="text-muted-foreground">Aniqlik: {accuracy}%</span>
        </div>
      </div>

      {/* Target code */}
      <div className="glass-card p-4 font-mono text-sm leading-relaxed">
        {target.split("").map((char, i) => {
          let color = "text-muted-foreground/50";
          if (i < input.length) {
            color = input[i] === char ? "text-neon-green" : "text-neon-red bg-neon-red/10";
          } else if (i === input.length) {
            color = "text-foreground bg-neon-purple/20";
          }
          return <span key={i} className={cn("transition-colors", color)}>{char === "\n" ? "↵\n" : char}</span>;
        })}
      </div>

      {/* Input */}
      <textarea
        ref={inputRef}
        value={input}
        onChange={e => handleChange(e.target.value)}
        disabled={finished}
        className="input-field font-mono text-sm min-h-[120px] resize-none"
        placeholder="Bu yerda yozing..."
        autoFocus
        spellCheck={false}
      />

      {finished && (
        <motion.div className="glass-card p-6 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Trophy className="w-12 h-12 text-neon-yellow mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl mb-2">Tugatildi! 🎉</h3>
          <div className="flex items-center justify-center gap-6 text-lg">
            <div><span className="font-bold text-neon-blue">{wpm}</span> <span className="text-sm text-muted-foreground">WPM</span></div>
            <div><span className="font-bold text-neon-green">{accuracy}%</span> <span className="text-sm text-muted-foreground">aniqlik</span></div>
            <div><span className="font-bold text-neon-yellow">{elapsed}s</span> <span className="text-sm text-muted-foreground">vaqt</span></div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button onClick={restart} className="btn-ghost py-2.5 px-5 text-sm"><RotateCcw className="w-4 h-4 inline mr-1" /> Qayta</button>
        <button onClick={next} className="btn-neon py-2.5 px-5 text-sm">Keyingi kod →</button>
      </div>
    </div>
  );
}

// ===== CODE BATTLE (vaqt bilan) =====
const battleProblems = [
  { title: "Ikki sonni qo'shish", desc: "a + b natijasini chiqaring", input: "5 3", expected: "8", hint: "a, b = map(int, input().split())" },
  { title: "Juft yoki toq", desc: "Son juft bo'lsa 'Juft', toq bo'lsa 'Toq'", input: "4", expected: "Juft", hint: "n % 2 == 0" },
  { title: "Eng katta son", desc: "3 ta sondan eng kattasini toping", input: "3 7 5", expected: "7", hint: "max() funksiyasi" },
  { title: "Satr uzunligi", desc: "So'z uzunligini chiqaring", input: "salom", expected: "5", hint: "len() funksiyasi" },
];

function CodeBattleGame() {
  const [probIdx, setProbIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const prob = battleProblems[probIdx];

  useEffect(() => {
    if (!started || result) return;
    if (timeLeft <= 0) { setResult("lose"); return; }
    const t = setInterval(() => setTimeLeft(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft, result]);

  function start() {
    setStarted(true); setTimeLeft(30); setResult(null); setAnswer("");
  }

  function submit() {
    if (answer.trim() === prob.expected) {
      setScore(s => s + 1); setStreak(s => s + 1);
      setResult("win");
    } else {
      setStreak(0); setResult("lose");
    }
  }

  function next() {
    setProbIdx((probIdx + 1) % battleProblems.length);
    setStarted(true); setTimeLeft(30); setResult(null); setAnswer("");
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl flex items-center gap-2"><Swords className="w-5 h-5 text-neon-green" /> Code Battle</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-neon-yellow font-bold">Skor: {score}</span>
          {streak > 1 && <span className="text-neon-red flex items-center gap-1"><Zap className="w-4 h-4" /> {streak}x streak</span>}
        </div>
      </div>

      {!started && !result ? (
        <div className="glass-card p-8 text-center">
          <Swords className="w-16 h-16 text-neon-green/30 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl mb-2">Tayyormisiz?</h3>
          <p className="text-muted-foreground mb-6">30 soniya ichida masalani yeching. Tezlik va aniqlik muhim!</p>
          <button onClick={start} className="btn-primary py-3 px-8">Boshlash!</button>
        </div>
      ) : (
        <>
          {/* Timer */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
              <motion.div className={cn("h-full rounded-full transition-colors", timeLeft > 10 ? "bg-neon-green" : timeLeft > 5 ? "bg-neon-yellow" : "bg-neon-red")}
                style={{ width: `${(timeLeft / 30) * 100}%` }} />
            </div>
            <span className={cn("font-mono font-bold text-lg", timeLeft <= 5 ? "text-neon-red animate-pulse" : "text-foreground")}>{timeLeft}s</span>
          </div>

          {/* Problem */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-lg mb-2">{prob.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{prob.desc}</p>
            <div className="flex gap-4 text-xs font-mono bg-surface rounded-lg px-3 py-2 mb-3">
              <span>Kirish: <strong>{prob.input}</strong></span>
              <span>Kutilgan: <strong className="text-neon-green">{prob.expected}</strong></span>
            </div>
            <p className="text-xs text-neon-yellow">💡 {prob.hint}</p>
          </div>

          {/* Answer input */}
          {!result && (
            <div className="flex gap-3">
              <input value={answer} onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                className="input-field flex-1 font-mono" placeholder="Javobingiz..." autoFocus />
              <button onClick={submit} className="btn-primary py-3 px-6">Yuborish</button>
            </div>
          )}

          {/* Result */}
          {result && (
            <motion.div className={cn("glass-card p-6 text-center", result === "win" ? "border-neon-green/20" : "border-neon-red/20")} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              {result === "win" ? (
                <>
                  <Trophy className="w-12 h-12 text-neon-green mx-auto mb-2" />
                  <p className="font-bold text-neon-green text-lg">To'g'ri! 🎉</p>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-neon-red mx-auto mb-2" />
                  <p className="font-bold text-neon-red text-lg">{timeLeft <= 0 ? "Vaqt tugadi!" : "Noto'g'ri!"}</p>
                  <p className="text-sm text-muted-foreground mt-1">To'g'ri javob: <strong className="text-neon-green">{prob.expected}</strong></p>
                </>
              )}
              <button onClick={next} className="btn-primary py-2.5 px-6 mt-4">Keyingi masala →</button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
