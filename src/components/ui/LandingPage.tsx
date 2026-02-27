"use client";

import { Heart, MessageCircle, BarChart2, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onBegin: () => void;
}

const features = [
  {
    icon: Heart,
    title: "Comfort Mode",
    description:
      "Talk through what's on your mind with a warm, non-judgmental companion that meets you where you are.",
  },
  {
    icon: BarChart2,
    title: "Pattern Analysis",
    description:
      "Paste a conversation and get evidence-based insight into communication dynamics—without the guesswork.",
  },
  {
    icon: MessageCircle,
    title: "Guided Check-in",
    description:
      "A quick daily check-in calibrates your mood and stress so Binc can choose the right tone and questions.",
  },
];

export default function LandingPage({ onBegin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🌿
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Binc
          </span>
        </div>
        <button
          onClick={onBegin}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Start your daily check-in"
        >
          Check in now →
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground"
            aria-hidden="true"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Emotional clarity, one check-in at a time
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Process what you feel.{" "}
            <span className="text-primary">Understand what happened.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Binc is your private emotional companion. Check in daily, talk
            through hard moments, and get clear-eyed analysis of
            relationship patterns—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onBegin}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Begin your daily check-in"
            >
              Begin today&apos;s check-in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-xs text-muted-foreground">
              Takes about 60 seconds
            </span>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mx-auto">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 text-left space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-border/60 text-center text-xs text-muted-foreground">
        Private by design. Your data stays yours.
      </footer>
    </div>
  );
}
