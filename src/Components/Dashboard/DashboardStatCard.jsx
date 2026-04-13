import { motion } from "framer-motion";
import clsx from "clsx";

export default function DashboardStatCard({
  title,
  subtitle,
  value,
  icon: Icon,
  delay = 0,
  onClick,
  badge,
  cardClassName,
  iconWrapClassName,
  iconClassName,
  accentClassName,
}) {
  const clickable = typeof onClick === "function";

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      onClick={onClick}
      className={clsx(
        "group relative overflow-hidden rounded-[26px] border border-slate-200/70 bg-white p-5 sm:p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-all duration-300 dark:border-slate-800 dark:bg-slate-900",
        clickable && "cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]",
        cardClassName
      )}
    >
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100",
          accentClassName || "from-slate-500/5 to-transparent"
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {title}
            </p>

            {subtitle ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              iconWrapClassName
            )}
          >
            <Icon className={clsx("h-6 w-6", iconClassName)} />
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {value}
            </p>
          </div>

          {badge ? (
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              {badge}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}