"use client";

export default function ModeSwitcher({
  mode,
  setMode,
}: {
  mode: "comfort" | "analysis";
  setMode: (m: "comfort" | "analysis") => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setMode("comfort")}
        className={`px-3 py-2 rounded-md border text-sm ${mode === "comfort" ? "bg-black text-white" : ""}`}
        type="button"
      >
        Comfort Mode
      </button>
      <button
        onClick={() => setMode("analysis")}
        className={`px-3 py-2 rounded-md border text-sm ${mode === "analysis" ? "bg-black text-white" : ""}`}
        type="button"
      >
        Analysis Mode
      </button>
    </div>
  );
}
