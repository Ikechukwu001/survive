import { Users, AlertCircle, FileText, Sparkles } from "lucide-react";
import InstallerStatCard from "./InstallerStatCard";

export default function InstallerStatsGrid({
  stats,
  onOpenClients,
  onOpenTickets,
  onOpenGuides,
}) {
  return (
    <section className="mb-8 sm:mb-10">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
            <Sparkles className="h-3.5 w-3.5" />
            Installer Overview
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Business Activity at a Glance
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Track your clients, pending support issues, and published solar guides.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
        <InstallerStatCard
          title="Total Clients"
          subtitle="Connected customer accounts"
          value={stats?.totalClients ?? 0}
          icon={Users}
          delay={0.1}
          onClick={onOpenClients}
          iconWrapClassName="bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md"
          iconClassName="text-white"
          accentClassName="from-sky-500/12 to-transparent"
        />

        <InstallerStatCard
          title="Pending Tickets"
          subtitle="Support issues awaiting attention"
          value={stats?.pendingTickets ?? 0}
          icon={AlertCircle}
          delay={0.2}
          onClick={onOpenTickets}
          iconWrapClassName="bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-md"
          iconClassName="text-white"
          accentClassName="from-red-500/12 to-transparent"
        />

        <InstallerStatCard
          title="Guides Created"
          subtitle="Published installer resources"
          value={stats?.totalGuides ?? 0}
          icon={FileText}
          delay={0.3}
          onClick={onOpenGuides}
          iconWrapClassName="bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-md"
          iconClassName="text-white"
          accentClassName="from-emerald-500/12 to-transparent"
        />
      </div>
    </section>
  );
}