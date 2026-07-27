"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  LessonGame, LessonGameType, LessonGameContent, CourseDifficulty,
  QuizRaceContent, JeopardyContent, MatchPairsContent, CrosswordContent,
} from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { cn } from "@/lib/utils";
import { GAME_TYPES, emptyContent, validateContent, cleanContent, gameTypeLabel } from "@/lib/lessonGames";
import { CrosswordEditor } from "./CrosswordEditor";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, Gamepad2,
  Trophy, Play, Timer, Grid3x3, Link2, Users, Table2, Radio,
} from "lucide-react";

const TYPE_ICON: Record<LessonGameType, React.ElementType> = {
  quiz_race: Timer,
  jeopardy: Grid3x3,
  match_pairs: Link2,
  crossword: Table2,
};

const CATEGORIES = [
  { value: "programming", label: "Dasturlash" },
  { value: "python", label: "Python" },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: "Kompyuter savodxonligi" },
  { value: "algorithms", label: "Algoritmlar" },
];

const DIFFICULTIES: { value: CourseDifficulty; label: string }[] = [
  { value: "beginner", label: "Boshlang'ich" },
  { value: "intermediate", label: "O'rta" },
  { value: "advanced", label: "Yuqori" },
];

type Form = {
  title: string;
  description: string;
  type: LessonGameType;
  category: string;
  difficulty: CourseDifficulty;
  coin_reward: number;
  xp_reward: number;
  content: LessonGameContent;
};

const emptyForm = (): Form => ({
  title: "", description: "", type: "quiz_race",
  category: "programming", difficulty: "beginner",
  coin_reward: 5, xp_reward: 15,
  content: emptyContent("quiz_race"),
});

/**
 * O'yinlar CRUD.
 * `scope="teacher"` bo'lsa faqat o'z o'yinlari ko'rinadi — RLS baribir
 * cheklaydi, lekin so'rovni ham cheklab qo'ygan ma'qul.
 */
export function LessonGamesAdmin({ scope }: { scope: "admin" | "teacher" }) {
  const supabase = createClient();
  const [games, setGames] = useState<LessonGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busyLive, setBusyLive] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    /**
     * O'qituvchi barcha o'yinlarni ko'radi — hamkasbining ishini olib
     * darsda ishlatishi mumkin. Tahrirlash va o'chirish faqat o'zinikida
     * (RLS ham shuni ta'minlaydi, interfeys esa yo'q tugmani ko'rsatmaydi).
     */
    const { data } = await supabase
      .from("lesson_games")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setGames(data as LessonGame[]);
    setLoading(false);
  }

  function openNew() { setForm(emptyForm()); setEditId(null); setShowForm(true); }

  function openEdit(g: LessonGame) {
    setForm({
      title: g.title, description: g.description || "", type: g.type,
      category: g.category, difficulty: g.difficulty,
      coin_reward: g.coin_reward, xp_reward: g.xp_reward,
      content: g.content,
    });
    setEditId(g.id);
    setShowForm(true);
  }

  function changeType(type: LessonGameType) {
    // Kontent shakli butunlay boshqacha — turni almashtirsak qaytadan boshlaymiz
    if (!confirm("Turni almashtirsangiz kiritilgan savollar o'chadi. Davom etamizmi?")) return;
    setForm(f => ({ ...f, type, content: emptyContent(type) }));
  }

  async function save(publish?: boolean) {
    if (!form.title.trim()) { toast.error("Nom kiriting"); return; }

    const err = validateContent(form.type, form.content);
    if (err) { toast.error(err); return; }

    if (!userId) { toast.error("Sessiya topilmadi, sahifani yangilang"); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.title, { lower: true, strict: true }),
      description: form.description.trim() || null,
      type: form.type,
      content: cleanContent(form.type, form.content),
      category: form.category,
      difficulty: form.difficulty,
      coin_reward: form.coin_reward,
      xp_reward: form.xp_reward,
      ...(editId ? {} : { author_id: userId }),
      ...(publish !== undefined ? { is_published: publish } : {}),
    };

    const { error } = editId
      ? await supabase.from("lesson_games").update(payload).eq("id", editId)
      : await supabase.from("lesson_games").insert(payload);

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Saqlandi" : "Yaratildi");
    setShowForm(false);
    load();
  }

  async function togglePublish(g: LessonGame) {
    await supabase.from("lesson_games").update({ is_published: !g.is_published }).eq("id", g.id);
    load();
  }

  async function del(g: LessonGame) {
    if (!confirm(`"${g.title}" o'chirilsinmi? Natijalar ham o'chadi.`)) return;
    await supabase.from("lesson_games").delete().eq("id", g.id);
    toast.success("O'chirildi");
    load();
  }

  /** Tahrirlash faqat o'z o'yinida; admin hammasini tahrirlaydi */
  const canEdit = (g: LessonGame) => scope === "admin" || g.author_id === userId;

  /**
   * Jonli sessiya — hozircha faqat tezlik viktorinasi uchun.
   * Qolgan turlar navbat bilan emas, erkin o'ynaladi, shuning uchun
   * "hamma birga bir savolda" modeli ularga to'g'ri kelmaydi.
   */
  async function startLive(g: LessonGame) {
    setBusyLive(g.id);
    const { data, error } = await supabase.rpc("create_game_session", { p_game_id: g.id });
    setBusyLive(null);
    if (error) { toast.error(error.message); return; }
    router.push(`/t-live/${data.session_id}`);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-neon-purple" /> Dars o&apos;yinlari
          </h1>
          <p className="text-sm text-muted-foreground">
            {`${games.length} ta o'yin`}{scope === "teacher" && " · hamkasblarnikini ham ko'rishingiz mumkin"}
          </p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi o&apos;yin
        </button>
      </div>

      {/* FORMA */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="glass-card p-6 space-y-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">{editId ? "Tahrirlash" : "Yangi o'yin"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {/* Tur tanlash */}
            <div>
              <label className="text-sm font-medium mb-2 block">O&apos;yin turi</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {GAME_TYPES.map(t => {
                  const Icon = TYPE_ICON[t.value];
                  const active = form.type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => active ? undefined : (editId || hasContent(form) ? changeType(t.value) : setForm(f => ({ ...f, type: t.value, content: emptyContent(t.value) })))}
                      className={cn(
                        "text-left p-4 rounded-xl border-2 transition-all",
                        active ? "border-neon-purple bg-neon-purple/[0.08]" : "border-border bg-surface/40 hover:bg-surface/60"
                      )}
                    >
                      <Icon className={cn("w-5 h-5 mb-2", active ? "text-neon-purple" : "text-muted-foreground")} />
                      <p className="text-sm font-semibold">{t.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{t.akin}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Nom *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Sikllar bo'yicha viktorina" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tavsif</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} placeholder="Qaysi mavzuni mustahkamlaydi" maxLength={300} />
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block">Soha</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Daraja</label>
                <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value as CourseDifficulty })} className="input-field">
                  {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Coin</label>
                <input type="number" min={0} value={form.coin_reward} onChange={e => setForm({ ...form, coin_reward: +e.target.value })} className="input-field" />
              </div>
            </div>

            {/* Kontent muharriri */}
            <div className="pt-2 border-t border-border/60">
              {form.type === "quiz_race" && (
                <QuizEditor
                  content={form.content as QuizRaceContent}
                  onChange={c => setForm(f => ({ ...f, content: c }))}
                />
              )}
              {form.type === "jeopardy" && (
                <JeopardyEditor
                  content={form.content as JeopardyContent}
                  onChange={c => setForm(f => ({ ...f, content: c }))}
                />
              )}
              {form.type === "match_pairs" && (
                <PairsEditor
                  content={form.content as MatchPairsContent}
                  onChange={c => setForm(f => ({ ...f, content: c }))}
                />
              )}
              {form.type === "crossword" && (
                <CrosswordEditor
                  content={form.content as CrosswordContent}
                  onChange={c => setForm(f => ({ ...f, content: c }))}
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
              <button onClick={() => save(false)} disabled={saving} className="btn-ghost py-2 px-5 text-sm border border-border flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Qoralama
              </button>
              <button onClick={() => save(true)} disabled={saving} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} Nashr qilish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RO'YXAT */}
      <div className="space-y-2">
        {loading ? [1, 2, 3].map(i => <div key={i} className="glass-card h-16 animate-pulse" />) :
        games.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">Hali o&apos;yin yaratilmagan</p>
            <button onClick={openNew} className="btn-primary text-sm py-2 px-5"><Plus className="w-4 h-4 inline mr-1" /> Birinchi o&apos;yin</button>
          </div>
        ) : games.map(g => {
          const Icon = TYPE_ICON[g.type];
          return (
            <div key={g.id} className="glass-card p-4 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-neon-purple/[0.08] border border-neon-purple/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-neon-purple" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{g.title}</p>
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground mt-0.5">
                  <span>{gameTypeLabel(g.type)}</span>
                  <span className="inline-flex items-center gap-1">· <Users className="w-3 h-3" />{g.plays}</span>
                  {g.is_published
                    ? <span className="text-neon-green">· Nashr qilingan</span>
                    : <span className="text-neon-yellow">· Qoralama</span>}
                </div>
              </div>
              {g.is_published && (
                <Link href={`/play/${g.slug}`} target="_blank" className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground" title="O'ynab ko'rish">
                  <Play className="w-4 h-4" />
                </Link>
              )}
              {g.type === "quiz_race" && (
                <button
                  onClick={() => startLive(g)}
                  disabled={busyLive === g.id}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-neon-purple/30 text-neon-purple bg-neon-purple/[0.06] hover:bg-neon-purple/[0.12] disabled:opacity-50 transition-colors"
                  title="Sinf bilan jonli o'ynash"
                >
                  {busyLive === g.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
                  Jonli
                </button>
              )}
              {canEdit(g) ? (
                <>
                  <button onClick={() => togglePublish(g)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground" title={g.is_published ? "Yashirish" : "Nashr"}>
                    {g.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(g)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(g)} className="p-2 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
                </>
              ) : (
                <span className="text-[11px] text-muted-foreground px-2 whitespace-nowrap">boshqa muallif</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Formada allaqachon kontent bormi — turni almashtirishda ogohlantirish uchun */
function hasContent(f: Form): boolean {
  const c: any = f.content;
  if (c.questions) return c.questions.some((q: any) => q.text?.trim());
  if (c.categories) return c.categories.some((cat: any) => cat.name?.trim());
  if (c.pairs) return c.pairs.some((p: any) => p.left?.trim());
  if (c.words) return c.words.length > 0;
  return false;
}

/* ============================================================
   TEZLIK VIKTORINASI MUHARRIRI
   ============================================================ */
function QuizEditor({ content, onChange }: { content: QuizRaceContent; onChange: (c: QuizRaceContent) => void }) {
  const qs = content.questions || [];

  const set = (i: number, patch: Partial<QuizRaceContent["questions"][0]>) =>
    onChange({ questions: qs.map((q, idx) => idx === i ? { ...q, ...patch } : q) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm">
          Savollar <span className="numeric text-muted-foreground">({qs.length})</span>
        </h3>
        <button
          type="button"
          onClick={() => onChange({ questions: [...qs, { text: "", seconds: 20, options: [
            { text: "", correct: true }, { text: "", correct: false },
            { text: "", correct: false }, { text: "", correct: false },
          ] }] })}
          className="text-xs font-semibold text-neon-purple hover:underline inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Savol qo&apos;shish
        </button>
      </div>

      {qs.map((q, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-surface/30 space-y-3">
          <div className="flex items-start gap-3">
            <span className="numeric text-sm text-muted-foreground mt-2.5">{String(i + 1).padStart(2, "0")}</span>
            <input
              value={q.text}
              onChange={e => set(i, { text: e.target.value })}
              className="input-field flex-1"
              placeholder="Savol matni"
            />
            <input
              type="number"
              min={5}
              max={120}
              value={q.seconds}
              onChange={e => set(i, { seconds: +e.target.value })}
              className="input-field w-20 text-center"
              title="Soniya"
            />
            {qs.length > 1 && (
              <button
                type="button"
                onClick={() => onChange({ questions: qs.filter((_, idx) => idx !== i) })}
                className="p-2.5 rounded-lg text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-2 pl-8">
            {q.options.map((o, oi) => (
              <label
                key={oi}
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors",
                  o.correct ? "border-neon-green/40 bg-neon-green/[0.06]" : "border-border bg-card"
                )}
              >
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={o.correct}
                  onChange={() => set(i, { options: q.options.map((x, xi) => ({ ...x, correct: xi === oi })) })}
                  className="accent-[hsl(var(--brand-green))]"
                />
                <input
                  value={o.text}
                  onChange={e => set(i, { options: q.options.map((x, xi) => xi === oi ? { ...x, text: e.target.value } : x) })}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder={`Variant ${oi + 1}`}
                />
              </label>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground pl-8">
            To&apos;g&apos;ri javobni radio tugma bilan belgilang
          </p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   JEOPARDY MUHARRIRI
   ============================================================ */
function JeopardyEditor({ content, onChange }: { content: JeopardyContent; onChange: (c: JeopardyContent) => void }) {
  const cats = content.categories || [];

  const setCat = (ci: number, patch: Partial<JeopardyContent["categories"][0]>) =>
    onChange({ categories: cats.map((c, i) => i === ci ? { ...c, ...patch } : c) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm">
          Kategoriyalar <span className="numeric text-muted-foreground">({cats.length})</span>
        </h3>
        <button
          type="button"
          onClick={() => onChange({ categories: [...cats, { name: "", cells: [100, 200, 300].map(v => ({ value: v, question: "", answer: "" })) }] })}
          className="text-xs font-semibold text-neon-purple hover:underline inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Kategoriya
        </button>
      </div>

      {cats.map((cat, ci) => (
        <div key={ci} className="p-4 rounded-xl border border-border bg-surface/30 space-y-3">
          <div className="flex items-center gap-3">
            <input
              value={cat.name}
              onChange={e => setCat(ci, { name: e.target.value })}
              className="input-field flex-1 font-semibold"
              placeholder="Kategoriya nomi (masalan: Sikllar)"
            />
            {cats.length > 1 && (
              <button
                type="button"
                onClick={() => onChange({ categories: cats.filter((_, i) => i !== ci) })}
                className="p-2.5 rounded-lg text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {cat.cells.map((cell, ri) => (
            <div key={ri} className="grid sm:grid-cols-[70px_1fr_1fr_40px] gap-2 items-start">
              <input
                type="number"
                value={cell.value}
                onChange={e => setCat(ci, { cells: cat.cells.map((x, i) => i === ri ? { ...x, value: +e.target.value } : x) })}
                className="input-field text-center numeric"
                title="Ball"
              />
              <input
                value={cell.question}
                onChange={e => setCat(ci, { cells: cat.cells.map((x, i) => i === ri ? { ...x, question: e.target.value } : x) })}
                className="input-field text-sm"
                placeholder="Savol"
              />
              <input
                value={cell.answer}
                onChange={e => setCat(ci, { cells: cat.cells.map((x, i) => i === ri ? { ...x, answer: e.target.value } : x) })}
                className="input-field text-sm"
                placeholder="Javob"
              />
              {cat.cells.length > 1 && (
                <button
                  type="button"
                  onClick={() => setCat(ci, { cells: cat.cells.filter((_, i) => i !== ri) })}
                  className="p-2.5 rounded-lg text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setCat(ci, { cells: [...cat.cells, { value: (cat.cells.length + 1) * 100, question: "", answer: "" }] })}
            className="text-xs font-semibold text-neon-purple hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Katak qo&apos;shish
          </button>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   JUFTLIKLAR MUHARRIRI
   ============================================================ */
function PairsEditor({ content, onChange }: { content: MatchPairsContent; onChange: (c: MatchPairsContent) => void }) {
  const pairs = content.pairs || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm">
          Juftliklar <span className="numeric text-muted-foreground">({pairs.length})</span>
        </h3>
        <button
          type="button"
          onClick={() => onChange({ pairs: [...pairs, { left: "", right: "" }] })}
          className="text-xs font-semibold text-neon-purple hover:underline inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Juftlik
        </button>
      </div>

      {pairs.map((p, i) => (
        <div key={i} className="grid sm:grid-cols-[24px_1fr_1fr_40px] gap-2 items-center">
          <span className="numeric text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          <input
            value={p.left}
            onChange={e => onChange({ pairs: pairs.map((x, xi) => xi === i ? { ...x, left: e.target.value } : x) })}
            className="input-field text-sm"
            placeholder="Termin"
          />
          <input
            value={p.right}
            onChange={e => onChange({ pairs: pairs.map((x, xi) => xi === i ? { ...x, right: e.target.value } : x) })}
            className="input-field text-sm"
            placeholder="Ta'rif"
          />
          {pairs.length > 2 && (
            <button
              type="button"
              onClick={() => onChange({ pairs: pairs.filter((_, xi) => xi !== i) })}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
