export interface TransactionItemBase {
  id: string;
  amount: number;
  date: string;
  emoji?: string;
}

export interface IncomeItem extends TransactionItemBase {
  income_source: string;   // specific to income
}

export interface ExpenseItem extends TransactionItemBase {
  expense_category: string;  // specific to expenses
}

export interface RecentTransaction  {
  id: string;
  amount: number;
  emoji?: string;
  category: string;  
  created_at: string;
  type: "income" | "expense";
}




