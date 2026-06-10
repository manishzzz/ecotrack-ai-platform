import { SiteHeader } from "@/components/layout/site-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <DashboardShell />
      </div>
    </main>
  );
}
