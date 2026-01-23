export type Confidence = "low" | "medium" | "high";

export type Evidence = {
  speaker?: string;
  excerpt: string;
  reason?: string;
};

export type Pattern = {
  id: string;
  label: string;
  description: string;
  confidence: Confidence;
  evidence: Evidence[];
};

export type Recommendation = {
  focus: string;
  suggestion: string;
  rationale: string;
};

export type AnalysisResultV1 = {
  meta?: {
    analysis_version?: string;
    confidence_level?: Confidence;
    analysis_scope?: string;
    notes?: string;
  };
  data_quality?: {
    input_type?: string;
    has_timestamps?: boolean;
    has_speaker_labels?: boolean;
    missing_context?: string[];
  };
  metrics?: Record<string, any>;
  patterns?: Pattern[];
  user_contributions?: any[];
  uncertainties?: { description: string }[];
  recommendations?: Recommendation[];
};

function safeStr(x: unknown, fallback = ""): string {
  return typeof x === "string" ? x : fallback;
}

function safeBool(x: unknown, fallback = false): boolean {
  return typeof x === "boolean" ? x : fallback;
}

function safeArr<T = any>(x: unknown): T[] {
  return Array.isArray(x) ? (x as T[]) : [];
}

export function normalizeResult(result: any): AnalysisResultV1 {
  // Minimal normalization so UI never crashes on weird JSON
  const meta = result?.meta ?? {};
  const dq = result?.data_quality ?? {};

  return {
    meta: {
      analysis_version: safeStr(meta.analysis_version),
      confidence_level: (meta.confidence_level as Confidence) ?? "low",
      analysis_scope: safeStr(meta.analysis_scope),
      notes: safeStr(meta.notes),
    },
    data_quality: {
      input_type: safeStr(dq.input_type),
      has_timestamps: safeBool(dq.has_timestamps),
      has_speaker_labels: safeBool(dq.has_speaker_labels),
      missing_context: safeArr<string>(dq.missing_context),
    },
    metrics: result?.metrics ?? {},
    patterns: safeArr<Pattern>(result?.patterns),
    uncertainties: safeArr<{ description: string }>(result?.uncertainties),
    recommendations: safeArr<Recommendation>(result?.recommendations),
    user_contributions: safeArr(result?.user_contributions),
  };
}

export function formatMetricValue(value: any): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  // For objects like {count, confidence,...} we stringify lightly
  return JSON.stringify(value);
}

export function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
