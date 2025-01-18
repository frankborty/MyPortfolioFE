export interface ExpenseCategory {
    id: number;
    name: string;
}

export interface ExpenseCategoryAndTypes {
    id: number;
    name: string;
    expenseTypeList : string[];
}
