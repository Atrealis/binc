"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function moodEmoji(mood: number) {
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
  onBack,
}: {
  action: (formData: FormData) => void | Promise<void>;
  onBack?: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [feeling, setFeeling] = useState("");

  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const canSubmit = feeling.trim().length >= 3;

  return (
    <div className="rounded-2xl border border-border bg-card p-7 shadow-md space-y-7">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {onBack && step === 1 && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Back to home"
            >
              <ChevronLeft className="h-3 w-3" aria-hidden="true" />
              Back
            </button>
          )}
          <span>Daily check-in</span>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          How are you feeling right now?
        </h2>
      </div>

      {/* Step indicator */}
      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={2}
        aria-label={`Step ${step} of 2`}
      >
        <div
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            step >= 1 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
              step >= 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </span>
          Mood
        </div>
        <div className="flex-1 h-px bg-border" />
        <div
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            step >= 2 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
              step >= 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </span>
          Context
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          {/* Mood display */}
          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-4">
            <span className="text-5xl" aria-label={`Mood: ${moodLabel(mood)}`}>
              {moodEmoji(mood)}
            </span>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Current mood</div>
              <div className="text-base font-semibold text-foreground">
                {moodLabel(mood)}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <label
              htmlFor="mood-slider"
              className="text-sm font-medium text-foreground"
            >
              Rate your mood
            </label>
            <input
              id="mood-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={mood}
              onChange={(e) => setMood(clamp(Number(e.target.value), 1, 5))}
              aria-label="Mood slider 1 to 5"
            />
            <div className="flex justify-between text-base" aria-hidden="true">
              <span>😢</span>
              <span>😟</span>
              <span>😐</span>
              <span>🙂</span>
              <span>😄</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <form
          action={async (formData) => {
            formData.set("session_id", sessionId);
            formData.set("mood", String(mood));
            formData.set("stress", String(stress));
            formData.set("clarity", String(clarity));
            formData.set("feeling", feeling);
            await action(formData);
          }}
          className="space-y-6"
        >
          {/* Stress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="stress-slider"
                className="text-sm font-medium text-foreground"
              >
                Stress level
              </label>
              <span className="text-sm font-semibold text-primary">
                {stress}/5
              </span>
            </div>
            <input
              id="stress-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={stress}
              onChange={(e) => setStress(clamp(Number(e.target.value), 1, 5))}
              aria-label="Stress level slider 1 to 5"
            />
          </div>

          {/* Clarity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="clarity-slider"
                className="text-sm font-medium text-foreground"
              >
                Mental clarity
              </label>
              <span className="text-sm font-semibold text-primary">
                {clarity}/5
              </span>
            </div>
            <input
              id="clarity-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={clarity}
              onChange={(e) => setClarity(clamp(Number(e.target.value), 1, 5))}
              aria-label="Clarity slider 1 to 5"
            />
          </div>

          {/* Feeling text */}
          <div className="space-y-2">
            <label
              htmlFor="feeling-input"
              className="text-sm font-medium text-foreground"
            >
              In one sentence, what&apos;s going on?
            </label>
            <textarea
              id="feeling-input"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-shadow resize-none"
              placeholder="e.g., I keep replaying the breakup and I can't focus."
              name="feeling"
              aria-describedby="feeling-hint"
            />
            <p id="feeling-hint" className="text-xs text-muted-foreground">
              This helps Binc pick the right tone and questions.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => setStep(1)}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              Start session
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
