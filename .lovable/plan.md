# Cash Memo Generator — Phase 1 Plan

A single internal web app that turns one total monthly expense into a set of valid, finance-compliant Cash Memos, each strictly below Rs 10,000, with exact totals and downloadable PDFs.

## 1. Application architecture

- One React + TypeScript web app (already the stack here), styled with Tailwind.
- All calculation runs inside the app in a separate "engine" folder, kept apart from the screens. This means Phase 2 (HOD approval) can be added later without touching the maths.
- Pieces:
  - Screens (form, college names, results)
  - Calculation engine (memo count, memo amounts, category split, number-to-words)
  - Validation layer (the 10 checks) that must pass before anything is produced
  - PDF builder (memo layout) + ZIP packer
- No backend, no login, no database in Phase 1. Nothing is stored; you fill the form, download the PDFs, done. This is the fastest safe path and removes all setup for you.

## 2. Database structure (designed now, built in Phase 2)

Not created yet, but the data is already shaped this way in code so Phase 2 just saves it:

- employees (name / employee ID)
- memo_batches (employee, date-month, total amount, created at)
- memos (batch, serial no, college name, amount, amount in words)
- memo_categories (memo, category name, amount)
- Later: approvals (status, HOD, approved amount, date)

Separation like this keeps one employee's records isolated once logins exist.

## 3. Phase 1 screen flow

```text
Step 1  Details      Employee Name/ID, Date/Month, Total Expenditure  -> [CALCULATE]
Step 2  Colleges     "Cash Memos Required: 8" + 8 name boxes          -> [GENERATE]
Step 3  Result       green validation summary, memo list with amounts
                     [DOWNLOAD ALL (ZIP)]  +  per-memo [PDF] buttons
                     [START NEW BATCH]
```
Back buttons on steps 2 and 3. Generate stays disabled until every college name is filled.

## 4. Memo-count algorithm

memoCount = ceiling(total / 9999). Example: 75,000 / 9,999 = 7.50 -> 8 memos. 9,999 -> 1 memo. 10,000 -> 2 memos.

## 5. Memo-allocation algorithm (exact, never off by Rs 1)

All maths is done in whole rupees only, so rounding drift is impossible.

1. Start with a base of total / memoCount for each memo.
2. Apply a controlled variation pattern (a fixed, seeded pattern — not uncontrolled randomness) that shifts amounts up and down around the base so the memos look natural and unequal.
3. Any leftover rupees are pushed onto memos that still have headroom, one rupee at a time, until the running sum equals the total exactly.
4. Clamp: nothing may reach 9,999+; nothing may be 0 or less. If a memo would break a rule, the excess is moved to another memo.
5. Final assertion: sum === total, every memo between 1 and 9,999. If not, the engine retries with a tighter pattern; it never shows a wrong result.

## 6. Five-category allocation approach

A configuration object holds the five categories and their target weight ranges, e.g.:

```text
Sweet Box       18-24%
Food            26-34%
Transportation  16-22%
Mic & Sound Box 14-20%
Pamphlets        8-14%
```

You (or I, later) can change these percentages in one place without rebuilding the app.

For each memo: pick a weight inside each range using the same deterministic pattern, convert to rupees, floor them, then hand the remaining rupees to the largest categories one by one. Every category ends positive, unequal, and the five always add to the memo total exactly.

## 7. PDF generation approach

- Built with pdf-lib / jsPDF (free, open source, runs in your browser — nothing is uploaded anywhere).
- Layout reproduces the standard Cash Memo: "CASH MEMO" heading, Date, Employee Name/ID, College/School event description, the five-row expense table, Total, Amount in Words, "Billed To: Nxtwave Disruptive Technologies Pvt. Ltd." fixed at the top right (not editable), and the signature areas. No HOD block in Phase 1.
- Files named `Cash_Memo_001_College_A.pdf`, and "Download All" bundles them into one ZIP.
- Note: please share the handwritten memo image when you can — I will build a faithful version from the standard format now and fine-tune spacing/wording to match your sample after you send it.

## 8. Validation strategy

All 10 checks run before a single PDF exists: total > 0, colleges > 0, college count = memo count, every memo > 0, every memo < 10,000, sum = total, exactly 5 categories, categories sum = memo total, words match the number, no missing field. Failure = no PDFs plus a plain-English message such as "Please enter all required college names."

Also handled: blank total, negative, decimals (rounded to whole rupees with a notice), duplicate college names (allowed, with a gentle warning), very large totals, and single-college cases.

## 9. Security approach

Phase 1 stores nothing and sends nothing to any server, so there is no data to leak. No keys or passwords in the app. When Phase 2 adds saving and HOD approval, I will turn on Lovable Cloud with company-email login and per-employee access rules so no one sees another person's memos.

## 10. Step-by-step implementation plan (nothing for you to code)

1. Build the app shell and Screen 1 form.
2. Build and self-test the memo-count engine.
3. Build the exact memo-amount engine.
4. Build the five-category engine.
5. Build the Cash Memo PDF template.
6. Wire the engines to the PDF builder.
7. Add Download All (ZIP) and individual downloads.
8. Run the full test list (1,000 / 3,000 / 5,000 / 8,000 / 9,999 / 10,000 / 20,000 / 40,000 / 55,000 / 75,000 / 90,000 / 100,000 / 153,000 plus the edge cases) as automated tests and report the results to you.

Your only job: open the preview, type three values, click two buttons, download.

## What I need from you

- Confirm this plan, and send the handwritten Cash Memo photo whenever convenient.
- Confirm you are happy with no login/database in Phase 1 (fastest, zero setup), or say if you want records saved from day one.
