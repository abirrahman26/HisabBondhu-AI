# Demo_Script.md — Final Presentation Script

**Format:** brief §12 specifies a **two-minute judge demonstration**. A following **one-minute Q&A** is *Needs confirmation from organizer* (OC-03); prep is included below. Only P0 features implemented **and tested** may be shown. Replace anything not working with the backup plan. Sample data is fictional and labeled.

## 1. Starting state (set up before going on stage)
- Phone (Android Chrome) and laptop on hotspot or venue Wi-Fi (both tested). Live Hosting URL open, **logged in to the demo account** (D-09) with **demo data loaded** (`Judge_Mode.md`); banner "Demo data (fictional) is loaded" visible.
- Sugar and customer "Rahim" do **not** exist yet. Rehearsal was done in a **different** account.
- Assistant example chips visible. Backup video/screenshots ready (recording, labeled as such).

## 2. Timed script (120 s) — merges brief §12 and master §8

| Time | Do (click-by-click) | Say |
|---|---|---|
| 0:00–0:15 **Problem** | Show a photo/slide of a paper khata (or the empty notebook idea) | "Millions of shopkeepers in Bangladesh run their shop from a paper khata. They forget who owes them, don't know what's running out, and can't tell if they made a profit." |
| 0:15–0:30 **Solution** | Open Dashboard (demo data): today's sales, baki, low stock | "HisabBondhu AI manages the whole shop — and you simply talk to it in Bangla. This is fictional demo data." |
| 0:30–1:00 **Live Golden Path (GP-2…GP-5)** | Products → Add *Sugar (চিনি)* kg 110/130, stock 50, low 10 → Sell: 3 kg to new customer *Rahim*, **Baki** → Save → Baki → Rahim → Record payment 200 | "I add a product, sell three kilos on baki to Rahim — stock drops to 45, he owes ৳390. He pays ৳200, now ৳190. The ledger shows every step." *(cash sale GP-3 was shown in rehearsal; if time is short skip it)* |
| 1:00–1:30 **Gemini question (GP-6)** | Assistant → tap/paste **"Kar kache sob theke beshi baki ache?"** (voice only if tested; otherwise typed) → Bangla answer + Verified card | "I ask in Bangla: who owes me the most? Gemini picks an allowed function; our code reads Firestore and does the math; Gemini explains in Bangla. Karim ৳1,200, Nasima ৳850. The card shows the exact data — Gemini never calculates money." |
| 1:30–1:50 **Command + confirm (GP-7, GP-8)** | Type **"Rahim ke 500 taka baki dilam"** → confirmation card → tap **Confirm** → balance ৳690 → **refresh the page** | "Now a command. Nothing is saved until I confirm. Confirm — Rahim's balance is ৳690. Refresh — it's still there, saved in Firestore." |
| 1:50–2:00 **Impact + close** | Dashboard | "HisabBondhu turns the shopkeeper's notebook into a business assistant that speaks their language." |

Technical-credibility lines (said inside the 1:00–1:50 segments): "Gemini through Firebase AI Logic with App Check — no API key in the browser. Function calling with a fixed allowlist. Firestore with per-owner rules. Hosted on Firebase."

## 3. Expected results (what judges should notice)
Stock 45 after the baki sale; balance 390 → 190; Bangla answer matching the card; confirm card appears **before** the save; balance 690 after Confirm and after refresh; live HTTPS URL on a phone.
Numbers with demo dataset: after GP-4/GP-5 total baki 2,240 (Karim 1,200 · Nasima 850 · Rahim 190); after GP-7 total baki 2,740.

## 4. Gemini and Firebase proof points
Open devtools not required. Show: (a) the Verified card equals the answer, (b) Cancel path available, (c) Firebase console tab with the new `ledger` document (optional, only if time), (d) live URL in the browser bar.

## 5. Impact statement (no invented metrics)
Say: "It replaces the notebook with one place for stock, baki and profit, usable by voice or typing." **Do not** claim time-saved percentages, user counts or accuracy rates unless measured.

## 6. Backup plan
| Failure | Action |
|---|---|
| Voice fails | Type the same sentence (planned anyway) |
| Gemini/AI Logic error | Say so; show the manual forms (sale, payment) and the error+Retry; then play the backup recording **labeled as a recording** |
| Wi-Fi down | Switch to phone hotspot; if still down, play recording |
| Firebase slow | Pre-opened logged-in tabs; wait 5 s; fall back to recording |
| Time overrun | Skip GP-3/product add; keep GP-6 and GP-7 |
Never claim a feature works if it failed on stage.

## 7. One-minute Q&A prep (*if confirmed*) — short, honest answers
| Likely question | Answer |
|---|---|
| Why Gemini? | Bangla understanding + function calling turns speech into structured actions; code handles the math. |
| How do you stop wrong numbers? | Gemini never computes; code does; the card shows source data. |
| How is data secured? | Firebase Auth + Firestore rules per owner, App Check; no keys in the browser; Gemini only sees minimal fields (no phone numbers). |
| What if Gemini misunderstands? | Nothing saves without Confirm; ambiguity triggers a Bangla question. |
| Does it work offline? | No — clear error + retry; offline is future work. |
| Voice support? | Chrome on Android via browser speech recognition (if implemented); typing always works. |
| Limitations? | Estimated profit, no SMS/WhatsApp, no staff accounts, Gemini quotas. |
| What next? | Reminders to customers, supplier workflows, offline mode, MFA. |
