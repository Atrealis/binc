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
          title: "Let’s sort the mess gently.",
          bullets: [
            "What part hurts most right now?",
            "What story is your brain trying to write about why it happened?",
            "What’s one alternative explanation that’s less self-blaming?",
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
    <div className="border rounded-md p-4 space-y-3">
      <div className="text-xs text-gray-500">Comfort plan (phase: {phase})</div>
      <div className="font-semibold">{content.title}</div>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {content.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="text-xs text-gray-500">
        (No AI used here — this is deterministic coaching to keep it safe + free.)
      </div>
    </div>
  );
}
