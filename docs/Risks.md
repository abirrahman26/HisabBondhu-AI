# Risks.md — Risk Register

Likelihood/Impact: L/M/H. Owner: **PO** Product Owner, **AG** Antigravity.

## 1. Risk register
| ID | Category | Risk | L | I | Mitigation | Detection | Contingency | Owner |
|---|---|---|---|---|---|---|---|---|
| R-01 | Schedule | Phase-approval overhead + debugging exceed 4.5 h | H | H | Time-boxes in Plan; ≤3-min reviews; 25-min buffer; cut list | Clock vs cumulative table at each gate | Cut per Plan §6 | PO |
| R-02 | API | AI Logic / Gemini misconfig, region, quota or App Check blocks calls | M | H | "Hello" call early in Phase 3/5; check availability (OC-05); monitor-only App Check until verified | First call fails | Typed manual forms + backup video; Cloud Functions fallback only with billing approval | AG |
| R-03 | Quota | Gemini rate limit during demo/rehearsal | M | M | Short prompts; limit rehearsals; no auto-retry loops | 429 errors | Wait/retry; manual forms; backup video | AG |
| R-04 | AI | Wrong function chosen / hallucinated numbers | M | H | Numbers only from function results; VerifiedDataCard; AI test cases; low-temperature settings | AI_Test_Cases failures | Show card as source of truth; rephrase | AG |
| R-05 | Security | Prompt injection through stored names/notes | M | M | Data-not-instructions rule; opaque refs; propose-only; confirm card from code | AI-12 test | Disable assistant writes; keep reads | AG |
| R-06 | Security | Secrets in repo/bundle (e.g., key in `VITE_`) | L | H | No Gemini key exists; `.gitignore`; bundle grep before commit/deploy | T-19 | Rotate credentials; purge history (with PO) | AG |
| R-07 | Security | Rules too open/closed | M | H | Rules spec; two-account test; Rules emulator/playground | T-18 | Tighten/loosen immediately; redeploy with approval | AG |
| R-08 | Data | Stock/ledger inconsistency from partial writes | M | H | Transactions; idempotent IDs; unit tests | T-08/T-09 | Manual correction screen (P2) / recompute from ledger | AG |
| R-09 | Data | Wrong "today/week" due to timezone | M | M | `dateKey` in Dhaka; tests at 23:30/00:30 | T-13 | Fix helper; recompute | AG |
| R-10 | UX | Bangla text not rendering / wrong digits on demo phone | M | H | Font fallback; test early on device | Visual check Phase 2 | Use device-installed font; English labels | AG/PO |
| R-11 | Demo | Voice recognition fails (noise, browser, permission) | H | M | Typed fallback always; voice P2; demo never depends on it | Rehearsal | Type the same sentence | PO |
| R-12 | Demo | Venue Wi-Fi fails | M | H | Phone hotspot; local backup video; pre-opened logged-in session | Pre-demo check | Show backup video, state clearly it is a recording | PO |
| R-13 | Deployment | Live URL differs from localhost (env/rules/App Check) | M | H | Preview deploy in Phase 3; GP on live URL in Phase 7 | T-24 | Roll back to last good deploy (with approval) | AG |
| R-14 | Auth | Email/password friction or reset mail not tested | L | M | Pre-created demo account | Phase 7 | Judge uses demo account | PO |
| R-15 | Scope | Feature creep (suppliers, voice, receipts before P0) | H | H | Plan order + cut list; P3 forbidden | Weekly check at gates | Cut | PO |
| R-16 | Rules | Misreading rules (pre-event prep, demo data) | M | H | OC-01/04/06 ask organizers early | Organizer reply | Remove prepared items; build at venue only | PO |
| R-17 | Process | Master-prompt phase order infeasible (C-01) | H | M | D-01 | Phase 0 | Use in-memory adapter variant | PO |
| R-18 | Privacy | Real customer phone numbers in demo | L | H | Fictional data only; labeled | Review | Delete records | PO |

## 2. Unresolved assumptions / questions
ASM-1 4.5 h · ASM-2 venue internet · ASM-3 AI Logic on no-cost plan · ASM-4 demo phone Android Chrome · ASM-5 "GSD" = phase organization (C-07) · ASM-6 BD phone number format = 11 digits starting `01` · ASM-7 week starts Saturday (D-15). All Product Owner decisions D-01…D-18 are **pending approval**.

## 3. Often Forgotten, We Will Check (challenge-specific)
Ranked by impact ÷ effort. "Must" = required before Phase 7 sign-off. Status stays **NOT DONE** until Antigravity reports actual results.

| # | Check | Why for this product | Class | Owner | Acceptance check | Est. |
|---|---|---|---|---|---|---|
| OF-1 | Bangla rendering + digits + keyboard on the real demo phone | Core audience reads Bangla; broken glyphs destroy the demo | **Must** | AG (PO supplies phone) | Bangla names, replies and Bengali digits render correctly in Chrome Android; photo/screenshot kept | 5 min |
| OF-2 | All money/stock/profit/date math in code, integers, defined rounding | Brief's #1 pitfall ("wrong AI arithmetic") | **Must** | AG | Unit tests for GP values (260, 390, 190, 690, profit 100); no number in UI originates from Gemini text | 10 min |
| OF-3 | Atomic sale + stock + ledger; negative-stock warning; idempotent confirm | Prevents double records and silent negative stock | **Must** | AG | Double-tap Confirm → one record; stock 45 after GP-4; warning when qty > stock | 10 min |
| OF-4 | Confirmation card from code values, Cancel saves nothing, raw text shown | Trust is the product | **Must** | AG | T-14/T-15 pass; Firestore shows no doc after Cancel | 8 min |
| OF-5 | Two-account isolation + rules deployed | Acceptance checklist item | **Must** | AG+PO | Account B cannot read/write A (console + app); record evidence | 8 min |
| OF-6 | No secrets in repo/bundle; no `VITE_` private key | Master rule + brief | **Must** | AG | Scan of `git diff`, repo and `dist/` finds none | 5 min |
| OF-7 | Dhaka timezone + Saturday week boundary | "Today" must be correct near midnight | **Must** | AG | Test dates 23:59/00:01 Dhaka | 5 min |
| OF-8 | Ambiguous names (two Rahims) disambiguated with phone last-4 | Brief §10 | **Must** | AG | AI-06 passes | 5 min |
| OF-9 | Demo fallbacks: typed input, hotspot, backup recording, pre-logged-in session | Brief §10 "demo failure" | **Must** | PO | Full demo performed once with Wi-Fi off→hotspot | 10 min |
| OF-10 | First-time empty state + guide | First-use clarity | Do if time | AG | New account shows guide | 4 min |
| OF-11 | Duplicate-entry warning | Brief §10 | Do if time | AG | T-12 | 6 min |
| OF-12 | Prompt-injection resistance via stored names | AI reliability | Do if time | AG | AI-12 | 5 min |
| OF-13 | Live-URL verification on phone, not localhost | Deployment reality | **Must** | AG+PO | GP-1…GP-8 on live URL | 8 min |
| OF-14 | Accessibility basics (labels, focus, targets ≥48 px, contrast) | UX 15% | Do if time | AG | Accessibility.md quick checks | 8 min |
| OF-15 | Honest limitations (no offline, no SMS, estimated profit) stated in app/README/demo | Trust and ethics | **Must** | AG | Settings/About text + README | 3 min |
Not applicable: 2FA/MFA, rate-limit UI, email verification (D-05, P3).

## 4. Organizer confirmations required
OC-01 … OC-07 in `Analysis.md` §6.
