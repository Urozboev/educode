"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import type { SupportedLanguage, TestCase, SubmissionTestResult } from "@/types";
import {
  Play, Square, RotateCcw, CheckCircle2, XCircle, Clock,
  Loader2, ChevronDown, Sparkles, Copy, Check
} from "lucide-react";

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
  language,
  starterCode = "",
  testCases = [],
  taskId,
  taskType,
  onSubmit,
  onAIFeedback,
  readOnly = false,
  height = "400px",
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<SubmissionTestResult[]>([]);
  const [activeTab, setActiveTab] = useState<"output" | "tests">("output");
  const [pyodideReady, setPyodideReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const pyodideRef = useRef<any>(null);
  const workerRef = useRef<Worker | null>(null);

  // Pyodide yuklash (Python uchun)
  useEffect(() => {
    if (language === "python") {
      loadPyodide();
    }
    return () => {
      workerRef.current?.terminate();
    };
  }, [language]);

  async function loadPyodide() {
    try {
      // Pyodide ni script orqali yuklash
      if (!(window as any).loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = async () => {
          pyodideRef.current = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          });
          setPyodideReady(true);
        };
        document.head.appendChild(script);
      } else {
        if (!pyodideRef.current) {
          pyodideRef.current = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          });
        }
        setPyodideReady(true);
      }
    } catch (err) {
      console.error("Pyodide yuklashda xatolik:", err);
    }
  }

  // Python kodini Pyodide da ishga tushirish
  async function runPython(sourceCode: string, stdin: string = ""): Promise<{ stdout: string; stderr: string; time_ms: number }> {
    if (!pyodideRef.current) throw new Error("Pyodide tayyor emas");

    const startTime = performance.now();
    try {
      // stdin ni simulyatsiya qilish
      const wrappedCode = `
import sys
from io import StringIO

_stdin_data = """${stdin}"""
sys.stdin = StringIO(_stdin_data)
_stdout = StringIO()
sys.stdout = _stdout

try:
${sourceCode.split("\n").map((l) => "    " + l).join("\n")}
except Exception as e:
    print(str(e), file=sys.stderr if hasattr(sys, 'stderr') else _stdout)

_result = _stdout.getvalue()
_result
`;
      const result = await pyodideRef.current.runPythonAsync(wrappedCode);
      const time_ms = Math.round(performance.now() - startTime);
      return { stdout: result || "", stderr: "", time_ms };
    } catch (err: any) {
      const time_ms = Math.round(performance.now() - startTime);
      return { stdout: "", stderr: err.message || String(err), time_ms };
    }
  }

  // JavaScript kodini sandbox iframe da ishga tushirish
  async function runJavaScript(sourceCode: string, stdin: string = ""): Promise<{ stdout: string; stderr: string; time_ms: number }> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.sandbox.add("allow-scripts");
      document.body.appendChild(iframe);

      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        resolve({ stdout: "", stderr: "Vaqt limiti (5 sekund) oshdi", time_ms: 5000 });
      }, 5000);

      const handler = (event: MessageEvent) => {
        if (event.data?.type === "execution_result") {
          clearTimeout(timeout);
          window.removeEventListener("message", handler);
          document.body.removeChild(iframe);
          const time_ms = Math.round(performance.now() - startTime);
          resolve({ ...event.data.result, time_ms });
        }
      };

      window.addEventListener("message", handler);

      const html = `
        <script>
          const _output = [];
          const _console_log = console.log;
          console.log = (...args) => _output.push(args.map(String).join(' '));

          const _input_lines = ${JSON.stringify(stdin.split("\n"))};
          let _input_idx = 0;
          function prompt() { return _input_lines[_input_idx++] || ''; }
          const readline = prompt;

          try {
            ${sourceCode}
            parent.postMessage({
              type: 'execution_result',
              result: { stdout: _output.join('\\n'), stderr: '' }
            }, '*');
          } catch(e) {
            parent.postMessage({
              type: 'execution_result',
              result: { stdout: _output.join('\\n'), stderr: e.message }
            }, '*');
          }
        </script>
      `;

      iframe.srcdoc = html;
    });
  }

  // Kodni ishga tushirish
  async function handleRun() {
    setIsRunning(true);
    setOutput("");
    setTestResults([]);

    try {
      let result;
      if (language === "python") {
        result = await runPython(code);
      } else if (language === "javascript" || language === "typescript") {
        result = await runJavaScript(code);
      } else {
        setOutput("Bu til hozircha faqat server tomondan qo'llab-quvvatlanadi (Judge0 kerak).");
        setIsRunning(false);
        return;
      }

      if (result.stderr) {
        setOutput(`❌ Xatolik:\n${result.stderr}\n\n⏱ ${result.time_ms}ms`);
      } else {
        setOutput(`${result.stdout}\n\n⏱ ${result.time_ms}ms`);
      }

      // Test cases bilan tekshirish
      if (testCases.length > 0) {
        const results: SubmissionTestResult[] = [];
        for (const tc of testCases) {
          let tcResult;
          if (language === "python") {
            tcResult = await runPython(code, tc.input);
          } else {
            tcResult = await runJavaScript(code, tc.input);
          }

          results.push({
            input: tc.input,
            expected: tc.expected_output,
            actual: tcResult.stdout.trim(),
            passed: tcResult.stdout.trim() === tc.expected_output.trim(),
            time_ms: tcResult.time_ms,
          });
        }
        setTestResults(results);
        setActiveTab("tests");
      }
    } catch (err: any) {
      setOutput(`❌ Xatolik: ${err.message}`);
    }

    setIsRunning(false);
  }

  // Topshiriqni yuborish
  async function handleSubmit() {
    if (!taskId) return;
    await handleRun();

    // API ga natijalarni yuborish
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          task_id: taskId,
          task_type: taskType,
          test_cases: testCases,
          execution_result: {
            outputs: testResults.map((r) => r.actual),
            time_ms: testResults[0]?.time_ms || 0,
          },
        }),
      });
      const data = await res.json();
      if (onSubmit) onSubmit(code, data.test_results || testResults);
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setCode(starterCode);
    setOutput("");
    setTestResults([]);
  }

  const passedCount = testResults.filter((r) => r.passed).length;
  const allPassed = testResults.length > 0 && passedCount === testResults.length;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col">
        <div className="editor-header">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-neon-red/60" />
              <div className="w-3 h-3 rounded-full bg-neon-yellow/60" />
              <div className="w-3 h-3 rounded-full bg-neon-green/60" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {language === "python" ? "main.py" : language === "javascript" ? "main.js" : "main.ts"}
            </span>
            {language === "python" && (
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-mono", pyodideReady ? "bg-neon-green/10 text-neon-green" : "bg-neon-yellow/10 text-neon-yellow")}>
                {pyodideReady ? "Python tayyor" : "Yuklanmoqda..."}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Nusxalash">
              {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
            <button onClick={handleReset} className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Qayta boshlash">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="editor-container flex-1" style={{ minHeight: height }}>
          <Editor
            height={height}
            language={language === "python" ? "python" : "javascript"}
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              readOnly,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: "line",
              cursorBlinking: "smooth",
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleRun}
            disabled={isRunning || (language === "python" && !pyodideReady)}
            className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Bajarilmoqda..." : "Ishga tushirish"}
          </button>

          {taskId && (
            <button
              onClick={handleSubmit}
              disabled={isRunning}
              className="btn-neon py-2.5 px-6 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Yuborish
            </button>
          )}

          {onAIFeedback && testResults.length > 0 && (
            <button
              onClick={() => onAIFeedback(code, testResults)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Tahlil
            </button>
          )}
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 flex flex-col lg:max-w-md">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-2">
          <button
            onClick={() => setActiveTab("output")}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "output" ? "bg-surface text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Natija
          </button>
          {testCases.length > 0 && (
            <button
              onClick={() => setActiveTab("tests")}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                activeTab === "tests" ? "bg-surface text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Testlar
              {testResults.length > 0 && (
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                  allPassed ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red"
                )}>
                  {passedCount}/{testResults.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="output-panel flex-1" style={{ minHeight: height }}>
          {activeTab === "output" ? (
            output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-muted-foreground italic">
                "Ishga tushirish" tugmasini bosing...
              </p>
            )
          ) : (
            <div className="space-y-3">
              {testResults.length === 0 ? (
                <p className="text-muted-foreground italic">
                  Kodni ishga tushiring, test natijalari bu yerda ko'rinadi
                </p>
              ) : (
                testResults.map((result, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-xl border",
                      result.passed
                        ? "bg-neon-green/5 border-neon-green/20"
                        : "bg-neon-red/5 border-neon-red/20"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-neon-green" />
                      ) : (
                        <XCircle className="w-4 h-4 text-neon-red" />
                      )}
                      <span className="font-mono text-xs font-semibold">
                        Test #{i + 1} — {result.passed ? "O'tdi" : "Xato"}
                      </span>
                      <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {result.time_ms}ms
                      </span>
                    </div>
                    <div className="space-y-1 text-xs font-mono">
                      <div><span className="text-muted-foreground">Kirish:</span> {result.input}</div>
                      <div><span className="text-muted-foreground">Kutilgan:</span> <span className="text-neon-green">{result.expected}</span></div>
                      {!result.passed && (
                        <div><span className="text-muted-foreground">Chiqish:</span> <span className="text-neon-red">{result.actual || "(bo'sh)"}</span></div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {allPassed && (
                <div className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 text-center">
                  <CheckCircle2 className="w-8 h-8 text-neon-green mx-auto mb-2" />
                  <p className="font-semibold text-neon-green">Barcha testlar o'tdi! 🎉</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
