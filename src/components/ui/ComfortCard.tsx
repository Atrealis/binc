import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardDescription>Comfort plan (phase: {phase})</CardDescription>
        <CardTitle>{content.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="list-disc pl-5 text-sm space-y-1">
          {content.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          (No AI used here — this is deterministic coaching to keep it safe + free.)
        </p>
      </CardContent>
    </Card>
  );
}
