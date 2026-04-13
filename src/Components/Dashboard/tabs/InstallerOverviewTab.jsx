import { motion } from "framer-motion";
import {
  Users,
  AlertCircle,
  CheckCircle,
  Clock3,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Card, Badge, EmptyState } from "../../UI";

export default function InstallerOverviewTab({ clients = [], tickets = [] }) {
  const recentClients = clients.slice(0, 4);
  const recentTickets = tickets.slice(0, 4);

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "pending"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
              <Sparkles className="h-3.5 w-3.5" />
              Installer Overview
            </div>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Manage your solar business at a glance
            </h3>

            <p className="mt-2 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Track connected clients, support workload, and recent activity from one dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniSummaryCard label="Clients" value={clients.length} />
            <MiniSummaryCard label="Pending" value={pendingTickets} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Connected Clients"
          value={clients.length}
          subtitle="Active linked client accounts"
          icon={Users}
          iconClassName="text-sky-500"
        />
        <MetricCard
          title="Pending Tickets"
          value={pendingTickets}
          subtitle="Support requests awaiting action"
          icon={AlertCircle}
          iconClassName="text-amber-500"
        />
        <MetricCard
          title="Resolved Tickets"
          value={resolvedTickets}
          subtitle="Completed support requests"
          icon={CheckCircle}
          iconClassName="text-emerald-500"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Clients
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Latest connected customer accounts
              </p>
            </div>
          </div>

          {recentClients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients yet"
              description="You do not have any connected clients yet."
            />
          ) : (
            <div className="space-y-3">
              {recentClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-2xl border border-slate-200/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h5 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {client.fullName || "Unnamed Client"}
                        </h5>
                        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                          {client.email || "No email provided"}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Client
                      </div>
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
                Latest support activity
              </p>
            </div>
          </div>

          {recentTickets.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="No tickets yet"
              description="No support tickets have been submitted yet."
            />
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-2xl border border-slate-200/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h5 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {ticket.title || "Untitled ticket"}
                        </h5>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {ticket.clientName || "Unknown client"}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
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
                            : ticket.status === "in-progress"
                            ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
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
    </div>
  );
}

function MiniSummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, iconClassName }) {
  return (
    <Card className="rounded-[26px] border border-slate-200/70 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
          <Icon className={`h-6 w-6 ${iconClassName}`} />
        </div>
      </div>
    </Card>
  );
}