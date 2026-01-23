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

  const prompt = `
You are Binc in COMFORT MODE.

Goal:
- Be warm, calm, emotionally supportive.
- Ask 1-2 gentle follow-up questions to gather context.
- Do NOT be cheesy, do NOT be overly validating if the user is distorted.
- Keep it concise (max ~120 words).

User phase (from check-in): ${phase}
User feeling (from check-in): ${feeling}

Conversation so far:
${transcript}

Now write Binc's next reply (plain text only).
`.trim();

  // quick retry for overloaded model
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { temperature: 0.6 },
      });

      const text = res.text?.trim();
      if (text) return text;

      return "I’m here with you. What’s the hardest part of this moment right now—and what do you need most, just for tonight?";
    } catch (e: any) {
      if (attempt === 3) {
        return "I’m here with you. I might be a bit slow right now—can you tell me what happened, and what part is hurting the most?";
      }
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }

  return "I’m here with you. What happened—and what are you feeling most strongly right now?";
}
