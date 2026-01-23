"use client";

import { useMemo, useState } from "react";

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
    <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
      <div>
        <div className="text-sm text-gray-500">Daily check-in</div>
        <h2 className="text-xl font-semibold">How are you feeling right now?</h2>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className={step === 1 ? "text-black font-medium" : ""}>1) Mood</span>
        <span>→</span>
        <span className={step === 2 ? "text-black font-medium" : ""}>2) Context</span>
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-5xl">{moodEmoji(mood)}</div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Mood</div>
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
            <div className="flex justify-between text-xs text-gray-400">
              <span>😢</span>
              <span>😟</span>
              <span>😐</span>
              <span>🙂</span>
              <span>😄</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded-md bg-black text-white text-sm"
              onClick={() => {
                if (canNext) setStep(2);
              }}
            >
              Next
            </button>
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
              <span className="text-sm text-gray-500">{stress}/5</span>
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
              <span className="text-sm text-gray-500">{clarity}/5</span>
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
            <div className="text-xs text-gray-400">
              This helps Binc pick the right tone and questions.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="px-3 py-2 rounded-md border text-sm"
              onClick={() => setStep(1)}
            >
              Back
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50"
              disabled={!canSubmit}
            >
              Start session
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
