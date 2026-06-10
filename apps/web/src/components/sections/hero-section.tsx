"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20">
      <div className="absolute inset-0 bg-mesh" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge>AI-powered climate intelligence</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            Understand Your Carbon Impact. Build A Sustainable Future.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Calculate, track, reduce, and visualize your carbon footprint with a platform designed like a modern product,
            not a spreadsheet.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/register">
                Start Calculating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">View Product Demo</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-400/10" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly carbon score</p>
                  <p className="text-4xl font-semibold">74/100</p>
                </div>
                <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Transport impact", "82 kg CO2e"],
                  ["Energy impact", "56 kg CO2e"],
                  ["Predicted next month", "188 kg CO2e"],
                  ["Reduction potential", "15%"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <p className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
                AI Advisor: Shifting 3 weekly car commutes to public transport can cut your transport emissions by about 15%.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
