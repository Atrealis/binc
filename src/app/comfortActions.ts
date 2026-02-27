"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { generateComfortReply } from "@/lib/aiComfort";

export async function sendComfortMessage(formData: FormData) {
  const session_id = String(formData.get("session_id") ?? "");
  const phase = String(formData.get("phase") ?? "processing");
  const feeling = String(formData.get("feeling") ?? "");
  const text = String(formData.get("text") ?? "").trim();

  if (!session_id || !text) return;

  // 1) Insert user message
  const { error: insUserErr } = await supabase.from("comfort_messages").insert({
    session_id,
    role: "user",
    content: text,
  });
  if (insUserErr) throw insUserErr;

  // 2) Fetch last messages for context
  const { data: msgs, error: fetchErr } = await supabase
    .from("comfort_messages")
    .select("role, content, created_at")
    .eq("session_id", session_id)
    .order("created_at", { ascending: true })
    .limit(30);

  if (fetchErr) throw fetchErr;

  // 3) Call AI
  const reply = await generateComfortReply({
    phase,
    feeling,
    messages: (msgs ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  // 4) Insert assistant reply
  const { error: insBotErr } = await supabase.from("comfort_messages").insert({
    session_id,
    role: "assistant",
    content: reply,
  });
  if (insBotErr) throw insBotErr;

  revalidatePath("/");
}
