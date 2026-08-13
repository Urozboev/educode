"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, Loader2, Bot, User, Trash2, Sparkles, Brain, Clock } from "lucide-react";
import { AILabel, AIDisclaimer } from "@/components/ai/AILabel";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface Message {
  role: "user" | "assistant";
  content: string;
  meta?: { model?: string; prompt_template?: string; generated_at?: string };
}


interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  cooldownUntil?: string | null;
  blocked?: boolean;
  message?: string;
}

export default function ChatPage() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    fetch("/api/ai/stats").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.daily) {
        setQuota({
          used: d.daily.used,
          limit: d.daily.limit,
          remaining: d.daily.remaining,
          cooldownUntil: d.daily.cooldownUntil,
        });
      }
    }).catch(() => {});
  }, []);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-6),
        }),
      });
      const data = await res.json();

      if (res.status === 429 || data.blocked) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.reply || data.message || "AI yordami chegarasiga yetdingiz." },
        ]);
        if (data.quota) {
          setQuota({
            used: data.quota.used,
            limit: data.quota.limit,
            remaining: data.quota.remaining,
            cooldownUntil: data.quota.cooldownUntil,
            blocked: true,
          });
        }
        setLoading(false);
        return;
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          meta: {
            model: data.meta?.model,
            prompt_template: data.meta?.prompt_template,
            generated_at: new Date().toISOString(),
          },
        },
      ]);

      if (data.quota) {
        setQuota({
          used: data.quota.used,
          limit: data.quota.limit,
          remaining: data.quota.remaining,
          cooldownUntil: data.quota.cooldownUntil,
        });
        if (data.quota.warning) toast.warning(data.quota.warning);
      }
      if (data.cooldownTriggered) {
        toast.warning(t.cabinet.chat.cooldownToast);
      }
    } catch (_e) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ " + t.cabinet.chat.failed }]);
    }
    setLoading(false);
  }

  function formatContent(content: string) {
    // Kod bloklarini ajratish
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "").trim();
        return <pre key={i} className="bg-[#0d1117] text-[#c9d1d9] p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 border border-border">{code}</pre>;
      }
      // Inline kod
      return <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/`([^`]+)`/g, '<code class="bg-surface px-1.5 py-0.5 rounded text-neon-green text-xs font-mono">$1</code>') }} />;
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neon-blue" /> {t.cabinet.chat.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t.cabinet.chat.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quota && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border",
                quota.cooldownUntil
                  ? "bg-neon-red/10 border-neon-red/20 text-neon-red"
                  : quota.remaining <= 2
                  ? "bg-neon-yellow/10 border-neon-yellow/20 text-neon-yellow"
                  : "bg-surface border-border text-muted-foreground",
              )}
              title={t.cabinet.chat.quotaTitle}
            >
              {quota.cooldownUntil ? <Clock className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5" />}
              <span>{quota.used}/{quota.limit}</span>
            </div>
          )}
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="btn-ghost py-1.5 px-3 text-xs flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> {t.cabinet.chat.clear}
            </button>
          )}
        </div>
      </div>

      {quota?.cooldownUntil && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-neon-red/5 border border-neon-red/20 text-xs text-neon-red flex items-center gap-2">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>
            {t.cabinet.chat.cooldownBefore}{" "}
            <span className="font-semibold">
              {new Date(quota.cooldownUntil).toLocaleTimeString(locale === "kaa" ? "uz" : locale, { hour: "2-digit", minute: "2-digit" })}
            </span>{" "}
            {t.cabinet.chat.cooldownAfter}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-neon-blue/20 mx-auto mb-4" />
            <h2 className="font-semibold text-lg mb-2">{t.cabinet.chat.emptyTitle}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              {t.cabinet.chat.emptyText}
            </p>
            <p className="text-xs text-neon-yellow/80 mb-6">
              ⚠️ {t.cabinet.chat.emptyWarn}
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {t.cabinet.chat.suggestions.map(s => (
                <button key={s} onClick={() => handleSend(s)}
                  className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border text-xs text-muted-foreground hover:text-foreground transition-all text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "")}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-neon-blue" />
              </div>
            )}
            <div className={cn("max-w-[85%] flex flex-col gap-2",
              msg.role === "user" ? "items-end" : "items-start")}>
              <div className={cn("rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-neon-purple text-white rounded-br-md"
                  : "bg-surface border border-border rounded-bl-md")}>
                {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
              </div>
              {msg.role === "assistant" && (
                <div className="flex flex-col gap-1 w-full">
                  <AILabel
                    model={msg.meta?.model}
                    promptTemplate={msg.meta?.prompt_template}
                    generatedAt={msg.meta?.generated_at}
                  />
                  <AIDisclaimer />
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-neon-purple" />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center"><Bot className="w-4 h-4 text-neon-blue" /></div>
            <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" /><div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "0.1s" }} /><div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "0.2s" }} /></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={t.cabinet.chat.placeholder} className="input-field flex-1" disabled={loading} />
          <button onClick={() => handleSend()} disabled={!input.trim() || loading}
            className="btn-primary py-3 px-4 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Gemini AI · {t.cabinet.chat.footer}
        </p>
      </div>
    </div>
  );
}
