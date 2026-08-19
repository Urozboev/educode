"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import type { TraceResult, ExecutionStep } from "@/lib/visualizer/pythonTracer";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Layers,
  Database,
  Terminal,
  Activity,
  Code2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryVisualizerProps {
  traceResult: TraceResult | null;
  code: string;
  isLoading?: boolean;
}

export default function MemoryVisualizer({ traceResult, code, isLoading }: MemoryVisualizerProps) {
  const { t } = useI18n();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps = traceResult?.steps || [];
  const currentStep: ExecutionStep | undefined = steps[currentStepIdx];
  const codeLines = useMemo(() => code.split("\n"), [code]);

  // Reset on new trace
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [traceResult]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-surface/30 rounded-2xl border border-border">
        <div className="w-10 h-10 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center animate-spin">
          <Activity className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{t.visualizer.tracing}</p>
      </div>
    );
  }

  if (!traceResult || steps.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-surface/30 rounded-2xl border border-dashed border-border">
        <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-muted-foreground">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-sm">{t.visualizer.title}</h4>
        <p className="text-xs text-muted-foreground max-w-sm">{t.visualizer.noSteps}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Playback Controls Toolbar */}
      <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {/* First / Prev */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx(0);
            }}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg hover:bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
            title="Boshiga o'tish"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx((p) => Math.max(0, p - 1));
            }}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg hover:bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
            title={t.visualizer.stepBack}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 rounded-lg bg-neon-purple text-white hover:bg-neon-purple/90 font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> {t.visualizer.pause}
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> {t.visualizer.play}
              </>
            )}
          </button>

          {/* Next / Last */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1));
            }}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2 rounded-lg hover:bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
            title={t.visualizer.stepForward}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx(steps.length - 1);
            }}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2 rounded-lg hover:bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
            title="Oxiriga o'tish"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Slider & Indicator */}
        <div className="flex-1 min-w-[200px] flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStepIdx}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIdx(Number(e.target.value));
            }}
            className="w-full accent-neon-purple cursor-pointer h-1.5 bg-black/40 rounded-lg"
          />
          <span className="text-xs font-mono font-semibold text-muted-foreground whitespace-nowrap">
            {currentStepIdx + 1} / {steps.length} {t.visualizer.step}
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{t.visualizer.speed}:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-card border border-border rounded-lg px-2 py-1 text-xs text-foreground"
          >
            <option value={1500}>0.5x</option>
            <option value={1000}>1.0x</option>
            <option value={500}>2.0x</option>
          </select>
        </div>
      </div>

      {/* Visualizer Grid: Code on left, Call Stack & Heap on right */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left: Code with Active Line Indicator */}
        <div className="lg:col-span-5 rounded-2xl bg-card border border-border p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-neon-blue">
              <Code2 className="w-4 h-4" /> Python kodi
            </span>
            {currentStep && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                {t.visualizer.line}: {currentStep.line}
              </span>
            )}
          </div>

          <div className="font-mono text-xs overflow-x-auto space-y-1 flex-1">
            {codeLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrentLine = currentStep?.line === lineNum;
              return (
                <div
                  key={lineNum}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-1 rounded transition-colors",
                    isCurrentLine ? "bg-neon-purple/20 border-l-4 border-neon-purple font-semibold text-white" : "text-muted-foreground"
                  )}
                >
                  <span className="w-6 text-right select-none opacity-40 text-[11px]">{lineNum}</span>
                  <span className="whitespace-pre">{lineText || " "}</span>
                </div>
              );
            })}
          </div>

          {/* Terminal Output Stream */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>{t.visualizer.output}</span>
            </div>
            <pre className="font-mono text-xs p-2.5 rounded-xl bg-black/50 border border-border text-neon-green/90 min-h-[48px] max-h-[90px] overflow-y-auto whitespace-pre-wrap">
              {currentStep?.stdout || <span className="opacity-40 text-muted-foreground">Chiqish yo&apos;q</span>}
            </pre>
          </div>
        </div>

        {/* Right: Stack & Heap Visual Representation */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Call Stack Section */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border text-xs font-semibold text-muted-foreground">
              <Layers className="w-4 h-4 text-neon-purple" />
              <span>{t.visualizer.callStack}</span>
            </div>

            <div className="space-y-3">
              {currentStep?.callStack.map((frame, idx) => {
                const isTopFrame = idx === 0;
                return (
                  <div
                    key={frame.id}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all",
                      isTopFrame ? "bg-neon-purple/[0.04] border-neon-purple/30 shadow-sm" : "bg-surface/50 border-border"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-neon-purple" />
                        {frame.funcName === "<module>" ? t.visualizer.globalFrame : `def ${frame.funcName}()`}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {t.visualizer.line}: {frame.line}
                      </span>
                    </div>

                    {/* Local variables list */}
                    {Object.keys(frame.locals).length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-2">
                        {Object.entries(frame.locals).map(([varName, varVal]) => (
                          <div
                            key={varName}
                            className="p-2 rounded-lg bg-surface border border-border/80 flex items-center justify-between text-xs font-mono"
                          >
                            <span className="text-neon-cyan font-bold">{varName}</span>
                            <span className="text-muted-foreground">=</span>
                            <span className="text-neon-green font-semibold truncate max-w-[120px]">{String(varVal)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic">O&apos;zgaruvchilar mavjud emas</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Heap Memory Objects Section */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border text-xs font-semibold text-muted-foreground">
              <Database className="w-4 h-4 text-neon-green" />
              <span>{t.visualizer.heapMemory}</span>
            </div>

            {currentStep && Object.keys(currentStep.heap).length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.values(currentStep.heap).map((obj) => (
                  <div key={obj.id} className="p-3 rounded-xl bg-surface border border-neon-green/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-neon-green uppercase text-[11px] px-1.5 py-0.5 rounded bg-neon-green/10">
                        {obj.type}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{obj.id}</span>
                    </div>

                    {/* Array Cells */}
                    {Array.isArray(obj.value) ? (
                      <div className="flex items-center gap-1 overflow-x-auto pb-1">
                        {obj.value.map((elem, eIdx) => (
                          <div
                            key={eIdx}
                            className="flex flex-col items-center min-w-[36px] p-1.5 rounded-lg bg-black/40 border border-border text-center"
                          >
                            <span className="text-[9px] text-muted-foreground font-mono">[{eIdx}]</span>
                            <span className="text-xs font-bold font-mono text-neon-green">{String(elem)}</span>
                          </div>
                        ))}
                      </div>
                    ) : typeof obj.value === "object" && obj.value !== null ? (
                      <div className="space-y-1 font-mono text-xs">
                        {Object.entries(obj.value).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-black/30">
                            <span className="text-amber-300">{k}:</span>
                            <span className="text-foreground">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-foreground">{String(obj.value)}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">
                Hozircha Heap xotirada murakkab tuzilmalar (ro&apos;yxat, lug&apos;at) yaratilmagan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
