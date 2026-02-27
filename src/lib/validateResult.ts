type ValidateOk = { ok: true };
type ValidateFail = { ok: false; errors: string[] };

export function validateAnalysisResult(result: unknown): ValidateOk | ValidateFail {
  const errors: string[] = [];
  const r = result as Record<string, unknown> | null | undefined;

  // Basic shape checks
  if (!r || typeof r !== "object") errors.push("Result is not an object.");
  if (!r?.meta) errors.push("Missing meta.");
  if (!r?.data_quality) errors.push("Missing data_quality.");
  if (!r?.uncertainties || !Array.isArray(r.uncertainties) || r.uncertainties.length === 0) {
    errors.push("uncertainties must be a non-empty array.");
  }
  if (!r?.patterns || !Array.isArray(r.patterns)) {
    errors.push("patterns must be an array.");
  }

  // Evidence rules: every pattern must have evidence excerpts (if pattern exists)
  for (const p of (Array.isArray(r?.patterns) ? r.patterns : []) as Record<string, unknown>[]) {
    if (!p?.label) errors.push("A pattern is missing label.");
    if (!p?.description) errors.push(`Pattern "${String(p?.label ?? "unknown")}" missing description.`);
    if (!p?.confidence) errors.push(`Pattern "${String(p?.label ?? "unknown")}" missing confidence.`);
    if (!p?.evidence || !Array.isArray(p.evidence) || p.evidence.length === 0) {
      errors.push(`Pattern "${String(p?.label ?? "unknown")}" must include at least 1 evidence excerpt.`);
    } else {
      for (const e of p.evidence as Record<string, unknown>[]) {
        if (!e?.excerpt || typeof e.excerpt !== "string") errors.push(`Pattern "${String(p?.label ?? "unknown")}" has evidence without excerpt.`);
        if (!e?.reason || typeof e.reason !== "string") errors.push(`Pattern "${String(p?.label ?? "unknown")}" has evidence without reason.`);
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}
