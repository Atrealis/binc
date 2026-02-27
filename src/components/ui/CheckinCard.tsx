"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function moodEmoji(mood: number) {
  // mood: 1..5
  if (mood <= 1) return "😢";
  if (mood === 2) return "😟";
  if (mood === 3) return "😐";
  if (mood === 4) return "🙂";
  return "😄";
}

function moodLabel(mood: number) {
  if (mood <= 1) return "Really low";
  if (mood === 2) return "Low";
  if (mood === 3) return "Neutral";
  if (mood === 4) return "Okay";
  return "Good";
}

export default function CheckinCard({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [step, setStep] = useState<1 | 2>(1);

  // step 1
  const [mood, setMood] = useState(3);

  // step 2
  const [stress, setStress] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [feeling, setFeeling] = useState("");

  const sessionId = useMemo(() => {
    // new session id each page load (good for "every time I open app")
    return crypto.randomUUID();
  }, []);

  const canNext = true;
  const canSubmit = feeling.trim().length >= 3;

  return (
    <Card>
      <CardHeader>
        <div className="text-sm text-muted-foreground">Daily check-in</div>
        <h2 className="text-xl font-semibold">How are you feeling right now?</h2>
      </CardHeader>
      <CardContent className="space-y-6">
      {/* STEP INDICATOR */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={step === 1 ? "text-foreground font-medium" : ""}>1) Mood</span>
        <span>→</span>
        <span className={step === 2 ? "text-foreground font-medium" : ""}>2) Context</span>
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-5xl">{moodEmoji(mood)}</div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Mood</div>
              <div className="font-medium">{moodLabel(mood)}</div>
            </div>
          </div>

          {/* Mood meter slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={mood}
              onChange={(e) => setMood(clamp(Number(e.target.value), 1, 5))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>😢</span>
              <span>😟</span>
              <span>😐</span>
              <span>🙂</span>
              <span>😄</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => {
                if (canNext) setStep(2);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <form
          action={async (formData) => {
            // attach hidden values
            formData.set("session_id", sessionId);
            formData.set("mood", String(mood));
            formData.set("stress", String(stress));
            formData.set("clarity", String(clarity));
            formData.set("feeling", feeling);

            await action(formData);
          }}
          className="space-y-5"
        >
          {/* stress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Stress level</label>
              <span className="text-sm text-muted-foreground">{stress}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={stress}
              onChange={(e) => setStress(clamp(Number(e.target.value), 1, 5))}
              className="w-full"
            />
          </div>

          {/* clarity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Clarity</label>
              <span className="text-sm text-muted-foreground">{clarity}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={clarity}
              onChange={(e) => setClarity(clamp(Number(e.target.value), 1, 5))}
              className="w-full"
            />
          </div>

          {/* feeling text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              In one sentence, what’s going on?
            </label>
            <textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              rows={4}
              className="w-full border rounded-md p-3 text-sm"
              placeholder="e.g., I keep replaying the breakup and I can’t focus."
              name="feeling"
            />
            <div className="text-xs text-muted-foreground">
              This helps Binc pick the right tone and questions.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={!canSubmit}
            >
              Start session
            </Button>
          </div>
        </form>
      )}
      </CardContent>
    </Card>
  );
}
