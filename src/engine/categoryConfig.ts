/**
 * ============================================================
 *  TEMPORARY TEST CONFIGURATION - NOT FINANCE APPROVED
 * ------------------------------------------------------------
 *  These category weights are placeholders used for development
 *  and testing ONLY. Replace the `weightRanges` values below
 *  with the approved allocation rules when Finance provides
 *  them. Nothing else in the application needs to change.
 * ============================================================
 */

export const CATEGORY_CONFIG_STATUS = "TEMPORARY TEST CONFIGURATION - NOT FINANCE APPROVED";

/** The five expense categories are FIXED and must never change. */
export const CATEGORY_NAMES = [
  "Sweet Box",
  "Food",
  "Transportation",
  "Mic & Sound Box",
  "Pamphlets",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

export interface CategoryRule {
  name: CategoryName;
  /** Minimum share of the memo total, as a fraction (0.18 = 18%). */
  min: number;
  /** Maximum share of the memo total, as a fraction. */
  max: number;
}

/** TEMPORARY placeholder weights - awaiting approved allocation logic. */
export const CATEGORY_RULES: CategoryRule[] = [
  { name: "Sweet Box", min: 0.18, max: 0.24 },
  { name: "Food", min: 0.26, max: 0.34 },
  { name: "Transportation", min: 0.16, max: 0.22 },
  { name: "Mic & Sound Box", min: 0.14, max: 0.2 },
  { name: "Pamphlets", min: 0.08, max: 0.14 },
];
