"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { SupportedLanguage, TestCase, SubmissionTestResult } from "@/types";
import { Play, RotateCcw, CheckCircle2, XCircle, Clock, Loader2, Sparkles, Copy, Check, Send, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  language: SupportedLanguage;
  starterCode?: string;
  testCases?: TestCase[];
  taskId?: string;
  taskType?: "topic_task" | "challenge";
  onSubmit?: (code: string, results: SubmissionTestResult[]) => void;
  onAIFeedback?: (code: string, results: SubmissionTestResult[]) => void;
  readOnly?: boolean;
  height?: string;
}

export default function CodeEditor({
  language, starterCode = "", testCases = [], taskId, taskType,
  onSubmit, onAIFeedback, readOnly = false, height = "400px",
}: CodeEditorProps) {
  const supabase = createClient();
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<SubmissionTestResult[]>([]);
  const [activeTab, setActiveTab] = useState<"output" | "tests">("output");
  const [pyodideReady, setPyodideReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => { if (language === "python") loadPyodide(); }, [language]);

  async function loadPyodide() {
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = async () => {
          pyodideRef.current = await (window as any).loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
          setPyodideReady(true);
        };
        document.head.appendChild(script);
      } else {
        if (!pyodideRef.current) pyodideRef.current = await (window as any).loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
        setPyodideReady(true);
      }
    } catch (err) { console.error("Pyodide:", err); }
  }

  // ===== PYTHON ISHGA TUSHIRISH =====
  // globals orqali string uzatish — indent muammosi BO'LMAYDI
  async function runPython(src: string, stdin: string = ""): Promise<{ stdout: string; stderr: string; time_ms: number }> {
    if (!pyodideRef.current) throw new Error("Pyodide tayyor emas");
    const t0 = performance.now();
    try {
      pyodideRef.current.globals.set('__user_code__', src);
      pyodideRef.current.globals.set('__user_stdin__', stdin);
      pyodideRef.current.runPython(`
import sys
from io import StringIO

sys.stdin = StringIO(__user_stdin__)
__capture__ = StringIO()
sys.stdout = __capture__
__run_err__ = ""

try:
    exec(__user_code__, {"__builtins__": __builtins__, "input": lambda p="": sys.stdin.readline().strip()})
except Exception as __e__:
    __run_err__ = type(__e__).__name__ + ": " + str(__e__)

sys.stdout = sys.__stdout__
__run_stdout__ = __capture__.getvalue()
`);
      const stdout = pyodideRef.current.globals.get('__run_stdout__') || '';
      const stderr = pyodideRef.current.globals.get('__run_err__') || '';
      return { stdout, stderr, time_ms: Math.round(performance.now() - t0) };
    } catch (err: any) {
      return { stdout: "", stderr: err.message || String(err), time_ms: Math.round(performance.now() - t0) };
    }
  }

  // ===== JAVASCRIPT ISHGA TUSHIRISH =====
  async function runJS(src: string, stdin: string = ""): Promise<{ stdout: string; stderr: string; time_ms: number }> {
    return new Promise((resolve) => {
      const t0 = performance.now();
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.sandbox.add("allow-scripts");
      document.body.appendChild(iframe);
      const timeout = setTimeout(() => { try { document.body.removeChild(iframe); } catch (_e) { /* */ } resolve({ stdout: "", stderr: "Vaqt limiti (5s)", time_ms: 5000 }); }, 5000);
      const handler = (e: MessageEvent) => {
        if (e.data?.type === "exec_done") {
          clearTimeout(timeout); window.removeEventListener("message", handler);
          try { document.body.removeChild(iframe); } catch (_e) { /* */ }
          resolve({ ...e.data.r, time_ms: Math.round(performance.now() - t0) });
        }
      };
      window.addEventListener("message", handler);
      const lines = JSON.stringify(stdin.split("\n"));
      iframe.srcdoc = `<script>
var _o=[];var _olog=console.log;console.log=function(){_o.push([].slice.call(arguments).map(String).join(' '))};
var _l=${lines},_i=0;function prompt(){return _l[_i++]||''}var readline=prompt;var input=prompt;
try{${src};parent.postMessage({type:'exec_done',r:{stdout:_o.join('\\n'),stderr:''}},'*')}
catch(e){parent.postMessage({type:'exec_done',r:{stdout:_o.join('\\n'),stderr:e.message}},'*')}
<\/script>`;
    });
  }

  async function runCode(src: string, stdin: string = "") {
    return language === "python" ? runPython(src, stdin) : runJS(src, stdin);
  }

  // ===== ODDIY ISHGA TUSHIRISH (testlarsiz) =====
  async function handleRun() {
    setIsRunning(true); setOutput(""); setTestResults([]);
    try {
      // Birinchi test input ni stdin sifatida berish (agar mavjud bo'lsa)
      const defaultStdin = testCases.length > 0 ? testCases[0].input : "";
      const r = await runCode(code, defaultStdin);
      if (r.stderr) setOutput(`❌ Xatolik:\n${r.stderr}\n\n⏱ ${r.time_ms}ms`);
      else setOutput(`${r.stdout}\n\n⏱ ${r.time_ms}ms`);
    } catch (err: any) { setOutput(`❌ ${err.message}`); }
    setIsRunning(false);
  }

  // ===== BARCHA TESTLARNI TEKSHIRISH =====
  async function handleRunTests() {
    if (testCases.length === 0) { toast.info("Test mavjud emas"); return; }
    setIsRunning(true); setTestResults([]); setActiveTab("tests");
    const results: SubmissionTestResult[] = [];
    for (const tc of testCases) {
      try {
        const r = await runCode(code, tc.input);
        const actual = r.stdout.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
        const expected = tc.expected_output.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
        results.push({ input: tc.input, expected: tc.expected_output.trim(), actual: r.stderr ? `Xatolik: ${r.stderr}` : r.stdout.trim(), passed: !r.stderr && actual === expected, time_ms: r.time_ms });
      } catch (err: any) {
        results.push({ input: tc.input, expected: tc.expected_output.trim(), actual: `Xatolik: ${err.message}`, passed: false, time_ms: 0 });
      }
    }
    setTestResults(results);
    const passed = results.filter(r => r.passed).length;
    if (passed === results.length) setOutput(`✅ Barcha ${results.length} ta test o'tdi!`);
    else setOutput(`⚠️ ${passed}/${results.length} test o'tdi.`);
    setIsRunning(false);
  }

  // ===== YUBORISH — DB GA SAQLASH + COIN/XP =====
  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 1. Avval testlarni ishga tushirish
    let results = testResults;
    if (testCases.length > 0) {
      setActiveTab("tests");
      const newResults: SubmissionTestResult[] = [];
      for (const tc of testCases) {
        try {
          const r = await runCode(code, tc.input);
          const actual = r.stdout.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
          const expected = tc.expected_output.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
          newResults.push({ input: tc.input, expected: tc.expected_output.trim(), actual: r.stderr ? `Xatolik: ${r.stderr}` : r.stdout.trim(), passed: !r.stderr && actual === expected, time_ms: r.time_ms });
        } catch (err: any) {
          newResults.push({ input: tc.input, expected: tc.expected_output.trim(), actual: `Xatolik: ${err.message}`, passed: false, time_ms: 0 });
        }
      }
      results = newResults;
      setTestResults(results);
    }

    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const allPassed = total > 0 && passed === total;
    const status = total === 0 ? 'accepted' : (allPassed ? 'accepted' : 'wrong_answer');

    // 2. User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Tizimga kiring"); setIsSubmitting(false); return; }

    // 3. Submission saqlash
    const { error: subErr } = await supabase.from('submissions').insert({
      user_id: user.id, task_id: taskId, task_type: taskType || 'topic_task',
      code, language, status, passed_tests: passed, total_tests: total, test_results: results,
    });
    if (subErr) { toast.error(`Saqlash xatolik: ${subErr.message}`); setIsSubmitting(false); return; }

    // 4. Challenge uchun coin/XP berish (TO'G'RIDAN-TO'G'RI)
    if (allPassed && taskType === 'challenge' && taskId) {
      // Oldin yechganmi tekshirish
      const { count } = await supabase.from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('task_id', taskId).eq('status', 'accepted');

      if ((count || 0) <= 1) {
        // Birinchi marta yechdi — mukofot berish
        const { data: challenge } = await supabase.from('challenges')
          .select('coin_reward, xp_reward, solved_count, title').eq('id', taskId).single();
        const { data: profile } = await supabase.from('profiles')
          .select('coins, xp').eq('id', user.id).single();

        if (challenge && profile) {
          const coinReward = challenge.coin_reward || 5;
          const xpReward = challenge.xp_reward || 15;
          const newCoins = profile.coins + coinReward;
          const newXp = profile.xp + xpReward;

          await supabase.from('profiles').update({ coins: newCoins, xp: newXp }).eq('id', user.id);
          await supabase.from('coin_transactions').insert({
            user_id: user.id, amount: coinReward, type: 'challenge_complete',
            reference_id: taskId, description: `"${challenge.title}" bajarildi`,
            balance_after: newCoins,
          });
          await supabase.from('challenges').update({
            solved_count: (challenge.solved_count || 0) + 1,
          }).eq('id', taskId);

          toast.success(`Barcha testlar o'tdi! +${coinReward} coin, +${xpReward} XP 🎉`);
        } else {
          toast.success("Barcha testlar o'tdi! ✅");
        }
      } else {
        toast.success("Barcha testlar o'tdi! (oldin yechilgan)");
      }
    } else if (allPassed) {
      toast.success("Barcha testlar o'tdi! ✅");
    } else {
      toast.info(`${passed}/${total} test o'tdi. Qayta urinib ko'ring.`);
    }

    if (onSubmit) onSubmit(code, results);
    setIsSubmitting(false);
  }

  function handleCopy() { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  function handleReset() { setCode(starterCode); setOutput(""); setTestResults([]); }

  const passedCount = testResults.filter(r => r.passed).length;
  const allPassed = testResults.length > 0 && passedCount === testResults.length;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-surface/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neon-red/60" /><div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/60" /><div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" /></div>
          <span className="text-xs font-mono text-muted-foreground">{language === "python" ? "main.py" : "main.js"}</span>
          {language === "python" && <span className={cn("text-[10px] px-2 py-0.5 rounded-full", pyodideReady ? "bg-neon-green/10 text-neon-green" : "bg-neon-yellow/10 text-neon-yellow")}>{pyodideReady ? "✓ Tayyor" : "⏳ Yuklanmoqda..."}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="p-1.5 hover:bg-accent rounded-lg">{copied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}</button>
          <button onClick={handleReset} className="p-1.5 hover:bg-accent rounded-lg"><RotateCcw className="w-3.5 h-3.5 text-muted-foreground" /></button>
        </div>
      </div>

      {/* stdin ko'rsatma */}
      {testCases.length > 0 && (
        <div className="px-4 py-1.5 bg-neon-yellow/5 border-b border-neon-yellow/10 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-neon-yellow flex-shrink-0" />
          <p className="text-[10px] text-neon-yellow">
            <strong>input()</strong> funksiyasidan foydalaning! Testlar stdin orqali qiymat beradi. Masalan: <code className="bg-surface px-1 rounded">n = int(input())</code>
          </p>
        </div>
      )}

      {/* Editor */}
      <div style={{ height }}><Editor height={height} language={language === "python" ? "python" : "javascript"} value={code} onChange={val => setCode(val || "")} theme="vs-dark"
        options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", lineNumbers: "on", scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, readOnly, padding: { top: 12, bottom: 12 }, renderLineHighlight: "line", cursorBlinking: "smooth" }} /></div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/50 bg-surface/30 flex-wrap">
        <button onClick={handleRun} disabled={isRunning || (language === "python" && !pyodideReady)}
          className="btn-primary py-2 px-4 flex items-center gap-1.5 text-sm disabled:opacity-50">
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Ishga tushirish
        </button>
        {testCases.length > 0 && (
          <button onClick={handleRunTests} disabled={isRunning || (language === "python" && !pyodideReady)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-full text-sm font-medium bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20 disabled:opacity-50 transition-all">
            <CheckCircle2 className="w-4 h-4" /> Testlarni tekshirish
          </button>
        )}
        {taskId && (
          <button onClick={handleSubmit} disabled={isRunning || isSubmitting}
            className="btn-neon py-2 px-4 flex items-center gap-1.5 text-sm disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
          </button>
        )}
        {onAIFeedback && (
          <button onClick={() => onAIFeedback(code, testResults)}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 transition-all">
            <Sparkles className="w-3.5 h-3.5" /> AI
          </button>
        )}
        {testResults.length > 0 && (
          <span className={cn("ml-auto text-xs font-mono font-bold", allPassed ? "text-neon-green" : "text-neon-red")}>{passedCount}/{testResults.length}</span>
        )}
      </div>

      {/* Output / Tests */}
      <div className="border-t border-border/50">
        <div className="flex items-center gap-1 px-4 pt-2">
          <button onClick={() => setActiveTab("output")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", activeTab === "output" ? "bg-surface text-foreground" : "text-muted-foreground")}>Natija</button>
          {testCases.length > 0 && (
            <button onClick={() => setActiveTab("tests")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5", activeTab === "tests" ? "bg-surface text-foreground" : "text-muted-foreground")}>
              Testlar {testResults.length > 0 && <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", allPassed ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red")}>{passedCount}/{testResults.length}</span>}
            </button>
          )}
        </div>
        <div className="p-4 max-h-60 overflow-y-auto">
          {activeTab === "output" ? (
            output ? <pre className="font-mono text-sm whitespace-pre-wrap text-muted-foreground">{output}</pre>
              : <p className="text-sm text-muted-foreground italic">Kodni ishga tushiring...</p>
          ) : (
            <div className="space-y-2">
              {testResults.length === 0 ? <p className="text-sm text-muted-foreground italic">"Testlarni tekshirish" tugmasini bosing</p> : (
                <>
                  {testResults.map((r, i) => (
                    <div key={i} className={cn("p-3 rounded-xl border", r.passed ? "bg-neon-green/5 border-neon-green/20" : "bg-neon-red/5 border-neon-red/20")}>
                      <div className="flex items-center gap-2 mb-1.5">
                        {r.passed ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <XCircle className="w-4 h-4 text-neon-red" />}
                        <span className="font-mono text-xs font-semibold">Test #{i + 1}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground"><Clock className="w-3 h-3 inline mr-0.5" />{r.time_ms}ms</span>
                      </div>
                      <div className="space-y-0.5 text-xs font-mono">
                        <div className="flex gap-2"><span className="text-muted-foreground w-16">Kirish:</span><span className="text-foreground">{r.input || "(bo'sh)"}</span></div>
                        <div className="flex gap-2"><span className="text-muted-foreground w-16">Kutilgan:</span><span className="text-neon-green">{r.expected}</span></div>
                        <div className="flex gap-2"><span className="text-muted-foreground w-16">Chiqish:</span><span className={r.passed ? "text-neon-green" : "text-neon-red"}>{r.actual || "(bo'sh)"}</span></div>
                      </div>
                    </div>
                  ))}
                  {allPassed && <div className="p-3 rounded-xl bg-neon-green/5 border border-neon-green/20 text-center"><CheckCircle2 className="w-6 h-6 text-neon-green mx-auto mb-1" /><p className="font-semibold text-sm text-neon-green">Barcha testlar o'tdi! 🎉</p></div>}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
