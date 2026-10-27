"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/user";
import type { TopicTask } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  ImagePlus, Loader2, Send, X, CheckCircle2, Clock, AlertTriangle, ListChecks,
} from "lucide-react";

const BUCKET = "task-reports";
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Katta skrinshotni brauzerda kichraytiradi.
 *
 * 4K ekrandagi PNG skrinshot 6–10 MB bo'ladi va bucket chegarasidan
 * (5 MB) o'tmaydi. 1920 px kenglik o'qituvchi ko'rishi uchun yetarli,
 * JPEG 0.85 da matn o'qiladigan bo'lib qoladi.
 */
async function shrinkImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  const MAX_SIDE = 1920;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.85),
  );
}

interface Uploaded {
  path: string;
  preview: string;
}

interface LastSubmission {
  id: string;
  status: string;
  code: string;
  attachments: string[] | null;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
}

/**
 * `report` topshirig'i: amaliy ish hisoboti.
 *
 * Talaba ishni (Packet Tracer, Wireshark, Windows Server…) o'z
 * kompyuterida bajaradi, skrinshot va xulosa yuklaydi. Yuborilgach
 * mavzu bo'yicha topshiriq bajarilgan hisoblanadi — o'qituvchi
 * tekshiruvini kutib turish talabani keyingi mavzudan to'xtatib
 * qo'ymasligi kerak. O'qituvchi esa qabul qiladi yoki izoh bilan
 * qaytaradi; talaba izohni shu yerda ko'radi va qayta yuboradi.
 */
export default function ReportTask({
  task,
  onSubmitted,
}: {
  task: TopicTask;
  onSubmitted: () => void;
}) {
  const supabase = createClient();
  const spec = task.report_spec ?? { steps: [], prompt: "", min_images: 1, max_images: 4, min_chars: 40 };
  const [userId, setUserId] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean[]>(() => spec.steps.map(() => false));
  const [images, setImages] = useState<Uploaded[]>([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [last, setLast] = useState<LastSubmission | null>(null);
  const [lastUrls, setLastUrls] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadLast = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("submissions")
      .select("id, status, code, attachments, review_note, reviewed_at, created_at")
      .eq("user_id", uid)
      .eq("task_id", task.id)
      .eq("language", "report")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sub = (data as LastSubmission | null) ?? null;
    setLast(sub);
    // Qaytarilgan hisobotda forma darhol ochiq, qolganlarida yopiq
    setShowForm(!sub || sub.status === "wrong_answer");
    const paths = sub?.attachments ?? [];
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
      setLastUrls((signed ?? []).map((s) => s.signedUrl).filter(Boolean) as string[]);
    } else {
      setLastUrls([]);
    }
  }, [supabase, task.id]);

  useEffect(() => {
    setChecked(spec.steps.map(() => false));
    setImages([]);
    setText("");
    (async () => {
      const user = await getCurrentUser(supabase);
      if (!user) return;
      setUserId(user.id);
      loadLast(user.id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  async function addFiles(files: FileList | null) {
    if (!files || !userId) {
      if (!userId) toast.error("Tizimga kiring");
      return;
    }
    const room = spec.max_images - images.length;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    if (list.length === 0) {
      if (room <= 0) toast.error(`Ko'pi bilan ${spec.max_images} ta rasm`);
      return;
    }
    setUploading(true);
    const added: Uploaded[] = [];
    for (const file of list) {
      const blob = await shrinkImage(file);
      if (blob.size > MAX_BYTES) {
        toast.error(`${file.name}: 5 MB dan katta`);
        continue;
      }
      const ext = blob.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${userId}/${task.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
        contentType: blob.type || file.type,
        upsert: false,
      });
      if (error) {
        toast.error(`Yuklashda xato: ${error.message}`);
        continue;
      }
      added.push({ path, preview: URL.createObjectURL(blob) });
    }
    setImages((prev) => [...prev, ...added]);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function removeImage(i: number) {
    const img = images[i];
    setImages((prev) => prev.filter((_, j) => j !== i));
    URL.revokeObjectURL(img.preview);
    await supabase.storage.from(BUCKET).remove([img.path]);
  }

  const textOk = text.trim().length >= spec.min_chars;
  const imagesOk = images.length >= spec.min_images;
  const canSend = textOk && imagesOk && !uploading && !sending;

  async function send() {
    if (!canSend || !userId) return;
    setSending(true);
    const { error } = await supabase.from("submissions").insert({
      user_id: userId,
      task_id: task.id,
      task_type: "topic_task",
      language: "report",
      code: text.trim(),
      status: "pending",
      passed_tests: 0,
      total_tests: 1,
      attachments: images.map((x) => x.path),
      test_results: spec.steps.map((s, i) => ({ step: s, done: checked[i] })),
    });
    setSending(false);
    if (error) {
      toast.error(`Yuborishda xato: ${error.message}`);
      return;
    }
    images.forEach((x) => URL.revokeObjectURL(x.preview));
    setImages([]);
    setText("");
    toast.success("Hisobot yuborildi. O'qituvchi tekshirgach natija shu yerda ko'rinadi.");
    onSubmitted();
    loadLast(userId);
  }

  return (
    <div className="space-y-4">
      {/* Oxirgi yuborilgan hisobot holati */}
      {last && (
        <div
          className={cn(
            "glass-card p-4 space-y-3 border",
            last.status === "accepted" && "border-neon-green/40",
            last.status === "pending" && "border-amber-500/40",
            last.status === "wrong_answer" && "border-neon-red/40",
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            {last.status === "accepted" && <><CheckCircle2 className="w-4 h-4 text-neon-green" /> Hisobot qabul qilingan</>}
            {last.status === "pending" && <><Clock className="w-4 h-4 text-amber-500" /> Tekshirilmoqda</>}
            {last.status === "wrong_answer" && <><AlertTriangle className="w-4 h-4 text-neon-red" /> Qayta ishlashga qaytarilgan</>}
            <span className="ml-auto text-xs font-normal text-muted-foreground">{formatDateTime(last.created_at)}</span>
          </div>
          {last.review_note && (
            <p className="text-sm rounded-xl bg-surface/60 px-3 py-2 whitespace-pre-line">
              <span className="font-semibold">O'qituvchi izohi: </span>{last.review_note}
            </p>
          )}
          {lastUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lastUrls.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt={`Hisobot rasmi ${i + 1}`} className="h-20 w-auto rounded-lg border border-border object-cover" />
                </a>
              ))}
            </div>
          )}
          {!showForm && (
            <button type="button" onClick={() => setShowForm(true)} className="btn-ghost text-sm py-2 px-4">
              Yangi variant yuborish
            </button>
          )}
        </div>
      )}

      {showForm && (
        <div className="glass-card p-5 space-y-5">
          {spec.steps.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-neon-purple" /> Bajarish tartibi
              </p>
              <ol className="space-y-1.5">
                {spec.steps.map((s, i) => (
                  <li key={i}>
                    <label className="flex items-start gap-2.5 text-sm cursor-pointer rounded-lg px-2 py-1.5 hover:bg-surface/50">
                      <input
                        type="checkbox"
                        checked={checked[i] ?? false}
                        onChange={(e) => {
                          const next = [...checked];
                          next[i] = e.target.checked;
                          setChecked(next);
                        }}
                        className="mt-0.5 accent-neon-purple w-4 h-4 shrink-0"
                      />
                      <span className={cn("leading-relaxed", checked[i] && "text-muted-foreground line-through")}>
                        <span className="font-mono text-xs text-muted-foreground mr-1">{i + 1}.</span>
                        {s}
                      </span>
                    </label>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Rasmlar */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Skrinshotlar{" "}
              <span className="font-normal text-muted-foreground">
                ({images.length}/{spec.max_images}, kamida {spec.min_images} ta)
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={img.path} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt={`Yuklangan rasm ${i + 1}`} className="h-24 w-auto max-w-[180px] rounded-xl border border-border object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label={`${i + 1}-rasmni olib tashlash`}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-red text-white flex items-center justify-center shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {images.length < spec.max_images && (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addFiles(e.dataTransfer.files);
                  }}
                  className="h-24 w-36 rounded-xl border-2 border-dashed border-border hover:border-neon-purple/60 hover:bg-neon-purple/[0.04] flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-colors disabled:opacity-60"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                  {uploading ? "Yuklanmoqda…" : "Rasm qo'shish"}
                </button>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              hidden
              onChange={(e) => addFiles(e.target.files)}
            />
            <p className="text-[11px] text-muted-foreground">
              PNG, JPG yoki WebP. Katta rasmlar avtomatik kichraytiriladi. Skrinshotda parol yoki shaxsiy ma'lumot ko'rinmasin.
            </p>
          </div>

          {/* Xulosa */}
          <div className="space-y-2">
            <label htmlFor={`report-${task.id}`} className="text-sm font-semibold block">Xulosa</label>
            {spec.prompt && <p className="text-xs text-muted-foreground leading-relaxed">{spec.prompt}</p>}
            <textarea
              id={`report-${task.id}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="input-field text-sm resize-y"
              placeholder="Nima qildingiz, qanday natija oldingiz va nimani tushundingiz?"
            />
            <p className={cn("text-[11px] font-mono", textOk ? "text-neon-green" : "text-muted-foreground")}>
              {text.trim().length}/{spec.min_chars} belgi
            </p>
          </div>

          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Hisobotni yuborish
          </button>
        </div>
      )}
    </div>
  );
}
