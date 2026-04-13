import { motion } from "framer-motion";
import {
  BookOpen,
  MessageSquareText,
  ArrowRight,
  Clock3,
  Sparkles,
} from "lucide-react";
import { Card, Badge, EmptyState } from "../../UI";

export default function OverviewTab({ guides = [], tickets = [], installerInfo }) {
  const recentGuides = guides.slice(0, 3);
  const recentTickets = tickets.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              Overview
            </div>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome to your solar workspace
            </h3>

            <p className="mt-2 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
              View your latest guides, recent support requests, and key account activity in one place.
            </p>
          </div>

          {installerInfo ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">Assigned installer</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {installerInfo.companyName || "Solar Partner"}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Guides
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Quick access to the latest installer resources
              </p>
            </div>
          </div>

          {recentGuides.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No guides yet"
              description="Your installer hasn’t created any guides yet."
            />
          ) : (
            <div className="space-y-3">
              {recentGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Card className="rounded-2xl border border-slate-200/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h5 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {guide.title}
                        </h5>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {guide.content}
                        </p>
                      </div>

                      <Badge className="shrink-0 capitalize">
                        {guide.category || "Guide"}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Tickets
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your latest support activity
              </p>
            </div>
          </div>

          {recentTickets.length === 0 ? (
            <EmptyState
              icon={MessageSquareText}
              title="No tickets submitted"
              description="You haven’t created any support tickets yet."
            />
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Card className="rounded-2xl border border-slate-200/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h5 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {ticket.title}
                        </h5>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Clock3 className="h-4 w-4" />
                          <span>
                            {ticket.createdAt
                              ? new Date(ticket.createdAt).toLocaleString()
                              : "Recently created"}
                          </span>
                        </div>
                      </div>

                      <Badge
                        className={
                          ticket.status === "resolved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                        }
                      >
                        {ticket.status || "pending"}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Card className="rounded-[28px] border border-slate-200/70 p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Need help quickly?
            </h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Try the AI Assistant tab first for immediate troubleshooting guidance.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
            <span>Switch to AI Assistant</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </div>
  );
}