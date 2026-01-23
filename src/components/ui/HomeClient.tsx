"use client";

import { useState } from "react";
import ModeSwitcher from "@/components/ui/ModeSwitcher";
import ComfortCard from "@/components/ui/ComfortCard";
import AnalysisPanel from "@/components/ui/AnalysisPanel";
import ComfortChat from "@/components/ui/ComfortChat";


export default function HomeClient({
  phase,
  requests,
  error,
  sessionId,
  feeling,
  comfortMessages,
}: {
  phase: string;
  requests: any[] | null;
  error: any;
  sessionId: string;
  feeling: string;
  comfortMessages: {
    role: "user" | "assistant";
    content: string;
    created_at: string;
  }[];
}) {

  const [mode, setMode] = useState<"comfort" | "analysis">("comfort");

  return (
    <div className="space-y-4">
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
