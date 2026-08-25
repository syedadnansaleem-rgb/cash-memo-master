import type { CategoryName } from "./categoryConfig";

export interface CategoryAllocation {
  name: CategoryName;
  amount: number;
}

export interface Memo {
  serial: number;
  collegeName: string;
  amount: number;
  amountInWords: string;
  categories: CategoryAllocation[];
}

export interface EmployeeDetails {
  employeeName: string;
  dateOrMonth: string;
  phoneNo?: string;
  address?: string;
}

export interface MemoBatch {
  details: EmployeeDetails;
  totalAmount: number;
  memoCount: number;
  memos: Memo[];
}
