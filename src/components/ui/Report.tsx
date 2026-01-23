import {
  AnalysisResultV1,
  normalizeResult,
  formatMetricValue,
  humanizeKey,
} from "@/lib/renderReport";

function ConfidenceBadge({ level }: { level?: string }) {
  const text = level ?? "unknown";
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
      Confidence: {text}
    </span>
  );
}

export default function Report({ result }: { result: any }) {
  const r: AnalysisResultV1 = normalizeResult(result);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">Summary</h3>
          <ConfidenceBadge level={r.meta?.confidence_level} />
        </div>
        {r.meta?.notes ? (
          <p className="text-sm text-gray-700">{r.meta.notes}</p>
        ) : (
          <p className="text-sm text-gray-500">
            No additional notes provided.
          </p>
        )}
      </section>

      {/* Data quality */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Data quality</h3>
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>Has timestamps: {r.data_quality?.has_timestamps ? "Yes" : "No"}</li>
          <li>
            Has speaker labels: {r.data_quality?.has_speaker_labels ? "Yes" : "No"}
          </li>
        </ul>
        {r.data_quality?.missing_context?.length ? (
          <div className="text-sm">
            <div className="font-medium">Limits / missing context</div>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {r.data_quality.missing_context.map((x, idx) => (
                <li key={idx}>{x}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* Metrics */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Metrics</h3>
        {r.metrics && Object.keys(r.metrics).length ? (
          <div className="grid gap-2">
            {Object.entries(r.metrics).map(([k, v]) => (
              <div key={k} className="border rounded-md p-3">
                <div className="text-sm font-medium">{humanizeKey(k)}</div>
                <div className="text-sm text-gray-700">{formatMetricValue(v)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No metrics available.</p>
        )}
      </section>

      {/* Patterns */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Observed patterns</h3>
        {r.patterns?.length ? (
          <div className="space-y-3">
            {r.patterns.map((p) => (
              <div key={p.id} className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">{p.label}</div>
                  <span className="text-xs text-gray-600">
                    Confidence: {p.confidence}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{p.description}</p>

                {p.evidence?.length ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700">
                      Evidence excerpts
                    </div>
                    {p.evidence.map((e, idx) => (
                      <div key={idx} className="rounded-md bg-gray-50 p-2">
                        <div className="text-xs text-gray-500">
                          {e.speaker ? `Speaker: ${e.speaker}` : "Speaker: unknown"}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{e.excerpt}</div>
                        {e.reason ? (
                          <div className="text-xs text-gray-600 mt-1">
                            Why it matters: {e.reason}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No patterns detected.</p>
        )}
      </section>

      {/* Uncertainties */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Uncertainties</h3>
        {r.uncertainties?.length ? (
          <ul className="text-sm list-disc pl-5 space-y-1 text-gray-700">
            {r.uncertainties.map((u, idx) => (
              <li key={idx}>{u.description}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No uncertainties listed.</p>
        )}
      </section>

      {/* Recommendations */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Recommendations</h3>
        {r.recommendations?.length ? (
          <div className="space-y-3">
            {r.recommendations.map((rec, idx) => (
              <div key={idx} className="border rounded-md p-3">
                <div className="text-sm font-semibold">{rec.focus}</div>
                <div className="text-sm text-gray-700">{rec.suggestion}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Rationale: {rec.rationale}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recommendations.</p>
        )}
      </section>
    </div>
  );
}
