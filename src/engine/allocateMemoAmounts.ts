import { MAX_MEMO_AMOUNT } from "./memoCount";
import { createRng } from "./random";

/**
 * Splits `total` into exactly `count` whole-rupee amounts where:
 *   - the amounts always add up to `total` EXACTLY
 *   - every amount is >= 1 and <= 9,999 (strictly below Rs 10,000)
 *   - the amounts are varied (not a mechanical equal split)
 *
 * Accuracy is structural: we start from an exact split and only ever
 * MOVE rupees between memos, so the sum can never drift.
 */
export function allocateMemoAmounts(total: number, count: number, seed: number): number[] {
  if (!Number.isInteger(total) || total <= 0) throw new Error("INVALID_TOTAL");
  if (!Number.isInteger(count) || count <= 0) throw new Error("INVALID_COUNT");
  if (count > total) throw new Error("TOO_MANY_MEMOS");
  if (total > count * MAX_MEMO_AMOUNT) throw new Error("TOO_FEW_MEMOS");

  // 1. Exact base split (remainder spread one rupee at a time).
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  const amounts: number[] = Array.from({ length: count }, (_, i) =>
    i < remainder ? base + 1 : base,
  );

  if (count === 1) return amounts;

  // 2. Variation: move rupees between pairs. Sum is preserved by construction.
  const rng = createRng(seed);
  const cap = Math.max(1, Math.floor(base * 0.3));
  const passes = count * 4;

  for (let step = 0; step < passes; step++) {
    const i = Math.floor(rng() * count);
    let j = Math.floor(rng() * count);
    if (i === j) j = (j + 1) % count;

    const canGive = amounts[i] - 1; // never go below Rs 1
    const canTake = MAX_MEMO_AMOUNT - amounts[j]; // never reach Rs 10,000
    const limit = Math.min(canGive, canTake, cap);
    if (limit <= 0) continue;

    const delta = 1 + Math.floor(rng() * limit);
    amounts[i] -= delta;
    amounts[j] += delta;
  }

  return amounts;
}
