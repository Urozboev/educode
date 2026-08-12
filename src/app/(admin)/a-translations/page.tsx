"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Languages, Loader2, Save, Search, ChevronLeft, Check, RefreshCw,
} from "lucide-react";
import { LOCALE_META, LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import {
  RESOURCE_LABEL, RESOURCE_TITLE_FIELD,
  type TranslatableResource, type TranslatableField,
} from "@/lib/i18n/content";

/**
 * Kontent tarjimasi paneli.
 *
 * Chapda asl (o'zbekcha) matn, o'ngda tanlangan tildagi tarjima.
 * Yonma-yon turishi shart: tarjimon nimani o'girayotganini ko'rib
 * turmasa, uzun HTML darsni almashtirib yuborish oson.
 *
 * Maydonlar ro'yxati `translatable_fields` reyestridan keladi — yangi
 * maydon qo'shish uchun shu sahifani emas, reyestrni tahrirlash kerak.
 */

const TARGET_LOCALES = LOCALES.filter(l => l !== DEFAULT_LOCALE) as Locale[];

interface ProgressRow {
  resource: string;
  locale: string;
  translated: number;
  total: number;
  percent: number;
}

export default function TranslationsPage() {
  const supabase = createClient();
  const [fields, setFields] = useState<TranslatableField[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [resource, setResource] = useState<TranslatableResource>("topics");
  const [locale, setLocale] = useState<Locale>("ru");

  const [rows, setRows] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);

  // Reyestr va holat
  const loadMeta = useCallback(async () => {
    const [{ data: f }, { data: p }] = await Promise.all([
      supabase.from("translatable_fields").select("*").order("resource").order("order_index"),
      supabase.rpc("translation_progress"),
    ]);
    if (f) setFields(f as TranslatableField[]);
    if (p) setProgress(p as ProgressRow[]);
  }, [supabase]);

  useEffect(() => { loadMeta(); }, [loadMeta]);

  // Tanlangan resursning qatorlari
  const loadRows = useCallback(async () => {
    setLoading(true);
    setActive(null);
    const titleField = RESOURCE_TITLE_FIELD[resource];
    const { data } = await supabase
      .from(resource)
      .select(`id, ${titleField}`)
      .order(titleField)
      .limit(500);
    setRows(data ?? []);
    setLoading(false);
  }, [supabase, resource]);

  useEffect(() => { loadRows(); }, [loadRows]);

  const resourceFields = fields.filter(f => f.resource === resource);

  async function openRow(row: any) {
    setActive(row);
    setSaved({});

    // Asl qiymatlar va mavjud tarjimalar
    const cols = resourceFields.map(f => f.field).join(", ");
    const [{ data: full }, { data: tr }] = await Promise.all([
      supabase.from(resource).select(`id, ${cols}`).eq("id", row.id).single(),
      supabase.rpc("get_translations", {
        p_resource: resource, p_row_ids: [row.id], p_locale: locale,
      }),
    ]);

    setActive({ ...row, __source: full ?? {} });

    const t = (tr as { row_id: string; fields: Record<string, unknown> }[] | null)?.[0]?.fields ?? {};
    const next: Record<string, string> = {};
    for (const f of resourceFields) {
      const v = t[f.field];
      next[f.field] = v == null ? "" : (f.kind === "json" ? JSON.stringify(v, null, 2) : String(v));
    }
    setValues(next);
  }

  async function saveField(f: TranslatableField) {
    if (!active) return;
    setSavingField(f.field);

    let payload: { p_value: string | null; p_value_json: unknown | null } = {
      p_value: values[f.field] || null, p_value_json: null,
    };

    if (f.kind === "json") {
      const raw = values[f.field]?.trim();
      if (raw) {
        try {
          payload = { p_value: null, p_value_json: JSON.parse(raw) };
        } catch {
          setSavingField(null);
          toast.error(`"${f.label}" — JSON noto'g'ri yozilgan`);
          return;
        }
      } else {
        payload = { p_value: null, p_value_json: null };
      }
    }

    const { data, error } = await supabase.rpc("save_translation", {
      p_resource: resource,
      p_row_id: active.id,
      p_locale: locale,
      p_field: f.field,
      ...payload,
    });
    setSavingField(null);

    if (error || !data?.ok) { toast.error(data?.message || error?.message || "Saqlanmadi"); return; }
    setSaved(s => ({ ...s, [f.field]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [f.field]: false })), 1800);
    loadMeta();
  }

  const shown = rows.filter(r => {
    const title = String(r[RESOURCE_TITLE_FIELD[resource]] ?? "");
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const pct = (res: string, loc: string) =>
    progress.find(p => p.resource === res && p.locale === loc)?.percent ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl">Kontent tarjimasi</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Mavzular, testlar, topshiriqlar va boshqa kontentni boshqa tillarga o&apos;girish
          </p>
        </div>
        <button onClick={loadMeta} className="btn-ghost px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Yangilash
        </button>
      </div>

      {/* Til tanlash */}
      <div className="flex items-center gap-2 flex-wrap">
        <Languages className="w-4 h-4 text-muted-foreground" />
        {TARGET_LOCALES.map(l => (
          <button
            key={l}
            onClick={() => { setLocale(l); setActive(null); }}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition inline-flex items-center gap-2",
              locale === l
                ? "bg-neon-purple/10 text-neon-purple border-neon-purple/30"
                : "bg-surface text-muted-foreground border-transparent hover:border-border")}
          >
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface border border-border">
              {LOCALE_META[l].code}
            </span>
            {LOCALE_META[l].native}
          </button>
        ))}
      </div>

      {/* Bo'limlar va holat */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {(Object.keys(RESOURCE_LABEL) as TranslatableResource[]).map(r => {
          const p = pct(r, locale);
          return (
            <button
              key={r}
              onClick={() => setResource(r)}
              className={cn("p-3 rounded-xl border text-left transition",
                resource === r
                  ? "border-neon-purple bg-neon-purple/[0.06]"
                  : "border-border/60 bg-card/40 hover:border-neon-purple/40")}
            >
              <p className="text-xs font-semibold truncate">{RESOURCE_LABEL[r]}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex-1 h-1 rounded-full bg-surface overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", p >= 100 ? "bg-neon-green" : "bg-neon-yellow")}
                    style={{ width: `${Math.min(100, p)}%` }}
                  />
                </div>
                <span className="numeric text-[10px] text-muted-foreground">{p}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {active ? (
        /* ============ TAHRIRLASH ============ */
        <div className="space-y-4">
          <button
            onClick={() => setActive(null)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ChevronLeft className="w-4 h-4" /> Ro&apos;yxatga qaytish
          </button>

          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{RESOURCE_LABEL[resource]}</p>
            <p className="font-semibold">{active[RESOURCE_TITLE_FIELD[resource]]}</p>
          </div>

          {resourceFields.map(f => {
            const source = active.__source?.[f.field];
            const sourceText = f.kind === "json"
              ? JSON.stringify(source ?? null, null, 2)
              : String(source ?? "");
            return (
              <div key={f.field} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm">{f.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground bg-surface px-2 py-0.5 rounded">
                      {f.kind}
                    </span>
                    <button
                      onClick={() => saveField(f)}
                      disabled={savingField === f.field}
                      className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingField === f.field ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : saved[f.field] ? <Check className="w-3.5 h-3.5" />
                        : <Save className="w-3.5 h-3.5" />}
                      {saved[f.field] ? "Saqlandi" : "Saqlash"}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">
                      Asl matn — O&apos;zbekcha
                    </label>
                    <textarea
                      readOnly
                      value={sourceText}
                      className="input-field w-full text-xs font-mono min-h-[140px] resize-y bg-surface/40 text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">
                      Tarjima — {LOCALE_META[locale].native}
                    </label>
                    <textarea
                      value={values[f.field] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [f.field]: e.target.value }))}
                      placeholder={f.kind === "json" ? "JSON ko'rinishida" : "Tarjimani shu yerga yozing"}
                      className="input-field w-full text-xs font-mono min-h-[140px] resize-y"
                    />
                  </div>
                </div>

                {!values[f.field] && (
                  <p className="text-[11px] text-muted-foreground">
                    Bo&apos;sh qoldirilsa foydalanuvchi o&apos;zbekcha matnni ko&apos;radi — sahifa baribir ishlaydi.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ============ QATORLAR RO'YXATI ============ */
        <>
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`${RESOURCE_LABEL[resource]} ichidan qidirish...`}
              className="input-field w-full text-sm pl-10"
            />
          </div>

          {loading ? (
            <div className="space-y-2">{[1, 2, 3, 4].map(i => <div key={i} className="glass-card h-12 animate-pulse" />)}</div>
          ) : shown.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground text-sm">Yozuv topilmadi</p>
          ) : (
            <div className="space-y-1.5">
              {shown.map(r => (
                <motion.button
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => openRow(r)}
                  className="w-full text-left p-3.5 rounded-xl border border-border/60 bg-card/40 hover:border-neon-purple/40 transition flex items-center gap-3"
                >
                  <Languages className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate flex-1">
                    {String(r[RESOURCE_TITLE_FIELD[resource]] ?? "").slice(0, 120)}
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
