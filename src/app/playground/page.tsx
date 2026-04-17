"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Editor from "@monaco-editor/react";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import {
  Play,
  Loader2,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Globe,
  Code2,
  Moon,
  Sun,
  ChevronDown,
  Cpu,
  Clock,
  LayoutDashboard,
  LogOut,
  AlertCircle,
  Keyboard,
} from "lucide-react";
import { LanguageLogo } from "@/components/icons/LanguageLogo";

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
};

const languages: Lang[] = [
  {
    id: "python",
    label: "Python",
    monaco: "python",
    version: "3.10",
    api: true,
    stdinPattern: /(^|\W)input\s*\(/,
    starter: `# Python Playground
# Agar kodda input() bo'lsa — qiymatlarni pastdagi "Kirish" oynasiga yozing
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

export default function PlaygroundPage() {
  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>(languages[0]);
  const [code, setCode] = useState(languages[0].starter);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stdin, setStdin] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [meta, setMeta] = useState<{ provider?: string; time?: string; memory?: number; warning?: string }>({});
  const [stdinFocused, setStdinFocused] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Foydalanuvchi holatini olish
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, role")
          .eq("id", session.user.id)
          .single();
        if (p) setUser({ name: p.full_name, avatar: p.avatar_url, role: p.role });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kod tarkibida input() bor-yo'qligini aniqlash
  const needsStdin = useMemo(() => {
    if (!lang.stdinPattern) return false;
    return lang.stdinPattern.test(code);
  }, [code, lang.stdinPattern]);

  async function handleLogout() {
    await supabase.auth.signOut();
    document.cookie = "user-role=; path=/; max-age=0";
    setUser(null);
    setUserMenuOpen(false);
  }

  const dashboardUrl =
    user?.role === "admin" ? "/a-dashboard" : user?.role === "teacher" ? "/t-dashboard" : "/dashboard";

  function switchLang(l: Lang) {
    setLang(l);
    setCode(l.starter);
    setOutput("");
    setStdin("");
    setShowHtml(false);
    setLangOpen(false);
    setMeta({});
  }

  const runOnApi = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const res = await fetch("/api/playground/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: lang.id, code, stdin }),
      signal: ctrl.signal,
    });
    const data = await res.json();

    setMeta({
      provider: data.provider,
      time: data.time,
      memory: data.memory,
      warning: data.warning,
    });

    if (data.error) {
      setOutput(`Server xatolik: ${data.error}`);
      return;
    }

    const out = data.stdout || "";
    const err = data.stderr || "";
    if (err) {
      setOutput(`${err}${out ? "\n\n" + out : ""}`);
    } else if (data.status === "timeout") {
      setOutput("Vaqt limiti tugadi (timeout)");
    } else {
      setOutput(out || "(natija bo'sh)");
    }
  }, [lang.id, code, stdin]);

  async function handleRun() {
    setRunning(true);
    setOutput("");
    setShowHtml(false);
    setMeta({});
    try {
      if (lang.id === "html") {
        setShowHtml(true);
        setOutput("HTML natijasi o'ng panelda ko'rsatilgan");
      } else {
        await runOnApi();
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setOutput(`Xatolik: ${e.message}`);
      }
    }
    setRunning(false);
  }

  // Ctrl/Cmd + Enter — bajarish
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!running) handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, code, lang.id, stdin]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 mr-2">
            <div className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold hidden sm:block">
              Edu<span className="gradient-text">Code</span>
            </span>
          </Link>
          <div className="h-5 w-px bg-border/60" />
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-neon-purple" />
            <span className="font-display font-semibold text-sm">Playground</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Til tanlash */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border/60 hover:border-border text-sm transition-all"
            >
              <LanguageLogo lang={lang.id} size={16} />
              <span className="font-medium">{lang.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-10 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 p-1.5">
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

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-accent rounded-lg text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-surface hover:bg-surface-hover border border-border/60 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[10px] overflow-hidden">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-11 w-52 bg-card p-1.5 rounded-xl shadow-2xl z-50 border border-border/60">
                    <Link
                      href={dashboardUrl}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neon-red hover:bg-neon-red/8 w-full transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Chiqish
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/register"
              className="hidden sm:inline-flex px-4 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-all"
            >
              Ro'yxatdan o'tish
            </Link>
          )}
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Editor panel */}
        <div className="flex-1 flex flex-col border-r border-border/30 min-w-0">
          {/* Editor toolbar */}
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
                  {lang.id === "html"
                    ? "index.html"
                    : lang.id === "java"
                    ? "Main.java"
                    : lang.id === "csharp"
                    ? "Program.cs"
                    : lang.id === "c++"
                    ? "main.cpp"
                    : lang.id === "typescript"
                    ? "main.ts"
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
                title="Nusxa olish"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-neon-green" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => {
                  setCode(lang.starter);
                  setOutput("");
                  setStdin("");
                  setShowHtml(false);
                  setMeta({});
                }}
                className="p-1.5 hover:bg-accent rounded-lg"
                title="Qayta yuklash"
              >
                <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[300px]">
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

          {/* Bottom bar: stdin + run */}
          <div className="border-t border-border/30 flex-shrink-0">
            {lang.id !== "html" && (
              <div
                className={cn(
                  "px-4 py-3 border-b border-border/20 transition-colors",
                  stdinFocused && "bg-neon-purple/[0.03]",
                  needsStdin && !stdin.trim() && "bg-neon-yellow/[0.04]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center border",
                        needsStdin && !stdin.trim()
                          ? "bg-neon-yellow/10 border-neon-yellow/30 text-neon-yellow"
                          : "bg-surface border-border/60 text-muted-foreground"
                      )}
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold leading-tight">
                        Kirish qiymatlari (stdin)
                      </div>
                      <div className="text-[11px] text-muted-foreground leading-tight">
                        {needsStdin
                          ? "Kodingiz foydalanuvchi kiritishini kutmoqda — qiymatlarni yozib, keyin Ishga tushirish bosing"
                          : "Agar kodingiz input() chaqirsa, qiymatlarni bu yerga yozing"}
                      </div>
                    </div>
                  </div>
                  {needsStdin && !stdin.trim() && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-neon-yellow font-semibold px-2 py-0.5 rounded-full bg-neon-yellow/10 border border-neon-yellow/20">
                      <AlertCircle className="w-3 h-3" /> kerak
                    </span>
                  )}
                </div>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  onFocus={() => setStdinFocused(true)}
                  onBlur={() => setStdinFocused(false)}
                  className={cn(
                    "w-full bg-surface/40 border rounded-lg px-3 py-2 text-sm font-mono resize-y min-h-[56px] max-h-40 placeholder:text-muted-foreground/50 focus:outline-none transition-colors",
                    needsStdin && !stdin.trim()
                      ? "border-neon-yellow/30 focus:ring-2 focus:ring-neon-yellow/30 focus:border-neon-yellow/50"
                      : "border-border/50 focus:ring-2 focus:ring-neon-purple/30 focus:border-neon-purple/40"
                  )}
                  placeholder={
                    lang.id === "python"
                      ? "Ali\n20"
                      : lang.id === "c++" || lang.id === "csharp" || lang.id === "java"
                      ? "5 10"
                      : "Har bir qator — yangi input() uchun qiymat"
                  }
                  spellCheck={false}
                />
              </div>
            )}
            <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
              <button
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-green text-white font-semibold text-sm hover:bg-neon-green/90 disabled:opacity-50 transition-all shadow-lg shadow-neon-green/20"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {running ? "Bajarilmoqda..." : "Ishga tushirish"}
              </button>
              <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] text-muted-foreground px-2 py-1 rounded border border-border/40 bg-surface/60 font-mono">
                Ctrl + Enter
              </kbd>
              <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
                {lang.id === "html" ? "Natija o'ngda" : "Judge0 + Piston (fallback)"}
              </span>
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex-1 flex flex-col min-w-0 lg:max-w-[50%]">
          <div className="px-4 py-2.5 border-b border-border/30 bg-surface/30 flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              {lang.id === "html" && showHtml ? (
                <Globe className="w-4 h-4 text-neon-blue" />
              ) : (
                <Terminal className="w-4 h-4 text-neon-green" />
              )}
              <span className="text-sm font-medium">
                {lang.id === "html" && showHtml ? "Ko'rinish (Preview)" : "Natija (Output)"}
              </span>
            </div>
            {meta.provider && (
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  {meta.provider === "judge0" ? "Judge0" : "Piston"}
                </span>
                {meta.time && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {meta.time}s
                  </span>
                )}
                {typeof meta.memory === "number" && <span>{Math.round(meta.memory / 1024)}MB</span>}
              </div>
            )}
          </div>
          {meta.warning && (
            <div className="px-4 py-2 bg-neon-yellow/5 border-b border-neon-yellow/20 text-[11px] text-neon-yellow">
              {meta.warning}
            </div>
          )}
          <div className="flex-1 min-h-[200px]">
            {lang.id === "html" && showHtml ? (
              <iframe
                srcDoc={code}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap text-muted-foreground overflow-auto h-full leading-relaxed">
                {output || '"Ishga tushirish" tugmasini bosing yoki Ctrl+Enter bosing...'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
