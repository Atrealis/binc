

import { submitAnalysis } from "@/app/analysisActions";
import { runAnalysis } from "@/app/runAnalysisActions";
import { submitChallenge } from "@/app/challengeActions";
import Report from "@/components/ui/Report";

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
          className="w-full border rounded-md p-3"
        />
        <button type="submit" className="px-4 py-2 rounded-md bg-black text-white">
          Analyze Conversation
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Analyses</h2>

        {error && (
          <pre className="text-sm text-red-600">{JSON.stringify(error, null, 2)}</pre>
        )}

        {!requests?.length ? (
          <p className="text-sm text-gray-500">No analyses yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="border rounded-md p-3 space-y-2">
                <div className="text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleString()}
                </div>

                <div className="text-sm font-medium">Status: {r.status}</div>
                <div className="text-xs text-gray-400">Characters: {r.raw_text.length}</div>

                <form action={runAnalysis.bind(null, r.id)}>

                  <button
                    type="submit"
                    className="px-3 py-1 rounded-md bg-black text-white text-sm"
                  >
                    {r.status === "done" ? "Re-run Analysis" : "Run Analysis"}
                  </button>
                </form>

                {r.result && (
                  <details className="text-sm">
                    <summary className="cursor-pointer">View report</summary>
                    <div className="mt-3">
                      <Report result={r.result} />

                      <form action={submitChallenge} className="space-y-3 mt-4">
                        <input type="hidden" name="analysis_id" value={r.id} />
                        <textarea
                          name="challenge_text"
                          placeholder="Challenge the analysis (e.g., missing context, alternative explanation, why a claim is wrong)..."
                          className="w-full border rounded-md p-3 text-sm"
                          rows={4}
                        />
                        <button type="submit" className="px-3 py-2 rounded-md border text-sm">
                          Submit challenge
                        </button>
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
