import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  UserRound,
  MessageSquareText,
} from "lucide-react";
import { Card, Badge, EmptyState } from "../../UI";

export default function InstallerTicketsTab({ tickets = [] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Support Tickets
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Review support issues submitted by clients and track their current status.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">Total tickets</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {tickets.length}
            </p>
          </div>
        </div>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No tickets available"
          description="Client support tickets will appear here once they are submitted."
        />
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="rounded-[26px] border border-slate-200/70 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {ticket.title || "Untitled ticket"}
                      </h4>

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

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <UserRound className="h-4 w-4" />
                        <span>{ticket.clientName || "Unknown client"}</span>
                      </div>

                      <div className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <span>
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleString()
                            : "Recently submitted"}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {ticket.description || "No description provided."}
                    </p>

                    {ticket.response && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                        <p className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle className="h-4 w-4" />
                          Installer responded
                        </p>
                        <p className="text-sm text-emerald-700/90 dark:text-emerald-300/90">
                          {ticket.response}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      <MessageSquareText className="h-4 w-4" />
                      Support Case
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}