"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import {
  Play, Loader2, RotateCcw, Copy, Check, Terminal, Globe,
  ChevronDown, Cpu, Clock, Keyboard, AlertCircle, X, CornerDownLeft, Compass, Network,
} from "lucide-react";
import { LanguageLogo } from "@/components/icons/LanguageLogo";
import { useI18n } from "@/lib/i18n";
import { diagnoseMisconceptions, type MisconceptionDiagnostic } from "@/lib/diagnostics/misconceptionEngine";
import MisconceptionAlert from "@/components/diagnostics/MisconceptionAlert";
import SemanticBridgeModal from "@/components/semantics/SemanticBridgeModal";
import KnowledgeGraphModal from "@/components/diagnostics/KnowledgeGraphModal";

type Lang = {
  id: string;
  label: string;
  monaco: string;
  version: string;
  starter: string;
  /** false — brauzerda bajariladi (HTML preview), true — backend API orqali */
  api?: boolean;
  /** Kod tarkibida stdin talab qilinishini aniqlovchi pattern */
  stdinPattern?: RegExp;
  /** Interaktiv konsol (dastur ishlagach qiymat kiritish) qo'llab-quvvatlanadimi */
  interactive?: boolean;
  /** stdin tugaganini bildiruvchi xato pattern (auto-detect uchun) */
  eofPattern?: RegExp;
};

const languages: Lang[] = [
  {
    id: "python",
    label: "Python",
    monaco: "python",
    version: "3.10",
    api: true,
    interactive: true,
    eofPattern: /EOFError/,
    stdinPattern: /(^|\W)input\s*\(/,
    starter: `# Python Playground
# input() chaqirilganda dastur to'xtab, konsolda qiymat so'raydi
name = input("Ismingiz: ")
age = input("Yoshingiz: ")
print(f"Xush kelibsiz, {name}! Siz {age} yoshdasiz.")`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monaco: "javascript",
    version: "Node 12",
    api: true,
    stdinPattern: /readline|process\.stdin/,
    starter: `// JavaScript (Node) Playground
console.log("Salom, Dunyo!");

const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((a, b) => a + b, 0);
console.log(\`Yig'indi: \${sum}\`);`,
  },
  {
    id: "typescript",
    label: "TypeScript",
    monaco: "typescript",
    version: "5.0",
    api: true,
    starter: `// TypeScript Playground
const greet = (name: string): string => {
  return \`Salom, \${name}!\`;
};
console.log(greet("TypeScript"));`,
  },
  {
    id: "c++",
    label: "C++",
    monaco: "cpp",
    version: "GCC 9.2",
    api: true,
    interactive: true,
    stdinPattern: /std::cin|cin\s*>>/,
    starter: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Yig'indi: " << a + b << endl;
    return 0;
}`,
  },
  {
    id: "java",
    label: "Java",
    monaco: "java",
    version: "OpenJDK 13",
    api: true,
    interactive: true,
    eofPattern: /NoSuchElementException|InputMismatchException/,
    stdinPattern: /Scanner|BufferedReader/,
    starter: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        System.out.println("Salom, " + name + "!");
    }
}`,
  },
  {
    id: "csharp",
    label: "C#",
    monaco: "csharp",
    version: "Mono 6.12",
    api: true,
    interactive: true,
    eofPattern: /ArgumentNullException|NullReferenceException/,
    stdinPattern: /Console\.ReadLine/,
    starter: `using System;

class Program {
    static void Main() {
        string name = Console.ReadLine();
        Console.WriteLine($"Salom, {name}!");
    }
}`,
  },
  {
    id: "html",
    label: "HTML/CSS",
    monaco: "html",
    version: "",
    api: false,
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    h1 { color: #6C5CE7; font-size: 2rem; margin-bottom: 8px; }
    p { color: rgba(255,255,255,0.6); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Salom, Dunyo!</h1>
    <p>HTML va CSS bilan ishlash</p>
  </div>
</body>
</html>`,
  },
];

/**
 * Python interaktiv rejim uchun harness (BITTA qator — traceback'da
 * qator raqami faqat 1 ga siljiydi, keyin biz uni to'g'irlaymiz).
 * input() qiymatini terminal kabi stdout'ga echo qiladi.
 */
const PY_ECHO_HARNESS =
  `import builtins as _b;_oi=_b.input;_b.input=lambda p="":(lambda v:(print(v),v)[1])(_oi(p))\n`;

/** Traceback'dagi qator raqamlarini harness siljishiga qarab to'g'irlash */
function fixPyLineNumbers(stderr: string): string {
  return stderr.replace(/line (\d+)/g, (_, n) => `line ${Math.max(1, parseInt(n) - 1)}`);
}

export default function PlaygroundPage() {
  const { t } = useI18n();
  const [lang, setLang] = useState<Lang>(languages[0]);
  const [code, setCode] = useState(languages[0].starter);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stdin, setStdin] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [meta, setMeta] = useState<{ provider?: string; time?: string; memory?: number; warning?: string }>({});
  const [stdinOpen, setStdinOpen] = useState(false);

  // Interaktiv konsol holati (Python)
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inlineValue, setInlineValue] = useState("");
  const inputsRef = useRef<string[]>([]);
  const inlineRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Ilmiy-pedagogik modallar va xatoliklar
  const [misconception, setMisconception] = useState<MisconceptionDiagnostic | null>(null);
  const [showSemanticBridge, setShowSemanticBridge] = useState(false);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);

  // Kod tarkibida stdin kerakligini aniqlash (interaktiv bo'lmagan tillar uchun)
  const needsStdin = useMemo(() => {
    if (!lang.stdinPattern || lang.interactive) return false;
    return lang.stdinPattern.test(code);
  }, [code, lang]);

  // Inline input paydo bo'lganda avtofokus + scroll
  useEffect(() => {
    if (awaitingInput) {
      inlineRef.current?.focus();
      consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight });
    }
  }, [awaitingInput, output]);

  function switchLang(l: Lang) {
    setLang(l);
    setCode(l.starter);
    setOutput("");
    setStdin("");
    setShowHtml(false);
    setLangOpen(false);
    setMeta({});
    setAwaitingInput(false);
    inputsRef.current = [];
  }

  /** Server API orqali bajarish (bitta chaqiruv) */
  const execOnServer = useCallback(
    async (execCode: string, execStdin: string) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const res = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ language: lang.id, code: execCode, stdin: execStdin }),
        signal: ctrl.signal,
      });
      return res.json();
    },
    [lang.id],
  );

  /**
   * Interaktiv bajarish (barcha API tillar): buffer bilan ishga tushiriladi.
   * stdin-tugadi xatosi (eofPattern: Python EOFError, Java NoSuchElement,
   * C# ArgumentNull...) chiqsa — konsolda inline input ochiladi.
   * Qiymat kiritilgach buffer'ga qo'shilib QAYTA bajariladi.
   * C++ kabi EOF'ni xatosiz "yutib yuboradigan" tillarda esa terminal
   * ostidagi doimiy kiritish qatori orqali qiymat qo'shib re-run qilinadi.
   */
  const runInteractive = useCallback(
    async (buffer: string[]) => {
      const isPy = lang.id === "python";
      const data = await execOnServer(isPy ? PY_ECHO_HARNESS + code : code, buffer.join("\n"));

      setMeta({ provider: data.provider, time: data.time, memory: data.memory, warning: data.warning });

      if (data.error) {
        setOutput(`${t.cabinet.play.serverError}: ${data.error}`);
        setAwaitingInput(false);
        return;
      }

      const out: string = data.stdout || "";
      const err: string = data.stderr || "";

      if (lang.eofPattern && err && lang.eofPattern.test(err)) {
        // Dastur kiritish kutmoqda — hozirgi chiqishni ko'rsatib, qiymat so'raymiz
        setOutput(out);
        setAwaitingInput(true);
        return;
      }

      setAwaitingInput(false);
      if (err) {
        setOutput(`${out}${out ? "\n" : ""}${isPy ? fixPyLineNumbers(err) : err}`);
      } else if (data.status === "timeout") {
        setOutput(out + "\n⏱ " + t.cabinet.play.timeout);
      } else {
        setOutput(out || t.cabinet.play.emptyOutput);
      }
    },
    [code, execOnServer, lang],
  );

  /** Oddiy (interaktiv bo'lmagan) bajarish */
  const runPlain = useCallback(async () => {
    const data = await execOnServer(code, stdin);
    setMeta({ provider: data.provider, time: data.time, memory: data.memory, warning: data.warning });

    if (data.error) {
      setOutput(`${t.cabinet.play.serverError}: ${data.error}`);
      return;
    }
    const out = data.stdout || "";
    const err = data.stderr || "";
    if (err) {
      setOutput(`${err}${out ? "\n\n" + out : ""}`);
    } else if (data.status === "timeout") {
      setOutput(t.cabinet.play.timeout);
    } else {
      setOutput(out || t.cabinet.play.emptyOutput);
    }
  }, [code, stdin, execOnServer]);

  async function handleRun() {
    setRunning(true);
    setOutput("");
    setShowHtml(false);
    setMeta({});
    setAwaitingInput(false);
    inputsRef.current = [];
    try {
      if (lang.id === "html") {
        setShowHtml(true);
        setOutput(t.cabinet.play.htmlInRightPanel);
      } else if (lang.interactive) {
        await runInteractive([]);
      } else {
        await runPlain();
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setOutput(`Xatolik: ${e.message}`);
    }
    setRunning(false);
  }

  /** Inline input yuborish — buffer'ga qo'shib qayta bajarish */
  async function submitInline() {
    const value = inlineValue;
    setInlineValue("");
    setAwaitingInput(false);
    // Darhol vizual echo (qayta bajarilganda haqiqiy stdout bilan almashadi)
    setOutput(prev => prev + value + "\n");
    inputsRef.current = [...inputsRef.current, value];
    setRunning(true);
    try {
      await runInteractive(inputsRef.current);
    } catch (e: any) {
      if (e?.name !== "AbortError") setOutput(`Xatolik: ${e.message}`);
    }
    setRunning(false);
  }

  /** Interaktiv sessiyani bekor qilish */
  function cancelInteractive() {
    setAwaitingInput(false);
    setOutput(prev => prev + "\n^C (kiritish bekor qilindi)");
    inputsRef.current = [];
  }

  // Ctrl/Cmd + Enter — bajarish
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!running && !awaitingInput) handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, awaitingInput, code, lang, stdin]);

  return (
    // Balandlik ota-konteynerdan keladi (layout playground uchun to'g'ri o'lchamli konteyner beradi)
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 pb-3 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
            <Terminal className="w-4.5 h-4.5 text-neon-purple" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">Playground</h1>
            <p className="text-[11px] text-muted-foreground leading-tight">{t.cabinet.play.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Til tanlash */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border/60 hover:border-border text-sm transition-all"
            >
              <LanguageLogo lang={lang.id} size={16} />
              <span className="font-medium">{lang.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-11 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 p-1.5">
                  {languages.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => switchLang(l)}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                        lang.id === l.id ? "bg-neon-purple/10 text-neon-purple" : "hover:bg-accent"
                      )}
                    >
                      <LanguageLogo lang={l.id} size={18} />
                      <span className="flex-1 text-left font-medium">{l.label}</span>
                      {l.version && <span className="text-[10px] text-muted-foreground">{l.version}</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Semantik ko'prik va Bilim xaritasi */}
          <button
            onClick={() => setShowSemanticBridge(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 text-xs font-semibold transition shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">{t.semanticBridge.toggleBtn}</span>
          </button>

          <button
            onClick={() => setShowKnowledgeGraph(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-card text-xs font-semibold transition"
          >
            <Network className="w-4 h-4 text-neon-purple" />
            <span className="hidden sm:inline">{t.misconceptions.openGraph}</span>
          </button>

          <button
            onClick={handleRun}
            disabled={running || awaitingInput}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-green text-white font-semibold text-sm hover:bg-neon-green/90 disabled:opacity-50 transition-all shadow-lg shadow-neon-green/20"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? t.cabinet.play.running : t.cabinet.play.run}
          </button>
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] text-muted-foreground px-2 py-1.5 rounded-lg border border-border/40 bg-surface/60 font-mono">
            Ctrl+Enter
          </kbd>
        </div>
      </div>

      {/* Misconception Alert if detected */}
      {misconception && (
        <div className="mb-3">
          <MisconceptionAlert rule={misconception.rule} onClose={() => setMisconception(null)} />
        </div>
      )}

      {/* Editor + Output */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 rounded-2xl border border-border/50 overflow-hidden bg-card/30">
        {/* Editor panel */}
        <div className="flex-1 flex flex-col lg:border-r border-border/30 min-w-0 min-h-[300px]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-surface/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-red/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-neon-green/50" />
              </div>
              <div className="flex items-center gap-1.5">
                <LanguageLogo lang={lang.id} size={14} />
                <span className="text-xs font-mono text-muted-foreground">
                  {lang.id === "html" ? "index.html"
                    : lang.id === "java" ? "Main.java"
                    : lang.id === "csharp" ? "Program.cs"
                    : lang.id === "c++" ? "main.cpp"
                    : lang.id === "typescript" ? "main.ts"
                    : "main." + lang.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-1.5 hover:bg-accent rounded-lg"
                title={t.cabinet.play.copy}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              <button
                onClick={() => {
                  setCode(lang.starter);
                  setOutput("");
                  setStdin("");
                  setShowHtml(false);
                  setMeta({});
                  setAwaitingInput(false);
                  inputsRef.current = [];
                }}
                className="p-1.5 hover:bg-accent rounded-lg"
                title={t.cabinet.play.reset}
              >
                <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={lang.monaco}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Stdin (faqat interaktiv bo'lmagan tillar uchun) */}
          {lang.id !== "html" && !lang.interactive && (
            <div className="border-t border-border/30 flex-shrink-0">
              <button
                onClick={() => setStdinOpen(!stdinOpen)}
                className={cn(
                  "w-full px-4 py-2 flex items-center justify-between text-left transition-colors",
                  needsStdin && !stdin.trim() && "bg-neon-yellow/[0.04]",
                )}
              >
                <div className="flex items-center gap-2">
                  <Keyboard className={cn("w-3.5 h-3.5", needsStdin && !stdin.trim() ? "text-neon-yellow" : "text-muted-foreground")} />
                  <span className="text-xs font-medium">{t.cabinet.play.stdinLabel}</span>
                  {needsStdin && !stdin.trim() && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-neon-yellow font-semibold px-2 py-0.5 rounded-full bg-neon-yellow/10 border border-neon-yellow/20">
                      <AlertCircle className="w-3 h-3" /> {t.cabinet.play.stdinNeeded}
                    </span>
                  )}
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", (stdinOpen || needsStdin) && "rotate-180")} />
              </button>
              {(stdinOpen || needsStdin) && (
                <div className="px-4 pb-3">
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    className="w-full bg-surface/40 border border-border/50 rounded-lg px-3 py-2 text-sm font-mono resize-y min-h-[48px] max-h-32 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/30 transition-colors"
                    placeholder={t.cabinet.play.stdinPlaceholder}
                    spellCheck={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Output panel — terminal */}
        <div className="flex-1 flex flex-col min-w-0 lg:max-w-[46%] min-h-[220px]">
          <div className="px-4 py-2.5 border-b border-border/30 bg-surface/30 flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              {lang.id === "html" && showHtml ? (
                <Globe className="w-4 h-4 text-neon-blue" />
              ) : (
                <Terminal className="w-4 h-4 text-neon-green" />
              )}
              <span className="text-sm font-medium">
                {lang.id === "html" && showHtml ? t.cabinet.play.preview : t.cabinet.play.terminal}
              </span>
              {awaitingInput && (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-neon-blue font-semibold px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 animate-pulse">
                  {t.cabinet.play.awaitingInput}
                </span>
              )}
            </div>
            {meta.provider && (
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  {meta.provider === "judge0" ? "Judge0" : "Piston"}
                </span>
                {meta.time && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />{meta.time}s
                  </span>
                )}
              </div>
            )}
          </div>
          {meta.warning && (
            <div className="px-4 py-2 bg-neon-yellow/5 border-b border-neon-yellow/20 text-[11px] text-neon-yellow">
              {meta.warning}
            </div>
          )}
          <div ref={consoleRef} className="flex-1 min-h-0 overflow-auto bg-[#0d1117]">
            {lang.id === "html" && showHtml ? (
              <iframe
                srcDoc={code}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="p-4 font-mono text-sm leading-relaxed">
                <pre className="whitespace-pre-wrap text-[#c9d1d9] inline">
                  {output || (running ? "" : t.cabinet.play.hint)}
                </pre>

                {/* Inline input — dastur kiritish kutayotganda terminal ichida.
                    C++ kabi EOF'ni xatosiz o'tkazadigan tillarda esa natijadan
                    keyin ham qiymat qo'shish mumkin (kiritilgach qayta bajariladi) */}
                {(awaitingInput ||
                  (!running && !!output && lang.interactive && !lang.eofPattern && !!lang.stdinPattern?.test(code))) && (
                  <form
                    className="inline-flex items-center gap-1"
                    onSubmit={(e) => { e.preventDefault(); submitInline(); }}
                  >
                    <input
                      ref={inlineRef}
                      value={inlineValue}
                      onChange={(e) => setInlineValue(e.target.value)}
                      className="bg-transparent border-b border-neon-blue/60 outline-none text-neon-blue font-mono text-sm min-w-[120px] max-w-[300px] caret-neon-blue"
                      autoFocus
                      spellCheck={false}
                      aria-label={t.cabinet.play.programInput}
                    />
                    <button type="submit" className="text-neon-blue/70 hover:text-neon-blue p-0.5" title={t.cabinet.play.submitEnter}>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={cancelInteractive} className="text-muted-foreground/50 hover:text-neon-red p-0.5" title={t.cabinet.play.cancel}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {running && !awaitingInput && (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> bajarilmoqda...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SemanticBridgeModal
        open={showSemanticBridge}
        onClose={() => setShowSemanticBridge(false)}
        currentCode={code}
      />

      <KnowledgeGraphModal
        open={showKnowledgeGraph}
        onClose={() => setShowKnowledgeGraph(false)}
      />
    </div>
  );
}
