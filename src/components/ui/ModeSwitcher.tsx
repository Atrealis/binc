"use client";

import { MessageCircle, BarChart2 } from "lucide-react";

export default function ModeSwitcher({
  mode,
  setMode,
}: {
  mode: "comfort" | "analysis";
  setMode: (m: "comfort" | "analysis") => void;
}) {
  return (
    <div
      className="inline-flex rounded-xl border border-border bg-muted p-1 gap-1"
      role="tablist"
      aria-label="App mode"
    >
      <button
        role="tab"
        aria-selected={mode === "comfort"}
        onClick={() => setMode("comfort")}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          mode === "comfort"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        type="button"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Comfort
      </button>
      <button
        role="tab"
        aria-selected={mode === "analysis"}
        onClick={() => setMode("analysis")}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          mode === "analysis"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        type="button"
      >
        <BarChart2 className="h-4 w-4" aria-hidden="true" />
        Analysis
      </button>
    </div>
  );
}
