"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Lock, Video as VideoIcon, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  topicId: string;
  /** Free preview darslar uchun register CTA'da redirect qilinadigan sahifa */
  redirectPath?: string;
  className?: string;
  /** Video ko'rish ulushi (0–1) o'zgarganda chaqiriladi — "Ko'rdim" tugmasini ochish uchun */
  onProgress?: (fraction: number) => void;
}

interface TokenResponse {
  provider?: string;
  embed_url?: string;
  expires_in?: number;
  error?: string;
  requires?: "auth" | "enrollment";
}

/**
 * Himoyalangan video player.
 * - Embed URL server'dan olinadi (/api/video/token) — enrollment RLS orqali tekshiriladi
 * - Signed URL'lar muddatli (Bunny: 4 soat), to'g'ridan-to'g'ri ulashib bo'lmaydi
 * - Right-click va drag bloklanadi
 * - Foydalanuvchi email'i yarim shaffof watermark sifatida video ustida harakatlanadi
 *   (ekran yozib olishda kim tarqatganini aniqlash uchun)
 */
export default function ProtectedVideoPlayer({ topicId, redirectPath, className, onProgress }: Props) {
  const supabase = createClient();
  const [data, setData] = useState<TokenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [watermark, setWatermark] = useState<string | null>(null);
  const [wmPos, setWmPos] = useState({ top: 12, left: 65 });
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const maxFracRef = useRef(0);

  // Bunny player.js hodisalarini tinglash — video ko'rish ulushini aniqlash
  useEffect(() => {
    if (!onProgress) return;
    function onMsg(e: MessageEvent) {
      // Faqat Bunny iframe'idan kelgan xabarlar
      if (typeof e.data !== "string") return;
      let msg: any;
      try { msg = JSON.parse(e.data); } catch { return; }
      if (msg?.context !== "player.js") return;

      const iframe = iframeRef.current;
      if (msg.event === "ready" && iframe?.contentWindow) {
        // Hodisalarga obuna bo'lish
        ["timeupdate", "ended"].forEach(ev => {
          iframe.contentWindow!.postMessage(
            JSON.stringify({ context: "player.js", method: "addEventListener", value: ev }),
            "*",
          );
        });
      } else if (msg.event === "timeupdate" && msg.value) {
        const { seconds, duration } = msg.value;
        if (duration > 0) {
          const frac = Math.min(1, seconds / duration);
          if (frac > maxFracRef.current + 0.01) {
            maxFracRef.current = frac;
            onProgress?.(frac);
          }
        }
      } else if (msg.event === "ended") {
        maxFracRef.current = 1;
        onProgress?.(1);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onProgress, data?.embed_url]);

  async function fetchToken() {
    setLoading(true);
    try {
      const res = await fetch("/api/video/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic_id: topicId }),
      });
      const json: TokenResponse = await res.json();
      setData(json);
    } catch {
      setData({ error: "Video yuklashda xatolik. Qayta urinib ko'ring." });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchToken();
    // Foydalanuvchi email'ini watermark uchun olish
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setWatermark(user.email);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  // Watermark har 20 sekundda joyini o'zgartiradi (kesib tashlash qiyin bo'lsin)
  useEffect(() => {
    if (!watermark) return;
    const t = setInterval(() => {
      setWmPos({
        top: 8 + Math.random() * 75,
        left: 5 + Math.random() * 70,
      });
    }, 20000);
    return () => clearInterval(t);
  }, [watermark]);

  // Signed URL muddati tugashidan 5 daqiqa oldin yangilash
  useEffect(() => {
    if (!data?.expires_in || data.provider !== "bunny") return;
    const t = setTimeout(fetchToken, Math.max(60, data.expires_in - 300) * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.embed_url]);

  if (loading) {
    return (
      <div className={`aspect-video bg-black/90 flex items-center justify-center ${className || ""}`}>
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  // Ruxsat yo'q — CTA
  if (data?.error || !data?.embed_url) {
    return (
      <div className={`aspect-video bg-black/90 flex flex-col items-center justify-center gap-4 p-6 text-center ${className || ""}`}>
        <div className="w-14 h-14 rounded-2xl bg-neon-purple/15 flex items-center justify-center">
          {data?.requires ? <Lock className="w-7 h-7 text-neon-purple" /> : <VideoIcon className="w-7 h-7 text-neon-purple" />}
        </div>
        <p className="text-sm text-white/80 max-w-sm">{data?.error || "Video mavjud emas"}</p>
        {data?.requires === "auth" && (
          <Link
            href={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:opacity-90 transition"
          >
            Bepul ro'yxatdan o'tish
          </Link>
        )}
        {data?.requires === "enrollment" && redirectPath && (
          <Link
            href={redirectPath.split("/topics")[0]}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:opacity-90 transition"
          >
            Kursga yozilish
          </Link>
        )}
        {!data?.requires && (
          <button
            onClick={fetchToken}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/80 text-sm hover:bg-white/10 transition"
          >
            <RefreshCw className="w-4 h-4" /> Qayta urinish
          </button>
        )}
      </div>
    );
  }

  const isDirect = data.provider === "direct";

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video bg-black select-none ${className || ""}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {isDirect ? (
        // Eski to'g'ridan-to'g'ri mp4 havolalar uchun — yuklab olish menyusi o'chirilgan
        <video
          src={data.embed_url}
          className="w-full h-full"
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          playsInline
        />
      ) : (
        <iframe
          ref={iframeRef}
          src={data.embed_url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin"
        />
      )}

      {/* Harakatlanuvchi watermark — ekran yozuvlarida foydalanuvchini aniqlash uchun */}
      {watermark && (
        <div
          className="absolute pointer-events-none text-[11px] font-mono text-white/25 transition-all duration-1000 z-10"
          style={{ top: `${wmPos.top}%`, left: `${wmPos.left}%` }}
        >
          {watermark}
        </div>
      )}
    </div>
  );
}
