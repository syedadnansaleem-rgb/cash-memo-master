import { CATEGORY_RULES } from "./categoryConfig";
import { createRng } from "./random";
import type { CategoryAllocation } from "./types";

/**
 * Splits one memo amount across the five fixed expense categories.
 * The percentage rules come from src/engine/categoryConfig.ts
 * (currently a TEMPORARY, non-approved test configuration).
 *
 * Guarantees: every category > 0 and the five amounts add up to the
 * memo amount EXACTLY (leftover rupees are handed out one at a time).
 */
export function allocateCategories(memoAmount: number, seed: number): CategoryAllocation[] {
  const rules = CATEGORY_RULES;
  const n = rules.length;

  if (!Number.isInteger(memoAmount) || memoAmount <= 0) throw new Error("INVALID_MEMO_AMOUNT");

  // Tiny amounts cannot give every category a positive share: spread evenly.
  if (memoAmount < n) {
    const amounts = new Array(n).fill(0);
    for (let i = 0; i < memoAmount; i++) amounts[i] += 1;
    return rules.map((r, i) => ({ name: r.name, amount: amounts[i] }));
  }

  const rng = createRng(seed);

  // 1. Pick a weight inside each configured range.
  const weights = rules.map((r) => r.min + rng() * (r.max - r.min));
  const weightSum = weights.reduce((a, b) => a + b, 0);

  // 2. Convert to whole rupees, keeping at least Rs 1 per category.
  const amounts = weights.map((w) => Math.max(1, Math.floor((w / weightSum) * memoAmount)));

  // 3. Reconcile to the exact memo amount, one rupee at a time.
  let diff = memoAmount - amounts.reduce((a, b) => a + b, 0);

  let guard = 0;
  while (diff !== 0 && guard < 100000) {
    guard++;
    // Largest first when adding, largest first when removing (keeps all > 0).
    const order = amounts
      .map((amount, index) => ({ amount, index }))
      .sort((a, b) => b.amount - a.amount);

    for (const { index } of order) {
      if (diff === 0) break;
      if (diff > 0) {
        amounts[index] += 1;
        diff -= 1;
      } else if (amounts[index] > 1) {
        amounts[index] -= 1;
        diff += 1;
      }
    }
  }

  return rules.map((r, i) => ({ name: r.name, amount: amounts[i] }));
}
