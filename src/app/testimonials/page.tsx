import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";

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
  {
    quote:
      "After a really rough week I just needed to vent without being judged. Binc was exactly that—no advice I didn't ask for, just space.",
    name: "Priya K.",
    context: "Stress and burnout",
  },
  {
    quote:
      "The pattern analysis feature showed me things about my communication I'd been blind to for years. It was confronting but so helpful.",
    name: "Marcus D.",
    context: "Communication patterns",
  },
  {
    quote:
      "I was sceptical at first but the check-in questions feel genuinely human. Not like a form—more like a friend asking how you're doing.",
    name: "Cleo W.",
    context: "Daily emotional support",
  },
];

export const metadata: Metadata = {
  title: "Stories — Binc",
  description: "Real moments from people who found clarity with Binc.",
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="px-6 py-4 border-b border-border/60">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
          <span className="text-muted-foreground/40">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🌿</span>
            <span className="text-base font-semibold tracking-tight text-foreground">Binc</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">What people say</h1>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            Binc is built for real moments—hard days, confusing conversations, quiet spirals. Here&apos;s what some
            people have shared about what it means to them.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map(({ quote, name, context }) => (
            <div
              key={name}
              className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
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

        {/* Trust / safety note */}
        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-6 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">A note on support</p>
          <p>
            Binc is a reflective companion designed to help you process emotions and find clarity. It is not a
            substitute for professional mental health care, and it is not a crisis service.
          </p>
          <p>
            If you or someone you know is in immediate danger, please contact your local emergency services or a
            crisis helpline. You are not alone.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-border/60 text-center text-xs text-muted-foreground">
        Private by design. Your data stays yours.
      </footer>
    </div>
  );
}
