

import { submitAnalysis } from "@/app/analysisActions";
import { runAnalysis } from "@/app/runAnalysisActions";
import { submitChallenge } from "@/app/challengeActions";
import Report from "@/components/ui/Report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function statusVariant(
  status: string
): "success" | "destructive" | "secondary" | "outline" {
  if (status === "done") return "success";
  if (status === "error") return "destructive";
  if (status === "pending") return "secondary";
  return "outline";
}

export default function AnalysisPanel({
  requests,
  error,
}: {
  requests: any[] | null;
  error: any;
}) {
  return (
    <div className="space-y-8">
      <form action={submitAnalysis} className="space-y-4">
        <textarea
          name="raw_text"
          placeholder="Paste the conversation here..."
          rows={10}
          className="w-full border rounded-md p-3 text-sm"
        />
        <Button type="submit">Analyze Conversation</Button>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Analyses</h2>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {error.message ?? JSON.stringify(error)}
          </div>
        )}

        {!requests?.length ? (
          <p className="text-sm text-muted-foreground">No analyses yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="border rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                  <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {r.raw_text.length} characters
                </div>

                <form action={runAnalysis.bind(null, r.id)}>
                  <Button type="submit" size="sm" variant="outline">
                    {r.status === "done" ? "Re-run Analysis" : "Run Analysis"}
                  </Button>
                </form>

                {r.result && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium">
                      View report
                    </summary>
                    <div className="mt-3 space-y-4">
                      <Report result={r.result} />

                      <form action={submitChallenge} className="space-y-3">
                        <input
                          type="hidden"
                          name="analysis_id"
                          value={r.id}
                        />
                        <textarea
                          name="challenge_text"
                          placeholder="Challenge the analysis (e.g., missing context, alternative explanation, why a claim is wrong)..."
                          className="w-full border rounded-md p-3 text-sm"
                          rows={4}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          Submit challenge
                        </Button>
                      </form>
                    </div>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
