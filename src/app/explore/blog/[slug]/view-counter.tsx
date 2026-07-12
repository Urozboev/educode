"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/** Maqola ochilganda ko'rishlar hisoblagichini oshiradi (bir marta) */
export function BlogViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `blog_viewed_${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    createClient().rpc("increment_blog_view", { p_slug: slug }).then(() => {});
  }, [slug]);
  return null;
}
