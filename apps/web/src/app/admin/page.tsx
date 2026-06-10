"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";

const adminModules = [
  "Users and access controls",
  "Carbon records and reports",
  "Challenges and reward tuning",
  "Blog publishing and moderation",
  "Platform analytics and admin activity"
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<{
    activeUsers: number;
    totalCalculations: number;
    challengeParticipation: number;
    averageEmissionKg: number;
  } | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      return;
    }

    void (async () => {
      const response = await api<{
        stats: {
          activeUsers: number;
          totalCalculations: number;
          challengeParticipation: number;
          averageEmissionKg: number;
        };
      }>("/admin/overview");
      setStats(response.stats);
    })().catch(() => undefined);
  }, [user]);

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-600">Admin panel</p>
          <h1 className="mt-3 text-4xl font-semibold">Operational control over users, content, and platform performance.</h1>
        </div>
        {loading ? (
          <Card className="mt-8">Checking admin session...</Card>
        ) : user?.role !== "ADMIN" ? (
          <Card className="mt-8">This area is restricted to administrator accounts.</Card>
        ) : stats ? (
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              ["Active users", String(stats.activeUsers)],
              ["Calculations", String(stats.totalCalculations)],
              ["Challenge entries", String(stats.challengeParticipation)],
              ["Average emissions", `${stats.averageEmissionKg} kg`]
            ].map(([label, value]) => (
              <Card key={label}>
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="mt-3 text-3xl font-semibold">{value}</div>
              </Card>
            ))}
          </div>
        ) : null}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {adminModules.map((module) => (
            <Card key={module}>
              <h2 className="text-xl font-semibold">{module}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                This surface is wired to the admin API endpoints and designed for role-based operational workflows.
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
