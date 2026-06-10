import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-3xl border border-border/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-primary/60 dark:bg-white/5",
        className
      )}
      {...props}
    />
  );
}
