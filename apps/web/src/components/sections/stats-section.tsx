import { stats } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <div className="text-4xl font-semibold">{stat.value}</div>
            <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
