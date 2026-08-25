# Cash Memo Master

I want you to act as a senior full-stack product engineer, business analyst,

UI/UX designer, financial calculation engineer, QA engineer, and product

architect.

I have ZERO coding knowledge, so I need you to build the application for me.

Do not assume that I can manually modify code.

IMPORTANT:

Do not use Google Forms, Google Sheets, or spreadsheet-based workflows as

the primary user interface.

I need a dedicated responsive internal web application called:

"CASH MEMO GENERATOR"

The application is for an Offline Lead Generation Operations team.

==================================================

1. BUSINESS CONTEXT

==================================================

Our team conducts offline marketing events at 12th-grade colleges/schools.

During these events, employees incur small local expenses such as:

1. Sweet Box

2. Food

3. Transportation

4. Mic & Sound Box

5. Pamphlets

In many locations, local vendors do not provide formal bills.

For reimbursement, the company uses a standardized Cash Memo.

The Finance team has already approved the process where Operations can use

a standardized category-wise allocation when the employee knows the total

expense but does not know the exact category-wise expenditure.

The Finance team has also specified one critical rule:

EVERY INDIVIDUAL CASH MEMO MUST BE STRICTLY BELOW ₹10,000.

There is NO minimum amount.

A cash memo can therefore be ₹1,000, ₹3,000, ₹5,000, ₹8,500, etc.

The only hard financial limit is:

MEMO AMOUNT < ₹10,000

The existing Finance verification/reimbursement tool is NOT being replaced.

This application is only for generating Cash Memos in Phase 1.

==================================================

2. PHASE 1 OBJECTIVE

==================================================

Phase 1 must do ONLY the following:

USER ENTERS:

- Employee Name / Employee ID

- Date / Month

- Total Monthly Expenditure

The application then calculates how many Cash Memos are required.

After calculating the number of Cash Memos, the application asks the user

to enter exactly that many college/school names.

The application then automatically:

1. Determines the required number of Cash Memos.

2. Collects the corresponding number of college/school names.

3. Allocates the total amount across those colleges/schools.

4. Ensures every individual Cash Memo is strictly below ₹10,000.

5. Ensures the combined Cash Memo amounts equal the original total EXACTLY.

6. Allocates each Cash Memo into five expense categories.

7. Ensures the five category amounts add up EXACTLY to that Cash Memo's amount.

8. Generates the Cash Memos using the approved Cash Memo format.

9. Converts the total amount into words automatically.

10. Allows the user to download the generated Cash Memos as PDFs.

Do NOT add HOD approval functionality in Phase 1.

HOD approval will be Phase 2.

==================================================

3. USER EXPERIENCE

==================================================

The application should be extremely simple because the users are

Operations employees and should not have to understand the calculation

logic.

SCREEN 1:

CASH MEMO GENERATOR

Fields:

Employee Name / Employee ID

[____________________________]

Date / Month

[____________________________]

Total Monthly Expenditure

₹ [__________________________]

[ CALCULATE CASH MEMOS ]

The user should not enter category-wise expenses.

The user should not manually calculate the number of Cash Memos.

The application must calculate it automatically.

==================================================

4. MEMO COUNT LOGIC

==================================================

The maximum amount allowed per Cash Memo is strictly below ₹10,000.

Therefore, the maximum usable amount for calculation is ₹9,999.

The minimum number of memos required for a total should be:

CEILING(totalAmount / 9999)

However, the application must ALSO respect the number of actual

college/school events.

After calculating the minimum required number of memos, display:

"Number of Cash Memos Required: X"

Then display exactly X college-name input fields.

Example:

Total Monthly Expenditure:

₹75,000

The application calculates:

75,000 / 9,999 = 7.50

Therefore:

8 Cash Memos Required

Then display:

College/School 1

[________________]

College/School 2

[________________]

College/School 3

[________________]

College/School 4

[________________]

College/School 5

[________________]

College/School 6

[________________]

College/School 7

[________________]

College/School 8

[________________]

The user enters the eight actual college/school names.

IMPORTANT:

Do not allow the user to generate the memos until all required

college/school names are entered.

==================================================

5. ALLOCATION LOGIC

==================================================

This is a CRITICAL part of the application.

The application must NOT use uncontrolled random numbers.

The allocation engine must be deterministic, validated and business-rule

driven.

Requirements:

- Every memo must be strictly below ₹10,000.

- No memo can be ₹10,000 or more.

- No minimum memo amount.

- Small totals are allowed.

- Combined total of all Cash Memos must equal the user's original total

  EXACTLY.

- There must be ZERO mismatch.

- No ₹1 difference is acceptable.

- Each college/school receives one Cash Memo.

- The total amount must be distributed across all required colleges/schools.

Example:

If total = ₹75,000 and 8 colleges are entered:

Generate 8 valid memo amounts.

All 8 amounts must:

- be < ₹10,000

- be > 0

- add exactly to ₹75,000

Before showing the result, run an independent validation:

SUM(all memo amounts) === original total

If FALSE:

DO NOT generate the PDFs.

If TRUE:

continue.

==================================================

6. AVOID BAD ALLOCATIONS

==================================================

The generated amounts should be reasonably varied and should not look

like obvious identical splits.

Avoid:

- identical amounts

- excessive repetition

- unnecessary round figures

- mechanically equal distribution

However:

ACCURACY IS MORE IMPORTANT THAN APPEARANCE.

Never modify an amount merely to make it look random if doing so causes

the total to become incorrect.

The system must prioritize:

1. Exact total

2. Below ₹10,000

3. Correct number of memos

4. Reasonable allocation

5. Variation

==================================================

7. FIVE EXPENSE CATEGORIES

==================================================

Every Cash Memo must contain exactly these five categories:

1. Sweet Box

2. Food

3. Transportation

4. Mic & Sound Box

5. Pamphlets

The application must automatically allocate each memo amount across

these five categories.

Example:

Cash Memo Amount:

₹8,700

Possible structure:

Sweet Box

₹X

Food

₹X

Transportation

₹X

Mic & Sound Box

₹X

Pamphlets

₹X

TOTAL

₹8,700

CRITICAL VALIDATION:

Sweet Box

+ Food

+ Transportation

+ Mic & Sound Box

+ Pamphlets

MUST EXACTLY EQUAL:

₹8,700

No mismatch is allowed.

==================================================

8. CATEGORY ALLOCATION ENGINE

==================================================

Create a configurable allocation engine.

Do NOT hard-code random values.

Create a clear configuration object/function where category allocation

rules can be changed later without rewriting the whole application.

The allocation engine should:

1. Generate reasonable category allocations.

2. Create unequal category amounts where practical.

3. Avoid excessive repetition.

4. Ensure all category values are positive.

5. Ensure category values add exactly to the memo total.

6. Validate the result before generating the PDF.

If an allocation fails validation:

REGENERATE OR CORRECT THE ALLOCATION INTERNALLY.

Do not show an invalid memo to the user.

==================================================

9. FIXED CASH MEMO INFORMATION

==================================================

The following information is FIXED and must not be entered by the user:

Billed To:

Nxtwave Disruptive Technologies Pvt. Ltd.

This must appear at the TOP-RIGHT CORNER of every Cash Memo.

The user must not be able to edit this value.

==================================================

10. USER-ENTERED INFORMATION

==================================================

User-entered fields:

1. Employee Name / Employee ID

2. Date / Month

3. Total Monthly Expenditure

4. College/School names generated dynamically by the application

Do not ask the user to enter:

- Sweet Box amount

- Food amount

- Transportation amount

- Mic & Sound Box amount

- Pamphlets amount

- Memo count

The application must calculate these automatically.

==================================================

11. CASH MEMO DESIGN

==================================================

I will provide the existing handwritten Cash Memo format separately.

The application must reproduce that format as closely as possible.

Do not redesign the Cash Memo unnecessarily.

Preserve:

- Cash Memo heading

- Date

- Employee details

- College/school/event description

- Expense table

- Five expense categories

- Total

- Amount in Words

- Billed To section

- Signature areas that exist in the original format

PHASE 1:

Do NOT add HOD approval workflow.

HOD Approved Amount and HOD approval functionality will be implemented

in Phase 2.

==================================================

12. AMOUNT IN WORDS

==================================================

The application must automatically convert every Cash Memo total into

words.

Example:

₹8,700

Eight Thousand Seven Hundred Only

The amount in words must always correspond exactly to the numeric total.

==================================================

13. PDF GENERATION

==================================================

After successful validation, generate individual PDF Cash Memos.

Example:

Cash_Memo_001_College_A.pdf

Cash_Memo_002_College_B.pdf

Cash_Memo_003_College_C.pdf

etc.

Provide:

[ DOWNLOAD ALL CASH MEMOS ]

Preferably package all PDFs into a single ZIP file.

Also provide:

[ DOWNLOAD INDIVIDUAL PDF ]

for each memo.

==================================================

14. PRE-GENERATION VALIDATION

==================================================

Before generating any PDF, run all of these checks:

CHECK 1:

Total amount > 0

CHECK 2:

Number of colleges > 0

CHECK 3:

Number of college names = calculated memo count

CHECK 4:

Every memo amount > 0

CHECK 5:

Every memo amount < ₹10,000

CHECK 6:

SUM(all memo amounts) = original total

CHECK 7:

Every memo has exactly five categories

CHECK 8:

SUM(five categories) = memo total

CHECK 9:

Amount in words = memo total

CHECK 10:

No required field is missing

If ANY check fails:

DO NOT GENERATE THE PDF.

Show a clear error message and fix the calculation internally.

==================================================

15. USER-FRIENDLY ERROR MESSAGES

==================================================

Examples:

"Please enter a total amount."

"Please enter all required college names."

"The generated allocation could not satisfy the ₹10,000 limit.

Please try again."

"Calculation validation failed. No memo was generated."

Do not expose technical errors, code or database messages to normal users.

==================================================

16. PHASE 1 UI

==================================================

Design a clean, professional internal business application.

Use a simple dashboard-style interface.

Main screen:

-----------------------------------------

        CASH MEMO GENERATOR

-----------------------------------------

Employee Name / ID

[________________________]

Date / Month

[________________________]

Total Monthly Expenditure

₹ [______________________]

[ CALCULATE ]

-----------------------------------------

After calculation:

Cash Memos Required: 8

Enter College/School Names:

1. [______________________]

2. [______________________]

3. [______________________]

4. [______________________]

5. [______________________]

6. [______________________]

7. [______________________]

8. [______________________]

[ GENERATE CASH MEMOS ]

-----------------------------------------

After generation:

✓ 8 Cash Memos Generated

✓ Total: ₹75,000

✓ All memos below ₹10,000

✓ Total validation successful

[ DOWNLOAD ALL ]

[ DOWNLOAD INDIVIDUAL MEMOS ]

==================================================

17. PHASE 2 – DO NOT BUILD NOW

==================================================

Phase 2 will add HOD approval functionality.

Potential Phase 2 features:

- HOD dashboard

- Pending approvals

- Cash Memo preview

- HOD Approved Amount

- HOD approval

- HOD signature

- Approved / Rejected / Pending status

- Approval date

- Approval history

DO NOT IMPLEMENT THESE FEATURES IN PHASE 1.

Build the Phase 1 architecture so Phase 2 can be added later without

rewriting the entire application.

==================================================

18. DATA AND SECURITY

==================================================

This is an internal company application.

Use proper separation between:

- users

- memo generation records

- colleges/events

- memo amounts

- category allocations

- generated documents

Do not expose one employee's information to another unauthorized user.

Do not use public data sharing for production.

If authentication is implemented, use company email authentication where

possible.

Use environment variables for secrets.

Never hard-code passwords, API keys or database credentials.

==================================================

19. TECHNOLOGY REQUIREMENTS

==================================================

I have ZERO coding knowledge.

Use a technology stack that is:

- free/open-source where possible

- simple to maintain

- suitable for an internal web application

- portable

- not dependent on Google Sheets or Google Forms

Preferred architecture:

Frontend:

React + TypeScript

Styling:

Tailwind CSS

Backend/database:

Supabase or another free/open-source backend

PDF generation:

Reliable open-source PDF generation library

Authentication:

Company email authentication if practical

Deployment:

Use a free-tier deployment option for the prototype.

Do not introduce paid services unless absolutely necessary.

==================================================

20. IMPORTANT DEVELOPMENT RULE

==================================================

DO NOT BUILD THE ENTIRE APPLICATION IN ONE STEP.

Build it incrementally.

FIRST:

Create the application shell and Phase 1 UI.

SECOND:

Build and test the memo-count calculation engine.

THIRD:

Build the exact memo allocation engine.

FOURTH:

Build the five-category allocation engine.

FIFTH:

Build the Cash Memo PDF template.

SIXTH:

Connect the calculation engine to PDF generation.

SEVENTH:

Build Download All / Download Individual functionality.

EIGHTH:

Run comprehensive tests.

Only after Phase 1 is stable should Phase 2 be considered.

==================================================

21. TEST CASES

==================================================

The application MUST be tested with:

₹1,000

₹3,000

₹5,000

₹8,000

₹9,999

₹10,000

₹20,000

₹40,000

₹55,000

₹75,000

₹90,000

₹100,000

₹153,000

For every test:

- Calculate required memo count.

- Ensure every memo < ₹10,000.

- Ensure combined total exactly matches input.

- Ensure five categories exactly match each memo.

- Ensure PDFs are generated correctly.

Also test:

- empty total

- negative amount

- decimal amount

- missing college names

- duplicate college names

- extremely large total

- one college

- multiple colleges

==================================================

22. MOST IMPORTANT REQUIREMENT

==================================================

FINANCIAL ACCURACY MUST NEVER BE SACRIFICED FOR RANDOMNESS OR VISUAL

VARIATION.

The application must NEVER produce:

₹75,000 entered

but

₹74,999 generated

or

₹75,001 generated.

The application must NEVER produce a memo of:

₹10,000

or higher.

Every generated result must pass mathematical validation BEFORE PDF

generation.

==================================================

23. FIRST TASK

==================================================

Do NOT immediately build everything.

First, analyze this specification and give me:

1. Proposed application architecture

2. Database structure

3. Phase 1 screen flow

4. Memo-count algorithm

5. Memo-allocation algorithm

6. Five-category allocation approach

7. PDF-generation approach

8. Validation strategy

9. Security approach

10. Step-by-step implementation plan suitable for a person with ZERO

coding knowledge

Then wait for my confirmation before implementing the application.

Remember:

I am a non-technical Business Operations user.

Explain everything in simple language.

Do not ask me to write code manually.

Do not ask me to configure complicated developer tools unless absolutely

necessary.

When something needs to be configured, give me exact click-by-click

instructions.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0562978f-7d4e-4c68-9c43-8a996d8aad8a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
