# Binc

**Your emotional check-in companion.**  
Process what you feel, understand what happened, and move forward with clarity.

Built with **Next.js 16 + TypeScript + Tailwind v4 + Supabase + Google Gemini**.

---

## UX Flow

```
/ (Landing page)
  → "Begin today's check-in" CTA
    → Check-in form (mood → context, 2 steps)
      → Post-check-in confirmation (summary + next steps)
        → Main app
          ├── Comfort Mode  — chat with Binc about what's going on
          └── Analysis Mode — paste a conversation for AI pattern analysis
```

1. **Pre-check-in landing** (`/`) — marketing intro with feature highlights and a single CTA.
2. **Check-in form** — two-step form capturing mood (1–5), stress (1–5), clarity (1–5), and a free-text feeling summary.
3. **Post-check-in confirmation** — shows a snapshot of submitted values, inferred support phase, and two next-action buttons.
4. **Comfort Mode** — a chat interface powered by Google Gemini, tuned to the user's phase.
5. **Analysis Mode** — paste any conversation, run AI analysis, view a structured report, and challenge the analysis with missing context.

---

## Required Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Google Gemini (required for Comfort + Analysis modes)
GEMINI_API_KEY=<your-gemini-api-key>
```

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in env vars
cp .env.example .env.local  # then edit .env.local

# 3. Apply the Supabase migration (see below)

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Migration

The schema lives in [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).

### Option A — Supabase CLI

```bash
# Link to your project (first time only)
supabase link --project-ref <project-ref>

# Push migrations
supabase db push
```

### Option B — SQL Editor

1. Open your Supabase project → SQL Editor.
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`.
3. Click **Run**.

---

## Data Model

See [`docs/data-model.md`](docs/data-model.md) for a full description of every table, column, RLS policy, and index.

**Tables:**
- `checkins` — daily check-in sessions
- `comfort_messages` — comfort-mode chat history
- `analysis_requests` — submitted conversations and AI results
- `analysis_challenges` — user corrections to analyses
- `checkin_prompts` — seed prompts/templates per phase

---

## Comfort Response Generation

Comfort Mode replies are produced by `src/lib/aiComfort.ts` (`generateComfortReply`).

### Pipeline

1. **Crisis detection** — the latest user message is scanned for self-harm/suicidal keywords before anything else. If a match is found, a compassionate acknowledgement is returned immediately along with local crisis-line numbers (US: 988; international: findahelpline.com). No LLM call is made.

2. **Emotion extraction** — a lightweight rule-based helper (`extractEmotionSignals`) scans the user's message for emotion themes (grief, heartbreak, anxiety, shame, anger, loneliness, hurt). Detected themes are injected into the system prompt so the model explicitly references them.

3. **Context-aware prompting** — the last 12 messages (with `User:` / `Binc:` speaker labels) are included in the prompt together with the user's phase (`acute` / `processing` / `reflective`) and the feeling they entered at check-in.

4. **LLM call with retry** — the request is tried against `gemini-2.0-flash`, then `gemini-2.0-flash-lite`, with up to 3 attempts each (400 ms × attempt backoff).

5. **Varied fallback** — if every attempt fails, a response is drawn from a 6-item pool (`FALLBACK_POOL`). The same index is never returned twice in a row.

6. **Telemetry** — every outcome is logged to stdout as structured JSON via `logTelemetry`:
   - `llm_success` — model, attempt number, latency (ms)
   - `llm_failure` — model, attempt number, latency (ms)
   - `crisis_detected` — latency (ms)
   - `fallback_used` — latency (ms)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Google Gemini (`@google/genai`) |
| Icons | Lucide React |
| UI primitives | Radix UI Slot + CVA |
