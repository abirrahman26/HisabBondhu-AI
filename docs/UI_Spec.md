# UI_Spec.md — UI/UX Specification

## 1. Design direction
Phone-first (360×640 baseline), calm and trustworthy "digital khata": large tap targets, high contrast, plain words, one primary action per screen. English UI; **Bangla appears only in assistant replies, user-entered names, and bilingual product names**. No decorative gradients, no heavy animation. Desktop: same layout, centered max-width 960 px with left rail navigation.

## 2. Information architecture
Home (dashboard) · Sell · Baki (customers → ledger) · Products · Assistant · More (Expenses P1, History P1, Suppliers P2, Settings). Page title (h1) on every screen; document `<title>` updates per route.

## 3. Screen inventory
Login · Setup · Dashboard · Products (list + form sheet) · Sell · Baki list · Customer ledger · Assistant · Expenses (P1) · Sales history (P1) · Suppliers/Purchases (P2) · Settings · 404.

## 4. Layout and responsive behavior
- ≤640 px: single column, bottom nav (5 items, 56 px high, icon + label), forms as full-screen sheets, sticky primary action bar above the nav.
- ≥768 px: left rail nav, content max-width 960 px, two-column dashboard cards, forms as side panels/modals.
- No horizontal page scroll at 320–1280 px; wide tables become stacked cards on phones.
- Respect safe areas (`env(safe-area-inset-*)`).

## 5. Design tokens (practical)
| Token | Value | Notes |
|---|---|---|
| Primary | teal-700 `#0F766E` | white text contrast ≈5.5:1 (verify) |
| Primary hover/active | teal-800 | |
| Surface / background | white / slate-50 | |
| Text | slate-900 body, slate-600 secondary (≥4.5:1 on white — verify) | |
| Danger | red-700 | destructive, overdue baki |
| Warning | amber-700 on amber-50 | low stock, duplicate, negative stock |
| Success | green-700 on green-50 | saved |
| AI accent | indigo-700 | assistant bubbles + "AI" tag |
| Verified-data accent | slate-100 card with a "Verified from your data" label | distinguishes database facts from AI text |
| Font | system sans stack with `Noto Sans Bengali`/system Bengali fallback; **test Bangla rendering on the demo phone** | Bangla `line-height: 1.6` |
| Sizes | body 16 px, small 14 px (never below), titles 20–24 px, amounts 24 px bold with tabular numerals | |
| Spacing | 4-px scale (4/8/12/16/24/32) | |
| Radius | 12 px cards, 999 px chips | |
| Targets | ≥48×48 px | primary buttons 56 px high on phone |

Money format: `৳1,250` (Latin digits in UI; the AI may reply with Bangla digits; stored values are plain integers).

## 6. Components and responsibilities
`AppShell` (nav, banner slots) · `DemoBanner` · `OfflineBanner` · `StatCard` · `EmptyState` · `Skeleton` · `Toast` · `ConfirmDialog` · `FormField` (label, hint, error with `aria-describedby`) · `MoneyInput` (integers) · `QtyInput` (decimal rules by unit) · `ProductPicker` (search) · `CustomerPicker` (search + inline add; shows phone last-4) · `PaymentTypeSelector` (Cash / bKash / Nagad / Baki — labels only, large segmented buttons) · `SaleSummary` · `LedgerList` · `LowStockList` · `ChatThread` · `ChatBubble` (user / AI with "AI" tag) · `VerifiedDataCard` · `ConfirmationCard` · `MicButton` (P2) · `ErrorWithRetry`.

## 7. Key component behavior
**ConfirmationCard** (most important for judges): title "Confirm: record baki"; rows — Customer (name + phone last-4), Amount (large), Type (Baki given / Payment received), Date (today), "You said: 'Rahim ke 500 taka baki dilam'", buttons **Confirm** (primary) and **Cancel**. Buttons disabled after first tap; shows "Saving…" then "Saved ✓" only after the write resolves. Duplicate/stock/overpayment warnings appear in an amber block above the buttons.
**VerifiedDataCard:** compact table of the exact function result (e.g., top debtors with amounts), labeled "Verified from your data — calculated by the app, not by AI".
**ChatBubble (AI):** small "AI" tag; the text is Gemini's explanation. Never styled like a saved record.

## 8. Forms, validation, feedback
Inline validation on blur and submit; error text states the fix ("Enter a selling price of 0 or more"). Integers only for money; quantity rules by unit. Required indicators in text ("required"), not color alone. Errors link to fields; focus moves to first error. Dialogs trap focus and restore it. Toasts `role="status"` (errors `role="alert"`), auto-dismiss ≥6 s, never the only place an error appears.

## 9. Empty / loading / error / success states
Dashboard empty: "Welcome, {owner}. Start by adding your first product." + primary button + (P1) "Load demo data to explore". Lists: skeleton rows; empty states with one action; errors with Retry. Success: "Saved ✓" toast and the new data visible.

## 10. Mobile behavior
Numeric keyboards for amount/qty/phone (`inputmode`); amounts inputs never zoom (16 px font); keyboard does not hide the primary action (sticky bar adjusts); assistant input pinned above nav; chips with example questions (typed fallback for voice).

## 11. Accessibility
See `Accessibility.md` (semantic landmarks, labels, focus, contrast, targets, reduced motion).

## 12. Microcopy guidance
Plain English, short, no jargon. Examples: "Sell", "Record payment", "Who owes me?", "Not enough stock — only 4 left", "No internet. Can't save right now.", "Assistant is unavailable. Try again or use the forms." Bangla assistant replies short and polite; amounts with ৳.

## 13. Judge Mode / demo usability
Banner "Demo data (fictional) is loaded" with "Remove demo data". Assistant example chips: "Kar kache sob theke beshi baki ache?", "Aj koto bikri holo?", "Ki ki jinis shesh hoye ashche?", "Rahim ke 500 taka baki dilam". Chips only fill the input (judge presses Send) so behavior is honest.

## 14. Do-not-do
No custom animation libraries, no icon packs beyond one set, no theming system, no dark mode (not required; cut), no illustrations.
