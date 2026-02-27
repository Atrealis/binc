import { sendComfortMessage } from "@/app/comfortActions";
import { Button } from "@/components/ui/button";

export default function ComfortChat({
  sessionId,
  phase,
  feeling,
  messages,
}: {
  sessionId: string;
  phase: string;
  feeling: string;
  messages: { role: "user" | "assistant"; content: string; created_at: string }[];
}) {

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="text-xs text-muted-foreground">
        Comfort Mode • phase: <span className="font-medium">{phase}</span>
      </div>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">Say what’s on your mind.</div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={`text-sm p-3 rounded-md border ${
                m.role === "user" ? "bg-background" : "bg-muted"
              }`}
            >
              <div className="text-xs text-muted-foreground mb-1">
                {m.role === "user" ? "You" : "Binc"}
              </div>
              {m.content}
            </div>
          ))
        )}
      </div>

      <form action={sendComfortMessage} className="space-y-2">
        <input type="hidden" name="session_id" value={sessionId} />
        <input type="hidden" name="phase" value={phase} />
        <input type="hidden" name="feeling" value={feeling} />

        <textarea
          name="text"
          rows={3}
          className="w-full border rounded-md p-3 text-sm"
          placeholder="Tell me what happened…"
        />
        <Button type="submit" size="sm">Send</Button>
      </form>
    </div>
  );
}
