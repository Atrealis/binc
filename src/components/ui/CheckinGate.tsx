"use client";

import { useState } from "react";
import CheckinCard from "@/components/ui/CheckinCard";
import LandingPage from "@/components/ui/LandingPage";
import PostCheckin from "@/components/ui/PostCheckin";

type CheckinData = {
  mood: number;
  stress: number;
  clarity: number;
  feeling: string;
  phase: string;
};

type GateState = "landing" | "checkin" | "success" | "app";

export default function CheckinGate({
  action,
  children,
}: {
  action: (formData: FormData) => void;
  children: (initialMode: "comfort" | "analysis") => React.ReactNode;
}) {
  const [gateState, setGateState] = useState<GateState>("landing");
  const [checkinData, setCheckinData] = useState<CheckinData | null>(null);
  const [initialMode, setInitialMode] = useState<"comfort" | "analysis">("comfort");

  if (gateState === "landing") {
    return <LandingPage onBegin={() => setGateState("checkin")} />;
  }

  if (gateState === "checkin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <CheckinCard
            action={async (formData) => {
              const mood = Number(formData.get("mood") ?? 3);
              const stress = Number(formData.get("stress") ?? 3);
              const clarity = Number(formData.get("clarity") ?? 3);
              const feeling = String(formData.get("feeling") ?? "");

              // Infer phase client-side for immediate feedback
              let phase = "reflective";
              if (stress >= 4 && mood <= 2) phase = "acute";
              else if (clarity <= 2) phase = "processing";

              setCheckinData({ mood, stress, clarity, feeling, phase });
              await action(formData);
              setGateState("success");
            }}
            onBack={() => setGateState("landing")}
          />
        </div>
      </div>
    );
  }

  if (gateState === "success" && checkinData) {
    return (
      <PostCheckin
        mood={checkinData.mood}
        stress={checkinData.stress}
        clarity={checkinData.clarity}
        feeling={checkinData.feeling}
        phase={checkinData.phase}
        onContinue={(mode) => {
          setInitialMode(mode);
          setGateState("app");
        }}
      />
    );
  }

  return <>{children(initialMode)}</>;
}
