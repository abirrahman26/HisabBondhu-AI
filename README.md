# HisabBondhu AI

A Bangla-speaking business assistant for Bangladeshi shopkeepers. *(Built from scratch at the Build with AI Hackathon with Google Antigravity. This repository currently contains the **documentation pack only**; application code is created at the venue.)*

## Problem and solution
Shopkeepers keep sales, stock, baki (credit) and expenses in a paper khata. They lose track of who owes what, what is running out, and whether they made a profit. **HisabBondhu AI** lets them manage the whole shop and simply talk to it in Bangla: Gemini understands the request, the app code runs exact lookups and arithmetic, the shopkeeper confirms, the record is saved in Firestore, and the answer comes back in Bangla.

## P0 Golden Path (identical in every doc)
1. **GP-1** Sign in; complete first-time shop setup.
2. **GP-2** Add product "Sugar (চিনি)" — kg, buy 110, sell 130, stock 50, low-stock level 10.
3. **GP-3** Cash sale: 2 kg Sugar = ৳260 → stock 48.
4. **GP-4** Baki sale to a new customer "Rahim": 3 kg = ৳390 → Rahim owes ৳390; stock 45.
5. **GP-5** Rahim pays ৳200 → balance ৳190; ledger shows both steps.
6. **GP-6** Ask the assistant "Kar kache sob theke beshi baki ache?" → Bangla answer from real data + a verified-data card.
7. **GP-7** Command "Rahim ke 500 taka baki dilam" → confirmation card → **Confirm** → balance ৳690 (Cancel saves nothing).
8. **GP-8** Refresh the page → everything is still there.

## Features
P0: auth + shop setup, products, sales (cash/mobile banking/baki) with stock decrease, baki ledger and repayments, dashboard, Bangla Q&A, AI-proposed baki/payment with confirm card, Firestore persistence + rules, Firebase Hosting. P1: low-stock alerts, expenses, AI-proposed sales/expenses, duplicate warning, Google sign-in, password reset, demo data (Judge Mode), sale history. P2: voice input, suppliers/purchases, receipt, weekly summary, CSV report, undo last AI action. P3 (not during hackathon): SMS/WhatsApp reminders, payment integrations, barcode, offline mode, staff accounts, 2FA. Full list: `docs/PRD.md`.

## Stack
React + Vite (JavaScript), Tailwind CSS, React Router, Firebase Authentication, Cloud Firestore, Firebase AI Logic (Gemini) + App Check, Firebase Hosting.

## Architecture (high level)
Browser (React) → Firebase Auth session → Firestore (`shops/{uid}/…`, protected by Security Rules). Assistant: browser → Firebase AI Logic (App Check) → Gemini → **allowlisted function call** → app code queries Firestore for the signed-in owner → minimal result → Gemini explains in Bangla. Write-type calls only produce a **proposal**; the user taps Confirm; the app writes. Details: `docs/TRD.md`.

## Prerequisites
Node.js (current LTS), a Google account for the Product Owner, a Firebase project (created by the Product Owner), Firebase CLI, Chrome on Android for the demo device. Versions and Gemini model availability/quotas/pricing must be checked at implementation time.

## Local setup (placeholders only)
1. Product Owner creates/selects the Firebase project and registers a Web app (Antigravity asks before choosing a project).
2. Copy `.env.example` to `.env` and fill the names below from the Firebase console. Never commit `.env`.
3. `npm install`, `npm run dev`, `npm test`, `npm run build`. *(Script names confirmed by Antigravity in Phase 1.)*

## Environment variables (names only)
| Name | Purpose | Secret? |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web config | No (public config) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth | No |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project | No |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase config | No |
| `VITE_FIREBASE_APP_ID` | Firebase config | No |
| `VITE_APPCHECK_RECAPTCHA_SITE_KEY` | App Check site key | No (public site key) |
| `VITE_GEMINI_MODEL` | Model name for AI Logic | No |

There is **no Gemini API key variable**. Do not create one in a `VITE_` variable.

## Deploy
Only after Product Owner approval: build, `firebase deploy --only hosting` (rules deployed separately with approval), then open the live URL on a phone and run the Golden Path.

## Firebase notes
Services: Hosting, Auth, Firestore, AI Logic, App Check. Rules: owner-only under `shops/{uid}`. Test with two accounts. See `docs/Schema.md`.

## Gemini notes
Function calling with a fixed allowlist; Bangla replies; failure → clear error + Retry; manual forms always work. Quotas/pricing/model/region: verify at implementation time.

## Security warnings
No secrets in code, chat, logs, screenshots or Git. No paid billing, real emails, commits/pushes or deployments without explicit Product Owner approval.

## Documentation index
`AGENTS.md` · `HANDOVER.md` · `docs/Analysis.md` · `PRD.md` · `AppFlow.md` · `UI_Spec.md` · `TRD.md` · `Schema.md` · `API_Spec.md` · `Plan.md` · `Risks.md` · `Testing.md` · `AI_Test_Cases.md` · `Demo_Script.md` · `Judge_Mode.md` · `Accessibility.md`

## Known limitations (planned)
No offline mode; no SMS/WhatsApp; no staff accounts; no 2FA; voice depends on browser support (Chrome on Android) and internet; estimated profit is an estimate; Gemini quotas may limit heavy use. Status of each is updated by Antigravity as the build proceeds.
