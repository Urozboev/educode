"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Play, Loader2, RotateCcw, Copy, Check, Terminal, Globe, Code2, Moon, Sun, ArrowLeft, ChevronDown } from "lucide-react";

const languages = [
  { id: "python", label: "Python", monaco: "python", version: "3.10.0", icon: "🐍", starter: '# Python Playground\nprint("Salom, Dunyo!")\n\n# input() dan foydalanish:\nism = input("Ismingiz: ")\nprint(f"Xush kelibsiz, {ism}!")' },
  { id: "javascript", label: "JavaScript", monaco: "javascript", version: "18.15.0", icon: "📜", starter: '// JavaScript Playground\nconsole.log("Salom, Dunyo!");\n\nconst arr = [1, 2, 3, 4, 5];\nconst sum = arr.reduce((a, b) => a + b, 0);\nconsole.log(`Yig\'indi: ${sum}`);' },
  { id: "typescript", label: "TypeScript", monaco: "typescript", version: "5.0.3", icon: "🔷", starter: '// TypeScript Playground\nconst greet = (name: string): string => {\n  return `Salom, ${name}!`;\n};\nconsole.log(greet("TypeScript"));' },
  { id: "c++", label: "C++", monaco: "cpp", version: "10.2.0", icon: "⚙️", piston: "c++", starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Salom, Dunyo!" << endl;\n    \n    int a = 10, b = 20;\n    cout << "Yig\'indi: " << a + b << endl;\n    return 0;\n}' },
  { id: "java", label: "Java", monaco: "java", version: "15.0.2", icon: "☕", piston: "java", starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Salom, Dunyo!");\n        \n        int[] arr = {1, 2, 3, 4, 5};\n        int sum = 0;\n        for (int n : arr) sum += n;\n        System.out.println("Yig\'indi: " + sum);\n    }\n}' },
  { id: "csharp", label: "C#", monaco: "csharp", version: "6.12.0", icon: "🟣", piston: "csharp.net", starter: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Salom, Dunyo!");\n        \n        int[] arr = {1, 2, 3, 4, 5};\n        int sum = 0;\n        foreach (int n in arr) sum += n;\n        Console.WriteLine($"Yig\'indi: {sum}");\n    }\n}' },
  { id: "html", label: "HTML/CSS", monaco: "html", version: "", icon: "🌐", starter: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    * { margin: 0; box-sizing: border-box; }\n    body {\n      font-family: system-ui, sans-serif;\n      background: linear-gradient(135deg, #1a1a2e, #16213e);\n      color: #fff;\n      min-height: 100vh;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .card {\n      background: rgba(255,255,255,0.05);\n      border: 1px solid rgba(255,255,255,0.1);\n      border-radius: 16px;\n      padding: 40px;\n      text-align: center;\n      backdrop-filter: blur(10px);\n    }\n    h1 { color: #6C5CE7; font-size: 2rem; margin-bottom: 8px; }\n    p { color: rgba(255,255,255,0.6); }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>Salom, Dunyo!</h1>\n    <p>HTML va CSS bilan ishlash</p>\n  </div>\n</body>\n</html>' },
];

export default function PlaygroundPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState(languages[0]);
  const [code, setCode] = useState(languages[0].starter);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stdin, setStdin] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);

  useEffect(() => { setMounted(true); loadPyodide(); }, []);

  function switchLang(l: typeof languages[0]) { setLang(l); setCode(l.starter); setOutput(""); setShowHtml(false); setLangOpen(false); }

  async function loadPyodide() {
    try {
      if (!(window as any).loadPyodide) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        s.onload = async () => { pyodideRef.current = await (window as any).loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" }); setPyReady(true); };
        document.head.appendChild(s);
      } else {
        if (!pyodideRef.current) pyodideRef.current = await (window as any).loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
        setPyReady(true);
      }
    } catch (_e) { /* */ }
  }

  async function runPython() {
    if (!pyodideRef.current) { setOutput("⏳ Python yuklanmoqda..."); return; }
    try {
      pyodideRef.current.globals.set("__user_code__", code);
      pyodideRef.current.globals.set("__user_stdin__", stdin);
      pyodideRef.current.runPython(`
import sys; from io import StringIO
sys.stdin = StringIO(__user_stdin__)
__c__ = StringIO(); sys.stdout = __c__; __e__ = ""
try:\n    exec(__user_code__, {"__builtins__": __builtins__, "input": lambda p="": (sys.stderr.write("") or "") if not p else p and sys.stdin.readline().strip() if True else sys.stdin.readline().strip()})
except Exception as e: __e__ = type(e).__name__ + ": " + str(e)
sys.stdout = sys.__stdout__; __ro__ = __c__.getvalue(); __re__ = __e__
`);
      // Fix: proper input handling
      pyodideRef.current.globals.set("__user_code__", code);
      pyodideRef.current.globals.set("__user_stdin__", stdin);
      pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdin = StringIO(__user_stdin__)
_out = StringIO()
sys.stdout = _out
_err = ""
try:
    exec(__user_code__, {"__builtins__": __builtins__, "input": lambda p="": sys.stdin.readline().strip()})
except Exception as e:
    _err = type(e).__name__ + ": " + str(e)
sys.stdout = sys.__stdout__
__ro__ = _out.getvalue()
__re__ = _err
`);
      const out = pyodideRef.current.globals.get("__ro__") || "";
      const err = pyodideRef.current.globals.get("__re__") || "";
      setOutput(err ? `❌ ${err}${out ? "\n\n" + out : ""}` : out || "(bo'sh natija)");
    } catch (e: any) { setOutput(`❌ ${e.message}`); }
  }

  async function runJS() {
    return new Promise<void>((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none"; iframe.sandbox.add("allow-scripts");
      document.body.appendChild(iframe);
      const t = setTimeout(() => { try { document.body.removeChild(iframe); } catch (_e) { /* */ } setOutput("⏱ Vaqt limiti (5s)"); resolve(); }, 5000);
      const h = (e: MessageEvent) => {
        if (e.data?.type === "pg_r") {
          clearTimeout(t); window.removeEventListener("message", h);
          try { document.body.removeChild(iframe); } catch (_e) { /* */ }
          setOutput(e.data.r.err ? `❌ ${e.data.r.err}${e.data.r.out ? "\n\n" + e.data.r.out : ""}` : e.data.r.out || "(bo'sh natija)");
          resolve();
        }
      };
      window.addEventListener("message", h);
      const lines = JSON.stringify(stdin.split("\n"));
      iframe.srcdoc = `<script>var _o=[];console.log=function(){_o.push([].slice.call(arguments).map(String).join(" "))};var _l=${lines},_i=0;function prompt(){return _l[_i++]||""}var readline=prompt;var input=prompt;try{${code};parent.postMessage({type:"pg_r",r:{out:_o.join("\\n"),err:""}},"*")}catch(e){parent.postMessage({type:"pg_r",r:{out:_o.join("\\n"),err:e.message}},"*")}<\/script>`;
    });
  }

  async function runPiston() {
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang.piston || lang.id, version: lang.version, files: [{ content: code }], stdin }),
      });
      const data = await res.json();
      if (data.run) {
        const out = data.run.stdout || ""; const err = data.run.stderr || "";
        setOutput(err ? `❌ ${err}${out ? "\n\n" + out : ""}` : out || "(bo'sh natija)");
      } else { setOutput("❌ " + JSON.stringify(data)); }
    } catch (e: any) { setOutput(`❌ Server xatolik: ${e.message}`); }
  }

  async function handleRun() {
    setRunning(true); setOutput(""); setShowHtml(false);
    try {
      if (lang.id === "python") await runPython();
      else if (lang.id === "javascript" || lang.id === "typescript") await runJS();
      else if (lang.id === "html") { setShowHtml(true); setOutput("✅ HTML natijasi o'ng panelda ko'rsatilgan"); }
      else await runPiston();
    } catch (e: any) { setOutput(`❌ ${e.message}`); }
    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 mr-2">
            <div className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center"><Code2 className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-display font-bold hidden sm:block">Edu<span className="gradient-text">Code</span></span>
          </Link>
          <div className="h-5 w-px bg-border/60" />
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-neon-purple" />
            <span className="font-display font-semibold text-sm">Playground</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Til tanlash dropdown */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border/60 hover:border-border text-sm transition-all">
              <span>{lang.icon}</span> <span className="font-medium">{lang.label}</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            {langOpen && (<>
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              <div className="absolute right-0 top-10 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 p-1.5">
                {languages.map(l => (
                  <button key={l.id} onClick={() => switchLang(l)}
                    className={cn("flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                      lang.id === l.id ? "bg-neon-purple/10 text-neon-purple" : "hover:bg-accent")}>
                    <span>{l.icon}</span> {l.label}
                  </button>
                ))}
              </div>
            </>)}
          </div>

          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 hover:bg-accent rounded-lg text-muted-foreground">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <Link href="/register" className="hidden sm:inline-flex px-4 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-all">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Editor panel */}
        <div className="flex-1 flex flex-col border-r border-border/30 min-w-0">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-surface/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neon-red/50" /><div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/50" /><div className="w-2.5 h-2.5 rounded-full bg-neon-green/50" /></div>
              <span className="text-xs font-mono text-muted-foreground">{lang.icon} {lang.id === "html" ? "index.html" : lang.id === "java" ? "Main.java" : lang.id === "csharp" ? "Program.cs" : lang.id === "c++" ? "main.cpp" : lang.id === "typescript" ? "main.ts" : "main." + lang.id}</span>
              {lang.id === "python" && <span className={cn("text-[10px] px-2 py-0.5 rounded-full", pyReady ? "bg-neon-green/10 text-neon-green" : "bg-neon-yellow/10 text-neon-yellow")}>{pyReady ? "✓ Tayyor" : "⏳ Yuklanmoqda..."}</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-1.5 hover:bg-accent rounded-lg">
                {copied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              <button onClick={() => { setCode(lang.starter); setOutput(""); setShowHtml(false); }} className="p-1.5 hover:bg-accent rounded-lg"><RotateCcw className="w-3.5 h-3.5 text-muted-foreground" /></button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[300px]">
            <Editor height="100%" language={lang.monaco} value={code} onChange={v => setCode(v || "")} theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 15, fontFamily: "'JetBrains Mono', monospace", lineNumbers: "on", scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, padding: { top: 16, bottom: 16 }, renderLineHighlight: "line", cursorBlinking: "smooth", smoothScrolling: true }} />
          </div>

          {/* Bottom bar: stdin + run */}
          <div className="border-t border-border/30 flex-shrink-0">
            {lang.id !== "html" && (
              <div className="px-4 py-2 border-b border-border/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Terminal className="w-3 h-3" /> Kirish (stdin)</div>
                <textarea value={stdin} onChange={e => setStdin(e.target.value)} className="w-full bg-transparent border border-border/40 rounded-lg px-3 py-2 text-sm font-mono resize-none h-12 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 focus:border-neon-purple/30" placeholder="Qiymatlarni kiriting (har bir qator alohida)..." />
              </div>
            )}
            <div className="px-4 py-2.5 flex items-center gap-2">
              <button onClick={handleRun} disabled={running || (lang.id === "python" && !pyReady)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-green text-white font-semibold text-sm hover:bg-neon-green/90 disabled:opacity-50 transition-all shadow-sm">
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {running ? "Bajarilmoqda..." : "Ishga tushirish"}
              </button>
              <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
                {lang.id === "python" || lang.id === "javascript" ? "Brauzerda bajariladi" : lang.id === "html" ? "Natija o'ngda" : "Piston API orqali"}
              </span>
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex-1 flex flex-col min-w-0 lg:max-w-[50%]">
          <div className="px-4 py-2.5 border-b border-border/30 bg-surface/30 flex items-center gap-2 flex-shrink-0">
            {lang.id === "html" && showHtml ? <Globe className="w-4 h-4 text-neon-blue" /> : <Terminal className="w-4 h-4 text-neon-green" />}
            <span className="text-sm font-medium">{lang.id === "html" && showHtml ? "Ko'rinish (Preview)" : "Natija (Output)"}</span>
          </div>
          <div className="flex-1 min-h-[200px]">
            {lang.id === "html" && showHtml ? (
              <iframe srcDoc={code} className="w-full h-full border-0 bg-white" sandbox="allow-scripts allow-same-origin" />
            ) : (
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap text-muted-foreground overflow-auto h-full leading-relaxed">
                {output || "\"Ishga tushirish\" tugmasini bosing yoki Ctrl+Enter bosing..."}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
