/**
 * Converts a whole-rupee amount into words using the Indian numbering
 * system (thousand / lakh / crore), e.g. 9271 ->
 * "Nine Thousand Two Hundred Seventy One Only".
 */

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS[t] : `${TENS[t]} ${ONES[o]}`;
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h > 0) parts.push(`${ONES[h]} Hundred`);
  if (rest > 0) parts.push(twoDigits(rest));
  return parts.join(" ");
}

/** Returns the number in words WITHOUT the trailing "Only". */
export function numberToWords(amount: number): string {
  if (!Number.isInteger(amount) || amount < 0) return "";
  if (amount === 0) return "Zero";

  const crore = Math.floor(amount / 10000000);
  const lakh = Math.floor((amount % 10000000) / 100000);
  const thousand = Math.floor((amount % 100000) / 1000);
  const rest = amount % 1000;

  const parts: string[] = [];
  if (crore > 0) parts.push(`${numberToWords(crore)} Crore`);
  if (lakh > 0) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${twoDigits(thousand)} Thousand`);
  if (rest > 0) parts.push(threeDigits(rest));

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/** Full memo wording, e.g. "Nine Thousand Two Hundred Seventy One Only". */
export function amountInWords(amount: number): string {
  return `${numberToWords(amount)} Only`;
}
