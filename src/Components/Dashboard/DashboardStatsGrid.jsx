import {
  BookOpen,
  MessageSquareText,
  AlertTriangle,
  Bot,
  Sparkles,
} from "lucide-react";
import DashboardStatCard from "./DashboardStatCard";

export default function DashboardStats({ guides, tickets, onOpenAI }) {
  const pendingCount = tickets.filter((t) => t.status !== "resolved").length;

  return (
    <section className="mb-8 sm:mb-10">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            Dashboard Overview
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            System Activity at a Glance
          </h2>

          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Monitor your guides, support requests, unresolved issues, and AI assistance from one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <DashboardStatCard
          title="Available Guides"
          subtitle="Resources ready for you"
          value={guides.length}
          icon={BookOpen}
          delay={0.1}
          iconWrapClassName="bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-md"
          iconClassName="text-white"
          accentClassName="from-emerald-500/12 to-transparent"
        />

        <DashboardStatCard
          title="Support Tickets"
          subtitle="Total requests submitted"
          value={tickets.length}
          icon={MessageSquareText}
          delay={0.2}
          iconWrapClassName="bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md"
          iconClassName="text-white"
          accentClassName="from-sky-500/12 to-transparent"
        />

        <DashboardStatCard
          title="Pending Issues"
          subtitle="Items needing attention"
          value={pendingCount}
          icon={AlertTriangle}
          delay={0.3}
          iconWrapClassName="bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md"
          iconClassName="text-white"
          accentClassName="from-orange-500/12 to-transparent"
        />

        <DashboardStatCard
          title="AI Assistant"
          subtitle="Instant smart support"
          value="Online"
          icon={Bot}
          delay={0.4}
          onClick={onOpenAI}
          cardClassName="border-purple-200/80 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 dark:border-purple-800 dark:from-purple-900/20 dark:via-slate-900 dark:to-fuchsia-900/10"
          iconWrapClassName="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md"
          iconClassName="text-white"
          accentClassName="from-fuchsia-500/12 to-transparent"
          badge="Live"
        />
      </div>
    </section>
  );
}