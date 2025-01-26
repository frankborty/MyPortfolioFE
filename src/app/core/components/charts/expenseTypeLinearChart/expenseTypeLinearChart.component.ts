import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';

import 'chartjs-adapter-date-fns';


@Component({
  selector: 'app-expenseTypeLinearChart',
  imports: [ImportsModule],

  templateUrl: './expenseTypeLinearChart.component.html',
  styleUrls: ['./expenseTypeLinearChart.component.css'],
})
export class ExpenseTypeLinearChartComponent implements OnInit, OnChanges {
  @Input() expenseList: Expense[] = [];
  @Input() expenseTypeList: ExpenseType[] = [];
  inputData: any;
  options: any;
  selectedExpenseTypes: ExpenseType[] = [];
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    // Controlla se expenseList è stato modificato
    if (changes['expenseList']) {
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

    if (
      this.selectedExpenseTypes == null ||
      this.selectedExpenseTypes.length === 0
    ) {
      this.inputData = {
        labels: [],
        datasets: [],
      };
    } else {
      const datasets = this.selectedExpenseTypes.map((type) => {
        const expensesByType = this.expenseList.filter(
          (expense) => expense.expenseType.name === type.name
        );
        return {
          label: type.name,
          data: expensesByType.map(point => ({
            x: point.date,   // Data come valore X
            y: point.amount  // Importo come valore Y
          })),
          pointRadius: 3,    // Imposta il raggio dei punti
          fill: false
        };       
      });

      this.inputData = {
        datasets: datasets
      };
    }

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          title: {
            display: true, // Mostra il titolo
            text: 'Spese Totali', // Testo del titolo
            font: {
              size: 18, // Dimensione del carattere
              weight: 'bold', // Spessore del carattere
            },
            color: 'rgba(0, 0, 0, 0.8)', // Colore del titolo
            align: 'center', // Allineamento: può essere 'start', 'center', o 'end'
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          labels: {
            color: textColor,
            boxWidth: 10,
            boxHeight: 10,
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month'
          },
          title: {
            display: true,
            text: 'Data'
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
          title: {
            display: true,
            text: 'Importo (€)',
          }
        },
      },
    };
    this.cd.markForCheck();
  }

  groupExpensesByMonth(expenseList: Expense[]): number[] {
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

    const monthlyTotals = Array(12).fill(0);

    for (const month in grouped) {
      if (grouped.hasOwnProperty(month)) { // Verifica che la proprietà appartenga all'oggetto
        monthlyTotals[parseInt(month)] = grouped[month];
      }
    }    
    return Object.values(monthlyTotals);
  }

  calcolaMediaCumulativa(data: number[]): number[] {
    const cumulativeAverages: number[] = [];
    let cumulativeSum = 0;
    data.forEach((monthlyTotal, index) => {
      cumulativeSum += monthlyTotal; // Aggiungi il totale del mese corrente
      const average = cumulativeSum / (index + 1); // Dividi per il numero di mesi
      cumulativeAverages.push(average);
    });
    return cumulativeAverages;
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
