export type Message = {
  speaker: string;
  text: string;
};

export function extractMessages(raw: string): Message[] {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

  const messages: Message[] = [];
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const speaker = line.slice(0, idx).trim();
    const text = line.slice(idx + 1).trim();
    if (!speaker || !text) continue;

    messages.push({ speaker, text });
  }

  return messages;
}

export function countAbsolutes(messages: Message[]) {
  const regex = /\b(always|never)\b/i;
  let count = 0;
  const excerpts: string[] = [];

  for (const m of messages) {
    if (regex.test(m.text)) {
      count++;
      excerpts.push(m.text);
    }
  }

  return { count, excerpts };
}

export function initiationBalance(messages: Message[]) {
  const counts: Record<string, number> = {};
  for (const m of messages) {
    counts[m.speaker] = (counts[m.speaker] ?? 0) + 1;
  }
  return counts;
}
