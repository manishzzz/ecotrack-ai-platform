const steps = [
  ["Track your habits", "Enter transport, energy, food, and lifestyle details in minutes."],
  ["See your footprint", "Get monthly and annual emissions, a carbon score, and category breakdowns."],
  ["Act on AI advice", "Follow tailored weekly plans, challenge missions, and reduction goals."],
  ["Improve over time", "Watch trend lines, predictions, offsets, and rewards build momentum."]
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-600">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">A cleaner workflow for sustainable living decisions.</h2>
        </div>
        <div className="space-y-5">
          {steps.map(([title, description], index) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/60 p-6 backdrop-blur-xl dark:bg-white/5">
              <div className="text-sm text-emerald-600">0{index + 1}</div>
              <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
