import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Filter, Search, Sparkles } from "lucide-react";
import { Card, Badge, EmptyState, Input } from "../../UI";

export default function GuidesTab({ guides = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => {
    const values = guides
      .map((guide) => guide.category)
      .filter(Boolean);
    return ["all", ...new Set(values)];
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCategory =
        selectedCategory === "all" || guide.category === selectedCategory;

      const haystack = `${guide.title || ""} ${guide.content || ""} ${guide.category || ""}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [guides, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Guides Library
            </div>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Installer Guides & Resources
            </h3>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Browse setup instructions, maintenance notes, and solar support resources.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">Total guides</p>
            <p className="font-semibold text-slate-900 dark:text-white">{guides.length}</p>
          </div>
        </div>
      </div>

      <Card className="rounded-[26px] border border-slate-200/70 p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guides, topics, or categories..."
              className="pl-11"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <Filter className="h-4 w-4" />
              Category
            </div>

            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {filteredGuides.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No guides available"
          description={
            selectedCategory === "all"
              ? "Your installer hasn’t created any guides yet."
              : `No guides were found in the ${selectedCategory} category.`
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
                      Practical support content from your installer
                    </p>
                  </div>

                  <Badge className="shrink-0 capitalize">
                    {guide.category || "guide"}
                  </Badge>
                </div>

                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {guide.content}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}