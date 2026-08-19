import { NextRequest } from "next/server";
import { synthesize, pickProvider } from "@/lib/agent/voice";
import { stripForSpeech, splitForTTS } from "@/lib/agent/speech-text";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** HTML teglarini olib tashlab, ovoz uchun toza matn hosil qilish */
function htmlToSpokenText(html: string): string {
  if (!html) return "";
  let text = html
    .replace(/<pre[\s\S]*?<\/pre>/gi, " Dastur kodi misoli. ") // code blocks are announced briefly
    .replace(/<code[\s\S]*?<\/code>/gi, (match) => {
      const codeInside = match.replace(/<[^>]+>/g, "").trim();
      return codeInside.length < 25 ? ` ${codeInside} ` : " kod ";
    })
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n\n$1.\n\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n— $1.\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  return stripForSpeech(text);
}

export async function POST(req: NextRequest) {
  try {
    const { html, text, lang = "uz" } = await req.json().catch(() => ({}));
    const rawContent = html ? htmlToSpokenText(html) : (text || "");

    if (!rawContent || rawContent.trim().length === 0) {
      return Response.json({ error: "Matn topilmadi" }, { status: 400 });
    }

    const cleanSpeech = rawContent.slice(0, 4000); // 4000 char safe limit per lecture
    const chunks = splitForTTS(cleanSpeech).slice(0, 8);
    const provider = pickProvider(lang);

    const clips: Array<{ text: string; audioUrl: string | null; cached: boolean }> = [];

    for (const chunk of chunks) {
      try {
        const res = await synthesize(chunk, lang);
        clips.push({
          text: chunk,
          audioUrl: res.audioUrl,
          cached: res.cached,
        });
      } catch (err: any) {
        clips.push({
          text: chunk,
          audioUrl: null,
          cached: false,
        });
      }
    }

    return Response.json({
      provider,
      lang,
      spokenText: cleanSpeech,
      clips,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Audio generatsiyasida xatolik" },
      { status: 500 }
    );
  }
}
