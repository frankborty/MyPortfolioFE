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

    if (changes['expenseTypeList']) {
      this.selectedExpenseTypes = this.expenseTypeList;
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
            y: point.amount,  // Importo come valore Y
            status: point.description
          })),
          pointRadius: 3,    // Imposta il raggio dei punti
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
          labels: {
            color: textColor,
            boxWidth: 10,
            boxHeight: 10,
          },
        },

        tooltip: {
          callbacks: {
            label: function (tooltipItem: { dataset: any; dataIndex: string | number; }) {
              // Recupera i dati dal punto selezionato
              const dataset = tooltipItem.dataset;
              const dataPoint = dataset.data[tooltipItem.dataIndex];
              const label = dataset.label || 'Nessun tipo';
    
              // Costruisci il messaggio del tooltip
              return `${dataPoint.status}: ${dataPoint.y}€ (${label})`;
            },
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
}
