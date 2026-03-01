import { supabase } from "@/lib/supabaseClient";
import { submitCheckin } from "./checkinActions";
import HomeClient from "@/components/ui/HomeClient";
import CheckinGate from "@/components/ui/CheckinGate";

export const dynamic = "force-dynamic";

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
    : { data: [] as { role: "user" | "assistant"; content: string; created_at: string }[] };

  return (
    <CheckinGate action={submitCheckin}>
      <div className="min-h-screen bg-background">
        {/* Top nav */}
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">🌿</span>
              <span className="text-lg font-semibold tracking-tight">Binc</span>
            </div>
            {latest?.phase && (
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {latest.phase === "acute"
                  ? "High support"
                  : latest.phase === "processing"
                  ? "Processing"
                  : "Reflective"}{" "}
                mode
              </span>
            )}
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          <HomeClient
            phase={latest?.phase ?? "processing"}
            requests={requests}
            error={error}
            sessionId={sessionId}
            feeling={latest?.feeling ?? ""}
            comfortMessages={comfortMessages ?? []}
          />
        </main>
      </div>
    </CheckinGate>
  );
}
