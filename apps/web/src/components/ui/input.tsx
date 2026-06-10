import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-border/70 bg-white/70 px-4 text-sm outline-none ring-0 transition focus:border-primary/60 dark:bg-white/5",
        className
      )}
      {...props}
    />
  );
}
