import { allocateCategories } from "./allocateCategories";
import { allocateMemoAmounts } from "./allocateMemoAmounts";
import { calculateMemoCount } from "./memoCount";
import { seedFromString } from "./random";
import { validateBatch } from "./validation";
import { amountInWords } from "./words";
import type { EmployeeDetails, MemoBatch } from "./types";

export interface GenerateResult {
  batch?: MemoBatch;
  errors: string[];
}

/**
 * Builds a fully validated batch of Cash Memos.
 * If validation fails, it retries with a different (still deterministic)
 * variation seed. Nothing invalid is ever returned to the screen.
 */
export function generateBatch(
  details: EmployeeDetails,
  totalAmount: number,
  collegeNames: string[],
): GenerateResult {
  const memoCount = calculateMemoCount(totalAmount);

  if (memoCount === 0) {
    return { errors: ["Please enter a valid total amount in whole rupees."] };
  }
  if (collegeNames.length !== memoCount) {
    return { errors: ["Please enter all required college/school names."] };
  }
  if (memoCount > totalAmount) {
    return { errors: ["The total amount is too small for the number of Cash Memos required."] };
  }

  const baseSeed = seedFromString(
    `${details.employeeName}|${details.dateOrMonth}|${totalAmount}|${collegeNames.join("|")}`,
  );

  let lastErrors: string[] = [];

  for (let attempt = 0; attempt < 25; attempt++) {
    const seed = (baseSeed + attempt * 7919) >>> 0;
    let amounts: number[];
    try {
      amounts = allocateMemoAmounts(totalAmount, memoCount, seed);
    } catch {
      return {
        errors: [
          "The generated allocation could not satisfy the Rs 10,000 limit. Please try again.",
        ],
      };
    }

    const batch: MemoBatch = {
      details,
      totalAmount,
      memoCount,
      memos: amounts.map((amount, i) => ({
        serial: i + 1,
        collegeName: collegeNames[i].trim(),
        amount,
        amountInWords: amountInWords(amount),
        categories: allocateCategories(amount, (seed + i * 104729) >>> 0),
      })),
    };

    const result = validateBatch(batch);
    if (result.ok) return { batch, errors: [] };
    lastErrors = result.errors;
  }

  return {
    errors: lastErrors.length
      ? lastErrors
      : ["Calculation validation failed. No memo was generated."],
  };
}
