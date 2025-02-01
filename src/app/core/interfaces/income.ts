import { IncomeType } from "./incomeType";

export interface Income {
    id: number,
    amount: number,
    date: string | Date;
    note: string,
    incomeType : IncomeType
}
