import { supabase } from "@/lib/supabaseClient";
import { submitAnalysis } from "./analysisActions";
import { runAnalysis } from "./runAnalysisActions";

export default async function Home() {
  const { data: requests, error } = await supabase
    .from("analysis_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="p-8 space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Binc — Conversation Analysis</h1>

      <form action={submitAnalysis} className="space-y-4">
        <textarea
          name="raw_text"
          placeholder="Paste the conversation here..."
          rows={10}
          className="w-full border rounded-md p-3"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white"
        >
          Analyze Conversation
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Analyses</h2>

        {error && (
          <pre className="text-sm text-red-600">
            {JSON.stringify(error, null, 2)}
          </pre>
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

  <form
    action={async () => {
      "use server";
      await runAnalysis(r.id);
    }}
  >
    <button
      type="submit"
      className="px-3 py-1 rounded-md bg-black text-white text-sm"
      disabled={r.status === "done"}
    >
      {r.status === "done" ? "Analysis Completed" : "Run Analysis"}
    </button>
  </form>

  {r.result && (
    <details className="text-sm">
      <summary className="cursor-pointer">View result (JSON for now)</summary>
      <pre className="mt-2 text-xs overflow-auto">
        {JSON.stringify(r.result, null, 2)}
      </pre>
    </details>
  )}
</li>

            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
