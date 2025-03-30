import { Component, effect, Input, OnChanges, OnInit, signal } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';
import { Nullable } from 'primeng/ts-helpers';
import { ExpenseService } from '../../../services/expenseService/expense.service';

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

interface CategorySummary {
  name: string;
  total: number;
  average: number;
  count: number;
  monthExpense: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}

@Component({
  selector: 'app-expenseSummaryTable',
  imports: [ImportsModule],
  templateUrl: './expenseSummaryTable.component.html',
  styleUrls: ['./expenseSummaryTable.component.css'],
})
export class ExpenseSummaryTableComponent implements OnInit {
  public expenseList = signal<Expense[]>([]);
  public expenseTypeList = signal<ExpenseType[]>([]);

  expenseTypeSummaryList: ExpenseTypeSummary[] = [];
  categorySummaryList: { key: string; value: CategorySummary }[] = [];

  totalSum: number = 0;
  totalCount: number = 0;
  totalAvg: number = 0;
  totalPerMese: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  selectedYear: Date = new Date('2025-01-01');

  constructor(expenseService: ExpenseService) {
    this.expenseList = expenseService.expenseList;
    this.expenseTypeList = expenseService.expenseTypeList;

    effect(() => {
      this.expenseList = expenseService.expenseList;
      this.expenseTypeList = expenseService.expenseTypeList;
      if (this.expenseList().length > 0 && this.expenseTypeList().length > 0) {
        this.processInputData();
      }
    });
  }

  ngOnInit() {
    this.processInputData();
  }

  processInputData() {
    this.expenseTypeSummaryList = [];
    let filteredByYear = this.expenseList().filter(
      (expense) =>
        new Date(expense.date).getFullYear() === this.selectedYear.getFullYear()
    );

    const groupedByType = filteredByYear.reduce((acc, expense) => {
      if (!acc[expense.expenseType.name]) {
        acc[expense.expenseType.name] = [];
      }
      acc[expense.expenseType.name].push(expense);
      return acc;
    }, {} as { [key: string]: Expense[] });

    this.initSummaryList();
    this.initSummaryValue();
    this.categorySummaryList = [];

    for (const typeItemKeys in groupedByType) {
      const type = groupedByType[typeItemKeys];

      const totaleSpeso = type.reduce((acc, curr) => acc + curr.amount, 0);
      const mediaSpesaMensile = totaleSpeso / 12;
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
      };
      const existingIndex = this.expenseTypeSummaryList.findIndex(
        (summary) => summary.name === summaryType.name
      );
      if (existingIndex !== -1) {
        this.expenseTypeSummaryList.splice(existingIndex, 1);
      }
      this.expenseTypeSummaryList.push(summaryType);
      this.updateTotalValue(summaryType);
      this.updateCategorySummaryList(summaryType);
    }
  }
  initSummaryValue() {
    this.totalSum = 0;
    this.totalCount = 0;
    this.totalAvg = 0;
    this.totalPerMese = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  updateTotalValue(summaryType: ExpenseTypeSummary) {
    this.totalSum += summaryType.total;
    this.totalCount += summaryType.count;
    this.totalAvg = this.totalSum / 12;
    this.totalPerMese[0] += summaryType.jan;
    this.totalPerMese[1] += summaryType.feb;
    this.totalPerMese[2] += summaryType.mar;
    this.totalPerMese[3] += summaryType.apr;
    this.totalPerMese[4] += summaryType.may;
    this.totalPerMese[5] += summaryType.jun;
    this.totalPerMese[6] += summaryType.jul;
    this.totalPerMese[7] += summaryType.aug;
    this.totalPerMese[8] += summaryType.sep;
    this.totalPerMese[9] += summaryType.oct;
    this.totalPerMese[10] += summaryType.nov;
    this.totalPerMese[11] += summaryType.dec;
  }

  updateCategorySummaryList(summaryType: ExpenseTypeSummary) {
    let categoryName = summaryType.categoryName;
    const existingItem = this.categorySummaryList.find(
      (item) => item.key === categoryName
    );

    if (existingItem) {
      // Aggiorna il valore dell'elemento esistente
      existingItem.value.total += summaryType.total;
      existingItem.value.count += summaryType.count;
      existingItem.value.average = existingItem.value.total / 12;
      existingItem.value.monthExpense[0] += summaryType.jan;
      existingItem.value.monthExpense[1] += summaryType.feb;
      existingItem.value.monthExpense[2] += summaryType.mar;
      existingItem.value.monthExpense[3] += summaryType.apr;
      existingItem.value.monthExpense[4] += summaryType.may;
      existingItem.value.monthExpense[5] += summaryType.jun;
      existingItem.value.monthExpense[6] += summaryType.jul;
      existingItem.value.monthExpense[7] += summaryType.aug;
      existingItem.value.monthExpense[8] += summaryType.sep;
      existingItem.value.monthExpense[9] += summaryType.oct;
      existingItem.value.monthExpense[10] += summaryType.nov;
      existingItem.value.monthExpense[11] += summaryType.dec;
    } else {
      // Aggiungi l'elemento se non esiste
      const categoryToAdd: CategorySummary = {
        name: summaryType.categoryName,
        total: summaryType.total,
        count: summaryType.count,
        average: summaryType.total / summaryType.count,
        monthExpense: [
          summaryType.jan,
          summaryType.feb,
          summaryType.mar,
          summaryType.apr,
          summaryType.may,
          summaryType.jun,
          summaryType.jul,
          summaryType.aug,
          summaryType.sep,
          summaryType.oct,
          summaryType.nov,
          summaryType.dec,
        ],
      };
      this.categorySummaryList.push({
        key: categoryToAdd.name,
        value: categoryToAdd,
      });
    }
  }

  initSummaryList() {
    this.expenseTypeSummaryList = this.expenseTypeList().map((expenseType) => ({
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
      .filter((x) => x.categoryName === categoryName)
      .reduce((acc, curr) => acc + curr.count, 0);

    const categoryTotalSum = this.expenseTypeSummaryList
      .filter((x) => x.categoryName === categoryName)
      .reduce((acc, curr) => acc + curr.total, 0);
    return (
      'Total: ' +
      categoryTotalCount +
      ' | Sum: ' +
      categoryTotalSum +
      '  | Avg: ' +
      (categoryTotalSum / 12).toFixed(2)
    );
  }

  groupExpensesByMonth(expenseList: Expense[]): number[] {
    if (!expenseList || expenseList.length === 0) {
      return [];
    }

    const grouped = expenseList.reduce((acc, expense) => {
      // Estrai il mese dalla data
      const month = expense.date.getMonth(); // Esempio: "January 2025"

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

  CalculateCategoryGroupFooterAverage(
    expenseType: Nullable | ExpenseTypeSummary
  ): number {
    if (expenseType) {
      const categorySummary = this.categorySummaryList.find(
        (item) => item.key === expenseType.categoryName
      );
      if (categorySummary) {
        return categorySummary.value.total / 12;
      }
    }
    return 0;
  }

  CalculateCategoryGroupFooterCount(
    expenseType: Nullable | ExpenseTypeSummary
  ): number {
    if (expenseType) {
      const categorySummary = this.categorySummaryList.find(
        (item) => item.key === expenseType.categoryName
      );
      if (categorySummary) {
        return categorySummary.value.count;
      }
    }
    return 0;
  }

  CalculateCategoryGroupFooterSum(
    expenseType: Nullable | ExpenseTypeSummary
  ): number {
    if (expenseType) {
      const categorySummary = this.categorySummaryList.find(
        (item) => item.key === expenseType.categoryName
      );
      if (categorySummary) {
        return categorySummary.value.total;
      }
    }
    return 0;
  }

  CalculateCategoryGroupFooterMonth(
    expenseType: any,
    month: number
  ): string | number {
    if (expenseType) {
      const categorySummary = this.categorySummaryList.find(
        (item) => item.key === expenseType.categoryName
      );
      if (categorySummary) {
        return categorySummary.value.monthExpense[month];
      }
    }
    return 0;
  }
}
