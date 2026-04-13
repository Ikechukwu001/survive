import React from "react";

export default function InstallerInfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-white/15 p-2">
          <Icon className="h-4 w-4 text-white" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
            {label}
          </p>
          <p className="mt-1 truncate text-base font-semibold text-white sm:text-lg">
            {value || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}