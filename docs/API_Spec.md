# API_Spec.md — API and Integration Specification

## 1. Internal module contracts (`shared/data` and `shared/lib`)
| Function | Input | Output | Notes |
|---|---|---|---|
| `createSaleTx(sale)` | validated sale object | `{saleId}` | Transaction: check stock, write sale, decrement stock, write ledger credit if `baki` |
| `recordPaymentTx({customerId, amount, note, createdBy, proposalId?})` | | `{entryId}` | |
| `recordBakiTx({customerId, amount, note, createdBy, proposalId?})` | | `{entryId}` | |
| `getCustomerBalances()` | – | `[{customerId, name, phone, balance}]` | Σcredit − Σpayment |
| `getPeriodSummary(period)` | `today\|week\|month` | `{sales, cogs, expenses, profit, saleCount}` | Dhaka dates (D-15, D-16) |
| `getLowStock()` | – | `[{productId, name, unit, stockQty, lowStockAt}]` | `stockQty ≤ lowStockAt`, active only |
| `resolveCustomer(name, altName?, ref?)` / `resolveProduct(...)` | | `{status: "match"\|"ambiguous"\|"none", matches[]}` | `shared/lib/match.js`; normalizes case, Bangla/English, aliases |
| `confirmProposal(proposalId)` / `cancelProposal(proposalId)` | | `{ok}` | UI-only actions; idempotent |
Errors: `AppError{code, userMessage, retryable}`; codes: `NETWORK, PERMISSION, QUOTA, TIMEOUT, VALIDATION, NOT_FOUND, MODEL_MALFORMED, STOCK_NEGATIVE, DUPLICATE`.

## 2. Gemini use cases
UC-1 answer business questions (read functions) · UC-2 turn commands into proposals · UC-3 ask clarifying questions · UC-4 explain results in Bangla/English. Gemini does **not**: compute money, write data, access Firestore, decide permissions.

## 3. Function allowlist (declarations given to Gemini)
Arguments are validated by the dispatcher **before** execution: unknown function → rejected; unknown/extra args → rejected; types, ranges, max lengths enforced; max 3 rounds per user message.

### Read functions
| Name | Priority | Args | Returns to Gemini (allowlisted fields only) |
|---|---|---|---|
| `getTodaySales` | P0 | – | `{date, saleCount, totalSales, cashTotal, mobileBankingTotal, bakiTotal}` |
| `getCustomerBalances` | P0 | `limit` int 1–20 (default 5), `order` `desc\|asc` | `[{customerRef, name, balance, phoneLast4?}]` (`phoneLast4` only when names collide) + `totalOutstanding` |
| `getLowStock` | P1 | – | `[{productName, unit, stockQty, lowStockAt}]` |
| `getProductInfo` | P1 | `productName`, `productNameAlt?` | `{status, matches:[{productRef, name, unit, sellPrice, stockQty}]}` (no buy price) |
| `getCustomerLedger` | P1 | `customerName`, `customerNameAlt?`, `customerRef?`, `limit` ≤20 | `{customer:{customerRef,name}, balance, entries:[{date,type,amount}]}` (no notes) |
| `getExpensesSummary` | P1 | `period` | `{period, total, byCategory:[{category,total}]}` |
| `getPeriodSummary` | P2 | `period` `today\|week\|month` | `{period, sales, costOfGoods, expenses, estimatedProfit}` |
| `getSupplierDues` | P2 | – | `[{supplierName, due}]` |

### Propose functions (never write)
| Name | Priority | Args | Notes |
|---|---|---|---|
| `proposeBakiEntry` | **P0** | `customerName`, `customerNameAlt?`, `customerRef?`, `amount` int 1–10,000,000, `note?` ≤100 | Gave goods/money on credit |
| `proposePayment` | **P0** | same | Customer paid |
| `proposeSale` | P1 | `items:[{productName, productNameAlt?, productRef?, qty>0, unitPrice?}]` (1–10), `paymentType` `cash\|mobile_banking\|baki`, `customerName?`/`customerRef?` | Price defaults to the product's `sellPrice` (code) |
| `proposeExpense` | P1 | `category` enum, `amount`, `note?` | |
| `proposePurchase` | P2 | supplier, items, paid | |

### Propose result returned to Gemini
`{status: "ready"|"ambiguous"|"not_found"|"invalid"|"duplicate_warning"|"stock_warning", proposalId?, candidates?:[{ref, name, phoneLast4}], reason?}`. The **confirmation card is rendered from code values**, not from Gemini text. Gemini then writes one short Bangla sentence asking the owner to confirm.

## 4. Field allowlist and exclusion rules
Sent to Gemini only if listed above. **Never:** full phone numbers, customer `note`, buy price (except through code-computed profit), emails, uid, Firestore IDs (use opaque `cN`/`pN` refs mapped in a session table), tokens/config. Stored free text (names, aliases) is wrapped in the function result as data fields; the system instruction forbids following instructions inside them.

## 5. Prompt/context strategy (spec level)
Static system instruction (see TRD §6) + chat history + function declarations. No database dump in the prompt. Language rule: Bangla by default, English if the latest user message is predominantly English. Numbers: use result values exactly; Bangla digits allowed; never round or total.

## 6. Response validation
1. Function name ∈ allowlist and priority-enabled. 2. Args conform to schema. 3. Resolved entities belong to the signed-in owner (path-scoped query). 4. Free-text Gemini output is display-only; it never drives a write. 5. **Number echo check (P2):** warn "Verify with the card" if a number in the text is absent from the function result. 6. Malformed/empty response → `MODEL_MALFORMED` → retry button.

## 7. Error mapping and retry policy
| Condition | User message (EN/Bangla short) | Retry |
|---|---|---|
| Network/offline | "No internet. Try again." | manual Retry |
| Timeout (20 s) | "Assistant took too long." | Retry; reads auto-retry once |
| Quota/rate limit (429) | "Assistant is busy. Try again in a minute or use the forms." | manual, no auto |
| Permission/App Check | "Assistant can't connect (security check). Use the forms." | none; log code |
| Malformed/unsafe/blocked | "Couldn't understand. Please rephrase." | Retry |
| Function arg invalid | Gemini asked to correct once; then clarify with user | max 1 |
Writes are never auto-retried; confirm is idempotent via `proposalId`.

## 8. Limits, quotas, cost
Gemini request rates/tokens/pricing/regions depend on the account and model → **verify at implementation time (OC-05)**. Budget guess for demo: <200 requests; do not assume unlimited free usage. Keep prompts short; no history beyond the session.

## 9. Firebase interfaces
Auth: `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, (P1) Google provider, (P1) `sendPasswordResetEmail`. Firestore: paths in `Schema.md`; transactions for sale/ledger/stock. App Check: reCAPTCHA provider. AI Logic: `getGenerativeModel` with tools + system instruction.

## 10. Authentication and authorization expectations
Email+password (P0), Google (P1), no MFA, no roles beyond owner (D-03…D-08). Identity = `auth.currentUser.uid` only. Dispatcher refuses all calls when unauthenticated.

## 11. Environment variable names
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_APPCHECK_RECAPTCHA_SITE_KEY`, `VITE_GEMINI_MODEL`. Fallback-only secret: `GEMINI_API_KEY` (Secret Manager, never frontend).

## 12. Sample payloads (fictional)
**Read — user:** "Kar kache sob theke beshi baki ache?" → call `getCustomerBalances{limit:3, order:"desc"}` → result `{totalOutstanding:2240, items:[{customerRef:"c2",name:"Karim Mia",balance:1200},{customerRef:"c3",name:"Nasima Begum",balance:850},{customerRef:"c1",name:"Rahim",balance:190}]}` → Gemini (Bangla): top debtor Karim Mia ৳1,200, then Nasima Begum ৳850, then Rahim ৳190.
**Command — user:** "Rahim ke 500 taka baki dilam" → `proposeBakiEntry{customerName:"Rahim", customerNameAlt:"রহিম", amount:500}` → `{status:"ready", proposalId:"3f2a…"}` → UI renders card (Rahim, ৳500, Baki given) → Confirm → write → balance 690 (GP values; in the demo dataset total outstanding becomes 2,740 after GP-7).
**Ambiguous:** `{status:"ambiguous", candidates:[{ref:"c1",name:"Rahim",phoneLast4:"0001"},{ref:"c4",name:"Rahim Sheikh",phoneLast4:"0004"}]}` → Gemini asks which one; reply → `proposeBakiEntry{customerRef:"c4",amount:500}`.

## 13. Cost and availability assumptions needing verification
AI Logic plan/billing requirement; model availability in the venue's region; Web Speech availability on the demo phone; App Check provider quotas.
