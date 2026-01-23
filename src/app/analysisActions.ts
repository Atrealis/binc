"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function submitAnalysis(formData: FormData) {
  const rawText = String(formData.get("raw_text") ?? "").trim();

  if (!rawText) return;

  await supabase.from("analysis_requests").insert([
    {
      raw_text: rawText,
      status: "pending",
    },
  ]);

  revalidatePath("/");
}
