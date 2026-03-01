"use client";

import { useRef, useEffect, useOptimistic, useState } from "react";
import { sendComfortMessage } from "@/app/comfortActions";
import { Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; created_at: string };

export default function ComfortChat({
  sessionId,
  phase,
  feeling,
  messages,
}: {
  sessionId: string;
  phase: string;
  feeling: string;
  messages: Msg[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [waiting, setWaiting] = useState(false);

  const [optimisticMsgs, addOptimistic] = useOptimistic(
    messages,
    (prev: Msg[], next: Msg) => [...prev, next]
  );

  // Auto-scroll to bottom whenever messages or waiting state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [optimisticMsgs, waiting]);

  // Clear waiting indicator once the server has returned new messages
  useEffect(() => {
    setWaiting(false);
  }, [messages]);

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
        {optimisticMsgs.length === 0 && !waiting ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground text-center px-4">
              Say what&apos;s on your mind. Binc is here with you.
            </p>
          </div>
        ) : (
          <>
            {optimisticMsgs.map((m, idx) => (
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
            ))}

            {/* Typing indicator while waiting for AI response */}
            {waiting && (
              <div className="flex flex-col gap-1 items-start">
                <span className="text-xs text-muted-foreground px-1">Binc</span>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <div className="border-t border-border/60 p-4">
        <form
          ref={formRef}
          action={async (formData) => {
            const text = String(formData.get("text") ?? "").trim();
            if (!text || waiting) return;
            addOptimistic({ role: "user", content: text, created_at: new Date().toISOString() });
            setWaiting(true);
            formRef.current?.reset();
            await sendComfortMessage(formData);
          }}
          className="flex gap-2 items-end"
        >
          <input type="hidden" name="session_id" value={sessionId} />
          <input type="hidden" name="phase" value={phase} />
          <input type="hidden" name="feeling" value={feeling} />

          <span id="comfort-textarea-hint" className="sr-only">
            Press Enter to send, Shift+Enter for a new line.
          </span>
          <textarea
            name="text"
            rows={2}
            disabled={waiting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            className="flex-1 rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-shadow resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Tell me what happened…"
            aria-label="Message to Binc"
            aria-describedby="comfort-textarea-hint"
          />
          <button
            disabled={waiting}
            className="inline-flex items-center justify-center rounded-xl bg-primary p-3 text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring self-end disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
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
