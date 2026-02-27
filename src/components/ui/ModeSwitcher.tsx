"use client";

import { Button } from "@/components/ui/button";

export default function ModeSwitcher({
  mode,
  setMode,
}: {
  mode: "comfort" | "analysis";
  setMode: (m: "comfort" | "analysis") => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => setMode("comfort")}
        variant={mode === "comfort" ? "default" : "outline"}
        type="button"
      >
        Comfort Mode
      </Button>
      <Button
        onClick={() => setMode("analysis")}
        variant={mode === "analysis" ? "default" : "outline"}
        type="button"
      >
        Analysis Mode
      </Button>
    </div>
  );
}
