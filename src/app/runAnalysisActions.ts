"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

function fakeAnalyze(raw: string) {
  // MVP placeholder: writes a result in the schema shape
  const preview = raw.slice(0, 200);

  return {
    meta: {
      analysis_version: "v1",
      confidence_level: "low",
      analysis_scope: "conversation-only",
      notes: "This is a placeholder result (fake analyzer).",
    },
    data_quality: {
      input_type: "raw text",
      has_timestamps: raw.includes("[") && raw.includes("]"),
      has_speaker_labels: raw.toLowerCase().includes(":"),
      missing_context: [
        "Tone and sarcasm cannot be inferred reliably.",
        "Conversation may omit important context outside text.",
      ],
    },
    metrics: {
      emotional_escalation_markers: {
        count: (raw.match(/\balways\b|\bnever\b/gi) ?? []).length,
        examples: ["always", "never"],
        confidence: "low",
      },
    },
    patterns: [
      {
        id: "pattern_1",
        label: "Early pattern (placeholder)",
        description:
          "This placeholder analyzer does not yet compute real patterns.",
        confidence: "low",
        evidence: [
          {
            speaker: "unknown",
            excerpt: preview,
            reason: "Preview excerpt from the pasted conversation.",
          },
        ],
      },
    ],
    user_contributions: [],
    uncertainties: [
      { description: "This is a placeholder analysis with limited rigor." },
    ],
    recommendations: [
      {
        focus: "Next step",
        suggestion: "Enable AI analysis after pipeline is verified.",
        rationale: "We are currently validating end-to-end flow.",
      },
    ],
  };
}

export async function runAnalysis(requestId: string) {
  // 1) fetch request
  const { data: req, error: fetchErr } = await supabase
    .from("analysis_requests")
    .select("id, raw_text")
    .eq("id", requestId)
    .single();

  if (fetchErr || !req) throw new Error(fetchErr?.message ?? "Request not found");

  // 2) generate result JSON (fake for now)
  const result = fakeAnalyze(req.raw_text);

  // 3) write back result + status
  const { error: updateErr } = await supabase
    .from("analysis_requests")
    .update({ status: "done", result })
    .eq("id", requestId);

  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/");
}
