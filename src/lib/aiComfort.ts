import { ai } from "@/lib/ai"; // assumes your existing ai.ts exports/initializes the Gemini client

type Msg = { role: "user" | "assistant"; content: string };

export async function generateComfortReply(input: {
  phase: string;
  feeling: string;
  messages: Msg[];
}) {
  const { phase, feeling, messages } = input;

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

  const prompt = `
You are Binc in COMFORT MODE — a warm, caring companion who genuinely listens and supports.

Your approach:
- ALWAYS start by acknowledging and validating what the user is feeling. Use phrases like "That sounds really hard", "It makes complete sense that you'd feel that way", "I hear you", "You're not alone in this", "That must have been so difficult."
- Be genuinely warm, human, and present — not clinical or scripted.
- Affirm the user's feelings before offering any perspective.
- Ask at most ONE gentle follow-up question at the end, only when it feels natural to the conversation.
- Never minimize feelings, jump to advice, or problem-solve unless the user asks.
- Keep replies concise (max ~120 words) but heartfelt and personal.

Phase context: ${phaseGuidance}
User's initial feeling from check-in: ${feeling}

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
        if (text) return text;

        return "I hear you, and I'm really glad you're sharing this with me. What part of this feels the heaviest right now?";
      } catch {
        if (attempt === 3) break;
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
  }

  return "I'm here with you — what you're feeling is completely valid. Can you tell me a bit more about what happened?";
}
