# Testing.md — QA and Test Plan

**Rule:** every Status starts as `NOT RUN`. Antigravity fills **Actual result** and **Status** (`PASS`/`FAIL`/`BLOCKED`/`NOT VERIFIED`) only after really running the test. Never pre-mark.

## 1. Strategy
- **Unit (automated, fast):** `shared/lib` — money rounding, line totals, balance, profit, Dhaka dates/week, name matching/aliases, tool-argument validation.
- **Integration (manual with real Firestore, or emulator if quick):** transactions, rules, persistence.
- **End-to-end (manual):** Golden Path on localhost (Phase 4/5), then on the **live URL on a phone** (Phase 7).
- **AI cases:** `AI_Test_Cases.md` (real Gemini only after PO authorizes).
- Priority: **P0** blocks release, **P1** should pass, **P2** nice.

## 2. Unit-test targets (P0)
UT-1 `lineTotal(0.5, 130)=65`, rounding rule documented · UT-2 sale total = Σ lines (260, 390) · UT-3 balance = Σcredit − Σpayment (390−200=190; +500 → 690) · UT-4 profit (650−550=100) · UT-5 `dateKey` at 23:59 and 00:01 Asia/Dhaka · UT-6 Saturday week start · UT-7 name match: "chini"/"চিনি"/"Sugar" · UT-8 arg validation rejects extra args, negative/float amounts, >cap.

## 3. Test cases

| ID | Scenario | Steps / input | Expected | Pri | Actual | Status |
|---|---|---|---|---|---|---|
| T-01 | Register + setup (valid) | New email + password; setup with shop "Demo Store", owner, phone `01700000000` | Lands on dashboard; refresh keeps session | P0 | | NOT RUN |
| T-02 | Register invalid | Bad email; 3-char password; existing email | Inline errors; no account created; input preserved | P0 | | NOT RUN |
| T-03 | Setup invalid | Empty shop name; phone `123` | Blocked with field errors | P0 | | NOT RUN |
| T-04 | Add product (GP-2) | Sugar (চিনি), kg, 110/130, stock 50, low 10 | Appears in list; persists after refresh | P0 | | NOT RUN |
| T-05 | Product invalid/long | Empty name; 200-char name; negative price; decimal qty for piece; price `1e9` | Validation errors; nothing saved | P0 | | NOT RUN |
| T-06 | Search (Bangla/English/alias) | "চিনি", "sugar", "chini" | Product found | P1 | | NOT RUN |
| T-07 | Cash sale (GP-3) | 2 kg Sugar, cash | Total ৳260; stock 48; in history | P0 | | NOT RUN |
| T-08 | Baki sale atomicity (GP-4) | 3 kg to new customer Rahim; also simulate failure (offline during save) | Success: sale+ledger credit 390+stock 45 all present. Failure: **none** of the three; input preserved; error + Retry | P0 | | NOT RUN |
| T-09 | Partial payment (GP-5) + overpayment | Pay 200; then try 500 when balance 190 | Balance 190; ledger shows 2 steps; overpayment warning defaults to Cancel | P0 | | NOT RUN |
| T-10 | Negative stock warning | Sell 100 kg with stock 45 | Warning "Only 45 left"; default = edit qty; accepted sale flagged | P0 | | NOT RUN |
| T-11 | Empty / invalid sale | No items; qty 0; baki without customer | Blocked with messages | P0 | | NOT RUN |
| T-12 | Duplicate submission / warning | Double-tap Save; repeat same payment within 10 min | One record per tap-sequence; duplicate warning with "Save anyway" (P1) | P0/P1 | | NOT RUN |
| T-13 | Dhaka date boundary | Create entries around 23:59/00:01 Dhaka (or via unit test with injected clock) | Correct `dateKey`; "today" correct | P1 | | NOT RUN |
| T-14 | AI command → Confirm (GP-7) | "Rahim ke 500 taka baki dilam" → Confirm; double-tap Confirm | Card shows Rahim/৳500/Baki; after Confirm balance 690; exactly one ledger doc; `createdBy:"ai"` | P0 | | NOT RUN |
| T-15 | AI command → Cancel | Same, tap Cancel | Nothing written; message "Cancelled" | P0 | | NOT RUN |
| T-16 | Persistence (GP-8) | Refresh; logout/login | Data intact (balance 690, stock 45) | P0 | | NOT RUN |
| T-17 | Dashboard values + empty | New account → empty guide. After GP-1…GP-5 (before GP-7): sales 650, est. profit 100, baki 190 | Matches hand calculation | P0 | | NOT RUN |
| T-18 | Isolation + unauth | Account B tries A's paths (console/app); signed-out reads | Denied; B sees only B's data | P0 | | NOT RUN |
| T-19 | Secret scan | Search repo, `git diff`, `dist/` for keys/tokens/`.env`; confirm `.gitignore` | None found; no private key in any `VITE_` var | P0 | | NOT RUN |
| T-20 | Gemini failure | Offline; simulate timeout; simulate 429/blocked | Clear error + Retry; manual forms still work; no false "saved" | P0 | | NOT RUN |
| T-21 | Mobile 360 px + keyboard | Chrome devtools 360×640 and real phone | No horizontal scroll; primary actions visible with keyboard open; numeric keyboards | P0 | | NOT RUN |
| T-22 | Accessibility quick checks | Tab through forms; labels; focus; contrast; targets ≥48 px | Per `Accessibility.md` | P1 | | NOT RUN |
| T-23 | Console/terminal | Run GP with devtools open | No uncaught errors/unhandled rejections | P0 | | NOT RUN |
| T-24 | **Live URL on phone** | GP-1…GP-8 on deployed Hosting URL | All pass; HTTPS; assistant works | P0 | | NOT RUN |
| T-25 | Long/mixed input to assistant | 2,000-char text; Bangla-script digits "৫০০"; emoji; empty | Handled safely; empty blocked; digits parsed | P1 | | NOT RUN |
| T-26 | Demo data (P1) | Load; banner visible; Remove | Only `isDemo` removed; real records untouched | P1 | | NOT RUN |
| T-27 | Voice (P2) | Mic → bn-BD → edit text → Send | Editable transcript; unsupported browsers fall back | P2 | | NOT RUN |

## 4. Gemini failure cases (summary)
Timeout, 429, App Check denied, blocked/unsafe response, empty response, malformed function args, unknown function name → all covered by T-20 and `AI_Test_Cases.md` AI-15/AI-16.

## 5. Firebase persistence and access control
T-16, T-18, plus: edit product updates only that product; archived product remains in old sales; rules reject unknown fields and non-integer amounts (use Rules Playground).

## 6. Authentication checks
Register/login/logout (T-01/T-02), session persistence (T-16), protected routes (open `/customers` signed out → `/login`), wrong password message, Google sign-in (P1), reset email (P1, **PO's own address, approval first**). MFA/2FA: not applicable (D-05).

## 7. "Often Forgotten, We Will Check" acceptance checks
Map: OF-1 (T-21 + photo) · OF-2 (UT-1…UT-4, T-17) · OF-3 (T-08, T-10, T-14) · OF-4 (T-14, T-15) · OF-5 (T-18) · OF-6 (T-19) · OF-7 (UT-5, UT-6, T-13) · OF-8 (AI-06) · OF-9 (rehearsal log) · OF-10 (T-17) · OF-11 (T-12) · OF-12 (AI-12) · OF-13 (T-24) · OF-14 (T-22) · OF-15 (read Settings/About text).

## 8. Acceptance criteria (brief §11)
All brief checklist items pass: register/setup; products + stock after sales; cash and baki sales; partial repayment ledger; Bangla Q&A from saved data; confirm/cancel semantics; persistence; second-account isolation; live URL on phone; no secrets in repo/browser code.

## 9. Release readiness checklist
- [ ] T-01…T-24 P0 all PASS (or documented waivers by PO)
- [ ] Live URL verified on phone · [ ] Rules deployed and tested · [ ] No secrets · [ ] Demo account ready · [ ] Backup video recorded and labeled · [ ] Known limitations listed in README/HANDOVER · [ ] PO approval for deployment recorded
