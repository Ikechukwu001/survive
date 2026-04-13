import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../UI";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquareText,
  Bot,
  CloudSun,
  Sparkles,
} from "lucide-react";

import OverviewTab from "./tabs/OverviewTab";
import GuidesTab from "./tabs/GuidesTab";
import TicketsTab from "./tabs/TicketsTab";
import AIAssistantTab from "./tabs/AIAssistantTab";
import WeatherTab from "./tabs/WeatherTab";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "guides",
    label: "Guides",
    icon: BookOpen,
  },
  {
    id: "tickets",
    label: "Tickets",
    icon: MessageSquareText,
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: Bot,
  },
  {
    id: "weather",
    label: "Weather",
    icon: CloudSun,
  },
];

export default function DashboardTabs({
  activeTab = "overview",
  setActiveTab,
  guides = [],
  tickets = [],
  installerInfo,
  currentUserId,
  clientName,
  installerId,
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
      "DashboardTabs error: setActiveTab was not passed as a function.",
      { received: setActiveTab }
    );
  };

  return (
    <Card className="relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.08),transparent_22%)]" />

      <div className="relative">
        {/* Header area */}
        <div className="border-b border-slate-200/80 px-4 py-5 sm:px-6 lg:px-8 dark:border-slate-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                Workspace
              </div>

              <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Manage Your Solar Experience
              </h2>

              <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Switch between support tools, guides, weather updates, and account activity.
              </p>
            </div>
          </div>

          {/* Tab controls */}
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
                      "relative inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "h-4 w-4",
                        isActive
                          ? "text-current"
                          : tab.id === "ai-assistant"
                          ? "text-violet-500"
                          : tab.id === "weather"
                          ? "text-sky-500"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab content */}
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
                <OverviewTab
                  guides={guides}
                  tickets={tickets}
                  installerInfo={installerInfo}
                />
              )}

              {safeActiveTab === "guides" && (
                <GuidesTab guides={guides} />
              )}

              {safeActiveTab === "tickets" && (
                <TicketsTab
                  tickets={tickets}
                  clientId={currentUserId}
                  clientName={clientName}
                  installerId={installerId}
                />
              )}

              {safeActiveTab === "ai-assistant" && (
                <AIAssistantTab
                  clientId={currentUserId}
                  installerId={installerId}
                />
              )}

              {safeActiveTab === "weather" && <WeatherTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}