import { ExpenseType } from "./expenseType";

export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: Date;
    note: string;
    type: ExpenseType;
}
