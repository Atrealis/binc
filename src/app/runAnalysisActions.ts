"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import {
  extractMessages,
  countAbsolutes,
  initiationBalance,
  messageLengthBySpeaker,
  questionRateBySpeaker,
  apologyCountBySpeaker,
} from "@/lib/extractConversation";

import { generateAnalysisJSON } from "@/lib/ai";
import { validateAnalysisResult } from "@/lib/validateResult";

async function analyzeWithAI(raw: string) {
  const messages = extractMessages(raw);
  const absolutes = countAbsolutes(messages);
  const initiation = initiationBalance(messages);

  const lengthBySpeaker = messageLengthBySpeaker(messages);
const questionRate = questionRateBySpeaker(messages);
const apologies = apologyCountBySpeaker(messages);

const metrics = {
  initiation_balance: initiation,
  emotional_escalation_markers: {
    count: absolutes.count,
    examples: absolutes.excerpts.slice(0, 3),
    confidence: "medium",
  },
  message_length_by_speaker: lengthBySpeaker,
  question_rate_by_speaker: questionRate,
  apology_count_by_speaker: apologies,
};


const evidence_candidates = messages
  .filter((m) => m.text.length > 8)
  .slice(0, 40)
  .map((m) => ({ speaker: m.speaker, excerpt: m.text }));


  const pack = { messages, metrics, evidence_candidates };

  const result = await generateAnalysisJSON(pack);

  const validation = validateAnalysisResult(result);
  if (!validation.ok) {
    return {
      meta: {
        analysis_version: "v1",
        confidence_level: "low",
        analysis_scope: "conversation-only",
        notes: "AI output failed validation. Showing validation errors.",
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
      metrics,
      patterns: [],
      user_contributions: [],
      uncertainties: [{ description: "AI output did not meet schema requirements." }],
      recommendations: [
        {
          focus: "Debug",
          suggestion: "Fix model prompt/output to satisfy schema.",
          rationale: validation.errors.join(" | "),
        },
      ],
    };
  }

  return result;
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
    const result = await analyzeWithAI(req.raw_text);


  // 3) write back result + status
  const { error: updateErr } = await supabase
    .from("analysis_requests")
    .update({ status: "done", result })
    .eq("id", requestId);

  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/");
}
