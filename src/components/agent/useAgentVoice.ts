"use client";

/**
 * Ovoz o'ynatish navbati — chat ham, dars ham shu hookdan foydalanadi.
 *
 * Navbat kerak, chunki uzun matn bo'laklarga bo'lib sintez qilinadi
 * (TTS provayderining belgi chegarasi bor). Bo'laklar ketma-ket
 * o'ynashi shart: parallel o'ynasa ular bir-birining ustiga tushadi.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { stripForSpeech } from "@/lib/agent/speech-text";

export function useAgentVoice(lang = "uz") {
  const [speaking, setSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const playingRef = useRef(false);

  const playNext = useCallback(() => {
    const url = queueRef.current.shift();
    if (!url) {
      playingRef.current = false;
      setSpeaking(false);
      return;
    }

    playingRef.current = true;
    setSpeaking(true);

    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.src = url;
    audio.onended = playNext;
    // Bitta bo'lak o'ynamasa butun navbat to'xtab qolmasin
    audio.onerror = playNext;
    audio.play().catch(() => playNext());
  }, []);

  const enqueue = useCallback((url: string) => {
    queueRef.current.push(url);
    if (!playingRef.current) playNext();
  }, [playNext]);

  /** Provayder yo'q bo'lganda — brauzer sintezi. Sifat pastroq, lekin jim qolmaydi */
  const speakInBrowser = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [lang]);

  const stop = useCallback(() => {
    queueRef.current = [];
    playingRef.current = false;
    audioRef.current?.pause();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  /**
   * @param alreadyClean matn oldindan tozalangan bo'lsa (masalan dars
   * `narration` maydoni) — qayta tozalash shart emas
   */
  const speak = useCallback(async (text: string, alreadyClean = false) => {
    const clean = alreadyClean ? text.trim() : stripForSpeech(text);
    if (!clean) return;

    try {
      const res = await fetch("/api/agent/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, lang, raw: true }),
      });

      if (!res.ok) return speakInBrowser(clean);

      const data = await res.json();
      if (data.provider === "browser" || !data.clips?.length) return speakInBrowser(clean);

      for (const clip of data.clips) {
        if (clip.audioUrl) enqueue(clip.audioUrl);
      }
    } catch {
      speakInBrowser(clean);
    }
  }, [lang, enqueue, speakInBrowser]);

  // Sahifadan chiqilganda ovoz orqada gapirib qolmasin
  useEffect(() => stop, [stop]);

  return { speak, stop, speaking };
}
