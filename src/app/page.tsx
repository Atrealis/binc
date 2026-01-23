import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Journal Entries (latest 5)</h1>
      <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
      <p className="text-sm text-gray-500">
        Next: we’ll add a form + insert.
      </p>
    </main>
  );
}
