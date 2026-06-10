import { featureCards } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-600">Platform capabilities</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Everything needed to turn awareness into measurable climate action.</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((feature) => (
          <Card key={feature.title} className="min-h-60">
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
