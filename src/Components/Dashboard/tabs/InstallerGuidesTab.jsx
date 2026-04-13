import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Filter, Sparkles } from "lucide-react";
import { Card, Badge, EmptyState } from "../../UI";

export default function InstallerGuidesTab({ guides = [], installerId }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "maintenance",
    "troubleshooting",
    "safety",
    "optimization",
  ];

  const filteredGuides =
    selectedCategory === "all"
      ? guides
      : guides.filter((guide) => guide.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
              <Sparkles className="h-3.5 w-3.5" />
              Guide Library
            </div>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Troubleshooting Guides
            </h3>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Manage your published solar help content and browse by support category.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">Installer ID</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {installerId || "Unavailable"}
            </p>
          </div>
        </div>
      </div>

      <Card className="rounded-[26px] border border-slate-200/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Available Guides ({filteredGuides.length})
          </h4>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {filteredGuides.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No guides available"
          description={
            selectedCategory === "all"
              ? "You haven’t created any guides yet."
              : `No guides found in the ${selectedCategory} category.`
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="rounded-[26px] border border-slate-200/70 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {guide.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Installer knowledge resource
                    </p>
                  </div>

                  <Badge className="shrink-0 capitalize">
                    {guide.category || "guide"}
                  </Badge>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {guide.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}