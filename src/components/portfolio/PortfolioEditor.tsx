"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioProject } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { cn } from "@/lib/utils";
import {
  Save, Loader2, Plus, Pencil, Trash2, X, ExternalLink, Eye, EyeOff,
  Github, Send, Linkedin, Globe, Briefcase, AlertCircle, Copy, Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

type ProfileForm = {
  username: string;
  headline: string;
  bio: string;
  skills: string;
  github_url: string;
  telegram_username: string;
  linkedin_url: string;
  website_url: string;
  is_portfolio_public: boolean;
};

const emptyProject = {
  title: "", description: "", cover_url: "",
  demo_url: "", repo_url: "", tech: "",
};

export function PortfolioEditor() {
  const { t } = useI18n();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    username: "", headline: "", bio: "", skills: "",
    github_url: "", telegram_username: "", linkedin_url: "", website_url: "",
    is_portfolio_public: false,
  });
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [pForm, setPForm] = useState(emptyProject);
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const [{ data: p }, { data: pr }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("portfolio_projects").select("*").eq("user_id", user.id).order("order_index"),
    ]);

    if (p) {
      setForm({
        username: p.username || "",
        headline: p.headline || "",
        bio: p.bio || "",
        skills: (p.skills || []).join(", "),
        github_url: p.github_url || "",
        telegram_username: p.telegram_username || "",
        linkedin_url: p.linkedin_url || "",
        website_url: p.website_url || "",
        is_portfolio_public: !!p.is_portfolio_public,
      });
    }
    if (pr) setProjects(pr as PortfolioProject[]);
    setLoading(false);
  }

  async function saveProfile() {
    if (!userId) return;
    const uname = slugify(form.username, { lower: true, strict: true });
    if (!uname) { toast.error(t.cabinet.portfolioEditor.usernameRequired); return; }
    if (uname.length < 3) { toast.error(t.cabinet.portfolioEditor.usernameShort); return; }

    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      username: uname,
      headline: form.headline.trim() || null,
      bio: form.bio.trim() || null,
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
      github_url: form.github_url.trim() || null,
      telegram_username: form.telegram_username.trim().replace(/^@/, "") || null,
      linkedin_url: form.linkedin_url.trim() || null,
      website_url: form.website_url.trim() || null,
      is_portfolio_public: form.is_portfolio_public,
    }).eq("id", userId);
    setSaving(false);

    if (error) {
      // username UNIQUE — eng ko'p uchraydigan xato shu
      toast.error(
        error.code === "23505"
          ? t.cabinet.portfolioEditor.usernameTaken
          : error.message
      );
      return;
    }
    setForm(f => ({ ...f, username: uname }));
    toast.success(t.cabinet.portfolioEditor.saved);
  }

  function openNewProject() { setPForm(emptyProject); setEditId(null); setShowForm(true); }

  function openEditProject(p: PortfolioProject) {
    setPForm({
      title: p.title, description: p.description || "", cover_url: p.cover_url || "",
      demo_url: p.demo_url || "", repo_url: p.repo_url || "", tech: (p.tech || []).join(", "),
    });
    setEditId(p.id);
    setShowForm(true);
  }

  async function saveProject() {
    if (!userId) return;
    if (!pForm.title.trim()) { toast.error(t.cabinet.portfolioEditor.projectTitleRequired); return; }
    setSavingProject(true);

    const payload = {
      user_id: userId,
      title: pForm.title.trim(),
      description: pForm.description.trim() || null,
      cover_url: pForm.cover_url.trim() || null,
      demo_url: pForm.demo_url.trim() || null,
      repo_url: pForm.repo_url.trim() || null,
      tech: pForm.tech.split(",").map(t => t.trim()).filter(Boolean),
      order_index: editId ? undefined : projects.length,
    };

    const { error } = editId
      ? await supabase.from("portfolio_projects").update(payload).eq("id", editId)
      : await supabase.from("portfolio_projects").insert(payload);

    setSavingProject(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? t.cabinet.portfolioEditor.saved : t.cabinet.portfolioEditor.added);
    setShowForm(false);
    load();
  }

  async function delProject(p: PortfolioProject) {
    if (!confirm(`"${p.title}" o'chirilsinmi?`)) return;
    await supabase.from("portfolio_projects").delete().eq("id", p.id);
    toast.success(t.cabinet.portfolioEditor.deleted);
    load();
  }

  function copyLink() {
    const url = `${window.location.origin}/u/${form.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <div className="max-w-3xl h-96 rounded-2xl border border-border/40 bg-card/30 animate-pulse" />;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-2xl flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-neon-purple" /> Portfolio
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.cabinet.portfolioEditor.subtitle}
        </p>
      </div>

      {/* Ochiq/yopiq */}
      <div className={cn(
        "flex items-start gap-3 p-4 rounded-xl border",
        form.is_portfolio_public
          ? "bg-neon-green/[0.06] border-neon-green/25"
          : "bg-surface/50 border-border"
      )}>
        {form.is_portfolio_public
          ? <Eye className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
          : <EyeOff className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {form.is_portfolio_public ? t.cabinet.portfolioEditor.publicOn : t.cabinet.portfolioEditor.publicOff}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {form.is_portfolio_public
              ? t.cabinet.portfolioEditor.publicOnHint
              : t.cabinet.portfolioEditor.publicOffHint}
          </p>
          {form.is_portfolio_public && form.username && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <code className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs">
                /u/{form.username}
              </code>
              <button onClick={copyLink} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-purple hover:underline">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t.cabinet.portfolioEditor.copied : t.cabinet.portfolioEditor.copyLink}
              </button>
              <Link href={`/u/${form.username}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-3.5 h-3.5" /> {t.cabinet.portfolioEditor.open}
              </Link>
            </div>
          )}
        </div>
        <button
          onClick={() => setForm(f => ({ ...f, is_portfolio_public: !f.is_portfolio_public }))}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0",
            form.is_portfolio_public
              ? "border border-border text-muted-foreground hover:text-foreground"
              : "bg-foreground text-background hover:opacity-90"
          )}
        >
          {form.is_portfolio_public ? t.cabinet.portfolioEditor.close : t.cabinet.portfolioEditor.open}
        </button>
      </div>

      {/* Profil */}
      <section className="space-y-4">
        <h2 className="eyebrow">{t.cabinet.portfolioEditor.basicInfo}</h2>

        <div>
          <label className="text-sm font-medium mb-1 block">{t.cabinet.portfolioEditor.username} *</label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">/u/</span>
            <input
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="input-field flex-1"
              placeholder="alivali"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t.cabinet.portfolioEditor.usernameHint}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">{t.cabinet.portfolioEditor.headline}</label>
          <input
            value={form.headline}
            onChange={e => setForm({ ...form, headline: e.target.value })}
            className="input-field"
            placeholder={t.cabinet.portfolioEditor.headlinePh}
            maxLength={120}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">{t.cabinet.portfolioEditor.about}</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            className="input-field resize-none"
            rows={4}
            placeholder={t.cabinet.portfolioEditor.aboutPh}
            maxLength={600}
          />
          <p className="text-xs text-muted-foreground mt-1">{form.bio.length}/600</p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">{t.cabinet.portfolioEditor.skills}</label>
          <input
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
            className="input-field"
            placeholder={t.cabinet.portfolioEditor.skillsPh}
          />
        </div>
      </section>

      {/* Havolalar */}
      <section className="space-y-4">
        <h2 className="eyebrow">{t.cabinet.portfolioEditor.links}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <LinkField Icon={Github} label="GitHub" value={form.github_url}
            onChange={v => setForm({ ...form, github_url: v })} placeholder="https://github.com/..." />
          <LinkField Icon={Send} label="Telegram" value={form.telegram_username}
            onChange={v => setForm({ ...form, telegram_username: v })} placeholder="@username" />
          <LinkField Icon={Linkedin} label="LinkedIn" value={form.linkedin_url}
            onChange={v => setForm({ ...form, linkedin_url: v })} placeholder="https://linkedin.com/in/..." />
          <LinkField Icon={Globe} label={t.cabinet.portfolioEditor.website} value={form.website_url}
            onChange={v => setForm({ ...form, website_url: v })} placeholder="https://..." />
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface/60 border border-border text-xs text-muted-foreground">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {t.cabinet.portfolioEditor.linksWarning}
          </span>
        </div>

        <button onClick={saveProfile} disabled={saving} className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t.common.save}
        </button>
      </section>

      {/* Loyihalar */}
      <section className="space-y-4 pt-6 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg">{t.cabinet.portfolioEditor.projects}</h2>
            <p className="text-sm text-muted-foreground">{t.cabinet.portfolioEditor.projectsHint}</p>
          </div>
          <button onClick={openNewProject} className="btn-ghost py-2 px-4 text-sm inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t.cabinet.portfolioEditor.add}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="glass-card p-5 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-sm">
                  {editId ? t.cabinet.portfolioEditor.editProject : t.cabinet.portfolioEditor.newProject}
                </h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input value={pForm.title} onChange={e => setPForm({ ...pForm, title: e.target.value })}
                className="input-field" placeholder={t.cabinet.portfolioEditor.projectTitlePh} />
              <textarea value={pForm.description} onChange={e => setPForm({ ...pForm, description: e.target.value })}
                className="input-field resize-none" rows={3} placeholder={t.cabinet.portfolioEditor.projectDescPh} maxLength={400} />

              <div className="grid sm:grid-cols-2 gap-3">
                <input value={pForm.demo_url} onChange={e => setPForm({ ...pForm, demo_url: e.target.value })}
                  className="input-field text-sm" placeholder={t.cabinet.portfolioEditor.demoPh} />
                <input value={pForm.repo_url} onChange={e => setPForm({ ...pForm, repo_url: e.target.value })}
                  className="input-field text-sm" placeholder={t.cabinet.portfolioEditor.repoPh} />
              </div>

              <input value={pForm.tech} onChange={e => setPForm({ ...pForm, tech: e.target.value })}
                className="input-field text-sm" placeholder={t.cabinet.portfolioEditor.techPh} />
              <input value={pForm.cover_url} onChange={e => setPForm({ ...pForm, cover_url: e.target.value })}
                className="input-field text-sm" placeholder={t.cabinet.portfolioEditor.coverPh} />

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-4 text-sm">{t.common.cancel}</button>
                <button onClick={saveProject} disabled={savingProject}
                  className="btn-primary py-2 px-5 text-sm inline-flex items-center gap-2 disabled:opacity-50">
                  {savingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t.common.save}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {projects.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-border rounded-xl">
            <Briefcase className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{t.cabinet.portfolioEditor.noProjects}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/40">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  {p.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                  )}
                  {p.tech?.length > 0 && (
                    <p className="text-[11px] font-mono text-muted-foreground mt-1">{p.tech.join(" · ")}</p>
                  )}
                </div>
                <button onClick={() => openEditProject(p)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => delProject(p)} className="p-2 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LinkField({
  Icon, label, value, onChange, placeholder,
}: {
  Icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-muted-foreground" /> {label}
      </label>
      <input value={value} onChange={e => onChange(e.target.value)} className="input-field text-sm" placeholder={placeholder} />
    </div>
  );
}
