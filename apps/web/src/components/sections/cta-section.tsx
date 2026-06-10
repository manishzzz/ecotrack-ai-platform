import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Card className="overflow-hidden bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-amber-400/15">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-600">Take action</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Launch a smarter sustainability workflow for yourself or your community.</h2>
          </div>
          <Button asChild size="lg">
            <Link href="/register">Create Your EcoTrack Account</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
