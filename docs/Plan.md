# Plan.md — Implementation Plan

## 1. Time budget (ASM-1: 4.5 h = 270 min; confirm OC-02)
Phase order follows **D-01 (pending approval)**. Approval gates (~2–3 min each) are inside each phase budget.

| Phase | Name | Minutes | Cumulative | Notes |
|---|---|---:|---:|---|
| 0 | Documentation review and execution plan | 10 | 0:10 | no code |
| 1 | Project foundation | 20 | 0:30 | |
| 2 | User interface | 30 | 1:00 | shell, screens, states |
| 3 | Firebase integration | 25 | 1:25 | Auth, Firestore, rules, hosting init, (approved) preview deploy |
| 4 | Core functionality | 65 | 2:30 | P0 flows + P1 core |
| 5 | Gemini integration | 45 | 3:15 | read tools, propose tools, confirm |
| 6 | Quality audit and hardening | 25 | 3:40 | |
| 7 | Deployment and demo rehearsal | 25 | 4:05 | |
| – | **Risk buffer** | 25 | 4:30 | never pre-spend |
If the event is **4 h (240 min)**: buffer 15, Phase 4 55, Phase 5 40, drop all P1 not on the Golden Path. If **5 h (300 min)**: add 30 min to Phase 4/6 for P1 items and one P2 item (voice).

## 2. P0-first strategy
Golden Path GP-1…GP-8 (PRD §8) works locally by the end of Phase 4 and on the deployed URL by the end of Phase 7. P1 only after the GP passes; P2 only after Phase 6 passes. Keep a known-working version (tag after each approved phase, only with Git approval).

## 3. Phase details

### Phase 0 — Review (10 min) — *no application code*
Tasks: read all docs (AGENTS order); list contradictions/missing decisions/infeasible scope; present roadmap + budget; list accounts/permissions/env var **names**; ask Product Owner the Analysis §5 questions (login method, 2FA, phase order D-01, demo account D-09); list "Often Forgotten" items (Risks §3). **DoD:** written roadmap, decision answers recorded in `HANDOVER.md`, PO says `APPROVED. Proceed to the next phase.`

### Phase 1 — Foundation (20 min)
Tasks: scaffold Vite React JS in Antigravity from scratch; Tailwind; React Router with route stubs; folder layout (TRD §3); `shared/lib` skeleton with unit-test runner; create `.gitignore`/`.env.example` (if OC-04 not confirmed) ; run dev server. **DoD:** app runs, routes render placeholders, test runner runs, no secrets. **Do not** start screens, Firebase or AI.

### Phase 2 — UI (30 min)
Tasks: AppShell + bottom nav, tokens, shared components (FormField, MoneyInput, StatCard, EmptyState, ConfirmDialog, Toast, ErrorWithRetry), screens with **empty/loading/error/success** states and client validation; action controls that need data are **visibly disabled with a reason** until Phase 4 (no fake functionality). Check 360 px and desktop; verify Bangla font rendering. **DoD:** every route reachable, no dead controls, no console errors.

### Phase 3 — Firebase (25 min)
Tasks (PO signs in personally; Antigravity asks before selecting/creating a project): connect web app config via `.env`; Auth (email/password); `shops/{uid}` setup flow; protected routes; Firestore rules per Schema §8; Hosting init (`dist`, SPA rewrite); App Check registration (debug token, not committed); verify two-account isolation; **optional** preview-channel deploy (needs approval). **DoD:** register → setup → refresh → still signed in; account B cannot read A (tested); rules deployed with approval. **No billing without approval.**

### Phase 4 — Core (65 min)
Order: F-02 products (15) → F-03 sale + stock transaction (15) → F-04 customers/ledger/payment/top debtors (15) → F-05 dashboard (8) → validation + errors polish (7) → P1 as time allows (F-12 low stock, F-13 expenses, F-15 duplicates, F-18 demo data, F-19 history) (≤5 each). **DoD:** GP-1…GP-5 and GP-8 manually pass on localhost with real Firestore; `shared/lib` unit tests pass (money, balance, profit, dates).

### Phase 5 — Gemini (45 min)
Order: AI Logic + App Check wiring and "hello" call (5) → tool dispatcher with allowlist/schema (10) → read functions `getTodaySales`, `getCustomerBalances`, `getLowStock` + VerifiedDataCard (10) → `proposeBakiEntry`/`proposePayment` + ConfirmationCard + idempotent confirm (12) → ambiguity + error/retry states (5) → P1 `proposeSale`/`proposeExpense` only if time (3+). **DoD:** GP-6 and GP-7 pass; Cancel saves nothing; AI failure shows retry + forms still work; `AI_Test_Cases.md` P0 cases run and recorded. Real Gemini testing only after credentials/AI Logic are set up securely and PO authorizes.

### Phase 6 — Quality (25 min)
Run `Testing.md` P0 cases + Often-Forgotten checks; mobile/desktop; keyboard/contrast basics; rules test; bundle secret scan; console/terminal clean; fix critical/high. **DoD:** no open Critical/High; known issues listed.

### Phase 7 — Deployment and rehearsal (25 min)
Confirm build/hosting config → **ask approval** → deploy → open live URL on phone → run GP on live → create/verify demo account and Judge Mode → rehearse `Demo_Script.md` ×3 (typed fallback each time) → record backup video/screenshots (honestly labeled). **DoD:** live URL verified, demo rehearsed, limitations listed. No new features in the last 20 minutes.

## 4. Dependencies and sequencing
Firebase project (PO) → Phase 3 → Phase 4 → Phase 5. App Check/AI Logic setup in Phase 3/5 can block Phase 5: do the "hello" call early. Demo account creation (PO) before Phase 7.

## 5. Review and approval gates
Each phase ends with the 9-step report (AGENTS §8) and **stops**. Git approval is a **separate** question after phase approval. Billing, real emails, deployment: separate explicit approvals.

## 6. Cut list (cut in this order)
1) P2 voice, receipt, CSV, supplier dues, weekly summary 2) AI `proposeSale`/`proposeExpense` 3) Google sign-in, password reset 4) Sale history page 5) Expenses 6) Duplicate warning 7) Demo-data loader (fallback: PO enters 6 records by hand before the demo) — **never cut:** GP-1…GP-8, Firestore rules, confirm card, Bangla Q&A, deployment.

## 7. Often Forgotten, We Will Check (prioritized; see Risks §3 for owners/estimates)
1 Bangla font/digits on demo phone · 2 All money math in code + integer rounding · 3 Atomic sale/stock/ledger + negative-stock warning · 4 Confirm card idempotency + Cancel saves nothing · 5 Two-account rules test · 6 No secrets in bundle/repo · 7 Dhaka date/week boundaries · 8 Demo fallbacks (typed input, hotspot, backup video) · 9 Empty-state first-use guide · 10 Ambiguity handling with phone last-4.

## 8. Tasks that must NOT start before approval
Any code before Phase 0 approval · next phase before review · commit/push · deploy (preview or production) · paid billing/Blaze · real email send · enabling App Check enforcement · loading demo data into a non-demo account · P3 items.
