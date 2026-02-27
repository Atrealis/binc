"use client";

import { CheckCircle, ArrowRight, MessageCircle, BarChart2 } from "lucide-react";

interface PostCheckinProps {
  mood: number;
  stress: number;
  clarity: number;
  feeling: string;
  phase: string;
  onContinue: (mode: "comfort" | "analysis") => void;
}

function phaseLabel(phase: string) {
  if (phase === "acute") return "High support";
  if (phase === "processing") return "Gentle processing";
  return "Reflective exploration";
}

function phaseDescription(phase: string) {
  if (phase === "acute")
    return "You're in a tough moment right now. Binc will lead with calm, grounding support.";
  if (phase === "processing")
    return "Things feel heavy but you're working through it. Binc will help you sort the pieces.";
  return "You're in a reflective headspace. Binc will ask deeper questions to help you grow.";
}

function moodEmoji(mood: number) {
  if (mood <= 1) return "😢";
  if (mood === 2) return "😟";
  if (mood === 3) return "😐";
  if (mood === 4) return "🙂";
  return "😄";
}

export default function PostCheckin({
  mood,
  stress,
  clarity,
  feeling,
  phase,
  onContinue,
}: PostCheckinProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Success header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
            <CheckCircle
              className="h-8 w-8 text-primary"
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Check-in complete
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Thanks for taking a moment to check in with yourself.
            </p>
          </div>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-foreground">
            Your snapshot
          </h2>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted p-3 text-center space-y-1">
              <div className="text-2xl" aria-label={`Mood: ${mood} out of 5`}>
                {moodEmoji(mood)}
              </div>
              <div className="text-xs text-muted-foreground">Mood</div>
              <div className="text-sm font-semibold text-foreground">
                {mood}/5
              </div>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center space-y-1">
              <div
                className="text-2xl font-bold text-foreground"
                aria-label={`Stress: ${stress} out of 5`}
              >
                {stress}
              </div>
              <div className="text-xs text-muted-foreground">Stress</div>
              <div className="text-sm font-semibold text-foreground">
                {stress}/5
              </div>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center space-y-1">
              <div
                className="text-2xl font-bold text-foreground"
                aria-label={`Clarity: ${clarity} out of 5`}
              >
                {clarity}
              </div>
              <div className="text-xs text-muted-foreground">Clarity</div>
              <div className="text-sm font-semibold text-foreground">
                {clarity}/5
              </div>
            </div>
          </div>

          {/* Feeling */}
          {feeling && (
            <div className="rounded-xl bg-muted/60 p-4 space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                What you shared
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                &ldquo;{feeling}&rdquo;
              </p>
            </div>
          )}

          {/* Tone / phase */}
          <div className="rounded-xl border border-border/80 bg-secondary/40 p-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-xs font-semibold text-primary">
                {phaseLabel(phase)} mode
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {phaseDescription(phase)}
            </p>
          </div>
        </div>

        {/* Next actions */}
        <div className="space-y-3">
          <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wide">
            What would you like to do?
          </p>

          <button
            onClick={() => onContinue("comfort")}
            className="w-full inline-flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground shadow-sm hover:bg-secondary/50 active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              Talk it through now
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>

          <button
            onClick={() => onContinue("analysis")}
            className="w-full inline-flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground shadow-sm hover:bg-secondary/50 active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="flex items-center gap-3">
              <BarChart2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Analyze a conversation
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
