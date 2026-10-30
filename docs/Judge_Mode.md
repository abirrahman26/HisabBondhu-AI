# Judge_Mode.md — Judge Mode Specification

## 1. Useful and permitted?
**Useful:** the brief requires "a clearly labelled demo-data option" and a tested demo with pre-loaded data. **Permitted:** *Needs confirmation* (OC-06) — fictional labeled data is a product feature, not pre-written code. If organizers object, fallback: the Product Owner enters the six demo records by hand in the demo account before presenting.

## 2. Purpose and scope
Let judges (and the presenter) see a non-empty, believable shop immediately, then verify the Golden Path with real functionality. Priority **P1** (F-18). The main product works without it.

## 3. Entry and exit
Settings → **Load demo data** (confirm dialog: "Adds fictional records, marked as demo"). Exit: **Remove demo data** (confirm) deletes only records with `isDemo: true`. A persistent banner shows while any demo record exists.

## 4. Demo dataset (all fictional, `isDemo:true`, owner-only)
**Products:** Rice (Miniket) kg 62/70 stock 100 low 20 · Soybean Oil litre 160/175 stock 8 low 10 · Salt packet 30/36 stock 40 low 10 · Lentil (Masur Dal) kg 110/125 stock 6 low 10. *(stock values are final; seeding does not recompute stock)*
**Customers:** Karim Mia `01700000002` · Nasima Begum `01700000003` (phones are placeholders, not real).
**Ledger:** Karim credit 1,500 (3 days ago) and payment 300 (yesterday) → **1,200**; Nasima credit 850 (2 days ago) → **850**.
**Sales today:** DS1 cash Rice 10 kg × 70 = **700** (cost 620); DS2 mobile banking Salt 5 × 36 = **180** (cost 150).
**Expenses:** Electricity 450 (2 days ago).
**Hand-checked expected values (today):** sales 880 · cost 770 · estimated profit **110** · low stock: Soybean Oil, Lentil · total baki **2,050** (1,200+850). *(Weekly numbers depend on the weekday and the Saturday week start — verify by hand at the event; do not quote them.)*
**After Golden Path GP-3…GP-5 on top of demo data:** sales 880+260+390 = 1,530 · profit 110+100 = 210 · baki 2,240 → **after GP-7: 2,740** (Rahim 690).
Do **not** include two same-name customers in the main dataset (the ambiguity test creates its own temporary customers).

## 5. Guided scenario and one-click examples
Assistant chips fill (never auto-send) the four example sentences listed in `UI_Spec.md` §13. The guided path is `Demo_Script.md`.

## 6. Real vs simulated
**Real:** auth, Firestore reads/writes, stock/ledger math, Gemini calls, confirmation flow. **Simulated:** only the *content* of seeded records (fictional). The banner says so. Nothing implies customers or sales are real.

## 7. Judge verification
Judges can: open the live URL, use the demo account (or register their own), watch values change after each action, refresh to see persistence, and (optionally) cancel a proposal and see no change.

## 8. Reset and rehearsal rules
Rehearse in a **separate rehearsal account**. The final demo account is loaded once and not rehearsed in (records created by the Golden Path are real, not `isDemo`, and "Remove demo data" would not remove them). Reset = create a new account. Demo credentials are given to judges verbally/on a slip — **never** stored in the repo, docs or chat.

## 9. Failure fallback
If seeding fails, enter demo records manually; if Gemini fails, use backup recording (labeled). Never fake live data.
