import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

export default function MobileDashboardMenu({ isOpen, onLogout }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="sm:hidden border-t dark:border-gray-700 overflow-hidden"
        >
          <div className="px-4 py-3">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}