import type { Message } from "@/lib/extractConversation";

export type EvidencePack = {
  messages: Message[];
  metrics: Record<string, any>;
  evidence_candidates: Array<{ speaker: string; excerpt: string }>;
};

export async function generateAnalysisJSON(_pack: EvidencePack) {
  // STUB (works with $0, no external calls)
  // Next step: replace this with Gemini/OpenAI/local model.
  return {
    meta: {
      analysis_version: "v1",
      confidence_level: "low",
      analysis_scope: "conversation-only",
      notes: "AI adapter stub (no external model connected yet).",
    },
    data_quality: {
      input_type: "raw text",
      has_timestamps: false,
      has_speaker_labels: true,
      missing_context: [
        "Tone and sarcasm cannot be inferred reliably.",
        "Conversation may omit context outside text.",
      ],
    },
    metrics: _pack.metrics,
    patterns: [
      {
        id: "pattern_stub",
        label: "Stub pattern (AI not connected)",
        description:
          "This is a placeholder until you connect a model. Pipeline + validation is active.",
        confidence: "low",
        evidence: _pack.evidence_candidates.slice(0, 2).map((e) => ({
          speaker: e.speaker,
          excerpt: e.excerpt,
          reason: "Candidate excerpt from conversation.",
        })),
      },
    ],
    user_contributions: [],
    uncertainties: [{ description: "AI model is not connected yet." }],
    recommendations: [
      {
        focus: "Next step",
        suggestion: "Connect an AI model provider.",
        rationale: "Schema + validation is ready; only inference is missing.",
      },
    ],
  };
}
