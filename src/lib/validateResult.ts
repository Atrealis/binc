import type { AnalysisResultV1 } from "@/lib/renderReport";

type ValidateOk = { ok: true };
type ValidateFail = { ok: false; errors: string[] };

export function validateAnalysisResult(result: any): ValidateOk | ValidateFail {
  const errors: string[] = [];

  // Basic shape checks
  if (!result || typeof result !== "object") errors.push("Result is not an object.");
  if (!result?.meta) errors.push("Missing meta.");
  if (!result?.data_quality) errors.push("Missing data_quality.");
  if (!result?.uncertainties || !Array.isArray(result.uncertainties) || result.uncertainties.length === 0) {
    errors.push("uncertainties must be a non-empty array.");
  }
  if (!result?.patterns || !Array.isArray(result.patterns)) {
    errors.push("patterns must be an array.");
  }

  // Evidence rules: every pattern must have evidence excerpts (if pattern exists)
  for (const p of result?.patterns ?? []) {
    if (!p?.label) errors.push("A pattern is missing label.");
    if (!p?.description) errors.push(`Pattern "${p?.label ?? "unknown"}" missing description.`);
    if (!p?.confidence) errors.push(`Pattern "${p?.label ?? "unknown"}" missing confidence.`);
    if (!p?.evidence || !Array.isArray(p.evidence) || p.evidence.length === 0) {
      errors.push(`Pattern "${p?.label ?? "unknown"}" must include at least 1 evidence excerpt.`);
    } else {
      for (const e of p.evidence) {
        if (!e?.excerpt || typeof e.excerpt !== "string") errors.push(`Pattern "${p?.label ?? "unknown"}" has evidence without excerpt.`);
        if (!e?.reason || typeof e.reason !== "string") errors.push(`Pattern "${p?.label ?? "unknown"}" has evidence without reason.`);
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}
