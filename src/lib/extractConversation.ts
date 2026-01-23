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
export function messageLengthBySpeaker(messages: Message[]) {
  const totals: Record<string, number> = {};
  for (const m of messages) {
    totals[m.speaker] = (totals[m.speaker] ?? 0) + m.text.length;
  }
  return totals;
}

export function questionRateBySpeaker(messages: Message[]) {
  const counts: Record<string, { questions: number; total: number }> = {};
  for (const m of messages) {
    if (!counts[m.speaker]) counts[m.speaker] = { questions: 0, total: 0 };
    counts[m.speaker].total += 1;
    if (m.text.includes("?")) counts[m.speaker].questions += 1;
  }
  // return as ratios
  const ratios: Record<string, number> = {};
  for (const [speaker, v] of Object.entries(counts)) {
    ratios[speaker] = v.total === 0 ? 0 : Number((v.questions / v.total).toFixed(2));
  }
  return ratios;
}

export function apologyCountBySpeaker(messages: Message[]) {
  const regex = /\b(sorry|apologize|apologies|my bad)\b/i;
  const counts: Record<string, number> = {};
  for (const m of messages) {
    counts[m.speaker] = counts[m.speaker] ?? 0;
    if (regex.test(m.text)) counts[m.speaker] += 1;
  }
  return counts;
}
