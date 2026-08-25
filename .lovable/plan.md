# Cash Memo Generator — Phase 1 Specification (revised)

A single internal web app that turns one total monthly expense into a set of Cash Memos, each strictly below Rs 10,000, with exact totals and downloadable PDFs. No backend, no login, no data leaves the browser.

## 1. Application architecture

- React + TypeScript app styled with Tailwind.
- Clear separation so Phase 2 can be added later without rewriting anything:
  - Screens (details form, college names, results)
  - Memo-count engine
  - Memo-amount allocation engine
  - Five-category allocation engine (rules kept in one config file)
  - Validation engine (all 10 checks)
  - PDF builder + ZIP packer
- Phase 1 stores nothing: no database, no login, no cloud storage, no server upload.

## 2. Data structure (shape only — built in Phase 2)

Data is shaped in code as: batch (employee, date/month, total) -> memos (serial, college, amount, amount in words) -> categories (5 rows per memo). Phase 2 can persist this as-is and add an approvals table.

## 3. Phase 1 screen flow

```text
Step 1  Details    Employee Name/ID, Date/Month, Total Expenditure  -> [CALCULATE CASH MEMOS]
Step 2  Colleges   "Cash Memos Required: 8" + exactly 8 name boxes  -> [GENERATE CASH MEMOS]
Step 3  Result     validation summary + memo list
                   [DOWNLOAD ALL (ZIP)] + per-memo [DOWNLOAD PDF]
                   [START NEW BATCH]
```

## 4. Memo-count algorithm (fixed before college names are asked)

memoCount = CEILING(total / 9999)

1,000 -> 1 | 5,000 -> 1 | 9,999 -> 1 | 10,000 -> 2 | 20,000 -> 3 | 40,000 -> 5 | 75,000 -> 8 | 90,000 -> 10 | 100,000 -> 11

The count is locked at this point. Exactly that many college fields appear, each college maps to exactly one memo and one PDF. Memos are never added or removed after the names are entered.

## 5. Input rules

- Whole rupees only. `75,000.50` is rejected with: "Please enter the amount in whole rupees." Nothing is silently rounded.
- Empty, zero, negative or non-numeric totals are rejected with plain-English messages.
- College names are trimmed; blanks block generation.
- Duplicate college names are never removed silently: a warning appears asking the user to confirm that the same college/event should carry more than one Cash Memo. Generation continues only after confirmation.

## 6. Memo-amount allocation (exact, whole rupees)

Priority order enforced in code: (1) exact total, (2) every memo < 10,000, (3) correct memo count, (4) one memo per college, (5) valid category split, (6) reasonable variation — variation is always last and is never allowed to change a total.

1. Base amount = total / memoCount, in whole rupees.
2. A deterministic variation pattern shifts amounts up/down around the base so memos are unequal and non-mechanical.
3. Clamp every memo to the range 1 .. 9,999.
4. Distribute any remaining rupees one at a time onto memos that still have headroom until the running sum equals the total exactly.
5. Assert sum === total and all bounds. If anything fails, the engine retries with a tighter (less varied) pattern, and finally with the plainest valid split. It never displays an invalid result.

## 7. Five-category allocation — configuration NOT finalized

The five categories are fixed: Sweet Box, Food, Transportation, Mic & Sound Box, Pamphlets.

The allocation percentages are NOT approved and are NOT treated as Finance-approved. They live in a single clearly-marked file, e.g. `src/engine/categoryConfig.ts`, headed:

```text
TEMPORARY TEST CONFIGURATION — NOT FINANCE APPROVED
Replace with the approved allocation rules when provided.
```

The engine reads whatever weights that file holds, so swapping in the approved rules later changes nothing else in the application. The UI shows a small note that the category split is using a temporary test configuration.

Mechanics (independent of the numbers used): weights -> rupee amounts -> whole-rupee floor -> remaining rupees handed out one at a time. Every category is positive and the five always sum exactly to that memo's amount.

## 8. Validation strategy

Ten checks run before any PDF exists: total > 0; colleges > 0; college count = memo count; every memo > 0; every memo < 10,000; sum of memos = original total; exactly five categories per memo; categories sum = memo total; amount in words matches the number; no missing field. Any failure means no PDFs plus a clear message such as "Calculation validation failed. No memo was generated."

## 9. Cash Memo format (from your uploaded memo — authoritative)

The PDF reproduces the uploaded memo, not a generic design:

```text
                        CASH MEMO            (centered, bold, underlined)

Date : 08-Jun-2026                 Billed To: Nxtwave Disruptive
Name : Ravinder Jangili                       Technologies Pvt. Ltd.
Phone No : 9908770424
Address : Gachibowli, Hyderabad

+-------+---------------------------------+--------+----------+--------+
| S No. |          Description            | Price  | Quantity | Amount |
+-------+---------------------------------+--------+----------+--------+
|       | NIAT offline marketing event    |        |          |        |
|       | at <College/School Name>        |        |          |        |
|       |     Sweet box        -          |  2240  |          |  2240  |
|       |     Food             -          |  4343  |          |  4343  |
|       |     Transportation   -          |  1366  |          |  1366  |
|       |     Mic & Sound box  -          |   826  |          |   826  |
|       |     Pamphlets        -          |   496  |          |   496  |
+-------+---------------------------------+--------+----------+--------+

Given            +-----------------+---------------------------------+
Cash.            | Total           |  9271 /-                        |
                 +-----------------+---------------------------------+
                 | Amount in Words | Nine Thousand Two Hundred       |
                 |                 | Seventy One Only                |
                 +-----------------+---------------------------------+

                                              ______________________
                                                    Signature
```

Preserved exactly: centered underlined "CASH MEMO" heading; Date / Name / Phone No / Address stacked at the left; "Billed To: Nxtwave Disruptive Technologies Pvt. Ltd." fixed at the top right and never editable; the boxed table with S No. / Description / Price / Quantity / Amount columns; the event description line followed by the five indented category rows with amounts in both Price and Amount columns; the "Given Cash." note at the lower left; the boxed Total and Amount in Words rows on the right; a blank signature line labelled "Signature" at the bottom right. Quantity is left blank as in the original. No HOD approval block anywhere.

One open item: the original memo shows Phone No and Address. I will add them as two optional fields on the details screen (entered once, reused on every memo) so the layout matches. Tell me if you would rather leave those two lines blank.

I will render a sample PDF and show you a picture of it for side-by-side comparison before wiring the rest of the app to it.


## 10. PDF and ZIP

Generated in the browser with an open-source PDF library. Files named `Cash_Memo_001_College_A.pdf` etc. "Download All" produces one ZIP; each memo also has its own download button.

## 11. Testing before Phase 1 is called complete

Automated tests over 1,000 / 3,000 / 5,000 / 8,000 / 9,999 / 10,000 / 20,000 / 40,000 / 55,000 / 75,000 / 90,000 / 100,000 / 153,000, each verifying memo count, field count, every memo in range, exact total, five categories per memo, exact category sums, correct words, and successful PDF generation. Plus edge cases: empty, negative, decimal, missing names, duplicates, very large total, one college, many colleges. If any test fails, Phase 1 is not complete.

## 12. Build order (I will explain each stage in plain language before moving on)

1. UI shell and Screen 1
2. Memo count engine
3. Memo amount allocation engine
4. Validation engine
5. Five-category allocation engine (temporary config)
6. Cash Memo PDF template
7. PDF generation
8. ZIP generation
9. Full test run and report

## 13. Out of scope for Phase 1

HOD approval, approved amount, HOD signature, approval dashboard, Finance approval, reimbursement workflow, Finance integration, employee login/database.
