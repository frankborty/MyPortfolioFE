import { ExpenseCategory } from "./expenseCategory";

export interface ExpenseType {
    id: number;
    name: string;
    category: ExpenseCategory;
}