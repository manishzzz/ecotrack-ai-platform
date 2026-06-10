"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({
  className,
  value
}: {
  className?: string;
  value: number;
}) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-secondary/70", className)}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
