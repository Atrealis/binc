"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import {
  extractMessages,
  countAbsolutes,
  initiationBalance,
} from "@/lib/extractConversation";

function fakeAnalyze(raw: string) {
  const messages = extractMessages(raw);
  const absolutes = countAbsolutes(messages);
  const initiation = initiationBalance(messages);

  return {
    meta: {
      analysis_version: "v1",
      confidence_level: "low",
      analysis_scope: "conversation-only",
      notes: "Deterministic analysis (no AI yet).",
    },
    data_quality: {
      input_type: "raw text",
      has_timestamps: false,
      has_speaker_labels: messages.length > 0,
      missing_context: [
        "Tone and sarcasm cannot be inferred reliably.",
        "Conversation may omit context outside text.",
      ],
    },
    metrics: {
      emotional_escalation_markers: {
        count: absolutes.count,
        examples: absolutes.excerpts.slice(0, 3),
        confidence: "medium",
      },
      initiation_balance: initiation,
    },
    patterns: absolutes.count
      ? [
          {
            id: "pattern_absolute_language",
            label: "Use of absolutist language",
            description:
              "Absolute terms (e.g. always, never) appear and may escalate conflict.",
            confidence: "medium",
            evidence: absolutes.excerpts.slice(0, 2).map((e) => ({
              speaker: "unknown",
              excerpt: e,
              reason: "Use of absolute language.",
            })),
          },
        ]
      : [],
    user_contributions: [],
    uncertainties: [
      { description: "Analysis does not infer intent or tone." },
    ],
    recommendations: [
      {
        focus: "Communication",
        suggestion:
          "Replace absolute statements with specific observations.",
        rationale:
          "Absolute language can escalate conflict.",
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
