import { CATEGORY_NAMES } from "./categoryConfig";
import { MAX_MEMO_AMOUNT } from "./memoCount";
import { amountInWords } from "./words";
import type { MemoBatch } from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * The 10 pre-generation checks. If ANY of them fails, no PDF is produced.
 */
export function validateBatch(batch: MemoBatch): ValidationResult {
  const errors: string[] = [];
  const { totalAmount, memoCount, memos, details } = batch;

  // CHECK 1 - total must be positive
  if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
    errors.push("The total amount must be a whole number greater than zero.");
  }

  // CHECK 2 - at least one college
  if (memos.length === 0) {
    errors.push("At least one college/school name is required.");
  }

  // CHECK 3 - college count must equal the calculated memo count
  if (memos.length !== memoCount) {
    errors.push("The number of college/school names does not match the number of Cash Memos required.");
  }

  for (const memo of memos) {
    // CHECK 4 - every memo amount above zero
    if (!Number.isInteger(memo.amount) || memo.amount <= 0) {
      errors.push(`Cash Memo ${memo.serial} has an invalid amount.`);
    }
    // CHECK 5 - every memo strictly below Rs 10,000
    if (memo.amount > MAX_MEMO_AMOUNT) {
      errors.push(`Cash Memo ${memo.serial} is Rs 10,000 or more, which is not allowed.`);
    }
    // CHECK 7 - exactly five categories, with the correct fixed names
    if (memo.categories.length !== CATEGORY_NAMES.length) {
      errors.push(`Cash Memo ${memo.serial} does not have exactly five expense categories.`);
    } else {
      memo.categories.forEach((c, i) => {
        if (c.name !== CATEGORY_NAMES[i]) {
          errors.push(`Cash Memo ${memo.serial} has an unexpected expense category.`);
        }
        if (!Number.isInteger(c.amount) || c.amount < 0) {
          errors.push(`Cash Memo ${memo.serial} has an invalid amount for ${c.name}.`);
        }
      });
      // CHECK 8 - categories add up exactly to the memo amount
      const catSum = memo.categories.reduce((a, c) => a + c.amount, 0);
      if (catSum !== memo.amount) {
        errors.push(`The expense categories on Cash Memo ${memo.serial} do not add up to its total.`);
      }
    }
    // CHECK 9 - words must match the number
    if (memo.amountInWords !== amountInWords(memo.amount)) {
      errors.push(`The amount in words on Cash Memo ${memo.serial} does not match its total.`);
    }
    // CHECK 10 (part) - college name present
    if (!memo.collegeName || memo.collegeName.trim() === "") {
      errors.push(`Cash Memo ${memo.serial} is missing a college/school name.`);
    }
  }

  // CHECK 6 - the memo amounts must add up to the original total EXACTLY
  const sum = memos.reduce((a, m) => a + m.amount, 0);
  if (sum !== totalAmount) {
    errors.push("The Cash Memo amounts do not add up to the total expenditure entered.");
  }

  // CHECK 10 - required fields present
  if (!details.employeeName?.trim()) errors.push("Please enter the employee name / ID.");
  if (!details.dateOrMonth?.trim()) errors.push("Please enter the date / month.");

  return { ok: errors.length === 0, errors };
}
