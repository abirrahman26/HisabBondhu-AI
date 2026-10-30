# Accessibility.md — Accessibility Checklist

All statuses start `NOT TESTED`. Do not claim compliance without testing. Antigravity fills **Result** with real observations.

| # | Area | Check | How Antigravity can test | Result | Status |
|---|---|---|---|---|---|
| A-01 | Semantics | One `<h1>` per page; landmarks `header/nav/main`; lists are lists; buttons are `<button>`, links are `<a>` | Inspect DOM / browser accessibility tree | | NOT TESTED |
| A-02 | Keyboard | Every control reachable and operable with Tab/Shift+Tab/Enter/Space/Esc; no keyboard traps; dialogs trap and restore focus | Manual keyboard pass over GP | | NOT TESTED |
| A-03 | Focus | Visible focus ring (≥3:1) on all interactive elements; logical order | Manual | | NOT TESTED |
| A-04 | Labels | Every input has a visible `<label>`; icon-only buttons have `aria-label` (mic, send, close); bottom-nav items have text | DOM check | | NOT TESTED |
| A-05 | Contrast | Body text ≥4.5:1, large text/UI ≥3:1 (teal-700 on white, amber/red states, AI accents) | Browser devtools contrast checker | | NOT TESTED |
| A-06 | Touch targets | Primary controls ≥48×48 px with spacing | Devtools measure at 360 px | | NOT TESTED |
| A-07 | Forms/errors | Errors in text near field, `aria-describedby`, `aria-invalid`; focus to first error; not color-only | Submit invalid forms | | NOT TESTED |
| A-08 | Live regions | Toasts `role="status"`; errors `role="alert"`; assistant replies announced (`aria-live="polite"`) | Screen-reader/inspect | | NOT TESTED |
| A-09 | Responsive text | Usable at 200% zoom and 320 px width; no horizontal scroll; Bangla `line-height` ≥1.6 | Zoom/resize | | NOT TESTED |
| A-10 | Motion | No auto-playing animation; honor `prefers-reduced-motion` | CSS review | | NOT TESTED |
| A-11 | Language | `<html lang="en">`; Bangla replies marked `lang="bn"` | DOM check | | NOT TESTED |
| A-12 | Confirmation card | Focus moves to the card when it appears; Confirm/Cancel clearly named; result announced | Manual | | NOT TESTED |
| A-13 | Input modes | `inputmode="numeric"`/`tel` on amount/phone; 16 px font to avoid zoom | Real phone | | NOT TESTED |

Screen-reader testing with a real device (TalkBack) is **optional/not promised**; record "NOT VERIFIED" if not done.
