import {
  AnalysisResultV1,
  normalizeResult,
  formatMetricValue,
  humanizeKey,
} from "@/lib/renderReport";

function ConfidenceBadge({ level }: { level?: string }) {
  const text = level ?? "unknown";
  const colorClass =
    level === "high"
      ? "bg-secondary text-secondary-foreground"
      : level === "medium"
      ? "bg-secondary/70 text-secondary-foreground"
      : "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {text} confidence
    </span>
  );
}

export default function Report({ result }: { result: unknown }) {
  const r: AnalysisResultV1 = normalizeResult(result);

  return (
    <div className="space-y-6 text-sm">
      {/* Summary */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <ConfidenceBadge level={r.meta?.confidence_level} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {r.meta?.notes ?? "No additional notes provided."}
        </p>
      </section>

      {/* Data quality */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Data quality</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Timestamps: </span>
            <span className="font-medium text-foreground">
              {r.data_quality?.has_timestamps ? "Yes" : "No"}
            </span>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Speaker labels: </span>
            <span className="font-medium text-foreground">
              {r.data_quality?.has_speaker_labels ? "Yes" : "No"}
            </span>
          </div>
        </div>
        {r.data_quality?.missing_context?.length ? (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Limits / missing context
            </p>
            <ul className="space-y-1">
              {r.data_quality.missing_context.map((x, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                  <span className="shrink-0 text-muted-foreground/60">•</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* Metrics */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Metrics</h3>
        {r.metrics && Object.keys(r.metrics).length ? (
          <div className="grid gap-2">
            {Object.entries(r.metrics).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border p-3 space-y-0.5">
                <div className="text-xs font-medium text-foreground">
                  {humanizeKey(k)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatMetricValue(v)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No metrics available.</p>
        )}
      </section>

      {/* Patterns */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Observed patterns
        </h3>
        {r.patterns?.length ? (
          <div className="space-y-3">
            {r.patterns.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-border p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {p.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.confidence} confidence
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.description}
                </p>

                {p.evidence?.length ? (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Evidence
                    </p>
                    {p.evidence.map((e, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-muted/50 p-3 space-y-1"
                      >
                        <p className="text-xs text-muted-foreground">
                          {e.speaker ? `Speaker: ${e.speaker}` : "Speaker: unknown"}
                        </p>
                        <p className="text-xs text-foreground whitespace-pre-wrap">
                          {e.excerpt}
                        </p>
                        {e.reason ? (
                          <p className="text-xs text-muted-foreground">
                            Why it matters: {e.reason}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No patterns detected.</p>
        )}
      </section>

      {/* Uncertainties */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Uncertainties</h3>
        {r.uncertainties?.length ? (
          <ul className="space-y-1">
            {r.uncertainties.map((u, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-muted-foreground">
                <span className="shrink-0 text-muted-foreground/60">•</span>
                {u.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">No uncertainties listed.</p>
        )}
      </section>

      {/* Recommendations */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Recommendations
        </h3>
        {r.recommendations?.length ? (
          <div className="space-y-3">
            {r.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border p-4 space-y-1"
              >
                <p className="text-xs font-semibold text-foreground">
                  {rec.focus}
                </p>
                <p className="text-xs text-muted-foreground">{rec.suggestion}</p>
                <p className="text-xs text-muted-foreground/70">
                  Rationale: {rec.rationale}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No recommendations.</p>
        )}
      </section>
    </div>
  );
}
