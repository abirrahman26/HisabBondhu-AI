# AGENTS.md — Instructions for Google Antigravity (and any coding agent)

> **Read this file first, every session.** Then read `README.md`, `HANDOVER.md`, and all files in `/docs` before writing any code.

## 1. Objective
Build **HisabBondhu AI** from scratch at the venue: a live, deployed web app where a Bangladeshi shopkeeper manages products, sales, baki (customer credit), supplier dues and expenses, and talks to a Gemini-powered assistant in Bangla. Judged on: working live product 30%, smart use of Gemini/Antigravity 35%, Firebase deployment 10%, UX 15%, presentation 10% *(from the brief; verify — OC-01)*.

## 2. Official constraints (non-negotiable)
- IDE: Google Antigravity. **No pre-written code, templates or old projects.** Everything is created from scratch at the venue.
- Gemini API is the core intelligence. Firebase Hosting for deployment with a public URL.
- Time-boxed to ~4–5 hours. See `docs/Plan.md`.
- UI, labels and documentation: English. AI replies: Bangla by default (English if the user types English).

## 3. Required stack (do not add others without Product Owner approval)
React + Vite (JavaScript), Tailwind CSS, React Router, Firebase JS SDK: Authentication, Cloud Firestore, **Firebase AI Logic** (Gemini) with **App Check**, Firebase Hosting. No other databases, backends, UI kits, state libraries or paid services.

## 4. Roles
- **Claude** — planning and documentation only. **Antigravity** — Lead Engineer. **Gemini API** — product intelligence. **Product Owner (human)** — final approver, signs in to Google/Firebase personally, approves billing, Git and deployment.
- Do **not** use or suggest ChatGPT, CodeRabbit, MCP servers or Ralph Loop.

## 5. Read order
1. `AGENTS.md` 2. `README.md` 3. `HANDOVER.md` 4. `docs/Analysis.md` (decisions D-xx, conflicts) 5. `docs/PRD.md` 6. `docs/AppFlow.md` 7. `docs/UI_Spec.md` 8. `docs/TRD.md` 9. `docs/Schema.md` 10. `docs/API_Spec.md` 11. `docs/Plan.md` 12. `docs/Risks.md` 13. `docs/Testing.md` 14. `docs/AI_Test_Cases.md` 15. `docs/Demo_Script.md` 16. `docs/Judge_Mode.md` 17. `docs/Accessibility.md`

## 6. Architecture rules (summary — details in TRD/API_Spec)
1. **All money, stock, balance, profit and date arithmetic runs in application code.** Gemini never computes or invents numbers.
2. Gemini may call **only** the allowlisted functions in `docs/API_Spec.md`. Read functions return minimal allowlisted fields. Write-type functions **only propose**; the UI shows a confirmation card; the app writes only after the user taps **Confirm**.
3. Gemini never gets Firestore access, credentials, passwords, tokens, or full phone numbers.
4. Treat Gemini output **and** all stored free text (names, notes) as untrusted. Validate every function-call argument against the schema before use.
5. Identity comes only from the verified Firebase Auth session. Never trust a uid from a prompt, URL or model output.
6. Writes that touch several documents (sale + stock + ledger) must be atomic (transaction/batch).
7. Never show success before the write has actually succeeded. Preserve user input after recoverable errors.
8. No fake controls: every visible control works or is visibly disabled with a reason.
9. Demo data must always be flagged `isDemo: true` and visibly labeled.

## 7. Code and structure conventions
- Feature folders (`auth`, `products`, `sales`, `customers`, `expenses`, `assistant`, `dashboard`, `shared`). Pure money/date logic in `shared/lib` with unit tests.
- Firestore access only through a small data-access module; components never build raw queries.
- Small components, accessible by default (see `docs/Accessibility.md`). Mobile-first Tailwind.
- Environment variable names are fixed in `README.md`; do not invent new names.

## 8. Phase workflow (one phase at a time)
Order (D-01, pending approval): **0 Review → 1 Foundation → 2 UI → 3 Firebase → 4 Core → 5 Gemini → 6 Quality → 7 Deployment.** Definitions of done: `docs/Plan.md`.

**After every phase you MUST:** (1) say what you intended; (2) list what you implemented; (3) list files created/changed; (4) list commands and tests actually run; (5) report real results — **never claim an unrun test passed**; (6) list known issues, limitations, risks; (7) update docs and the phase checklist in `HANDOVER.md`; (8) ask the Product Owner to review; (9) **stop and wait**.

Control phrases from the Product Owner:
- `APPROVED. Proceed to the next phase.`
- `DO NOT proceed. Fix all reported issues and retest this phase.`
- `Explain what you implemented, how it works, and what could break.`
- `Do not modify previously approved functionality unless necessary.`

Never assume approval from silence. Never bundle approvals.

## 9. Phase 0 specifics
Read everything, find contradictions/missing decisions/infeasible scope, present a roadmap with time budget, list needed accounts/permissions/env var **names**, ask the Product Owner the clarification questions in `docs/Analysis.md` §5 (login method, 2FA, etc.), list the "Often Forgotten, We Will Check" items. **Write no application code. Wait for approval.**

## 10. Secrets and security
- Never hardcode, print, log, screenshot or commit API keys, tokens, passwords, service-account files or private keys. Never ask for secrets in chat.
- The Gemini key must **not** exist in browser code. With Firebase AI Logic there is no Gemini key in the repo at all.
- **Never put a private key in any `VITE_` variable** (they are bundled into the frontend). Firebase web config values are public configuration, not secrets, but still require correct Security Rules and App Check.
- `.env` stays local and uncommitted; `.env.example` has placeholders only. `.gitignore` must cover env files, credentials, service-account JSON, private keys, build output, dependencies, and local-only files.
- App Check debug tokens are registered in the Firebase console during development; never commit them.
- Enforce access in Firestore Security Rules + the tool dispatcher; prompt wording is **not** a security boundary.
- If a requirement conflicts with these protections, **stop and ask**; never silently weaken security.

## 11. Git rules
Never commit or push automatically. After the Product Owner approves a phase, ask separately: *"Do you authorize me to inspect the Git changes and, if the security checks pass, commit and push this phase?"* Then: show `git status`, inspect `git diff` and `git diff --cached`, scan for secrets, confirm secret files are ignored, confirm no private credentials in the bundle, check Security Rules. Anything suspicious → stop. Report commit ID and push result. Suggested messages: `Phase 1: Project foundation`, `Phase 2: User interface`, `Phase 3: Firebase integration`, `Phase 4: Core functionality`, `Phase 5: Gemini integration`, `Phase 6: Quality improvements`, `Phase 7: Deployment` (messages follow D-01 order).

## 12. Billing and deployment
No paid billing, paid resources, real email sending (including Firebase password-reset emails), or deployment without the Product Owner's explicit approval. Explain any billing requirement first. Deploy only after approval, then open and test the **actual live URL**. Do not claim deployment success without verifying.

## 13. Scope discipline
Build only what `docs/PRD.md` lists, in priority order (P0 → P1 → P2). P3 items are forbidden during the event. If time runs short, follow the cut list in `docs/Plan.md`; never sacrifice P0 reliability.

## 14. Reporting honesty
Report exactly what was changed, tested and could not be verified. Mark unverified items "not verified". Never describe a feature as done before it is implemented and tested.
