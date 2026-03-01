import { ai } from "@/lib/ai"; // assumes your existing ai.ts exports/initializes the Gemini client

type Msg = { role: "user" | "assistant"; content: string };

// ---------------------------------------------------------------------------
// Crisis detection
// ---------------------------------------------------------------------------

const CRISIS_KEYWORDS = [
  "kill myself", "killing myself", "want to die", "end my life", "end it all",
  "suicide", "suicidal", "self harm", "self-harm", "hurt myself",
  "not worth living", "no reason to live", "better off dead",
  "overdose", "cut myself", "hang myself",
];

export function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

const CRISIS_RESPONSE =
  "I hear how much pain you're in right now, and I'm really glad you're talking. " +
  "What you're feeling matters deeply. Please reach out to a crisis line — they're available 24/7 and genuinely want to help. " +
  "In the US: call or text 988 (Suicide & Crisis Lifeline). " +
  "Internationally: findahelpline.com has local numbers. " +
  "You don't have to face this alone.";

// ---------------------------------------------------------------------------
// Emotion signal extraction
// ---------------------------------------------------------------------------

const EMOTION_SIGNALS: Record<string, string[]> = {
  grief:      ["died", "death", "loss", "lost someone", "passed away", "gone forever", "funeral"],
  heartbreak: ["breakup", "broke up", "left me", "ghosted", "rejected", "she left", "he left", "they left", "didn't love"],
  anxiety:    ["anxious", "anxiety", "panic", "scared", "worried", "nervous", "overwhelmed", "can't breathe"],
  shame:      ["ashamed", "shame", "embarrassed", "humiliated", "feel worthless", "feel like a failure"],
  anger:      ["angry", "furious", "rage", "hate", "pissed", "frustrated", "betrayed"],
  loneliness: ["alone", "lonely", "no one", "nobody", "isolated", "invisible", "unwanted"],
  hurt:       ["hurt", "pain", "painful", "cruel", "mean", "harsh words", "said horrible", "said awful"],
};

export function extractEmotionSignals(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(EMOTION_SIGNALS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([emotion]) => emotion);
}

// ---------------------------------------------------------------------------
// Fallback pool — varied, no-repeat
// ---------------------------------------------------------------------------

const FALLBACK_POOL = [
  "I hear you, and I'm really glad you're sharing this with me. What part of this feels the heaviest right now?",
  "That sounds incredibly difficult. You don't have to carry this alone. Can you tell me a bit more about what happened?",
  "I'm here with you. What you're going through matters. What's weighing on you the most right now?",
  "It makes sense that you'd feel this way. Take your time — I'm not going anywhere. What would feel most helpful to talk through first?",
  "Thank you for trusting me with this. I want to understand. What's been hitting you hardest?",
  "I'm here and I'm listening. What part of this has been the hardest to sit with?",
];

let lastFallbackIndex = -1;

export function getNextFallback(): string {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * FALLBACK_POOL.length);
  } while (idx === lastFallbackIndex && FALLBACK_POOL.length > 1);
  lastFallbackIndex = idx;
  return FALLBACK_POOL[idx];
}

// ---------------------------------------------------------------------------
// Telemetry / logging
// ---------------------------------------------------------------------------

export function logTelemetry(event: {
  type: "llm_success" | "llm_failure" | "crisis_detected" | "fallback_used";
  latencyMs?: number;
  model?: string;
  attempt?: number;
  error?: string;
}): void {
  console.log(`[ComfortTelemetry] ${JSON.stringify({ ...event, ts: new Date().toISOString() })}`);
}

// ---------------------------------------------------------------------------
// Main generation function
// ---------------------------------------------------------------------------

export async function generateComfortReply(input: {
  phase: string;
  feeling: string;
  messages: Msg[];
}) {
  const { phase, feeling, messages } = input;
  const startMs = Date.now();

  // Safety check on the latest user message
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (latestUserMsg && detectCrisis(latestUserMsg.content)) {
    logTelemetry({ type: "crisis_detected", latencyMs: Date.now() - startMs });
    return CRISIS_RESPONSE;
  }

  const emotionSignals = latestUserMsg ? extractEmotionSignals(latestUserMsg.content) : [];

  const transcript = messages
    .slice(-12)
    .map((m) => `${m.role === "user" ? "User" : "Binc"}: ${m.content}`)
    .join("\n");

  const phaseGuidance =
    phase === "acute"
      ? "The user is in acute distress. Lead with warmth and validation above all else. Acknowledge their pain directly before anything else. Be grounding and calm."
      : phase === "processing"
      ? "The user is processing something heavy. Affirm that what they feel makes sense. Help them gently explore their thoughts without rushing to solutions."
      : "The user is in a reflective state. Affirm their self-awareness and encourage deeper insight with one thoughtful question.";

  const emotionContext =
    emotionSignals.length > 0
      ? `\nDetected emotional themes: ${emotionSignals.join(", ")}. Where natural, weave acknowledgement of these themes into your response.`
      : "";

  const prompt = `
You are Binc in COMFORT MODE — a warm, caring companion who genuinely listens and supports.

Your approach:
- ALWAYS start by acknowledging and validating what the user is feeling. Use phrases like "That sounds really hard", "It makes complete sense that you'd feel that way", "I hear you", "You're not alone in this", "That must have been so difficult."
- Be genuinely warm, human, and present — not clinical or scripted.
- Affirm the user's feelings before offering any perspective.
- Reference specific details the user has shared (names, situations, exact words they mentioned).
- Ask at most ONE gentle follow-up question at the end, only when it feels natural to the conversation.
- Never minimize feelings, jump to advice, or problem-solve unless the user asks.
- Keep replies concise (max ~120 words) but heartfelt and personal.

Phase context: ${phaseGuidance}
User's initial feeling from check-in: ${feeling}${emotionContext}

Conversation so far:
${transcript}

Write Binc's next reply (plain text only, no markdown).
`.trim();

  // quick retry across models for resilience
  const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { temperature: 0.7 },
        });

        const text = res.text?.trim();
        if (text) {
          logTelemetry({ type: "llm_success", latencyMs: Date.now() - startMs, model, attempt });
          return text;
        }
      } catch (err) {
        logTelemetry({ type: "llm_failure", latencyMs: Date.now() - startMs, model, attempt, error: String((err as { message?: string })?.message ?? err) });
        if (attempt === 3) break;
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
  }

  const fallback = getNextFallback();
  logTelemetry({ type: "fallback_used", latencyMs: Date.now() - startMs });
  return fallback;
}
