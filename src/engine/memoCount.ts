/** Every memo must be STRICTLY below Rs 10,000, so the usable maximum is 9,999. */
export const MAX_MEMO_AMOUNT = 9999;

/** memoCount = CEILING(total / 9999) */
export function calculateMemoCount(totalAmount: number): number {
  if (!Number.isInteger(totalAmount) || totalAmount <= 0) return 0;
  return Math.ceil(totalAmount / MAX_MEMO_AMOUNT);
}
