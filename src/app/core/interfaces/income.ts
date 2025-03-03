import { IncomeType } from "./incomeType";

export interface Income {
    id: number,
    amount: number,
    date: Date;
    note: string,
    incomeType : IncomeType
}
