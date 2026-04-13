import { useState } from "react";
import {
  Sun,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";
import { ThemeToggle } from "../UI";
import InstallerMobileMenu from "./InstallerMobileMenu";

export default function InstallerDashboardHeader({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.10),transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 shadow-[0_10px_30px_rgba(249,115,22,0.28)] ring-1 ring-white/30 dark:ring-white/10">
              <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
              <Sun className="relative h-7 w-7 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Installer
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Pro Workspace
                </div>
              </div>

              <h1 className="mt-2 truncate text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Installer Dashboard
              </h1>

              <p className="mt-1 flex items-center gap-2 truncate text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-[15px]">
                <BriefcaseBusiness className="h-4 w-4 text-orange-500" />
                Manage clients, guides, and support operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <ThemeToggle />
            </div>

            <button
              onClick={onLogout}
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg dark:border-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <InstallerMobileMenu isOpen={mobileMenuOpen} onLogout={onLogout} />
    </header>
  );
}