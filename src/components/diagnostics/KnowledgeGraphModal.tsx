"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { KNOWLEDGE_GRAPH_NODES, type KnowledgeGraphNode } from "@/lib/diagnostics/misconceptionEngine";
import { X, Network, CheckCircle2, AlertTriangle, Lock, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface KnowledgeGraphModalProps {
  open: boolean;
  onClose: () => void;
}

export default function KnowledgeGraphModal({ open, onClose }: KnowledgeGraphModalProps) {
  const { locale, t } = useI18n();
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(KNOWLEDGE_GRAPH_NODES[0]);

  if (!open) return null;

  return (
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
              {t.misconceptions.mastered} (7)
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              {t.misconceptions.needsPractice} (3)
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
              {t.misconceptions.notStarted} (3)
            </span>
          </div>
          <span className="text-muted-foreground text-[11px] font-mono">
            {t.misconceptions.diagnosticReport}: 72% o&apos;zlashtirish indeksi
          </span>
        </div>

        {/* Graph Canvas & Details Sidebar */}
        <div className="flex-1 min-h-[420px] grid md:grid-cols-3 overflow-hidden">
          {/* SVG Graph View */}
          <div className="md:col-span-2 p-4 bg-black/20 overflow-auto relative flex items-center justify-center min-h-[350px]">
            <svg className="w-full h-[600px] min-w-[550px]" viewBox="0 0 740 700">
              {/* Draw Edges */}
              {KNOWLEDGE_GRAPH_NODES.map((node) =>
                node.prerequisites.map((preId) => {
                  const preNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === preId);
                  if (!preNode) return null;
                  const isPreMastered = preNode.status === "mastered";
                  return (
                    <line
                      key={`${preId}->${node.id}`}
                      x1={preNode.x + 60}
                      y1={preNode.y + 20}
                      x2={node.x + 60}
                      y2={node.y + 20}
                      stroke={isPreMastered ? "rgba(108, 92, 231, 0.4)" : "rgba(255, 255, 255, 0.1)"}
                      strokeWidth="2"
                      strokeDasharray={node.status === "locked" ? "4,4" : undefined}
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

                if (node.status === "mastered") {
                  strokeColor = "#00E676";
                  bgFill = "rgba(0, 230, 118, 0.15)";
                } else if (node.status === "needs_practice") {
                  strokeColor = "#FFB300";
                  bgFill = "rgba(255, 179, 0, 0.15)";
                } else if (node.status === "locked") {
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
          <div className="p-5 border-t md:border-t-0 md:border-l border-border bg-surface/30 flex flex-col justify-between overflow-y-auto">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      selectedNode.status === "mastered"
                        ? "bg-neon-green"
                        : selectedNode.status === "needs_practice"
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
                    <span className="text-muted-foreground">Holat:</span>
                    <span className="font-semibold text-foreground">
                      {selectedNode.status === "mastered"
                        ? t.misconceptions.mastered
                        : selectedNode.status === "needs_practice"
                        ? t.misconceptions.needsPractice
                        : t.misconceptions.notStarted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Oldingi talablar:</span>
                    <span className="font-mono text-muted-foreground">
                      {selectedNode.prerequisites.length > 0
                        ? `${selectedNode.prerequisites.length} ta mavzu`
                        : "Boshlang'ich"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-muted-foreground">Tavsiya qilingan mashq:</h5>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {selectedNode.status === "needs_practice"
                      ? "Ushbu tushuncha bo'yicha kod testlarida kognitiv zo'riqish aniqlangan. 2 ta mikro-topshiriqni yechish tavsiya etiladi."
                      : selectedNode.status === "mastered"
                      ? "Tushuncha mustahkam o'zlashtirilgan. Keyingi bosqichlarga o'tishingiz mumkin."
                      : "Avvalgi bog'langan mavzularni tugatib, ushbu modulni oching."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs">
                Tugun ustiga bosing
              </div>
            )}

            <button
              onClick={onClose}
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 mt-4"
            >
              <BookOpen className="w-4 h-4" />
              Darsga qaytish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
