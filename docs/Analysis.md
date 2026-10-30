# Analysis.md — Challenge Analysis, Source Classification and Decision Log

> Added file (not in the required list). Justification: the master prompt requires a Step A/B analysis, a decision log and organizer-confirmation list. This file is the single home for them; other docs link here by ID (D-xx, OC-xx).

## 0. Source status (read this first)

| Source | Status |
|---|---|
| `HisabBondhu_AI_Hackathon_Brief.pdf` | **Read in full.** It describes itself as a **"preparation brief"** and says: *"At the event, follow the official problem statement and rules."* |
| Official **Build with AI Hackathon Participant Guidelines** PDF | **NOT supplied.** Every "official" rule below comes from Section 1 of the brief only. **Needs confirmation from organizer / against the guidelines PDF** (OC-01). |
| `Claude_Master_Prompt.md` | Read in full. Governs the structure, roles, approval gates and security posture of this pack. |

**Consequence:** if the surprise problem revealed at the venue differs from HisabBondhu AI, this pack is a rehearsal and must be regenerated using the master prompt (Section 12). The process, security model, phase workflow and quality checklist remain reusable.

### Label legend
**OFF** official requirement (per brief §1; unverified against guidelines PDF) · **PS** problem-statement requirement · **TD** team decision · **REC** recommendation · **ASM** assumption / open question

## 1. Challenge in plain English

Small Bangladeshi shopkeepers track sales, stock, credit (*baki/dhar*), supplier dues and expenses in a paper notebook (*khata*). They lose track of who owes what, what is running out, and whether the week was profitable. Existing apps are menu/form/English heavy. **Build a live web app where the shopkeeper manages the shop and can simply speak or type in Bangla; the app understands, asks for confirmation, saves, and answers in Bangla.**

## 2. Requirements extracted

### 2.1 Hackathon rules (OFF, brief §1)
| ID | Requirement |
|---|---|
| OFF-1 | IDE: Google Antigravity (mandatory) |
| OFF-2 | Gemini API is the core intelligence of the product (mandatory) |
| OFF-3 | Deployment on Firebase Hosting with a publicly reachable live URL (mandatory) |
| OFF-4 | React + Vite recommended |
| OFF-5 | About 4–5 hours of build time |
| OFF-6 | Built from scratch at the venue; no pre-written code, templates, or old projects |
| OFF-7 | ChatGPT/Gemini/Claude and similar assistants allowed |

### 2.2 Judging weights (OFF, brief §1)
| Category | Weight |
|---|---:|
| Working live product | 30% |
| Smart use of Gemini and Antigravity | 35% |
| Firebase deployment | 10% |
| User experience | 15% |
| Final presentation | 10% |
| **Sum** | **100%** (consistent; no OCR ambiguity detected in this brief — still verify against guidelines PDF, OC-01) |

### 2.3 Problem-statement requirements (PS)
- PS-1 One user type: shopkeeper/owner. No storefront, no marketplace. Customers are records (name + phone), not users.
- PS-2 One shop per account; strict per-owner data isolation.
- PS-3 Phone-first (small Android), desktop must also work. Currency BDT, whole numbers.
- PS-4 Language: UI/docs English; shopkeeper input Bangla/Banglish/mixed; AI replies Bangla by default, English if user types English.
- PS-5 Voice via browser speech recognition (bn-BD) or audio to Gemini; **typed fallback must always work; the demo must not depend on voice alone.**
- PS-6 Functional areas: Account/shop, Products/stock, Selling, Baki, Supplier dues, Expenses, Dashboard, Gemini assistant, Safety/trust (see PRD).
- PS-7 AI rules: Gemini never computes money; no unrestricted DB access; fixed allowlist of functions; mutating functions only *propose*; user taps Confirm; ambiguity → short Bangla clarifying question; failure → clear error + retry, manual forms still work; **Gemini key never in frontend** (prefer Firebase AI Logic + App Check, else secure backend).
- PS-8 Data under `shops/{uid}/...`; balance computed from ledger in code.
- PS-9 Security: rules scoped to own uid, tested with two accounts; no keys/.env/service accounts committed; validate inputs; stock must not silently go negative.
- PS-10 Acceptance checklist (brief §11) and two-minute judge demo (brief §12).

## 3. Conflicts, tensions and gaps found (must be visible, not silently resolved)

| ID | Finding | Resolution in this pack |
|---|---|---|
| C-01 | **Phase-order conflict inside the master prompt.** Master order is Core (3) → Gemini (4) → Firebase (5), but Core must persist "only through the approved architecture" (Firestore) and Gemini tools query Firestore. Firebase cannot come after both. | **D-01:** this pack uses the order **0 Review → 1 Foundation → 2 UI → 3 Firebase → 4 Core → 5 Gemini → 6 Quality → 7 Deployment**. All master phase content is kept; only the sequence of Firebase moves earlier. *Product Owner decision pending approval.* If rejected, revert order and accept that Phase 3 core runs on a clearly labeled temporary in-memory adapter (throw-away work, ~15 min). |
| C-02 | Brief's demo (§12, 1:25–1:45) needs an **AI command + confirmation card**, but the brief lists AI-proposed entries as **P1**. | **TD:** promote the *minimal* proposal set (`proposeBakiEntry`, `proposePayment`) to **P0 (demo-critical)**. `proposeSale`, `proposeExpense` stay P1. |
| C-03 | Brief lists "stock decrease on sale" as P1 but the P0 acceptance checklist requires "stock is correct after sales". | **TD:** stock decrease is part of P0 sale recording. |
| C-04 | "Whole numbers" for amounts vs fractional quantities (0.5 kg). | **D-10:** money = integer BDT; quantity = number with up to 3 decimals for kg/litre, integer for piece/packet; line total = `round(qty × unitPrice)` in code. |
| C-05 | Master prompt structure for presentation (problem/solution/demo/tech/close) vs brief §12 timeline. | `Demo_Script.md` merges them; total 120 s. |
| C-06 | Brief asks for Firebase AI Logic + App Check; master prompt asks for authorization "in trusted backend logic". With AI Logic there is **no custom backend**. | **TD:** trust boundary = Firestore Security Rules (enforced by Google) + a strict client-side tool dispatcher with allowlist/schema validation. Honest threat model in TRD §7: the owner may only harm their own data; the real threats are Gemini output and prompt injection through stored text. Cloud Functions fallback needs the paid Blaze plan → approval needed (D-12). |
| C-07 | "GSD" appears in master prompt §14 item 7 without definition. | **ASM:** treated as "organizing work into phases"; no tool or dependency is assumed. |
| C-08 | Master prompt asks Claude to *ask* login/2FA questions before finalizing; user asked for "everything" now. | Master §4.2.1 allows proceeding with labeled assumptions. Defaults are in the Decision Log (D-02…D-09) and marked **Product Owner decision pending approval**. |
| C-09 | Pre-event preparation: brief says "do not bring pre-written code". Docs, `.gitignore`, `.env.example` and demo-data *specs* are not code, but boundaries are unclear. | **OC-04.** Until confirmed: keep the pack as documents only; Antigravity creates `.gitignore`/`.env.example` at the venue from the content described in `README.md`/`HANDOVER.md`. The two files in this pack are provided for review. |
| C-10 | Brief describes only a two-minute demo; master prompt expects 2-min talk + 1-min Q&A. | Brief confirms only the 2-minute demo. Q&A prep is included but marked **Needs confirmation** (OC-03). |

## 4. Product concept (Step B)

**One sentence:** HisabBondhu AI lets a Bangladeshi shopkeeper run sales, stock and baki by speaking or typing Bangla; Gemini understands the request, the app code does exact lookups and arithmetic, and nothing is saved until the shopkeeper taps Confirm.

**Why it wins the rubric:** 35% Gemini/Antigravity (function calling in Bangla, propose-confirm safety pattern) · 30% working live product (real Firestore persistence, refresh-proof) · 15% UX (phone-first, big buttons, confirm cards) · 10% Firebase (Hosting+Auth+Firestore+AI Logic+App Check) · 10% presentation (scripted, tested sample data).

**Gemini-powered core intelligence:** (a) Bangla/Banglish question → allowlisted read function → Bangla explanation; (b) Bangla command → allowlisted *propose* function → confirmation card; (c) clarifying questions for ambiguity. **Gemini never computes money or touches the database.**

**Minimum Firebase services:** Hosting, Authentication, Firestore, AI Logic (Gemini Developer API provider), App Check. No Storage, no Cloud Functions (unless fallback approved).

**External APIs:** none. (No email, SMS, payments.) Browser Web Speech API is optional (P2).

**Biggest risks + fallback:** see `Risks.md`. Top 3: Gemini/AI Logic misconfiguration or quota at demo time → typed manual forms + pre-recorded backup; Bangla voice unreliable on demo device → typed input (always); phase-approval overhead eating the clock → strict time-boxes and cut list.

## 5. Decision Log (Product Owner decisions)

Status values: **Pending approval** (default recommended, not yet approved) · **Approved** (set by Product Owner only).

| ID | Decision | Default / recommendation | Why it matters | Status |
|---|---|---|---|---|
| D-01 | Phase order | Firebase (Phase 3) before Core (Phase 4) and Gemini (Phase 5) | Persistence is needed before Core and AI | Pending approval |
| D-02 | Is login required? | **Yes.** Per-owner data and persistence are mandatory (PS-2) | No-login mode would break data isolation | Pending approval |
| D-03 | Sign-in method | **Email + password (P0)**; **Google sign-in (P1)**. No phone OTP (SMS cost/billing, region friction), no magic link (email deliverability risk at venue) | Judges need a path that works without a Google dependency | Pending approval |
| D-04 | Registration data | Email + password at sign-up; shop name, owner name, phone collected at first-time setup (PS requirement). Nothing else | Data minimization | Pending approval |
| D-05 | 2FA/MFA | **Not required.** Not requested by the brief; SMS MFA needs paid identity platform; adds 20+ min and demo friction. Document as P3 | Honest scope; ordinary email verification is *not* MFA and is not claimed as such | Pending approval |
| D-06 | Password reset | Firebase email reset (P1). Testing it sends a real email → only to the Product Owner's own address after explicit approval | Real-email rule | Pending approval |
| D-07 | Session | Firebase default persistence (survives refresh/restart); visible Logout; no custom expiry | Satisfies "data survives refresh and logout/login" | Pending approval |
| D-08 | Roles | Single role: owner. No admin/staff (P3) | PS-1/PS-2 | Pending approval |
| D-09 | Judge access | Product Owner creates a clearly labeled **demo account at the venue** with **fictional** data (Judge Mode "Load demo data"). Credentials are never written to the repo/docs/chat; judges may also register their own account | No shared account with real personal data | Pending approval |
| D-10 | Quantities | Decimal(≤3) for kg/litre; integer for piece/packet; money integer BDT | C-04 | Pending approval |
| D-11 | Voice | Web Speech API `bn-BD` as P2, recognized text shown in an editable box before sending; typed input always available | PS-5 | Pending approval |
| D-12 | Gemini integration | **Firebase AI Logic + App Check** (Gemini Developer API provider if available on the no-cost plan — verify). Fallback: Cloud Functions + Secret Manager **only with explicit billing approval** | PS-7 | Pending approval |
| D-13 | Demo data | Records carry `isDemo: true`; permanent banner while any demo data exists; "Remove demo data" button | Honest labeling | Pending approval |
| D-14 | Deletion | Products/customers are archived (`active=false`), not hard-deleted. Sales/ledger are append-only except demo records | Integrity | Pending approval |
| D-15 | "Today / this week" | Timezone **Asia/Dhaka (UTC+6)**; stored `dateKey = YYYY-MM-DD` in Dhaka time; week starts **Saturday** (local convention; verify with PO) | Wrong period = wrong totals | Pending approval |
| D-16 | Profit definition | Estimated profit (period) = Σ(qty × (unitPrice − unitCost)) over sales dated in period − expenses dated in period. Baki sales count when sold; repayments are not income. `unitCost` snapshots `buyPrice` at sale time. Always labeled "estimated" | Correct, explainable profit | Pending approval |
| D-17 | Duplicate window | Warn if same customer + same amount + same type exists within **10 minutes** (user may proceed) | Brief §10 | Pending approval |
| D-18 | Language of AI | Bangla default; English if the latest user message is predominantly English | PS-4 | Pending approval |

## 6. Organizer confirmations required

| ID | Question | Impact |
|---|---|---|
| OC-01 | Provide/verify the official participant-guidelines PDF; confirm rules in brief §1 and the judging weights (30/35/10/15/10). | All rules in this pack |
| OC-02 | Exact build time (4 vs 5 h) and clock start/stop. | `Plan.md` budget |
| OC-03 | Is the presentation 2 min + 1 min Q&A? | `Demo_Script.md` |
| OC-04 | May teams prepare documentation, `.gitignore`, `.env.example` and demo-data specs before the event? Is Claude-generated planning documentation acceptable? | Pack usage |
| OC-05 | Are Firebase billing (Blaze) / Gemini quotas provided or restricted at the venue? Is Firebase AI Logic permitted/available in the venue region? | D-12 |
| OC-06 | Is clearly labeled fictional demo data allowed in the live product? | D-13 |
| OC-07 | Wi-Fi availability/restrictions at the venue (Firebase, Google APIs, speech recognition need internet). | Demo fallback |
