import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function InstallerMobileMenu({ isOpen, onLogout }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-slate-200 dark:border-slate-800 sm:hidden"
        >
          <div className="px-4 py-3">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}