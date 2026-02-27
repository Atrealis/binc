"use client";

import { useRef } from "react";
import { sendComfortMessage } from "@/app/comfortActions";
import { Send } from "lucide-react";

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
  const formRef = useRef<HTMLFormElement>(null);

  const phaseLabel =
    phase === "acute"
      ? "High support"
      : phase === "processing"
      ? "Gentle processing"
      : "Reflective";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">🌿</span>
          <span className="text-sm font-semibold text-foreground">Comfort Mode</span>
        </div>
        <span className="text-xs font-medium text-primary bg-secondary px-2.5 py-1 rounded-full">
          {phaseLabel}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 space-y-3 min-h-[240px] max-h-[480px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground text-center px-4">
              Say what&apos;s on your mind. Binc is here with you.
            </p>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-1 ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-muted-foreground px-1">
                {m.role === "user" ? "You" : "Binc"}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input form */}
      <div className="border-t border-border/60 p-4">
        <form
          ref={formRef}
          action={async (formData) => {
            await sendComfortMessage(formData);
            formRef.current?.reset();
          }}
          className="flex gap-2 items-end"
        >
          <input type="hidden" name="session_id" value={sessionId} />
          <input type="hidden" name="phase" value={phase} />
          <input type="hidden" name="feeling" value={feeling} />

          <textarea
            name="text"
            rows={2}
            className="flex-1 rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-shadow resize-none"
            placeholder="Tell me what happened…"
            aria-label="Message to Binc"
          />
          <button
            className="inline-flex items-center justify-center rounded-xl bg-primary p-3 text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring self-end"
            type="submit"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
