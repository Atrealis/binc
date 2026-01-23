import { supabase } from "@/lib/supabaseClient";
import { submitCheckin } from "./checkinActions";
import HomeClient from "@/components/ui/HomeClient";
import CheckinGate from "@/components/ui/CheckinGate";

export default async function Home() {
  const { data: requests, error } = await supabase
    .from("analysis_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: latest } = await supabase
    .from("checkins")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sessionId = latest?.session_id ?? "";

  const { data: comfortMessages } = sessionId
    ? await supabase
        .from("comfort_messages")
        .select("role, content, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(30)
    : { data: [] as any[] };

  return (
    <CheckinGate action={submitCheckin}>
      <main className="p-8 space-y-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Binc</h1>

        <HomeClient
          phase={latest?.phase ?? "processing"}
          requests={requests}
          error={error}
          sessionId={sessionId}
          feeling={latest?.feeling ?? ""}
          comfortMessages={comfortMessages ?? []}
        />
      </main>
    </CheckinGate>
  );
}
