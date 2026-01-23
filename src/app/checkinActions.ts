"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

function inferPhase(mood: number, stress: number, clarity: number) {
  // Simple deterministic phase inference (tune later)
  if (stress >= 4 && mood <= 2) return "acute";
  if (clarity <= 2) return "processing";
  return "reflective";
}

export async function submitCheckin(formData: FormData) {
  const session_id = String(formData.get("session_id") ?? "");
   const mood = Number(formData.get("mood") ?? 3);
  const stress = Number(formData.get("stress") ?? 3);
  const clarity = Number(formData.get("clarity") ?? 3);

  const feeling = String(formData.get("feeling") ?? "").trim();

  if (!session_id || !feeling) return;

  const phase = inferPhase(mood, stress, clarity);

  const { error } = await supabase.from("checkins").insert({
    session_id,
    mood,
    stress,
    clarity,
    feeling,
    phase,
  });

  if (error) throw error;

  revalidatePath("/");
}
