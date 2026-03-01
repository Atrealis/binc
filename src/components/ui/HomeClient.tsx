"use client";

import { useState } from "react";
import ModeSwitcher from "@/components/ui/ModeSwitcher";
import AnalysisPanel from "@/components/ui/AnalysisPanel";
import ComfortChat from "@/components/ui/ComfortChat";

export default function HomeClient({
  initialMode = "comfort",
  phase,
  requests,
  error,
  sessionId,
  feeling,
  comfortMessages,
}: {
  initialMode?: "comfort" | "analysis";
  phase: string;
  requests: { id: string; created_at: string; status: string; raw_text: string; result?: unknown }[] | null;
  error: { message?: string } | null;
  sessionId: string;
  feeling: string;
  comfortMessages: {
    role: "user" | "assistant";
    content: string;
    created_at: string;
  }[];
}) {
  const [mode, setMode] = useState<"comfort" | "analysis">(initialMode);

  return (
    <div className="space-y-6">
      <ModeSwitcher mode={mode} setMode={setMode} />

      {mode === "comfort" ? (
        <ComfortChat
          sessionId={sessionId}
          phase={phase}
          feeling={feeling}
          messages={comfortMessages}
        />
      ) : (
        <AnalysisPanel requests={requests} error={error} />
      )}
    </div>
  );
}
