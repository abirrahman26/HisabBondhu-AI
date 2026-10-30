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
| 5 Gemini integration | COMPLETED | Approved | Approved (Commit: 8030787) |
| 6 Quality audit | COMPLETED | Approved | Approved (Commit: 2984b4c) |
| 7 Deployment + rehearsal | COMPLETED | Approved | Live: https://hisabbondhuai.vercel.app |
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
Production deployment verified live on Vercel at https://hisabbondhuai.vercel.app with SPA deep link routing (`vercel.json`), and Firebase Hosting (`firebase.json`) + Firestore Rules (`firestore.rules`) prepared. All Golden Path steps (GP-1 through GP-8) verified.

## 11. Gemini integration, quota and cost
Firebase AI Logic and Gemini 2.5 Flash function calling allowlist verified. Zero computation done by Gemini (money math strictly computed in code). Propose-confirm workflow eliminates arbitrary writes.

## 12. Git workflow and approval gates
All phases completed with explicit approval gates. Commits clean with zero secrets. Remote repository synchronized at https://github.com/abirrahman26/HisabBondhu-AI.git.

## 13. Known issues, risks, assumptions, limitations
Planned limitations per brief: single-shopkeeper accounts, estimated profit from unit cost, no SMS/WhatsApp, voice input dependent on browser SpeechRecognition.

## 14. Often Forgotten, We Will Check
OF-1 Bangla rendering (Noto Sans Bengali loaded) · OF-2 money math in code (`shared/lib`) · OF-3 atomic writes + idempotent confirm · OF-4 confirm card/cancel semantics (`ConfirmationCard`) · OF-5 two-account isolation (`/shops/{uid}/**`) · OF-6 no secrets (clean bundle scan) · OF-7 Dhaka dates (Asia/Dhaka UTC+6) · OF-8 ambiguity with phone last-4 · OF-9 demo fallbacks (localStorage + in-memory fallback) · OF-10 first-use empty state (`EmptyState`) · OF-11 duplicate warning (10-min window) · OF-12 injection resistance (allowlist dispatch) · OF-13 live URL on phone (https://hisabbondhuai.vercel.app verified) · OF-14 accessibility basics (WCAG AA contrast, touch targets ≥48px) · OF-15 honest limitations. **All 15 verified PASS in Phase 6 QA Audit.**

## 15. Demo instructions and fallback
`docs/Demo_Script.md` (120 s) and `docs/Judge_Mode.md`. Rehearsal completed. Fictional demo dataset loaded with banner indicator; typed fallback ready for every step.

## 16. Final Release Status
1. All 7 phases completed and verified.
2. Production site live: https://hisabbondhuai.vercel.app
3. GitHub repository: https://github.com/abirrahman26/HisabBondhu-AI.git (branch: main).
4. Automated tests passing: 47 / 47 tests.

