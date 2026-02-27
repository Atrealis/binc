export default function ComfortCard({ phase }: { phase: string }) {
  const content =
    phase === "acute"
      ? {
          title: "Take a breath first.",
          bullets: [
            "Name what you feel in 3 words.",
            "What do you need in the next 10 minutes (not the next 10 years)?",
            "One small action: water / walk / message a friend.",
          ],
        }
      : phase === "processing"
      ? {
          title: "Let\u2019s sort the mess gently.",
          bullets: [
            "What part hurts most right now?",
            "What story is your brain trying to write about why it happened?",
            "What\u2019s one alternative explanation that\u2019s less self-blaming?",
          ],
        }
      : {
          title: "You seem ready for reflection.",
          bullets: [
            "What did you learn about your needs?",
            "What boundary would you hold next time?",
            "What would you tell a friend in the same situation?",
          ],
        };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium text-primary">
          Comfort plan &middot; {phase}
        </span>
      </div>
      <p className="text-base font-semibold text-foreground">{content.title}</p>
      <ul className="space-y-2">
        {content.bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-sm text-muted-foreground">
            <span className="mt-0.5 h-4 w-4 shrink-0 inline-flex items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
              ·
            </span>
            {b}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground/70">
        No AI used — deterministic coaching to keep it safe and free.
      </p>
    </div>
  );
}
