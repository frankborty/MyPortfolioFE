import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Expense } from '../../../interfaces/expense';

@Component({
  selector: 'app-expenseTotalLinearChart',
  imports: [ImportsModule],
  templateUrl: './expenseTotalLinearChart.component.html',
  styleUrls: ['./expenseTotalLinearChart.component.css']
})
export class ExpenseTotalLinearChartComponent  implements OnInit, OnChanges {
  @Input() expenseList: Expense[] = [];
  inputData: any; 
  options: any;
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

    
    let data2023 = this.groupExpensesByMonth(this.expenseList.filter(expense => new Date(expense.date).getFullYear() === 2023));
    let data2024 = this.groupExpensesByMonth(this.expenseList.filter(expense => new Date(expense.date).getFullYear() === 2024));
    let data2025 = this.groupExpensesByMonth(this.expenseList.filter(expense => new Date(expense.date).getFullYear() === 2025));

    this.inputData = {
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      datasets: [
      {
      type: 'line',
      label: '2023MC',
      borderColor: 'rgb(255, 0, 100)', // Red
      borderWidth: 2,
      fill: false,
      tension: 0.5,
      data: this.calcolaMediaCumulativa(data2023)
      },
      {
      type: 'line',
      label: '2024MC',
      borderColor: 'rgb(0, 100, 255)',
      borderWidth: 2,
      fill: false,
      tension: 0.5,
      data: this.calcolaMediaCumulativa(data2024)
      },
      {
      type: 'line',
      label: '2025MC',
      borderColor: 'rgb(100, 255, 0)',
      borderWidth: 2,
      fill: false,
      tension: 0.5,
      data: this.calcolaMediaCumulativa(data2025)
      },
      {
      type: 'line',
      hidden: true,
      label: '2023SC',
      borderColor: 'rgb(255, 159, 64)', 
      borderWidth: 2,
      fill: false,
      tension: 0.5,
      data: this.calcolaSommaCumulativa(data2023)
      },
      {
      type: 'line',
      hidden: true,
      label: '2024SC',
      borderColor: 'rgb(153, 102, 255)',
      borderWidth: 2,
      fill: false,
      tension: 0.5,
      data: this.calcolaSommaCumulativa(data2024)
      },
      {
      type: 'line',
      label: '2025SC',
      borderColor: 'rgb(20, 100, 20)', // Dark Green
      borderWidth: 2,
      fill: false,
      tension: 0.5,
      data: this.calcolaSommaCumulativa(data2025)
      },
      {
      type: 'bar',
      label: '2023',
      backgroundColor: 'rgb(255, 100, 130)', // Red
      data : data2023
      },
      {
      type: 'bar',
      label: '2024',
      backgroundColor: 'rgb(100, 130, 255)', // Blue
      data : data2024
      },
      {
      type: 'bar',
      label: '2025',
      backgroundColor: 'rgb(130, 192, 192)', // Teal
      data : data2025
      },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            boxWidth: 10, 
            boxHeight: 10,
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

    // Converte l'oggetto in un array di totali
    return Object.values(grouped);
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
