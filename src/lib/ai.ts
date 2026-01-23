import { GoogleGenAI } from "@google/genai";
import type { Message } from "@/lib/extractConversation";

export type EvidencePack = {
  messages: Message[];
  metrics: Record<string, any>;
  evidence_candidates: Array<{ speaker: string; excerpt: string }>;
};

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY in environment variables.");
const ai = new GoogleGenAI({ apiKey });
 // reads GEMINI_API_KEY from env :contentReference[oaicite:3]{index=3}
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function isOverload(err: any) {
  const msg = String(err?.message ?? "");
  const status = String(err?.status ?? "");
  const code = String(err?.code ?? "");
  return msg.includes("overloaded") || status === "UNAVAILABLE" || code === "503";
}

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    meta: {
      type: "object",
      additionalProperties: false,
      properties: {
        analysis_version: { type: "string" },
        confidence_level: { type: "string", enum: ["low", "medium", "high"] },
        analysis_scope: { type: "string" },
        notes: { type: "string" },
      },
      required: ["analysis_version", "confidence_level", "analysis_scope", "notes"],
    },
    data_quality: {
      type: "object",
      additionalProperties: false,
      properties: {
        input_type: { type: "string" },
        has_timestamps: { type: "boolean" },
        has_speaker_labels: { type: "boolean" },
        missing_context: { type: "array", items: { type: "string" } },
      },
      required: ["input_type", "has_timestamps", "has_speaker_labels", "missing_context"],
    },
    metrics: { type: "object" },
    patterns: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          description: { type: "string" },
          confidence: { type: "string", enum: ["low", "medium", "high"] },
          evidence: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                speaker: { type: "string" },
                excerpt: { type: "string" },
                reason: { type: "string" },
              },
              required: ["speaker", "excerpt", "reason"],
            },
            minItems: 1,
          },
        },
        required: ["id", "label", "description", "confidence", "evidence"],
      },
    },
    user_contributions: { type: "array" },
    uncertainties: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { description: { type: "string" } },
        required: ["description"],
      },
      minItems: 1,
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          focus: { type: "string" },
          suggestion: { type: "string" },
          rationale: { type: "string" },
        },
        required: ["focus", "suggestion", "rationale"],
      },
    },
  },
  required: [
    "meta",
    "data_quality",
    "metrics",
    "patterns",
    "user_contributions",
    "uncertainties",
    "recommendations",
  ],
} as const;

export async function generateAnalysisJSON(pack: EvidencePack, userChallenge?: string) {

  const conversation = pack.messages
    .slice(0, 200)
    .map((m) => `${m.speaker}: ${m.text}`)
    .join("\n");

  const evidencePool = pack.evidence_candidates
    .slice(0, 30)
    .map((e) => `${e.speaker}: ${e.excerpt}`)
    .join("\n");

  const prompt = `
You are Binc's "Analysis Mode". Output MUST be valid JSON that matches the given JSON Schema.

Rules:
- Be evidence-based: every pattern must cite at least 1 excerpt from the provided evidence pool.
- Do NOT invent quotes. Only use excerpts that appear verbatim in the evidence pool.
- If the data is insufficient, say so in uncertainties and keep confidence low.
- Keep it empathetic but not sycophantic; avoid validating distorted beliefs.
- Always include at least 1 uncertainty.

User challenge (if any):
${userChallenge ?? "None provided"}

Inputs:
(1) Conversation (may be truncated):
${conversation}

(2) Deterministic metrics (truthy; do not contradict them):
${JSON.stringify(pack.metrics, null, 2)}

(3) Evidence pool (use ONLY these for excerpts):
${evidencePool}
`.trim();

 const config = {
  responseMimeType: "application/json",
  responseJsonSchema: ANALYSIS_SCHEMA,
  temperature: 0.2,
} as const;

const modelsToTry = ["gemini-3-flash-preview", "gemini-2.0-flash"];

let lastErr: any = null;

for (const model of modelsToTry) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const text = response.text;
      if (!text) throw new Error("Gemini returned no text output.");
      return JSON.parse(text);
    } catch (err: any) {
      lastErr = err;
      if (!isOverload(err)) break; // not overload -> don't retry
      await sleep(300 * attempt); // backoff
    }
  }
}

throw lastErr ?? new Error("Gemini failed with unknown error.");


 

}
