"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, Loader2, Bot, User, Trash2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Python da list comprehension nima?",
  "HTML va CSS nima farqi bor?",
  "Prompt engineering nima?",
  "Algoritm murakkabligini qanday hisoblash mumkin?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (_e) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Xatolik yuz berdi. Qayta urinib ko'ring." }]);
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neon-blue" /> AI Yordamchi
          </h1>
          <p className="text-xs text-muted-foreground">Dasturlash, kompyuter savodxonligi va prompt engineering bo'yicha</p>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="btn-ghost py-1.5 px-3 text-xs flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Tozalash
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-neon-blue/20 mx-auto mb-4" />
            <h2 className="font-semibold text-lg mb-2">Savol bering!</h2>
            <p className="text-sm text-muted-foreground mb-6">IT sohalari bo'yicha har qanday savolingizga javob beraman</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {suggestions.map(s => (
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
            <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-neon-purple text-white rounded-br-md"
                : "bg-surface border border-border rounded-bl-md")}>
              {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
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
            placeholder="Savol yozing..." className="input-field flex-1" disabled={loading} />
          <button onClick={() => handleSend()} disabled={!input.trim() || loading}
            className="btn-primary py-3 px-4 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Gemini AI · Faqat IT sohalari bo'yicha · Javoblar har doim to'g'ri bo'lmasligi mumkin
        </p>
      </div>
    </div>
  );
}
