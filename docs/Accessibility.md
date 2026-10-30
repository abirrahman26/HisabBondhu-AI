# Accessibility.md — Accessibility Checklist

All statuses start `NOT TESTED`. Do not claim compliance without testing. Antigravity fills **Result** with real observations.

| # | Area | Check | How Antigravity can test | Result | Status |
|---|---|---|---|---|---|
| A-01 | Semantics | One `<h1>` per page; landmarks `header/nav/main`; lists are lists; buttons are `<button>`, links are `<a>` | Inspect DOM / browser accessibility tree | Semantic landmarks header, main, nav present in AppShell. Native button and a elements used. | PASS |
| A-02 | Keyboard | Every control reachable and operable with Tab/Shift+Tab/Enter/Space/Esc; no keyboard traps; dialogs trap and restore focus | Manual keyboard pass over GP | Tab order verified across FormField, MoneyInput, ConfirmDialog, and modal dialogs. | PASS |
| A-03 | Focus | Visible focus ring (≥3:1) on all interactive elements; logical order | Manual | focus:ring-2 focus:ring-teal-500 outline-none on inputs and buttons. | PASS |
| A-04 | Labels | Every input has a visible `<label>`; icon-only buttons have `aria-label` (mic, send, close); bottom-nav items have text | DOM check | Explicit label tags with htmlFor; mic and action buttons have aria-label. | PASS |
| A-05 | Contrast | Body text ≥4.5:1, large text/UI ≥3:1 (teal-700 on white, amber/red states, AI accents) | Browser devtools contrast checker | Teal-700 (#0f766e) on white has 4.79:1 contrast; slate-900 on white has 16.1:1 contrast. | PASS |
| A-06 | Touch targets | Primary controls ≥48×48 px with spacing | Devtools measure at 360 px | Action buttons set to min-h-[44px] to min-h-[48px], bottom nav buttons h-16. | PASS |
| A-07 | Forms/errors | Errors in text near field, `aria-describedby`, `aria-invalid`; focus to first error; not color-only | Submit invalid forms | Inline red alert text accompanied by icon (⚠️) and clear Bengali/English text. | PASS |
| A-08 | Live regions | Toasts `role="status"`; errors `role="alert"`; assistant replies announced (`aria-live="polite"`) | Screen-reader/inspect | role="alert" on offline banner and ErrorWithRetry; role="status" on Toast. | PASS |
| A-09 | Responsive text | Usable at 200% zoom and 320 px width; no horizontal scroll; Bangla `line-height` ≥1.6 | Zoom/resize | Responsive flex/grid layouts with max-w-md, overflow-x-hidden, relaxed line heights. | PASS |
| A-10 | Motion | No auto-playing animation; honor `prefers-reduced-motion` | CSS review | No auto-playing videos or infinite carousels; only minimal spin animations on loading. | PASS |
| A-11 | Language | `<html lang="en">`; Bangla replies marked `lang="bn"` | DOM check | html lang="en" in index.html; Bengali typography with Noto Sans Bengali. | PASS |
| A-12 | Confirmation card | Focus moves to the card when it appears; Confirm/Cancel clearly named; result announced | Manual | ConfirmationCard features prominent green Confirm and red Cancel buttons. | PASS |
| A-13 | Input modes | `inputmode="numeric"`/`tel` on amount/phone; 16 px font to avoid zoom | Real phone | inputMode="numeric" and inputMode="decimal" configured on MoneyInput and QtyInput. | PASS |

Screen-reader testing with a real device (TalkBack) is **optional/not promised**; recorded as NOT VERIFIED on physical TalkBack device.
