"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function submitChallenge(formData: FormData) {
  const analysisId = String(formData.get("analysis_id") ?? "");
  const challengeText = String(formData.get("challenge_text") ?? "").trim();

  if (!analysisId || !challengeText) return;

  const { error } = await supabase.from("analysis_challenges").insert({
    analysis_id: analysisId,
    challenge_text: challengeText,
  });

  if (error) throw error;

  revalidatePath("/");
}
