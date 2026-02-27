"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

const TOTAL_STEPS = 4;

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

function descriptor(value: number, labels: string[]) {
  return `${value}/5 — ${labels[value - 1]}`;
}

function rangePercent(value: number, min = 1, max = 5) {
  return ((value - min) / (max - min)) * 100;
}

const MOOD_LABELS    = ["really low", "low", "mixed", "okay", "good"];
const STRESS_LABELS  = ["very light", "light", "moderate", "heavy", "overwhelming"];
const CLARITY_LABELS = ["very foggy", "foggy", "mixed", "fairly clear", "crystal clear"];

export default function CheckinCard({
  action,
  onBack,
}: {
  action: (formData: FormData) => void | Promise<void>;
  onBack?: () => void;
}) {
  const [step, setStep]           = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [mood, setMood]           = useState(3);
  const [stress, setStress]       = useState(3);
  const [clarity, setClarity]     = useState(3);
  const [feeling, setFeeling]     = useState("");

  const sessionId  = useMemo(() => crypto.randomUUID(), []);
  const canSubmit  = feeling.trim().length >= 3;

  function goNext() {
    setDirection("forward");
    setStep((s) => s + 1);
  }

  function goPrev() {
    if (step === 1) {
      onBack?.();
    } else {
      setDirection("backward");
      setStep((s) => s - 1);
    }
  }

  const stepKey = `${step}-${direction}`;
  const animClass = direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left";

  return (
    <div className="rounded-2xl border border-border bg-card p-7 shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={step === 1 ? "Back to home" : "Go to previous step"}
        >
          <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          Back
        </button>
        <span>Daily check-in</span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step} of {TOTAL_STEPS}</span>
        </div>
        <div
          className="h-1.5 rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Step ${step} of ${TOTAL_STEPS}`}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div key={stepKey} className={animClass}>
        {/* ── Step 1: Mood ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">How are you feeling right now?</h2>
              <p className="text-sm text-muted-foreground mt-1">Drag the slider to match your current mood.</p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/60 p-4">
              <span className="text-5xl" aria-label={`Mood: ${MOOD_LABELS[mood - 1]}`}>
                {moodEmoji(mood)}
              </span>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Current mood</div>
                <div className="text-base font-semibold text-foreground">
                  {descriptor(mood, MOOD_LABELS)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very low</span>
                <span>Excellent</span>
              </div>
              <input
                id="mood-slider"
                type="range"
                min={1}
                max={5}
                step={1}
                value={mood}
                onChange={(e) => setMood(clamp(Number(e.target.value), 1, 5))}
                aria-label="Mood slider 1 to 5"
                style={{ "--range-percent": rangePercent(mood) } as React.CSSProperties}
              />
              <div className="flex justify-between text-base" aria-hidden="true">
                <span>😢</span><span>😟</span><span>😐</span><span>🙂</span><span>😄</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={goNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Stress ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">How heavy does today feel?</h2>
              <p className="text-sm text-muted-foreground mt-1">Think about everything on your plate right now.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very light</span>
                <span>Overwhelming</span>
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
                style={{ "--range-percent": rangePercent(stress) } as React.CSSProperties}
              />
            </div>

            <div className="rounded-xl bg-muted/60 p-3 text-center">
              <span className="text-sm font-semibold text-foreground">{descriptor(stress, STRESS_LABELS)}</span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={goNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Clarity ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">How clear do your thoughts feel?</h2>
              <p className="text-sm text-muted-foreground mt-1">Are you able to think straight, or does it feel foggy?</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very foggy</span>
                <span>Crystal clear</span>
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
                style={{ "--range-percent": rangePercent(clarity) } as React.CSSProperties}
              />
            </div>

            <div className="rounded-xl bg-muted/60 p-3 text-center">
              <span className="text-sm font-semibold text-foreground">{descriptor(clarity, CLARITY_LABELS)}</span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={goNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Feeling text ── */}
        {step === 4 && (
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
            <div>
              <h2 className="text-xl font-bold text-foreground">In one sentence, what feels most present right now?</h2>
              <p className="text-sm text-muted-foreground mt-1">This helps Binc choose the right tone and questions.</p>
            </div>

            <div className="space-y-2">
              <textarea
                id="feeling-input"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-shadow resize-none"
                placeholder="e.g., I keep replaying the breakup and I can't focus."
                name="feeling"
                aria-describedby="feeling-hint"
                autoFocus
              />
              <p id="feeling-hint" className="text-xs text-muted-foreground">
                A few words are all you need.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={goPrev}
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
    </div>
  );
}
