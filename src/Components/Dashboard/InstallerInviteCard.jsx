import { motion } from "framer-motion";
import { Copy, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { Card, Button } from "../UI";

export default function InstallerInviteCard({ inviteCode, onCopyInviteCode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
      className="mb-8"
    >
      <Card className="group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.14),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Code
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Client Onboarding
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Your Client Invite Code
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                Share this code with clients so they can sign up and connect directly to your installer account.
              </p>
            </div>

            <div className="flex shrink-0 items-center">
              <Button
                onClick={onCopyInviteCode}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-slate-200/70 bg-slate-50/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
                <KeyRound className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Invite Code
                </p>
                <p className="mt-2 break-all font-mono text-xl font-black tracking-[0.18em] text-slate-900 dark:text-white sm:text-2xl">
                  {inviteCode || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}