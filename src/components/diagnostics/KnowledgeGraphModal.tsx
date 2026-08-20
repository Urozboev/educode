"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import {
  KNOWLEDGE_GRAPH_NODES,
  computeNodeStatuses,
  masteryIndex,
  type KnowledgeGraphNode,
  type NodeStatus,
  type TopicProgressRow,
} from "@/lib/diagnostics/misconceptionEngine";
import { X, Network, CheckCircle2, AlertTriangle, Lock, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface KnowledgeGraphModalProps {
  open: boolean;
  onClose: () => void;
}

/** Hech qanday progress bo'lmagandagi holat — birinchi tugun ochiq. */
const EMPTY_STATUSES = computeNodeStatuses([]);

export default function KnowledgeGraphModal({ open, onClose }: KnowledgeGraphModalProps) {
  const { locale, t } = useI18n();
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(KNOWLEDGE_GRAPH_NODES[0]);
  const [statuses, setStatuses] = useState<Record<string, NodeStatus>>(EMPTY_STATUSES);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /**
   * Holatlar foydalanuvchining haqiqiy progressidan hisoblanadi.
   * Ilgari ular kodga yozib qo'yilgan edi — har bir o'quvchiga bir xil
   * "7 o'zlashtirilgan, 72%" ko'rinardi.
   */
  useEffect(() => {
    if (!open || loaded) return;
    let bekor = false;
    (async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (!bekor) { setStatuses(EMPTY_STATUSES); setLoaded(true); } return; }

        const slugs = [...new Set(KNOWLEDGE_GRAPH_NODES.flatMap((n) => n.topicSlugs))];
        const { data } = await supabase
          .from("topic_progress")
          .select("is_completed, quiz_passed, quiz_score, quiz_total, tasks_completed, topics!inner(slug)")
          .eq("user_id", user.id)
          .in("topics.slug", slugs);

        const rows: TopicProgressRow[] = (data ?? []).map((r: any) => ({
          slug: Array.isArray(r.topics) ? r.topics[0]?.slug : r.topics?.slug,
          is_completed: !!r.is_completed,
          quiz_passed: !!r.quiz_passed,
          quiz_score: r.quiz_score,
          quiz_total: r.quiz_total,
          tasks_completed: !!r.tasks_completed,
        })).filter((r) => !!r.slug);

        if (!bekor) { setStatuses(computeNodeStatuses(rows)); setLoaded(true); }
      } catch (_e) {
        if (!bekor) { setStatuses(EMPTY_STATUSES); setLoaded(true); }
      } finally {
        if (!bekor) setLoading(false);
      }
    })();
    return () => { bekor = true; };
  }, [open, loaded]);

  // Modal <body> ga portal qilinadi. Bu panel .glass-card ichida
  // ko'rsatiladi, .glass-card da esa backdrop-filter bor — u
  // `position: fixed` uchun yangi konteyner yaratadi va modal
  // ekranni emas, kartaning ichini qoplab qolardi.
  if (!open || typeof document === "undefined") return null;

  const statusOf = (id: string): NodeStatus => statuses[id] ?? "locked";
  const countOf = (s: NodeStatus) => KNOWLEDGE_GRAPH_NODES.filter((n) => statusOf(n.id) === s).length;
  const selectedStatus = selectedNode ? statusOf(selectedNode.id) : "locked";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">{t.misconceptions.knowledgeGraphTitle}</h3>
              <p className="text-xs text-muted-foreground">{t.misconceptions.knowledgeGraphSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-2.5 bg-surface/30 border-b border-border flex items-center justify-between text-xs flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-neon-green font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-green shadow-sm shadow-neon-green/50" />
              {t.misconceptions.mastered} ({countOf("mastered")})
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              {t.misconceptions.needsPractice} ({countOf("needs_practice")})
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
              {t.misconceptions.notStarted} ({countOf("unlocked") + countOf("locked")})
            </span>
          </div>
          <span className="text-muted-foreground text-[11px] font-mono inline-flex items-center gap-1.5">
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {t.misconceptions.diagnosticReport}: {t.misconceptions.masteryIndex.replace("{p}", String(masteryIndex(statuses)))}
          </span>
        </div>

        {/* Graph Canvas & Details Sidebar.
            Telefonda ikkala panel yonma-yon emas, ustma-ust joylashadi —
            shuning uchun aylantirish butun tanaga beriladi. Ilgari
            balandlik gridda qat'iy taqsimlanib, pastdagi tafsilot paneli
            80px ga siqilib qolardi. */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-3 overflow-y-auto md:overflow-hidden md:min-h-[420px]">
          {/* SVG Graph View */}
          <div className="md:col-span-2 shrink-0 md:shrink p-4 bg-black/20 overflow-x-auto md:overflow-auto relative flex items-center justify-center">
            <svg className="w-full h-[340px] md:h-[600px] min-w-[550px]" viewBox="0 0 740 700">
              {/* Draw Edges */}
              {KNOWLEDGE_GRAPH_NODES.map((node) =>
                node.prerequisites.map((preId) => {
                  const preNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === preId);
                  if (!preNode) return null;
                  const isPreMastered = statusOf(preNode.id) === "mastered";
                  return (
                    <line
                      key={`${preId}->${node.id}`}
                      x1={preNode.x + 60}
                      y1={preNode.y + 20}
                      x2={node.x + 60}
                      y2={node.y + 20}
                      stroke={isPreMastered ? "rgba(108, 92, 231, 0.4)" : "rgba(255, 255, 255, 0.1)"}
                      strokeWidth="2"
                      strokeDasharray={statusOf(node.id) === "locked" ? "4,4" : undefined}
                    />
                  );
                })
              )}

              {/* Draw Nodes */}
              {KNOWLEDGE_GRAPH_NODES.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                let bgFill = "#1e1e2d";
                let strokeColor = "rgba(255,255,255,0.15)";
                let textColor = "#e2e8f0";

                const nodeStatus = statusOf(node.id);
                if (nodeStatus === "mastered") {
                  strokeColor = "#00E676";
                  bgFill = "rgba(0, 230, 118, 0.15)";
                } else if (nodeStatus === "needs_practice") {
                  strokeColor = "#FFB300";
                  bgFill = "rgba(255, 179, 0, 0.15)";
                } else if (nodeStatus === "locked") {
                  textColor = "#64748b";
                  bgFill = "rgba(15, 23, 42, 0.6)";
                }

                if (isSelected) {
                  strokeColor = "#6C5CE7";
                  bgFill = "rgba(108, 92, 231, 0.35)";
                }

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-all hover:opacity-90"
                    transform={`translate(${node.x - 20}, ${node.y})`}
                  >
                    <rect
                      width="160"
                      height="46"
                      rx="10"
                      fill={bgFill}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                    <text
                      x="80"
                      y="27"
                      textAnchor="middle"
                      fill={textColor}
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {node.label[locale] || node.label.uz}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Details Sidebar */}
          <div className="p-5 shrink-0 md:shrink border-t md:border-t-0 md:border-l border-border bg-surface/30 flex flex-col justify-between md:overflow-y-auto">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      selectedStatus === "mastered"
                        ? "bg-neon-green"
                        : selectedStatus === "needs_practice"
                        ? "bg-amber-400"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    {selectedNode.category}
                  </span>
                </div>

                <h4 className="font-display font-bold text-base text-foreground">
                  {selectedNode.label[locale] || selectedNode.label.uz}
                </h4>

                <div className="p-3.5 rounded-xl bg-card border border-border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.misconceptions.statusLabel}</span>
                    <span className="font-semibold text-foreground">
                      {selectedStatus === "mastered"
                        ? t.misconceptions.mastered
                        : selectedStatus === "needs_practice"
                        ? t.misconceptions.needsPractice
                        : t.misconceptions.notStarted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.misconceptions.prerequisites}</span>
                    <span className="font-mono text-muted-foreground">
                      {selectedNode.prerequisites.length > 0
                        ? t.misconceptions.topicsCount.replace("{n}", String(selectedNode.prerequisites.length))
                        : t.misconceptions.beginnerLevel}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-muted-foreground">{t.misconceptions.recommendedPractice}</h5>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {selectedStatus === "needs_practice"
                      ? t.misconceptions.adviceNeedsPractice
                      : selectedStatus === "mastered"
                      ? t.misconceptions.adviceMastered
                      : t.misconceptions.adviceLocked}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs">
                {t.misconceptions.clickNode}
              </div>
            )}

            <button
              onClick={onClose}
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 mt-4"
            >
              <BookOpen className="w-4 h-4" />
              {t.misconceptions.backToLesson}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
