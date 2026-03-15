"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Course, Topic, Quiz, TopicTask } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import {
  ArrowLeft, Plus, Pencil, Trash2, Save, X, Loader2, Video, FileText,
  ChevronUp, ChevronDown, ClipboardList, Code2, Sparkles, Brain, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminTopicsPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const supabase = createClient();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Topic form
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editTopicId, setEditTopicId] = useState<string | null>(null);
  const [topicForm, setTopicForm] = useState({ title: "", content_html: "", video_url: "", presentation_url: "", coin_reward: 10, xp_reward: 25, estimated_minutes: 30 });
  const [savingTopic, setSavingTopic] = useState(false);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);

  // Expanded topic (shows quizzes and tasks)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [topicQuizzes, setTopicQuizzes] = useState<Quiz[]>([]);
  const [topicTasks, setTopicTasks] = useState<TopicTask[]>([]);

  // Quiz form
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState({ question: "", options: '[{"id":"a","text":"","is_correct":false},{"id":"b","text":"","is_correct":true},{"id":"c","text":"","is_correct":false},{"id":"d","text":"","is_correct":false}]', explanation: "" });

  // Task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", starter_code: "# Kodingizni yozing\n", language: "python", test_cases: '[{"input":"","expected_output":"","is_hidden":false}]', difficulty: "easy" });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: c } = await supabase.from("courses").select("*").eq("id", courseId).single();
    if (c) setCourse(c as Course);
    const { data: t } = await supabase.from("topics").select("*").eq("course_id", courseId).order("order_index");
    if (t) setTopics(t as Topic[]);
    setLoading(false);
  }

  async function loadTopicDetails(topicId: string) {
    const { data: q } = await supabase.from("quizzes").select("*").eq("topic_id", topicId).order("order_index");
    if (q) setTopicQuizzes(q as Quiz[]);
    const { data: t } = await supabase.from("topic_tasks").select("*").eq("topic_id", topicId).order("order_index");
    if (t) setTopicTasks(t as TopicTask[]);
  }

  function toggleExpand(topicId: string) {
    if (expandedTopic === topicId) { setExpandedTopic(null); return; }
    setExpandedTopic(topicId);
    loadTopicDetails(topicId);
  }

  // ==================== TOPIC CRUD ====================
  function openNewTopic() {
    setTopicForm({ title: "", content_html: "", video_url: "", presentation_url: "", coin_reward: 10, xp_reward: 25, estimated_minutes: 30 });
    setEditTopicId(null); setShowTopicForm(true);
  }

  function openEditTopic(t: Topic) {
    setTopicForm({ title: t.title, content_html: t.content_html || "", video_url: t.video_url || "", presentation_url: t.presentation_url || "", coin_reward: t.coin_reward, xp_reward: t.xp_reward, estimated_minutes: t.estimated_minutes });
    setEditTopicId(t.id); setShowTopicForm(true);
  }

  async function saveTopic() {
    if (!topicForm.title.trim()) { toast.error("Mavzu nomini kiriting"); return; }
    setSavingTopic(true);
    const slug = slugify(topicForm.title, { lower: true, strict: true });
    const payload = { ...topicForm, slug, course_id: courseId, video_url: topicForm.video_url || null, presentation_url: topicForm.presentation_url || null };

    if (editTopicId) {
      const { error } = await supabase.from("topics").update(payload).eq("id", editTopicId);
      if (error) { toast.error(error.message); setSavingTopic(false); return; }
      toast.success("Mavzu yangilandi");
    } else {
      const { error } = await supabase.from("topics").insert({ ...payload, order_index: topics.length });
      if (error) { toast.error(error.message); setSavingTopic(false); return; }
      await supabase.from("courses").update({ total_topics: topics.length + 1 }).eq("id", courseId);
      toast.success("Yangi mavzu qo'shildi");
    }
    setShowTopicForm(false); setSavingTopic(false); loadData();
  }

  async function deleteTopic(t: Topic) {
    if (!confirm(`"${t.title}" mavzusini o'chirish?`)) return;
    await supabase.from("topics").delete().eq("id", t.id);
    await supabase.from("courses").update({ total_topics: Math.max(0, topics.length - 1) }).eq("id", courseId);
    toast.success("O'chirildi"); loadData();
  }

  async function moveOrder(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= topics.length) return;
    await supabase.from("topics").update({ order_index: newIdx }).eq("id", topics[idx].id);
    await supabase.from("topics").update({ order_index: idx }).eq("id", topics[newIdx].id);
    loadData();
  }

  // ==================== AI GENERATION ====================
  async function aiGenerate(type: 'lecture' | 'quiz' | 'task', topicTitle?: string) {
    setAiGenerating(type);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic_title: topicTitle || topicForm.title, course_title: course?.title }),
      });
      const data = await res.json();
      if (data.error && !data.data) { toast.error(data.error); setAiGenerating(null); return; }

      if (type === 'lecture') {
        setTopicForm(f => ({ ...f, content_html: data.data }));
        toast.success("Ma'ruza matni yaratildi!");
      } else if (type === 'quiz' && data.data) {
        // Quizlarni DB ga saqlash
        const quizzes = Array.isArray(data.data) ? data.data : [data.data];
        for (let i = 0; i < quizzes.length; i++) {
          await supabase.from("quizzes").insert({
            topic_id: expandedTopic, question: quizzes[i].question,
            question_type: quizzes[i].question_type || "single",
            options: quizzes[i].options, explanation: quizzes[i].explanation || "",
            points: 1, order_index: topicQuizzes.length + i,
          });
        }
        toast.success(`${quizzes.length} ta test savoli yaratildi!`);
        if (expandedTopic) loadTopicDetails(expandedTopic);
      } else if (type === 'task' && data.data) {
        const task = data.data;
        await supabase.from("topic_tasks").insert({
          topic_id: expandedTopic, title: task.title, description: task.description,
          starter_code: task.starter_code || "", solution_code: task.solution_code || "",
          language: task.language || "python", test_cases: task.test_cases || [],
          hints: task.hints || [], difficulty: task.difficulty || "easy",
          coin_reward: task.coin_reward || 5, xp_reward: task.xp_reward || 15,
          order_index: topicTasks.length,
        });
        toast.success("Amaliy topshiriq yaratildi!");
        if (expandedTopic) loadTopicDetails(expandedTopic);
      }
    } catch (e: any) { toast.error("AI xatolik: " + e.message); }
    setAiGenerating(null);
  }

  // ==================== QUIZ CRUD ====================
  async function saveQuiz() {
    if (!expandedTopic || !quizForm.question.trim()) { toast.error("Savolni kiriting"); return; }
    let options;
    try { options = JSON.parse(quizForm.options); } catch { toast.error("Options JSON noto'g'ri"); return; }

    await supabase.from("quizzes").insert({
      topic_id: expandedTopic, question: quizForm.question, question_type: "single",
      options, explanation: quizForm.explanation, points: 1, order_index: topicQuizzes.length,
    });
    toast.success("Test savoli qo'shildi");
    setShowQuizForm(false);
    setQuizForm({ question: "", options: '[{"id":"a","text":"","is_correct":false},{"id":"b","text":"","is_correct":true},{"id":"c","text":"","is_correct":false},{"id":"d","text":"","is_correct":false}]', explanation: "" });
    loadTopicDetails(expandedTopic);
  }

  async function deleteQuiz(id: string) {
    if (!confirm("Savolni o'chirish?")) return;
    await supabase.from("quizzes").delete().eq("id", id);
    toast.success("O'chirildi");
    if (expandedTopic) loadTopicDetails(expandedTopic);
  }

  // ==================== TASK CRUD ====================
  async function saveTask() {
    if (!expandedTopic || !taskForm.title.trim()) { toast.error("Nomini kiriting"); return; }
    let testCases;
    try { testCases = JSON.parse(taskForm.test_cases); } catch { toast.error("Test cases JSON noto'g'ri"); return; }

    await supabase.from("topic_tasks").insert({
      topic_id: expandedTopic, title: taskForm.title, description: taskForm.description,
      starter_code: taskForm.starter_code, language: taskForm.language,
      test_cases: testCases, difficulty: taskForm.difficulty,
      coin_reward: 5, xp_reward: 15, order_index: topicTasks.length,
    });
    toast.success("Topshiriq qo'shildi");
    setShowTaskForm(false);
    setTaskForm({ title: "", description: "", starter_code: "# Kodingizni yozing\n", language: "python", test_cases: '[{"input":"","expected_output":"","is_hidden":false}]', difficulty: "easy" });
    loadTopicDetails(expandedTopic);
  }

  async function deleteTask(id: string) {
    if (!confirm("Topshiriqni o'chirish?")) return;
    await supabase.from("topic_tasks").delete().eq("id", id);
    toast.success("O'chirildi");
    if (expandedTopic) loadTopicDetails(expandedTopic);
  }

  // ==================== RENDER ====================
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/a-courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Kurslar
          </Link>
          <h1 className="font-display font-bold text-2xl">{course?.title || "..."} — Mavzular</h1>
          <p className="text-sm text-muted-foreground">{topics.length} ta mavzu</p>
        </div>
        <button onClick={openNewTopic} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi mavzu
        </button>
      </div>

      {/* ===== TOPIC FORM ===== */}
      <AnimatePresence>
        {showTopicForm && (
          <motion.div className="glass-card p-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold">{editTopicId ? "Mavzuni tahrirlash" : "Yangi mavzu"}</h2>
              <button onClick={() => setShowTopicForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Mavzu nomi *</label>
                <input value={topicForm.title} onChange={e => setTopicForm({ ...topicForm, title: e.target.value })} className="input-field" placeholder="O'zgaruvchilar va ma'lumot turlari" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Ma'ruza matni (HTML)</label>
                  <button onClick={() => aiGenerate('lecture')} disabled={!topicForm.title || aiGenerating === 'lecture'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 disabled:opacity-50 transition-all">
                    {aiGenerating === 'lecture' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    AI bilan yaratish
                  </button>
                </div>
                <textarea value={topicForm.content_html} onChange={e => setTopicForm({ ...topicForm, content_html: e.target.value })}
                  className="input-field min-h-[250px] font-mono text-sm" placeholder="<h2>Sarlavha</h2><p>Matn...</p>" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Video URL</label>
                  <input value={topicForm.video_url} onChange={e => setTopicForm({ ...topicForm, video_url: e.target.value })} className="input-field" placeholder="https://youtube.com/watch?v=..." /></div>
                <div><label className="text-sm font-medium mb-1 block">Taqdimot URL</label>
                  <input value={topicForm.presentation_url} onChange={e => setTopicForm({ ...topicForm, presentation_url: e.target.value })} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Coin</label>
                  <input type="number" value={topicForm.coin_reward} onChange={e => setTopicForm({ ...topicForm, coin_reward: +e.target.value })} className="input-field" /></div>
                <div><label className="text-sm font-medium mb-1 block">XP</label>
                  <input type="number" value={topicForm.xp_reward} onChange={e => setTopicForm({ ...topicForm, xp_reward: +e.target.value })} className="input-field" /></div>
                <div><label className="text-sm font-medium mb-1 block">Daqiqa</label>
                  <input type="number" value={topicForm.estimated_minutes} onChange={e => setTopicForm({ ...topicForm, estimated_minutes: +e.target.value })} className="input-field" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowTopicForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
              <button onClick={saveTopic} disabled={savingTopic} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {savingTopic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editTopicId ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== TOPICS LIST ===== */}
      <div className="space-y-2">
        {loading ? [1,2,3].map(i => <div key={i} className="glass-card p-4 h-16 animate-pulse" />) :
        topics.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="mb-4">Hali mavzu qo'shilmagan</p>
            <button onClick={openNewTopic} className="btn-primary text-sm py-2 px-5"><Plus className="w-4 h-4 inline mr-1" /> Birinchi mavzuni qo'shish</button>
          </div>
        ) : topics.map((t, i) => (
          <div key={t.id}>
            <motion.div className="glass-card p-4 flex items-center gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveOrder(i, -1)} disabled={i === 0} className="p-0.5 hover:bg-accent rounded disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => moveOrder(i, 1)} disabled={i === topics.length - 1} className="p-0.5 hover:bg-accent rounded disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center text-neon-purple font-bold text-sm flex-shrink-0">{i + 1}</div>
              <button onClick={() => toggleExpand(t.id)} className="flex-1 min-w-0 text-left">
                <p className="font-medium text-sm truncate">{t.title}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                  {t.video_url && <span className="flex items-center gap-0.5"><Video className="w-3 h-3" /> Video</span>}
                  {t.content_html && <span className="flex items-center gap-0.5"><FileText className="w-3 h-3" /> Matn</span>}
                  <span>+{t.coin_reward} coin</span>
                </div>
              </button>
              <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedTopic === t.id && "rotate-90")} />
              <div className="flex items-center gap-1">
                <button onClick={() => openEditTopic(t)} className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteTopic(t)} className="p-1.5 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>

            {/* ===== EXPANDED: QUIZZES + TASKS ===== */}
            <AnimatePresence>
              {expandedTopic === t.id && (
                <motion.div className="ml-12 mt-2 mb-4 space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>

                  {/* QUIZZES */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2"><ClipboardList className="w-4 h-4 text-neon-blue" /> Test savollari ({topicQuizzes.length})</h3>
                      <div className="flex gap-2">
                        <button onClick={() => aiGenerate('quiz', t.title)} disabled={aiGenerating === 'quiz'}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 disabled:opacity-50">
                          {aiGenerating === 'quiz' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI yaratish
                        </button>
                        <button onClick={() => setShowQuizForm(!showQuizForm)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface hover:bg-surface-hover">
                          <Plus className="w-3 h-3" /> Qo'lda
                        </button>
                      </div>
                    </div>

                    {topicQuizzes.map((q, qi) => (
                      <div key={q.id} className="flex items-start gap-2 p-2 rounded-lg bg-surface/50 mb-1.5 text-xs">
                        <span className="text-muted-foreground font-mono w-5 flex-shrink-0">{qi + 1}.</span>
                        <span className="flex-1">{q.question}</span>
                        <button onClick={() => deleteQuiz(q.id)} className="p-1 hover:bg-neon-red/10 rounded text-muted-foreground hover:text-neon-red"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}

                    {showQuizForm && (
                      <div className="mt-3 p-3 rounded-xl bg-surface/50 border border-border space-y-2">
                        <input value={quizForm.question} onChange={e => setQuizForm({ ...quizForm, question: e.target.value })} className="input-field text-sm" placeholder="Savol matni..." />
                        <textarea value={quizForm.options} onChange={e => setQuizForm({ ...quizForm, options: e.target.value })} className="input-field font-mono text-[10px] min-h-[60px]" />
                        <input value={quizForm.explanation} onChange={e => setQuizForm({ ...quizForm, explanation: e.target.value })} className="input-field text-sm" placeholder="Tushuntirish (ixtiyoriy)" />
                        <div className="flex gap-2">
                          <button onClick={saveQuiz} className="btn-primary py-1.5 px-3 text-xs">Qo'shish</button>
                          <button onClick={() => setShowQuizForm(false)} className="btn-ghost py-1.5 px-3 text-xs">Bekor</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TASKS */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2"><Code2 className="w-4 h-4 text-neon-purple" /> Amaliy topshiriqlar ({topicTasks.length})</h3>
                      <div className="flex gap-2">
                        <button onClick={() => aiGenerate('task', t.title)} disabled={aiGenerating === 'task'}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20 disabled:opacity-50">
                          {aiGenerating === 'task' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI yaratish
                        </button>
                        <button onClick={() => setShowTaskForm(!showTaskForm)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface hover:bg-surface-hover">
                          <Plus className="w-3 h-3" /> Qo'lda
                        </button>
                      </div>
                    </div>

                    {topicTasks.map((task, ti) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface/50 mb-1.5 text-xs">
                        <Code2 className="w-3.5 h-3.5 text-neon-purple flex-shrink-0" />
                        <span className="flex-1 font-medium">{task.title}</span>
                        <span className="text-muted-foreground">{task.language} · {task.difficulty}</span>
                        <button onClick={() => deleteTask(task.id)} className="p-1 hover:bg-neon-red/10 rounded text-muted-foreground hover:text-neon-red"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}

                    {showTaskForm && (
                      <div className="mt-3 p-3 rounded-xl bg-surface/50 border border-border space-y-2">
                        <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} className="input-field text-sm" placeholder="Topshiriq nomi" />
                        <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} className="input-field text-sm min-h-[50px]" placeholder="Tavsif" />
                        <div className="grid grid-cols-2 gap-2">
                          <select value={taskForm.language} onChange={e => setTaskForm({ ...taskForm, language: e.target.value })} className="input-field text-sm">
                            <option value="python">Python</option><option value="javascript">JavaScript</option>
                          </select>
                          <select value={taskForm.difficulty} onChange={e => setTaskForm({ ...taskForm, difficulty: e.target.value })} className="input-field text-sm">
                            <option value="easy">Oson</option><option value="medium">O'rta</option><option value="hard">Qiyin</option>
                          </select>
                        </div>
                        <textarea value={taskForm.starter_code} onChange={e => setTaskForm({ ...taskForm, starter_code: e.target.value })} className="input-field font-mono text-xs min-h-[50px]" placeholder="Boshlang'ich kod" />
                        <textarea value={taskForm.test_cases} onChange={e => setTaskForm({ ...taskForm, test_cases: e.target.value })} className="input-field font-mono text-[10px] min-h-[50px]" placeholder='[{"input":"5","expected_output":"10","is_hidden":false}]' />
                        <div className="flex gap-2">
                          <button onClick={saveTask} className="btn-primary py-1.5 px-3 text-xs">Qo'shish</button>
                          <button onClick={() => setShowTaskForm(false)} className="btn-ghost py-1.5 px-3 text-xs">Bekor</button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
