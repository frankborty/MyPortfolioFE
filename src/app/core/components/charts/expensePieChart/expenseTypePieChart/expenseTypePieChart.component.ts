import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ImportsModule } from '../../../../../imports';
import { Expense } from '../../../../interfaces/expense';

@Component({
  selector: 'app-expenseTypePieChart',
  imports: [ImportsModule],
  templateUrl: './expenseTypePieChart.component.html',
  styleUrls: ['./expenseTypePieChart.component.css'],
})
export class ExpenseTypePieChartComponent implements OnInit, OnChanges {
  @Input() expenseList: Expense[] = [];
  inputData: any;
  options: any;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Controlla se expenseList è stato modificato
    if (changes['expenseList']) {
      this.initChart();
    }
  }

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    let spesaTotalePerType = this.calcolaSommaPerType(this.expenseList);
    spesaTotalePerType.sort((a, b) => b.sum - a.sum);

    let labelList = spesaTotalePerType.map((item) => item.name);
    let valueList = spesaTotalePerType.map((item) => item.sum);

    this.inputData = {
      labels: labelList,
      datasets: [
        {
          data: valueList,
        },
      ],
    };

    this.options = {
      plugins: {
        title: {
          display: true, // Mostra il titolo
          text: 'Spese per tipo', // Testo del titolo
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
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
    this.cd.markForCheck();
  }

  calcolaSommaPerType(expenseList: Expense[]): { name: string; sum: number }[] {
    const grouped = expenseList.reduce((acc, expense) => {
      // Raggruppa per tipo e somma gli importi
      if (!acc[expense.expenseType.name]) {
        acc[expense.expenseType.name] = 0;
      }
      acc[expense.expenseType.name] += expense.amount;

      return acc;
    }, {} as { [key: string]: number });

    // Converte l'oggetto in un array di oggetti con name e somma
    return Object.keys(grouped).map((key) => ({
      name: key,
      sum: grouped[key],
    }));
  }
}
