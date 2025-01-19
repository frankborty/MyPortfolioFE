import { ExpenseType } from "./expenseType";

export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string | Date;
    note: string;
    type: ExpenseType;
}

export interface ExpenseToAdd { 
    description : string;
    amount : number;
    date : string;
    note : string;
    expenseType : string;
}