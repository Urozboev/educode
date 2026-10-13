"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GUIDE_SETTINGS_KEY, toEmbed, type GuideVideos } from "@/lib/guide";
import { cn } from "@/lib/utils";

/**
 * Yo'riqnoma video manzillari — `platform_settings.guide_videos`.
 * Jadvalni hamma o'qiy oladi (settings_select siyosati), yozish faqat admin.
 */
export function useGuideVideos() {
  const [videos, setVideos] = useState<GuideVideos>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let bekor = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("platform_settings")
        .select("value")
        .eq("key", GUIDE_SETTINGS_KEY)
        .maybeSingle();
      if (bekor) return;
      const v = data?.value;
      setVideos(v && typeof v === "object" ? (v as GuideVideos) : {});
      setLoaded(true);
    })();
    return () => { bekor = true; };
  }, []);
  return { videos, loaded };
}

/** Video bor bo'lsa — 16:9 pleyer. Yo'q bo'lsa hech narsa chizmaydi. */
export function GuideVideo({ url, title, className }: { url?: string; title: string; className?: string }) {
  const e = toEmbed(url);
  if (!e) return null;
  return (
    <div className={cn("relative aspect-video rounded-2xl overflow-hidden border border-border bg-black", className)}>
      {e.kind === "video" ? (
        <video src={e.src} controls preload="metadata" className="absolute inset-0 w-full h-full" title={title} />
      ) : (
        <iframe
          src={e.src}
          title={title}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
    </div>
  );
}
