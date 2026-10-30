# PRD.md — Product Requirements Document

Labels: OFF / PS / TD / REC / ASM as defined in `Analysis.md`. Decision IDs (D-xx) are in `Analysis.md` §5.

## 1. Executive summary
HisabBondhu AI is a phone-first web app for a Bangladeshi shopkeeper to manage products, sales, baki (customer credit), supplier dues and expenses, with a Gemini-powered assistant that understands Bangla (or Banglish) speech/text, **proposes** actions for confirmation, and answers business questions in Bangla using exact figures computed by application code.

## 2. Problem statement (evidence from the brief)
- Shopkeepers rely on a paper *khata* or memory (brief §2) and lose track of who owes what, what is running out, and weekly profit.
- Menu/form/English-heavy apps are slower than speaking Bangla for many shopkeepers.
- **One sentence:** Small shopkeepers cannot easily see baki, stock and profit because their records are messy and existing apps do not speak their language.

## 3. Target users
| Persona | Description | Needs |
|---|---|---|
| **Primary: Shop owner "Rahima Store"-type** (fictional archetype) | Runs a grocery/tea stall/pharmacy/recharge shop alone; Android phone; more comfortable speaking Bangla than navigating English menus | Record a sale in seconds, know who owes what, see low stock, trust the numbers |
| Secondary (demo only): Judge | Wants to verify a working product quickly | Guided path, labeled demo data, visible proof of Gemini + Firestore |
Customers are **records only** (name + phone), never users. No storefront/marketplace (PS-1).

## 4. Value proposition
Say or type what happened in Bangla → see a confirmation card → one tap to save → ask "who owes me the most?" and get a correct Bangla answer from real data. The AI is the interface; the code is the calculator.

## 5. Goals and success criteria
| Goal | Measurable criterion |
|---|---|
| Working live product | Brief §11 acceptance checklist fully passes on the **deployed URL** on a phone |
| Smart Gemini use | ≥6 distinct allowlisted functions work; ≥90% of the scripted Bangla/Banglish prompts in `AI_Test_Cases.md` pass; zero cases where Gemini-originated numbers differ from code-computed numbers |
| Trust | No AI-created record is saved without Confirm (tested); Cancel saves nothing |
| Data safety | Second account cannot read/write first account's data (tested); no keys in repo/bundle |
| UX | Golden Path completable on a 360 px-wide phone in under 3 minutes by a first-time user (to be measured by a teammate at the venue — not claimed until measured) |
| Presentation | 120-second scripted demo rehearsed ≥3 times with a typed fallback for every voice step |

## 6. Non-goals
Customer storefront, marketplace, multi-shop, staff accounts, online payments, SMS/WhatsApp, barcode, offline mode, inventory forecasting, tax/VAT, e-invoicing, multi-currency.

## 7. Priorities (feature list)

| ID | Feature | Priority | Gemini? |
|---|---|---|---|
| F-01 | Email/password sign-up, sign-in, logout; first-time shop setup (shop name, owner name, phone); per-owner isolation | **P0** | – |
| F-02 | Products: add, edit, list, search, archive; fields per brief | **P0** | – |
| F-03 | Record sale (≥1 item; cash / mobile banking label / baki); stock decreases atomically; negative-stock warning | **P0** | – |
| F-04 | Baki: customers, baki sale adds to balance, repayments (full/partial), per-customer ledger, total outstanding, top debtors | **P0** | – |
| F-05 | Dashboard: today's sales, estimated profit, total baki, low-stock count, empty state | **P0** | – |
| F-06 | Assistant chat (typed): Bangla/English business questions via read functions; Bangla answers | **P0** | **Yes** |
| F-07 | AI-proposed **baki entry** and **payment** with confirmation card (demo-critical, C-02) | **P0** | **Yes** |
| F-08 | Firestore persistence, Security Rules, refresh/logout persistence | **P0** | – |
| F-09 | Firebase Hosting deployment, live URL | **P0** | – |
| F-10 | Input validation, loading/error/retry states, Bangla/English error text | **P0** | – |
| F-11 | Mobile-first layout, big buttons | **P0** | – |
| F-12 | Low-stock list/alert on dashboard and via assistant | P1 | Yes (query) |
| F-13 | Expenses (manual) + `proposeExpense` | P1 | Yes |
| F-14 | `proposeSale` (e.g., "2 kg chini beche dilam, nogod") | P1 | Yes |
| F-15 | Duplicate-entry warning (D-17) | P1 | – |
| F-16 | Google sign-in | P1 | – |
| F-17 | Password reset by email | P1 | – |
| F-18 | Demo data / Judge Mode (`Judge_Mode.md`) | P1 | – |
| F-19 | Sale history by date | P1 | – |
| F-20 | Today/this-week summary incl. profit via assistant (D-15, D-16) | P2 | Yes |
| F-21 | Bangla voice input (Web Speech `bn-BD`), editable transcript | P2 | – |
| F-22 | Supplier dues and purchases (stock increases) | P2 | Optional |
| F-23 | Simple printable receipt | P2 | – |
| F-24 | Undo last AI action | P2 | – |
| F-25 | CSV/PDF report | P2 | – |
| F-26 | SMS/WhatsApp reminders, payment integrations, barcode, offline mode, staff accounts, 2FA, email-verification enforcement, hard delete | **P3 — do not build** | – |

## 8. Golden Path (P0) — identical across PRD, AppFlow, Plan, Testing, Demo_Script
Starting state: clean account, no products, no customers.
- **GP-1** Sign in; complete first-time shop setup (shop name, owner name, phone).
- **GP-2** Add product "Sugar (চিনি)": unit kg, buy 110, sell 130, stock 50, low-stock level 10.
- **GP-3** Record a **cash** sale of 2 kg Sugar → total ৳260; stock becomes 48.
- **GP-4** Record a **baki** sale of 3 kg Sugar to new customer "Rahim" (fictional phone) → total ৳390; Rahim balance ৳390; stock 45.
- **GP-5** Record Rahim's **partial payment ৳200** → balance ৳190; ledger shows credit 390 then payment 200.
- **GP-6** In the assistant, ask (typed; voice only if tested) **"Kar kache sob theke beshi baki ache?"** → Bangla answer naming Rahim ৳190, plus a "Verified from your data" card.
- **GP-7** Command **"Rahim ke 500 taka baki dilam"** → confirmation card (Rahim, ৳500, baki) → tap **Confirm** → balance ৳690. (Variant: **Cancel** → nothing saved.)
- **GP-8** Refresh the page (and log out/in) → balance ৳690, stock 45, sales history intact. Dashboard today (clean account): sales ৳650, estimated profit ৳100, baki ৳690.

(Expected values verified by hand: sales 260+390=650; cost 5 kg×110=550; profit 650−550=100; baki 190+500=690.)

## 9. User stories and acceptance criteria

| Story | Acceptance criteria |
|---|---|
| **US-01** As a new shopkeeper I register and set up my shop (F-01) | Valid email + password (≥6 chars) creates account; setup requires shop name, owner name, phone (BD mobile format, 11 digits); refresh keeps me signed in; Logout returns to login; another account sees nothing of mine |
| **US-02** I add and edit products (F-02) | Required: name (1–60 chars, Bangla or English), unit ∈ {kg, piece, packet, litre}, buy ≥0, sell ≥0 (integers), stock ≥0, low-stock ≥0; search matches Bangla/English; archive hides but keeps history; edits update the right product |
| **US-03** I record a cash/bKash/Nagad/baki sale (F-03) | Items have qty>0 and price≥0; total computed in code; stock decreases atomically; if stock would go negative I see a warning and must explicitly accept or change; sale appears in history; baki requires a customer |
| **US-04** I track baki and repayments (F-04) | Baki sale creates a ledger credit; payment creates a ledger payment; balance = Σcredit − Σpayment (never hand-edited); payment > balance triggers a warning; ledger lists every step; "who owes the most" sorted desc |
| **US-05** I see a dashboard (F-05) | Shows today's sales, estimated profit, total baki, low-stock count; shows first-time guide when empty; numbers match manual calculation for GP values |
| **US-06** I ask the assistant in Bangla (F-06) | Typed Bangla/Banglish question returns a Bangla answer; every number in the answer equals the function result; "Verified from your data" card shows the raw result; error → message + Retry; manual screens still usable |
| **US-07** I command the assistant (F-07, F-14, F-13) | Bangla command → confirmation card with customer/amount/type (and phone last-4 if ambiguous); nothing saved until Confirm; Cancel saves nothing; double-tap on Confirm saves once; ambiguity → short Bangla clarifying question; saved record is tagged `createdBy: "ai"` |
| **US-08** I get warned about low stock (F-12) | Items with `stockQty ≤ lowStockAt` listed on dashboard and in assistant answer |
| **US-09** I record expenses (F-13) | Category ∈ {rent, electricity, transport, salary, other}; amount>0 integer; date; note ≤200 chars; reduces estimated profit |
| **US-10** I avoid duplicates (F-15) | Same customer+amount+type within 10 min → warning with "Save anyway" |
| **US-11** I can use Judge Mode (F-18) | One tap loads fictional, labeled demo data; banner shows while demo data exists; "Remove demo data" removes only `isDemo` records |
| **US-12** I speak instead of type (F-21) | Mic button fills an editable text box; I can fix the text before sending; unsupported browser hides/disables mic with a reason; typing always works |

## 10. Functional requirements (summary)
All items in the story table plus: supplier dues/purchases (P2); stock must not silently go negative; archive over delete; confirmation before delete/archive; AI action log (`aiActions`, optional P1) recording interpreted action and confirmed/cancelled.

## 11. Non-functional requirements
- **Security/privacy:** owner-only rules; Gemini receives only allowlisted fields; no full phone numbers to Gemini; no secrets in repo/bundle; App Check enabled.
- **Reliability:** atomic multi-document writes; no success before success; retry only where safe; idempotent confirm.
- **Performance:** dashboard loads in <3 s on a mid-range phone on 4G (measure, don't assume); Gemini reply typically a few seconds; show progress after 1 s; timeout 20 s.
- **Accessibility/UX:** see `Accessibility.md`, `UI_Spec.md`; touch targets ≥48 px.
- **Compatibility:** Chrome on Android (primary), desktop Chrome/Edge/Firefox; voice only where supported.
- **i18n:** UI English; Bangla text must render (font fallback tested on the demo phone).

## 12. Constraints and assumptions
OFF-1…OFF-7; PS-1…PS-10; assumptions: ASM-1 build time 4.5 h (OC-02); ASM-2 venue internet works for Firebase/Google (OC-07); ASM-3 AI Logic available with Gemini Developer API on the no-cost plan (verify, OC-05); ASM-4 demo phone is Android Chrome.

## 13. Dependencies
Firebase project (Product Owner), Antigravity, Gemini via AI Logic, Chrome Web Speech (P2).

## 14. MVP boundary / out of scope
MVP = all **P0**. P1 only after Golden Path passes locally **and** on the deployed URL. P2 only after P1 and quality gate. P3 explicitly excluded.
