"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 daqiqa
const SESSION_CHECK_MS = 60 * 1000; // Har 1 daqiqada tekshirish

export default function AutoLogout() {
  const supabase = createClient();
  const router = useRouter();
  const lastActivity = useRef(Date.now());
  const sessionId = useRef(Math.random().toString(36).substring(2, 10));

  useEffect(() => {
    // Faollik kuzatish
    const updateActivity = () => { lastActivity.current = Date.now(); };
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach(e => window.addEventListener(e, updateActivity));

    // Session ID saqlash (single session)
    const saveSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          last_active_session: sessionId.current,
          last_seen_at: new Date().toISOString(),
        }).eq("id", user.id);
      }
    };
    saveSession();

    // Har daqiqa tekshirish
    const interval = setInterval(async () => {
      // 1. Idle timeout
      if (Date.now() - lastActivity.current > IDLE_TIMEOUT_MS) {
        await supabase.auth.signOut();
        document.cookie = "user-role=; path=/; max-age=0";
        router.push("/login?reason=idle");
        return;
      }

      // 2. Single session — boshqa qurilmadan login qilinganmi?
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("last_active_session")
          .eq("id", user.id)
          .single();

        if (profile?.last_active_session && profile.last_active_session !== sessionId.current) {
          // Boshqa qurilmadan kirildi — eski sessiyani tugatish
          await supabase.auth.signOut();
          document.cookie = "user-role=; path=/; max-age=0";
          router.push("/login?reason=other_device");
          return;
        }

        // last_seen yangilash
        await supabase.from("profiles").update({
          last_seen_at: new Date().toISOString(),
        }).eq("id", user.id);
      }
    }, SESSION_CHECK_MS);

    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, []);

  return null; // Vizual element yo'q
}
