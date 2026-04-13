import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../UI";
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  FileText,
  Sparkles,
} from "lucide-react";

import InstallerOverviewTab from "./tabs/InstallerOverviewTab";
import InstallerClientsTab from "./tabs/InstallerClientsTab";
import InstallerTicketsTab from "./tabs/InstallerTicketsTab";
import InstallerGuidesTab from "./tabs/InstallerGuidesTab";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "tickets", label: "Tickets", icon: AlertCircle },
  { id: "guides", label: "Guides", icon: FileText },
];

export default function InstallerDashboardTabs({
  activeTab = "overview",
  setActiveTab,
  clients = [],
  tickets = [],
  guides = [],
  installerId,
  onSelectClient,
}) {
  const safeActiveTab = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : "overview";

  const handleTabChange = (tabId) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(tabId);
      return;
    }

    console.error(
      "InstallerDashboardTabs error: setActiveTab is not a function.",
      { received: setActiveTab }
    );
  };

  return (
    <Card className="relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.08),transparent_22%)]" />

      <div className="relative">
        <div className="border-b border-slate-200/80 px-4 py-5 sm:px-6 lg:px-8 dark:border-slate-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
                <Sparkles className="h-3.5 w-3.5" />
                Installer Workspace
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Manage Your Installer Operations
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                Switch between overview, clients, support tickets, and guide management.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-950/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = safeActiveTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={clsx(
                      "relative inline-flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "h-4 w-4",
                        isActive ? "text-current" : "text-orange-500"
                      )}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeActiveTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              {safeActiveTab === "overview" && (
                <InstallerOverviewTab
                  clients={clients}
                  tickets={tickets}
                />
              )}

              {safeActiveTab === "clients" && (
                <InstallerClientsTab
                  clients={clients}
                  onSelectClient={onSelectClient}
                />
              )}

              {safeActiveTab === "tickets" && (
                <InstallerTicketsTab
                  tickets={tickets}
                />
              )}

              {safeActiveTab === "guides" && (
                <InstallerGuidesTab
                  guides={guides}
                  installerId={installerId}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}