import { motion } from "framer-motion";
import {
  Users,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  UserRound,
} from "lucide-react";
import { Card, Button, EmptyState } from "../../UI";

export default function InstallerClientsTab({
  clients = [],
  onSelectClient,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Connected Clients
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              View all clients linked to your installer account and open a chat when needed.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">Total clients</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {clients.length}
            </p>
          </div>
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients connected"
          description="Once clients sign up with your invite code, they’ll appear here."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="h-full rounded-[26px] border border-slate-200/70 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                        {client.fullName || "Unnamed Client"}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Connected account
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
                </div>

                <div className="space-y-3">
                  <InfoRow
                    icon={Mail}
                    text={client.email || "No email provided"}
                  />
                  <InfoRow
                    icon={MapPin}
                    text={client.location || "Location not provided"}
                  />
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() =>
                      typeof onSelectClient === "function" && onSelectClient(client)
                    }
                    className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Open Chat
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
      <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
}