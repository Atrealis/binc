"use client";

import { submitAnalysis } from "@/app/analysisActions";
import { runAnalysis } from "@/app/runAnalysisActions";
import { submitChallenge } from "@/app/challengeActions";
import Report from "@/components/ui/Report";
import { Play, RotateCcw, AlertCircle } from "lucide-react";

type AnalysisRequest = {
  id: string;
  created_at: string;
  status: string;
  raw_text: string;
  result?: unknown;
};

export default function AnalysisPanel({
  requests,
  error,
}: {
  requests: AnalysisRequest[] | null;
  error: { message?: string } | null;
}) {
  return (
    <div className="space-y-8">
      {/* Submit form */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            Analyze a conversation
          </h2>
          <p className="text-sm text-muted-foreground">
            Paste the text of a conversation to get evidence-based pattern analysis.
          </p>
        </div>

        <form action={submitAnalysis} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="raw-text-input"
              className="text-sm font-medium text-foreground sr-only"
            >
              Conversation text
            </label>
            <textarea
              id="raw-text-input"
              name="raw_text"
              placeholder="Paste the conversation here…"
              rows={8}
              className="w-full rounded-xl border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-shadow resize-none"
              aria-label="Conversation text to analyze"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Analyze conversation
            </button>
          </div>
        </form>
      </div>

      {/* Recent analyses */}
      <section className="space-y-4" aria-label="Recent analyses">
        <h2 className="text-base font-semibold text-foreground">
          Recent analyses
        </h2>

        {error && (
          <div
            className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4"
            role="alert"
          >
            <AlertCircle
              className="h-4 w-4 text-destructive mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p className="text-sm text-destructive">
              {error.message ?? "Failed to load analyses."}
            </p>
          </div>
        )}

        {!requests?.length ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No analyses yet. Paste a conversation above to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {requests.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="space-y-0.5">
                      <div className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.raw_text.length.toLocaleString()} characters
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status === "done"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  {/* Run / re-run */}
                  <form action={runAnalysis.bind(null, r.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {r.status === "done" ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          Re-run analysis
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" aria-hidden="true" />
                          Run analysis
                        </>
                      )}
                    </button>
                  </form>

                  {/* Report + challenge */}
                  {!!r.result && (
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition-colors list-none flex items-center gap-1 select-none">
                        <span className="group-open:hidden">▶ View report</span>
                        <span className="hidden group-open:inline">▼ Hide report</span>
                      </summary>

                      <div className="mt-4 space-y-5">
                        <Report result={r.result} />

                        <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-semibold text-foreground">
                              Challenge this analysis
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Provide missing context, an alternative explanation, or
                              correct something that seems wrong.
                            </p>
                          </div>
                          <form action={submitChallenge} className="space-y-3">
                            <input
                              type="hidden"
                              name="analysis_id"
                              value={r.id}
                            />
                            <textarea
                              name="challenge_text"
                              placeholder="e.g., The conversation was sarcastic — the harsh words weren't meant literally."
                              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-shadow resize-none"
                              rows={4}
                              aria-label="Challenge text"
                            />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                              Submit challenge
                            </button>
                          </form>
                        </div>
                      </div>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
