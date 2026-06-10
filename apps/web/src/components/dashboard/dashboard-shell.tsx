"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { mockDashboard } from "@/lib/mock-data";
import type { DashboardOverview } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ChartCard } from "./chart-card";

const pieColors = ["#10b981", "#06b6d4", "#f59e0b", "#6366f1"];

type CalculatorFormState = {
  monthLabel: string;
  carKm: number;
  bikeKm: number;
  publicTransportKm: number;
  flightKm: number;
  electricityKwh: number;
  lpgCylinders: number;
  acHours: number;
  foodType: "VEGETARIAN" | "MIXED" | "NON_VEGETARIAN";
  shoppingHabit: "LOW" | "MODERATE" | "HIGH";
  plasticUsageKg: number;
  waterConsumptionLiters: number;
};

const initialForm: CalculatorFormState = {
  monthLabel: "June 2026",
  carKm: 180,
  bikeKm: 22,
  publicTransportKm: 60,
  flightKm: 0,
  electricityKwh: 190,
  lpgCylinders: 0.8,
  acHours: 40,
  foodType: "MIXED",
  shoppingHabit: "MODERATE",
  plasticUsageKg: 2,
  waterConsumptionLiters: 10200
};

export function DashboardShell() {
  const [data, setData] = useState<DashboardOverview | typeof mockDashboard>(mockDashboard);
  const [advice, setAdvice] = useState(
    "Start by replacing a few high-emission commutes each week and trim idle cooling time during peak hours."
  );
  const [chatQuestion, setChatQuestion] = useState(
    "What is the fastest way to reduce my carbon footprint over the next month without major lifestyle disruption?"
  );
  const [chatAnswer, setChatAnswer] = useState(
    "Ask Eco Assistant anything about sustainability, reduction methods, or offsets."
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Showing a guided demo until you sign in.");
  const [form, setForm] = useState({ ...initialForm });
  const { user, loading: authLoading } = useAuth();

  const scoreValue = useMemo(() => data.stats.latestCarbonScore, [data.stats.latestCarbonScore]);

  async function refreshDashboard() {
    const nextData = await api<DashboardOverview>("/dashboard/overview");
    setData(nextData);
    setStatus("Your latest dashboard data is live.");
  }

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    void refreshDashboard().catch(() => {
      setStatus("Signed in, but live dashboard data could not be loaded right now.");
    });
  }, [authLoading, user]);

  async function submitCalculation() {
    if (!user) {
      setChatAnswer("Sign in first to store calculations and unlock AI recommendations from the API.");
      return;
    }

    setLoading(true);
    try {
      const response = await api<{ record: { aiAdvice?: string } }>("/carbon/calculate", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setAdvice(response.record.aiAdvice ?? advice);
      await refreshDashboard();
    } catch (error) {
      setChatAnswer(error instanceof Error ? error.message : "Unable to calculate carbon footprint.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPredictions() {
    if (!user) {
      setChatAnswer("Sign in first to generate forecast data.");
      return;
    }

    setLoading(true);
    try {
      await api("/carbon/predictions");
      await refreshDashboard();
    } catch (error) {
      setChatAnswer(error instanceof Error ? error.message : "Unable to generate forecast data.");
    } finally {
      setLoading(false);
    }
  }

  async function askAssistant() {
    if (!user) {
      setChatAnswer("Sign in first to ask the AI assistant with your latest carbon context.");
      return;
    }

    setLoading(true);
    try {
      const response = await api<{ answer: string }>("/chat/assistant", {
        method: "POST",
        body: JSON.stringify({ question: chatQuestion })
      });
      setChatAnswer(response.answer);
    } catch (error) {
      setChatAnswer(error instanceof Error ? error.message : "Unable to reach Eco Assistant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-background">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge>Carbon dashboard</Badge>
            <h1 className="mt-4 text-4xl font-semibold">Track progress, forecast change, and turn data into action.</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              EcoTrack AI combines carbon analytics, AI recommendations, challenges, offsets, and ESG insight cards in a single workflow.
            </p>
          </div>
          <Card className="bg-background/60">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Session status</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {authLoading
                    ? "Checking your session..."
                    : user
                      ? `Signed in as ${user.name}.`
                      : "Browse the demo now, then sign in to save calculations and unlock live tracking."}
                </p>
              </div>
              <Button variant="outline" onClick={() => void refreshDashboard()} disabled={!user || authLoading}>
                Refresh live dashboard
              </Button>
              <p className="text-xs text-muted-foreground">{status}</p>
            </div>
          </Card>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total emissions", `${data.stats.totalEmissionsKg} kg CO2e`],
          ["Average monthly", `${data.stats.averageMonthlyKg} kg`],
          ["Level & points", `Lv ${data.stats.level} • ${data.stats.points} pts`],
          ["Trees saved", `${data.stats.treesSaved} trees`]
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartCard title="Carbon score" description="Higher scores indicate lower monthly emissions and steadier progress.">
          <div className="space-y-4">
            <div className="text-5xl font-semibold">{scoreValue}/100</div>
            <Progress value={scoreValue} />
          </div>
        </ChartCard>
        <ChartCard title="AI Sustainability Advisor" description="Personalized suggestions and goals generated from your footprint profile.">
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{advice}</p>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly emissions trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.monthlyTrend}>
                <defs>
                  <linearGradient id="emissionFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="emissions" stroke="#10b981" fill="url(#emissionFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Emission breakdown">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.charts.breakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                  {data.charts.breakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Weekly trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="emissions" stroke="#06b6d4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Forecasts">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.predictionSeries}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predictedKg" fill="#f59e0b" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="text-2xl font-semibold">Carbon calculator</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.entries(form).map(([key, value]) => (
              <div key={key}>
                <label className="mb-2 block text-sm capitalize text-muted-foreground">{key}</label>
                {typeof value === "number" ? (
                  <Input
                    type="number"
                    value={value}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, [key]: Number(event.target.value) }))
                    }
                  />
                ) : key === "foodType" ? (
                  <select
                    value={value}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [key]: event.target.value as CalculatorFormState["foodType"]
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-border/70 bg-white/70 px-4 text-sm dark:bg-white/5"
                  >
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="MIXED">Mixed</option>
                    <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                  </select>
                ) : key === "shoppingHabit" ? (
                  <select
                    value={value}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [key]: event.target.value as CalculatorFormState["shoppingHabit"]
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-border/70 bg-white/70 px-4 text-sm dark:bg-white/5"
                  >
                    <option value="LOW">Low</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                  </select>
                ) : (
                  <Input value={value} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={submitCalculation} disabled={loading}>
              Save calculation
            </Button>
            <Button variant="outline" onClick={fetchPredictions} disabled={loading}>
              Generate forecast
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold">Eco Assistant</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ask climate and sustainability questions with your latest carbon context.</p>
          <div className="mt-5">
            <Textarea value={chatQuestion} onChange={(event) => setChatQuestion(event.target.value)} />
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={askAssistant} disabled={loading}>
              Ask AI assistant
            </Button>
          </div>
          <div className="mt-5 rounded-[28px] border border-white/10 bg-background/50 p-4 text-sm leading-7 text-muted-foreground">
            {chatAnswer}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h3 className="text-xl font-semibold">Rewards</h3>
          <div className="mt-4 space-y-4">
            {data.rewards.map((reward) => (
              <div key={reward.title} className="rounded-3xl border border-white/10 p-4">
                <div className="font-semibold">{reward.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{reward.description}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold">Recent history</h3>
          <div className="mt-4 space-y-3">
            {data.history.map((item) => (
              <div key={item.monthLabel} className="flex items-center justify-between rounded-3xl border border-white/10 p-4">
                <div>
                  <div className="font-medium">{item.monthLabel}</div>
                  <div className="text-sm text-muted-foreground">Score {item.carbonScore}</div>
                </div>
                <div className="text-right font-semibold">{item.monthlyEmissionKg} kg</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold">Challenges and streaks</h3>
          <div className="mt-4 space-y-3">
            {data.activityFeed.map((item) => (
              <div key={`${item.title}-${item.timestamp}`} className="rounded-3xl border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.title}</div>
                  <Badge>{item.status}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
