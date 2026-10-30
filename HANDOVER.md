# HANDOVER.md — Project Handover

> ⚠️ **No one may expose or commit secrets.** No API keys, tokens, passwords, service-account files or private keys in chat, code, logs, screenshots, docs or Git. Never put a private key in a `VITE_` variable.

## 1. Current status
Documentation pack complete (planning only). **No application code exists.** Source of rules: `HisabBondhu_AI_Hackathon_Brief.pdf` (a *preparation* brief). The official participant-guidelines PDF was **not** available → verify everything in `docs/Analysis.md` §6 (OC-01…OC-07). If the surprise problem differs, regenerate with the master prompt.

### Phase checklist (order per D-01 — pending approval)
| Phase | Status | PO approval | Git approval |
|---|---|---|---|
| 0 Documentation review | COMPLETED | Approved | Approved (Commit: d96e94f) |
| 1 Foundation | COMPLETED | Approved | Approved (Commit: 6a8d67c) |
| 2 User interface | COMPLETED | Approved | Approved (Commit: 95b1285) |
| 3 Firebase integration | COMPLETED | Approved | Approved (Commit: bfb6933) |
| 4 Core functionality | COMPLETED | Approved | Approved (Commit: 26cff33) |
| 5 Gemini integration | COMPLETED | Approved | Ready to commit |
| 6 Quality audit | READY TO RUN | Pending | – |
| 7 Deployment + rehearsal | IN PROGRESS | Approved | Vercel domain: hisabbondhuai.vercel.app |
Antigravity updates this table after each phase with real results.

## 2. Product summary and approved scope
HisabBondhu AI — Bangla business assistant for one shopkeeper per account. Scope = all **P0** in `docs/PRD.md` (Golden Path GP-1…GP-8), then P1/P2 per Plan. **Approved scope: pending Product Owner approval** (nothing is approved by silence).

## 3. Decision log summary (all **Product Owner decision pending approval**)
D-01 phase order (Firebase before Core) · D-02 login required · D-03 email+password P0, Google P1 · D-04 minimal registration · D-05 no 2FA · D-06 email reset P1 · D-07 persistent session · D-08 owner role only · D-09 labeled demo account, fictional data · D-10 quantity/rounding rules · D-11 voice P2 · D-12 Firebase AI Logic + App Check (Functions fallback needs billing approval) · D-13 `isDemo` labeling · D-14 archive not delete · D-15 Dhaka time, Saturday week · D-16 profit definition · D-17 duplicate window 10 min · D-18 AI language rule. Details and trade-offs: `docs/Analysis.md` §5. **Record the PO's answers here during Phase 0:** _______________

## 4. Architecture overview
React+Vite SPA → Firebase Auth/Firestore/AI Logic/App Check → Gemini; Hosting. Tool dispatcher with allowlist between Gemini and Firestore; write-type functions only propose; confirm card; atomic transactions. See `docs/TRD.md`.

## 5. Important files and folders
`AGENTS.md` (rules) · `README.md` · `docs/` (specs) · `.gitignore`, `.env.example` (create at the venue if OC-04 is not confirmed) · app source: created by Antigravity at the venue (`src/auth|products|sales|customers|expenses|assistant|dashboard|shared`).

## 6. Required accounts and services
Google account (PO) · Firebase project with Hosting, Auth (email/password; Google P1), Firestore, AI Logic, App Check · Antigravity · Chrome on an Android phone. **PO signs in personally** to Google/Firebase. Antigravity asks before choosing/creating a project.

## 7. Environment variable names (names only)
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_APPCHECK_RECAPTCHA_SITE_KEY`, `VITE_GEMINI_MODEL`. No Gemini key variable exists (fallback-only secret `GEMINI_API_KEY` lives in Secret Manager if ever approved).

## 8. Secure credential setup
Fill `.env` locally from the Firebase console; never paste values into chat; never commit `.env`; App Check debug token registered in the console only; use the provider's official authorization flows.

## 9. Local run / test / build
`npm install` → `npm run dev` → `npm test` → `npm run build` (exact scripts confirmed in Phase 1). Test plan: `docs/Testing.md`.

## 10. Firebase and deployment procedure
Phase 3: connect app, Auth, rules, Hosting init (build dir `dist`, SPA rewrite), App Check registration; optional preview-channel deploy **with approval**. Phase 7: re-confirm config → **explicit PO approval** → deploy Hosting (+ rules with approval) → open live URL on a phone → run GP-1…GP-8 → record URL here: _______________ . Enable App Check **enforcement** only after the live Gemini test passes; record final state: _______________ .

## 11. Gemini integration, quota and cost
Firebase AI Logic function calling per `docs/API_Spec.md`. Verify model name, quotas, pricing, regional availability and plan requirement at implementation time. No paid billing without explicit PO approval.

## 12. Git workflow and approval gates
Never auto-commit/push. After PO approves a phase, ask the separate Git question (AGENTS §11), run the security checks, then commit/push and report commit ID + push result. Billing, real emails and deployment each need their own explicit approval.

## 13. Known issues, risks, assumptions, limitations
Risks: `docs/Risks.md` (R-01…R-18). Assumptions: ASM-1…ASM-7. Planned limitations: no offline mode, no SMS/WhatsApp, no staff accounts, no 2FA, voice browser-dependent, profit is an estimate, Gemini quotas. *(Update with actual issues after each phase.)*

## 14. Often Forgotten, We Will Check
OF-1 Bangla rendering on demo phone · OF-2 money math in code · OF-3 atomic writes + idempotent confirm · OF-4 confirm card/cancel semantics · OF-5 two-account isolation · OF-6 no secrets · OF-7 Dhaka dates · OF-8 ambiguity with phone last-4 · OF-9 demo fallbacks · OF-10 first-use empty state · OF-11 duplicate warning · OF-12 injection resistance · OF-13 live URL on phone · OF-14 accessibility basics · OF-15 honest limitations. Owners, acceptance checks and estimates: `docs/Risks.md` §3. **None are done until Antigravity reports actual results here:** _______________

## 15. Demo instructions and fallback
`docs/Demo_Script.md` (120 s) and `docs/Judge_Mode.md`. Rehearse in a separate account; typed fallback for every voice step; hotspot; labeled backup recording.

## 16. Next actions
1. PO answers Analysis §5 questions (esp. D-01, D-03, D-09) and sends OC-01/03/04/05/06/07 to organizers. 2. Upload this pack to Antigravity at the venue (after OC-04 is clear). 3. Antigravity performs **Phase 0 only** and waits for `APPROVED. Proceed to the next phase.` 4. All application code is written from scratch at the venue.
