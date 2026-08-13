"use client";

/**
 * AI agent tannarxi.
 *
 * Bitta savolga javob beradi: obuna puli LLM va TTS xarajatini
 * qoplayaptimi? Shu sababli asosiy raqam — marja, qolgan hamma
 * narsa uni tushuntirish uchun.
 */

import { useCallback, useEffect, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  Loader2, TrendingUp, TrendingDown, Zap, Coins, Users, Mic,
  BookOpen, AlertTriangle, RefreshCw,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface Report {
  days: number;
  since: string;
  pricing: { inputPerM: number; outputPerM: number; ttsPer1k: number; usdUzs: number };
  totals: {
    messages: number; tokensIn: number; tokensOut: number; ttsChars: number; lessons: number;
    llmCostUsd: number; ttsCostUsd: number; costUsd: number;
    revenueUzs: number; revenueUsd: number; marginUsd: number;
    costPerActiveUserUsd: number; activeUserCount: number;
  };
  subscriptions: { activePaid: number; pro: number; proPlus: number; total: number };
  cache: {
    lesson: number; quiz: number; task: number;
    voiceHits: number; voiceSavedChars: number; savingsUsd: number;
    cachedEntries: { lesson: number; quiz: number; task: number; voice: number };
  };
  daily: Array<{
    date: string; messages: number; tokensIn: number; tokensOut: number;
    ttsChars: number; lessons: number; costUsd: number;
  }>;
  topUsers: Array<{
    userId: string; name: string; messages: number;
    tokensIn: number; tokensOut: number; ttsChars: number; costUsd: number;
  }>;
}

const PERIODS = [7, 30, 90] as const;

const usd = (n: number) => `$${n.toFixed(2)}`;

export default function AdminAgentCostsPage() {
  const [days, setDays] = useState<number>(30);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/agent-costs?days=${days}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yuklanmadi");
      setReport(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { void load(); }, [load]);

  if (loading && !report) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm text-destructive">{error}</p>
        <button onClick={() => void load()} className="text-sm text-primary hover:underline">
          Qayta urinish
        </button>
      </div>
    );
  }

  if (!report) return null;

  const t = report.totals;
  const profitable = t.marginUsd >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">AI agent tannarxi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {report.since} dan buyon · obuna puli xarajatni qoplayaptimi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setDays(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm",
                days === p ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted",
              )}
            >
              {p} kun
            </button>
          ))}
          <button
            onClick={() => void load()}
            className="rounded-lg border border-border p-2 hover:bg-muted"
            title="Yangilash"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Asosiy raqam */}
      <div className={cn(
        "rounded-2xl border p-6",
        profitable ? "border-neon-green/30 bg-neon-green/5" : "border-destructive/30 bg-destructive/5",
      )}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              {profitable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              Marja ({report.days} kun)
            </div>
            <div className={cn(
              "font-display text-4xl font-bold",
              profitable ? "text-neon-green" : "text-destructive",
            )}>
              {profitable ? "+" : ""}{usd(t.marginUsd)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Daromad {usd(t.revenueUsd)} − xarajat {usd(t.costUsd)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Bitta faol foydalanuvchi</div>
            <div className="font-display text-2xl font-bold">{usd(t.costPerActiveUserUsd)}</div>
            <div className="text-xs text-muted-foreground">
              {t.activeUserCount} ta faol · obuna narxidan past bo'lishi kerak
            </div>
          </div>
        </div>
      </div>

      {/* Kartalar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          icon={<Zap className="h-4 w-4" />}
          label="LLM xarajati"
          value={usd(t.llmCostUsd)}
          hint={`${formatNumber(t.tokensIn)} in / ${formatNumber(t.tokensOut)} out token`}
        />
        <Card
          icon={<Mic className="h-4 w-4" />}
          label="Ovoz (TTS)"
          value={usd(t.ttsCostUsd)}
          hint={`${formatNumber(t.ttsChars)} belgi`}
        />
        <Card
          icon={<Coins className="h-4 w-4" />}
          label="Obuna daromadi"
          value={usd(t.revenueUsd)}
          hint={`${formatNumber(t.revenueUzs)} so'm`}
        />
        <Card
          icon={<Users className="h-4 w-4" />}
          label="Faol obunalar"
          value={String(report.subscriptions.activePaid)}
          hint={`Pro ${report.subscriptions.pro} · Pro+ ${report.subscriptions.proPlus}`}
        />
      </div>

      {/* Kesh tejami */}
      <div className="rounded-2xl border border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Kesh tejami</h2>
            <p className="text-sm text-muted-foreground">
              Keshsiz xarajat taxminan {usd(t.costUsd + report.cache.savingsUsd)} bo'lardi
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-bold text-neon-green">
              +{usd(report.cache.savingsUsd)}
            </div>
            <div className="text-xs text-muted-foreground">taxminiy</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <CacheStat label="Darslar" hits={report.cache.lesson} entries={report.cache.cachedEntries.lesson} />
          <CacheStat label="Testlar" hits={report.cache.quiz} entries={report.cache.cachedEntries.quiz} />
          <CacheStat label="Topshiriqlar" hits={report.cache.task} entries={report.cache.cachedEntries.task} />
          <CacheStat label="Ovoz" hits={report.cache.voiceHits} entries={report.cache.cachedEntries.voice} />
        </div>
      </div>

      {/* Kunlik grafik */}
      {report.daily.length > 0 && (
        <div className="rounded-2xl border border-border p-6">
          <h2 className="mb-4 font-semibold">Kunlik xarajat</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.daily}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d: string) => d.slice(5)}
                  stroke="currentColor"
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                  stroke="currentColor"
                  className="text-muted-foreground"
                />
                <Tooltip
                  formatter={(v: any) => usd(Number(v))}
                  labelFormatter={(l) => `Sana: ${l}`}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="costUsd"
                  name="Xarajat"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Eng qimmat foydalanuvchilar */}
      {report.topUsers.length > 0 && (
        <div className="rounded-2xl border border-border p-6">
          <h2 className="mb-1 font-semibold">Eng ko'p xarajat qilganlar</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Zarar shu ro'yxatning yuqorisidan boshlanadi — kunlik chegarani shularga qarab sozlang
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Foydalanuvchi</th>
                  <th className="pb-2 text-right font-medium">Xabar</th>
                  <th className="pb-2 text-right font-medium">Token</th>
                  <th className="pb-2 text-right font-medium">TTS belgi</th>
                  <th className="pb-2 text-right font-medium">Xarajat</th>
                </tr>
              </thead>
              <tbody>
                {report.topUsers.map((u) => (
                  <tr key={u.userId} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5">{u.name}</td>
                    <td className="py-2.5 text-right">{formatNumber(u.messages)}</td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {formatNumber(u.tokensIn + u.tokensOut)}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {formatNumber(u.ttsChars)}
                    </td>
                    <td className="py-2.5 text-right font-medium">{usd(u.costUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Narx sozlamalari */}
      <div className="flex gap-3 rounded-2xl border border-border bg-muted/30 p-5 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="mb-2 text-muted-foreground">
            Hisob quyidagi narxlarga asoslangan. Ular <code>.env.local</code> orqali
            sozlanadi — provayder tarifi o'zgarganda yangilang, aks holda marja
            noto'g'ri ko'rinadi.
          </p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            <li><code>AGENT_COST_INPUT_PER_M</code> = ${report.pricing.inputPerM} / 1M token</li>
            <li><code>AGENT_COST_OUTPUT_PER_M</code> = ${report.pricing.outputPerM} / 1M token</li>
            <li><code>AGENT_COST_TTS_PER_1K</code> = ${report.pricing.ttsPer1k} / 1000 belgi</li>
            <li><code>USD_UZS_RATE</code> = {formatNumber(report.pricing.usdUzs)} so'm</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Card({
  icon, label, value, hint,
}: {
  icon: React.ReactNode; label: string; value: string; hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function CacheStat({ label, hits, entries }: { label: string; hits: number; entries: number }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-lg font-bold">{formatNumber(hits)}</div>
      <div className="text-xs text-muted-foreground">
        {formatNumber(entries)} ta yozuv · keshdan berilgan
      </div>
    </div>
  );
}
