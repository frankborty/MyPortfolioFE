import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';

interface ExpenseTypeSummary {
  name: string;
  categoryName: string;
  categoryId: number;
  total: number;
  average: number;
  count: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

@Component({
  selector: 'app-expenseSummaryTable',
  imports: [ImportsModule],
  templateUrl: './expenseSummaryTable.component.html',
  styleUrls: ['./expenseSummaryTable.component.css'],
})
export class ExpenseSummaryTableComponent implements OnInit, OnChanges {
  @Input() expenseList: Expense[] = [];
  @Input() expenseTypeList: ExpenseType[] = [];
  expenseTypeSummaryList: ExpenseTypeSummary[] = [];

  totalSum : number = 0;
  totalCount: number = 0;
  totalAvg : number = 0;
  totalPerMese: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];

  selectedYear: Date = new Date('2024-01-01');

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.expenseTypeList.length > 0 && this.expenseTypeList.length > 0) {
        this.processInputData();  
      }
  }

  processInputData() {
    this.expenseTypeSummaryList = [];
    let filteredByYear = this.expenseList.filter(
      (expense) => new Date(expense.date).getFullYear() === this.selectedYear.getFullYear()
    );

    const groupedByType = filteredByYear.reduce((acc, expense) => {
      if (!acc[expense.expenseType.name]) {
        acc[expense.expenseType.name] = [];
      }
      acc[expense.expenseType.name].push(expense);
      return acc;
    }, {} as { [key: string]: Expense[] });

    this.initSummaryList();

    for(const typeItemKeys in groupedByType) {
      const type = groupedByType[typeItemKeys];

      const totaleSpeso = type.reduce((acc, curr) => acc + curr.amount, 0);
      const mediaSpesaMensile = totaleSpeso/12;
      const spesePerMese = this.groupExpensesByMonth(type);

      const summaryType: ExpenseTypeSummary = {
        name: typeItemKeys,
        categoryName: type[0].expenseType.category.name,
        categoryId: type[0].expenseType.category.id,
        total: totaleSpeso,
        average: mediaSpesaMensile,
        count: type.length,
        jan: spesePerMese[0],
        feb: spesePerMese[1],
        mar: spesePerMese[2],
        apr: spesePerMese[3],
        may: spesePerMese[4],
        jun: spesePerMese[5],
        jul: spesePerMese[6],
        aug: spesePerMese[7],
        sep: spesePerMese[8],
        oct: spesePerMese[9],
        nov: spesePerMese[10],
        dec: spesePerMese[11],
      }
      const existingIndex = this.expenseTypeSummaryList.findIndex(
        (summary) => summary.name === summaryType.name
      );
      if (existingIndex !== -1) {
        this.expenseTypeSummaryList.splice(existingIndex, 1);
      }
      this.expenseTypeSummaryList.push(summaryType);
      this.updateTotalValue(summaryType);
    }
  }
  updateTotalValue(summaryType: ExpenseTypeSummary) {
    this.totalSum=summaryType.total;
    this.totalCount=summaryType.count;
    this.totalAvg = this.totalSum/12;
    this.totalPerMese[0]+=summaryType.jan;
    this.totalPerMese[1]+=summaryType.feb;
    this.totalPerMese[2]+=summaryType.mar;
    this.totalPerMese[3]+=summaryType.apr;
    this.totalPerMese[4]+=summaryType.may;
    this.totalPerMese[5]+=summaryType.jun;
    this.totalPerMese[6]+=summaryType.jul;
    this.totalPerMese[7]+=summaryType.aug;
    this.totalPerMese[8]+=summaryType.sep;
    this.totalPerMese[9]+=summaryType.oct;
    this.totalPerMese[10]+=summaryType.nov;
    this.totalPerMese[11]+=summaryType.dec;
  }

  initSummaryList() {
    this.expenseTypeSummaryList = this.expenseTypeList.map(expenseType => ({
      name: expenseType.name,
      categoryName: expenseType.category.name,
      categoryId: expenseType.category.id,
      total: 0,
      average: 0,
      count: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    }));
  }

  CalculateCategoryFooter(categoryName: string) {
    const categoryTotalCount = this.expenseTypeSummaryList
      .filter(x => x.categoryName === categoryName)
      .reduce((acc, curr) => acc + curr.count, 0);

    const categoryTotalSum = this.expenseTypeSummaryList
        .filter(x => x.categoryName === categoryName)
        .reduce((acc, curr) => acc + curr.total, 0);
    return "Total: " + categoryTotalCount+ " | Sum: " + categoryTotalSum + "  | Avg: " + (categoryTotalSum/12).toFixed(2);
  }

  groupExpensesByMonth(expenseList: Expense[]): number[] {
    if (!expenseList || expenseList.length === 0) {
      return [];
    }

    const grouped = expenseList.reduce((acc, expense) => {
      // Estrai il mese dalla data
      const date = new Date(expense.date);
      const month = date.getMonth(); // Esempio: "January 2025"

      // Raggruppa per mese e somma gli importi
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += expense.amount;

      return acc;
    }, {} as { [key: string]: number });

    // Inizializza un vettore di 12 elementi vuoto
    const monthlyTotals = new Array(12).fill(0);

    for (const month in grouped) {
      // Converte il mese in un numero
      const monthNumber = parseInt(month, 10);
      // Assegna il totale mensile al vettore
      monthlyTotals[monthNumber] = grouped[month];
    }

    // Converte l'oggetto in un array di totali
    return monthlyTotals;
  }
}
