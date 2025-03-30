import {
  ChangeDetectorRef,
  Component,
  effect,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';
import { ExpenseCategory } from '../../../interfaces/expenseCategory';
import { ExpenseService } from '../../../services/expenseService/expense.service';

@Component({
  selector: 'app-expenseTotalTypeBarChart',
  imports: [ImportsModule],
  templateUrl: './expenseTotalTypeBarChart.component.html',
  styleUrls: ['./expenseTotalTypeBarChart.component.css'],
})
export class ExpenseTotalTypeBarChartComponent implements OnInit, OnChanges {
  public expenseList = signal<Expense[]>([]);
  public expenseTypeList = signal<ExpenseType[]>([]);
  public expenseCategoryList = signal<ExpenseCategory[]>([]);

  selectedExpenseTypes: ExpenseType[] = [];
  selectedExpenseCategories: ExpenseCategory[] = [];

  inputData: any;
  options: any;

  selectedYear: Date = new Date('2024-01-01');
  filterType = 'category';
  constructor(expenseService: ExpenseService, private cd: ChangeDetectorRef) {
    this.expenseList = expenseService.expenseList;
    this.expenseTypeList = expenseService.expenseTypeList;
    this.expenseCategoryList = expenseService.expenseCategoryList;

    effect(() => {
      if (
        this.expenseList().length > 0 &&
        this.expenseTypeList().length > 0 &&
        this.expenseCategoryList().length > 0
      ) {
        this.selectedExpenseCategories = this.expenseCategoryList();
        this.initChart();
      }
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenseList']) {
      this.initChart();
    }

    if (changes['expenseCategoryList']) {
      this.selectedExpenseCategories = this.expenseCategoryList();
      this.initChart();
    }
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color'
    );

    const filteredData = this.expenseList().filter(
      (expense) =>
        new Date(expense.date).getFullYear() === this.selectedYear.getFullYear()
    );

    let expenseGrouped = this.getExpensesGroupedByFilter(filteredData);

    this.inputData = {
      labels: [
        'Gen',
        'Feb',
        'Mar',
        'Apr',
        'Mag',
        'Giu',
        'Lug',
        'Ago',
        'Set',
        'Ott',
        'Nov',
        'Dic',
      ],
      datasets: [],
    };

    let datasets = expenseGrouped.map((categoryData) => {
      let dataValue = this.groupExpensesByMonth(categoryData.expenses);
      let totalSum = dataValue.reduce((a, b) => a + b, 0);
      let mediaMensile = totalSum / 12;
      return {
        type: 'bar',
        label:
          categoryData.category +
          '(' +
          categoryData.expenses.length +
          '|' +
          totalSum.toFixed(2) +
          '|' +
          mediaMensile.toFixed(2) +
          ')',
        data: dataValue,
      };
    });
    this.inputData.datasets.push(...datasets);

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        title: {
          display: true, // Mostra il titolo
          text: 'Spese mensili per categoria/tipo', // Testo del titolo
          font: {
            size: 18, // Dimensione del carattere
            weight: 'bold', // Spessore del carattere
          },
          color: 'rgba(0, 0, 0, 0.8)', // Colore del titolo
          align: 'center', // Allineamento: può essere 'start', 'center', o 'end'
          padding: {
            top: 10,
            bottom: 5,
          },
        },
        subtitle: {
          text: '(Count|Total|Avg)',
          display: true,
          padding: {
            top: 0,
            bottom: 0,
          },
        },
        labels: {
          color: textColor,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: {
            dataset: { label: string };
            parsed: { y: string | null };
          }) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' pippo';
            }
            return label;
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,

            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
    this.cd.markForCheck();
  }

  getExpensesGroupedByFilter(filteredData: Expense[]) {
    if (this.filterType === 'category') {
      if(this.selectedExpenseCategories == null) {
        this.selectedExpenseCategories = [];
      }

      return this.selectedExpenseCategories.map((category) => {
        return {
          category: category.name,
          expenses: filteredData.filter(
            (expense) => expense.expenseType.category.name === category.name
          ),
        };
      });
    } else {
      if(this.selectedExpenseTypes == null) {
        this.selectedExpenseTypes = [];
      }
      return this.selectedExpenseTypes.map((type) => {
        return {
          category: type.name,
          expenses: filteredData.filter(
            (expense) => expense.expenseType.name === type.name
          ),
        };
      });
    }
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

  calcolaSommaCumulativa(data: number[]): number[] {
    const cumulativeSumArray: number[] = [];
    let cumulativeSum = 0;
    data.forEach((monthlyTotal) => {
      cumulativeSum += monthlyTotal; // Aggiungi il totale del mese corrente
      cumulativeSumArray.push(cumulativeSum);
    });
    return cumulativeSumArray;
  }
}
