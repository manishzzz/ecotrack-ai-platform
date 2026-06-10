import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function ChartCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="h-full">
      <div className="mb-5">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}
