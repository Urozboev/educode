"use client";

/**
 * Agent bilan ovozli suhbat oynasi.
 *
 * Ovoz oqimi shunday ishlaydi:
 *   SSE delta → buferga qo'shiladi → tugagan gap ajratiladi →
 *   /api/agent/voice → audio navbatga qo'shiladi → ketma-ket o'ynaydi
 *
 * Ya'ni foydalanuvchi javob to'liq yozilib bo'lishini kutmaydi:
 * birinchi gap tayyor bo'lishi bilan ovoz boshlanadi.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2, Sparkles, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { takeCompleteSentences } from "@/lib/agent/speech-text";
import { useAgentVoice } from "./useAgentVoice";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  lang?: string;
  /** Rejadagi modul nomi — "Boshlash" tugmasidan kelinganda */
  startTopic?: string | null;
}

export default function AgentChat({ lang = "uz", startTopic = null }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Ovoz navbati dars sahifasi bilan umumiy — `useAgentVoice` da
  const { speak, stop: stopSpeaking, speaking } = useAgentVoice(lang);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  /* ---------------- Xabar yuborish ---------------- */

  const send = useCallback(async (text: string) => {
    const message = text.trim();
    if (!message || streaming) return;

    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);
    setStreaming(true);
    stopSpeaking();

    // Ovoz uchun bufer: hali gapga aylanmagan bo'lak shu yerda kutadi
    let speechBuffer = "";

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId, lang }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Xatolik (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const raw of events) {
          const eventLine = raw.split("\n").find((l) => l.startsWith("event:"));
          const dataLine = raw.split("\n").find((l) => l.startsWith("data:"));
          if (!eventLine || !dataLine) continue;

          const event = eventLine.slice(6).trim();
          const payload = JSON.parse(dataLine.slice(5).trim());

          if (event === "meta") {
            setConversationId(payload.conversationId);
          } else if (event === "delta") {
            setMessages((m) => {
              const next = [...m];
              next[next.length - 1] = {
                role: "assistant",
                content: next[next.length - 1].content + payload.text,
              };
              return next;
            });

            if (voiceOn) {
              speechBuffer += payload.text;
              const [ready, rest] = takeCompleteSentences(speechBuffer);
              if (ready) {
                speechBuffer = rest;
                void speak(ready);
              }
            }
          } else if (event === "error") {
            setError(payload.message);
          }
        }
      }

      // Oxirida qolgan tugallanmagan bo'lakni ham aytamiz
      if (voiceOn && speechBuffer.trim()) void speak(speechBuffer);
    } catch (e: any) {
      setError(e.message || "Xatolik yuz berdi");
      setMessages((m) => (m[m.length - 1]?.content === "" ? m.slice(0, -1) : m));
    } finally {
      setStreaming(false);
    }
  }, [streaming, conversationId, lang, voiceOn, speak, stopSpeaking]);

  /* ---------------- Mikrofon (brauzer STT) ---------------- */

  const toggleMic = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi. Matn yozib yuboring.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SR();
    recognition.lang = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setInput(transcript);
      // Yakuniy natija kelganda o'zi yuboriladi — foydalanuvchi
      // gapirib bo'lgach yana tugma bosishi shart emas
      if (e.results[e.results.length - 1].isFinal) {
        recognition.stop();
        setListening(false);
        void send(transcript);
      }
    };
    recognition.onerror = () => { setListening(false); };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    stopSpeaking();
  }, [listening, lang, send, stopSpeaking]);

  /* ---------------- UI ---------------- */

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Sarlavha */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform",
            speaking && "animate-pulse scale-110",
          )}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Ustoz</div>
            <div className="text-xs text-muted-foreground">
              {streaming ? "yozmoqda..." : speaking ? "gapirmoqda..." : listening ? "eshitmoqda..." : "shaxsiy AI o'qituvchi"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/agent/reja"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            title="O'quv reja"
          >
            <ListChecks className="h-5 w-5" />
            <span className="hidden sm:inline">Reja</span>
          </Link>

          <button
            onClick={() => { setVoiceOn((v) => !v); if (voiceOn) stopSpeaking(); }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            title={voiceOn ? "Ovozni o'chirish" : "Ovozni yoqish"}
          >
            {voiceOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Suhbat */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Salom! Men Ustozman.</h2>
            <p className="text-sm text-muted-foreground">
              Qaysi IT yo'nalishini o'rganmoqchisiz? Noldan boshlaymizmi, yoki
              bir narsalarni bilasizmi? Ayting — sizga mos reja tuzaman.
            </p>

            {startTopic ? (
              <button
                onClick={() => void send(`"${startTopic}" mavzusini boshlaymiz. Menga shu mavzuni tushuntiring.`)}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                &quot;{startTopic}&quot; mavzusini boshlash
              </button>
            ) : (
              <Link
                href="/agent/reja"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <ListChecks className="h-4 w-4" />
                O'quv reja tuzish
              </Link>
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}>
                {m.content || <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Kiritish */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <button
            onClick={toggleMic}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              listening
                ? "bg-destructive text-destructive-foreground animate-pulse"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
            title={listening ? "To'xtatish" : "Gapirish"}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); }
            }}
            rows={1}
            placeholder="Savolingizni yozing yoki mikrofonni bosing..."
            className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <button
            onClick={() => void send(input)}
            disabled={!input.trim() || streaming}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
          >
            {streaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
