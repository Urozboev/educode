"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n, type Locale } from "@/lib/i18n";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Square,
  Loader2,
  Sparkles,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TopicAudioPlayerProps {
  contentHtml?: string;
  topicTitle: string;
}

export default function TopicAudioPlayer({ contentHtml = "", topicTitle }: TopicAudioPlayerProps) {
  const { locale, t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 - 100%

  // HTML Audio element for server clips
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clipsQueueRef = useRef<string[]>([]);
  const currentClipIdxRef = useRef(0);

  // Web Speech API fallback ref
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const spokenTextRef = useRef("");

  // Helper to extract clean plain text from HTML
  const extractCleanText = useCallback((html: string) => {
    if (!html) return "";
    return html
      .replace(/<pre[\s\S]*?<\/pre>/gi, " . ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  // Stop everything
  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Language changed -> stop previous audio
  useEffect(() => {
    handleStop();
  }, [locale, handleStop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Play next server audio clip
  const playNextClip = useCallback(() => {
    if (currentClipIdxRef.current >= clipsQueueRef.current.length) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }

    const clipUrl = clipsQueueRef.current[currentClipIdxRef.current];
    if (!clipUrl) {
      // Fallback to browser speech if url is missing
      playBrowserSpeech(spokenTextRef.current);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    audioRef.current.src = clipUrl;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.muted = isMuted;

    audioRef.current.onended = () => {
      currentClipIdxRef.current += 1;
      const pct = Math.round((currentClipIdxRef.current / clipsQueueRef.current.length) * 100);
      setProgress(pct);
      playNextClip();
    };

    audioRef.current.onerror = () => {
      // If error loading server clip, fallback to browser speech
      playBrowserSpeech(spokenTextRef.current);
    };

    audioRef.current.play().catch(() => {
      playBrowserSpeech(spokenTextRef.current);
    });
  }, [playbackSpeed, isMuted]);

  // Browser speech synthesis fallback
  function playBrowserSpeech(fullText: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error(t.audioPlayer.error);
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = playbackSpeed;

    // Map language tag
    const langMap: Record<Locale, string> = {
      uz: "uz-UZ",
      kaa: "kk-KZ", // Karakalpak phonetics closest mapped to Turkic Kazakh/Uzbek engine
      ru: "ru-RU",
      en: "en-US",
    };
    utterance.lang = langMap[locale] || "uz-UZ";

    // Pick best available voice if possible
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }

  // Handle Play / Pause Toggle
  async function handleTogglePlay() {
    if (isPlaying) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
      return;
    }

    // Resume if already in middle
    if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    if (audioRef.current && audioRef.current.src && audioRef.current.currentTime > 0 && !audioRef.current.ended) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    // Start fresh audio synthesis
    setIsLoading(true);
    const plainText = `${topicTitle}. ` + extractCleanText(contentHtml);
    spokenTextRef.current = plainText;

    try {
      const res = await fetch("/api/courses/topic-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: contentHtml,
          text: plainText,
          lang: locale,
        }),
      });

      if (!res.ok) {
        throw new Error("Server audio not available");
      }

      const data = await res.json();
      const validClips = (data.clips || [])
        .map((c: any) => c.audioUrl)
        .filter(Boolean);

      if (validClips.length > 0) {
        clipsQueueRef.current = validClips;
        currentClipIdxRef.current = 0;
        setIsPlaying(true);
        playNextClip();
      } else {
        // Fallback to browser TTS
        playBrowserSpeech(plainText);
      }
    } catch (_err) {
      // Direct browser fallback
      playBrowserSpeech(plainText);
    } finally {
      setIsLoading(false);
    }
  }

  // Change speed
  function handleSpeedChange(newSpeed: number) {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    if (isPlaying && typeof window !== "undefined" && window.speechSynthesis) {
      // Restart browser speech with new rate
      window.speechSynthesis.cancel();
      playBrowserSpeech(spokenTextRef.current);
    }
  }

  const langNames: Record<Locale, string> = {
    uz: "O'zbekcha",
    kaa: "Qaraqalpaqsha",
    ru: "Русский",
    en: "English",
  };

  return (
    <div className="mb-6 p-4 rounded-2xl border border-neon-purple/30 bg-neon-purple/[0.04] backdrop-blur-sm flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left info badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center flex-shrink-0">
            <Headphones className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-foreground">
                {t.audioPlayer.title}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-neon-purple/15 text-neon-purple border border-neon-purple/20">
                {langNames[locale] || "O'zbekcha"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{t.audioPlayer.subtitle}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="text-[11px] font-mono">{t.audioPlayer.speed}:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="bg-card border border-border rounded-lg px-2 py-1 text-xs font-mono text-foreground focus:outline-none"
            >
              <option value={0.75}>0.75x</option>
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>
          </div>

          {/* Stop button */}
          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-2 rounded-xl border border-border bg-card hover:bg-surface text-muted-foreground hover:text-neon-red transition"
              title={t.audioPlayer.stop}
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Play / Pause main button */}
          <button
            onClick={handleTogglePlay}
            disabled={isLoading}
            className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 shadow-md shadow-neon-purple/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.audioPlayer.converting}</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{t.audioPlayer.pause}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.audioPlayer.play}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar when playing */}
      {isPlaying && (
        <div className="w-full bg-surface/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-neon-purple h-full rounded-full transition-all duration-300 animate-pulse"
            style={{ width: `${progress > 0 ? progress : 60}%` }}
          />
        </div>
      )}
    </div>
  );
}
