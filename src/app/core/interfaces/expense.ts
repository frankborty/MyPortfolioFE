import { ExpenseType } from "./expenseType";

export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: Date;
    note: string;
    expenseType: ExpenseType;
}

export interface ExpenseToEdit { 
    id: number,
    description : string;
    amount : number;
    date : Date;
    note : string;
    expenseType : string;
}