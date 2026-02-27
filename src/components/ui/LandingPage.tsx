"use client";

import Link from "next/link";
import { Heart, MessageCircle, BarChart2, ArrowRight, Quote } from "lucide-react";

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

const testimonials = [
  {
    quote:
      "Binc helped me notice I was spiralling before I even realised it myself. The daily check-in has become part of my morning routine.",
    name: "Alex R.",
    context: "Using Binc for 3 months",
  },
  {
    quote:
      "I pasted a confusing text thread into the analysis tool and it gave me words I didn't know I needed. Finally felt understood.",
    name: "Jordan M.",
    context: "Relationship support",
  },
  {
    quote:
      "It's the only app I've found that doesn't feel clinical. It meets me where I am, not where it thinks I should be.",
    name: "Sam T.",
    context: "Grief processing",
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
        <div className="flex items-center gap-4">
          <Link
            href="/testimonials"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Stories
          </Link>
          <button
            onClick={onBegin}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Start your daily check-in"
          >
            Check in now →
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
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

        {/* Testimonials preview */}
        <div className="mt-24 w-full max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">What people say</h2>
            <p className="text-sm text-muted-foreground">Real moments. Real people.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, context }) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm"
              >
                <Quote className="h-5 w-5 text-primary/40" aria-hidden="true" />
                <p className="text-sm text-foreground leading-relaxed">&ldquo;{quote}&rdquo;</p>
                <div>
                  <div className="text-sm font-semibold text-foreground">{name}</div>
                  <div className="text-xs text-muted-foreground">{context}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Read more stories
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border/60 space-y-2 text-center text-xs text-muted-foreground">
        <p>Private by design. Your data stays yours.</p>
        <p className="max-w-md mx-auto leading-relaxed">
          Binc is a reflective companion, not a crisis service. If you or
          someone you know is in immediate danger, please contact your local
          emergency services or a crisis helpline.
        </p>
      </footer>
    </div>
  );
}
