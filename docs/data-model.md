# Binc — Data Model

This document describes every table in the Binc Supabase schema, column meanings, RLS policy intent, and expected lifecycle.

---

## Tables

### `checkins`

One row is created each time a user completes the daily check-in form.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated row ID |
| `session_id` | `uuid` UNIQUE | Client-generated session token used to correlate messages |
| `user_id` | `uuid` FK → `auth.users` | Nullable until auth is introduced; links check-in to a Supabase user |
| `mood` | `smallint` (1–5) | How the user felt at check-in time |
| `stress` | `smallint` (1–5) | Perceived stress level |
| `clarity` | `smallint` (1–5) | Mental clarity / ability to think straight |
| `feeling` | `text` | Free-text sentence describing what's happening |
| `phase` | `text` | Inferred support phase: `acute`, `processing`, or `reflective` |
| `created_at` | `timestamptz` | Immutable creation timestamp |

**Phase inference logic** (deterministic, no AI):
- `stress >= 4 AND mood <= 2` → `acute`
- `clarity <= 2` → `processing`
- Otherwise → `reflective`

**Lifecycle:** Created by the client on form submit. Never updated. Deleted by cascade if the parent user is deleted.

**RLS:**
- `INSERT` — any client (anon key allowed); no auth required until login is added.
- `SELECT` — own rows only (`user_id = auth.uid() OR user_id IS NULL`).

---

### `comfort_messages`

Chat messages in a comfort-mode conversation, indexed by `session_id`.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `session_id` | `uuid` FK → `checkins.session_id` | Links the message thread to a check-in session |
| `role` | `text` | Either `user` or `assistant` |
| `content` | `text` | The message body |
| `created_at` | `timestamptz` | Used for ordered conversation replay |

**Lifecycle:** Rows are appended (never updated) by the server action `sendComfortMessage` — first the user turn, then the AI reply. Cascades on check-in deletion.

**RLS:**
- `INSERT` — any client.
- `SELECT` — caller must own the parent check-in.

---

### `analysis_requests`

A submitted conversation (raw text) awaiting or having received AI analysis.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `user_id` | `uuid` FK → `auth.users` | Nullable |
| `raw_text` | `text` | The raw conversation pasted by the user |
| `status` | `text` | `pending` → `running` → `done` or `error` |
| `result` | `jsonb` | Structured analysis output conforming to `AnalysisResultV1` |
| `created_at` | `timestamptz` | Immutable |
| `updated_at` | `timestamptz` | Auto-updated via trigger on every update |

**Lifecycle:** Created on paste submit (status = `pending`). Updated by `runAnalysis` with `result` and status = `done`.

**RLS:**
- `INSERT` — any client.
- `SELECT` / `UPDATE` — own rows only.

---

### `analysis_challenges`

User-submitted corrections or context additions challenging an existing analysis.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `analysis_id` | `uuid` FK → `analysis_requests.id` | Cascades on analysis deletion |
| `challenge_text` | `text` | The user's challenge / counter-narrative |
| `created_at` | `timestamptz` | Used to retrieve the *latest* challenge for re-analysis |

**Lifecycle:** Created by `submitChallenge`. The latest challenge is picked up on next `runAnalysis`.

**RLS:**
- `INSERT` — any client.
- `SELECT` — caller must own the parent analysis request.

---

### `checkin_prompts`

Seed table of reusable prompts, templates, and AI system instructions keyed by phase. Managed by the service role; read-only for all other clients.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `phase` | `text` | `acute`, `processing`, `reflective`, or `system` |
| `label` | `text` | Human-readable description |
| `content` | `text` | The full prompt / template text |
| `active` | `boolean` | Soft-delete flag; inactive prompts are hidden |
| `created_at` | `timestamptz` | Immutable |

**Lifecycle:** Seeded once by the migration. Updated via Supabase dashboard or service-role client.

**RLS:**
- `SELECT` — all authenticated + anon clients (active rows only).
- `INSERT` / `UPDATE` / `DELETE` — service role only (no policy created for these).

---

## RLS Policy Summary

| Table | Policy | For | Condition |
|---|---|---|---|
| `checkins` | `checkins_insert` | INSERT | `true` (open) |
| `checkins` | `checkins_select_own` | SELECT | `user_id = auth.uid() OR user_id IS NULL` |
| `comfort_messages` | `comfort_messages_insert` | INSERT | `true` |
| `comfort_messages` | `comfort_messages_select` | SELECT | parent checkin owned by caller |
| `analysis_requests` | `analysis_requests_insert` | INSERT | `true` |
| `analysis_requests` | `analysis_requests_select_own` | SELECT | `user_id = auth.uid() OR user_id IS NULL` |
| `analysis_requests` | `analysis_requests_update_own` | UPDATE | `user_id = auth.uid() OR user_id IS NULL` |
| `analysis_challenges` | `analysis_challenges_insert` | INSERT | `true` |
| `analysis_challenges` | `analysis_challenges_select` | SELECT | parent analysis owned by caller |
| `checkin_prompts` | `checkin_prompts_select_all` | SELECT | `active = true` |

> **Note:** The open `INSERT` policies allow the app to function without authentication. When user accounts are added, tighten these to `auth.uid() IS NOT NULL` and populate `user_id` on insert.

---

## Indexes

| Table | Columns | Purpose |
|---|---|---|
| `checkins` | `user_id` | Filter by user |
| `checkins` | `session_id` | Lookup by session (unique) |
| `checkins` | `created_at DESC` | Chronological ordering |
| `comfort_messages` | `session_id` | Thread replay |
| `comfort_messages` | `created_at ASC` | Message ordering |
| `analysis_requests` | `user_id` | Filter by user |
| `analysis_requests` | `created_at DESC` | Recent-first listing |
| `analysis_challenges` | `analysis_id` | Challenge lookup per analysis |
| `analysis_challenges` | `created_at DESC` | Latest challenge retrieval |
