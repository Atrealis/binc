"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function addJournalEntry(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await supabase.from("journal_entries").insert([{ content }]);

  revalidatePath("/");
}
