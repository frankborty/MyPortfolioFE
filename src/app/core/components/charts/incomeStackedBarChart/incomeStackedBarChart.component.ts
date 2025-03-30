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
import { Income } from '../../../interfaces/income';
import { IncomeType } from '../../../interfaces/incomeType';
import { IncomeService } from '../../../services/incomeService/income.service';

@Component({
  selector: 'app-incomeStackedBarChart',
  imports: [ImportsModule],
  templateUrl: './incomeStackedBarChart.component.html',
  styleUrls: ['./incomeStackedBarChart.component.css'],
})
export class IncomeStackedBarChartComponent {
  incomeList = signal<Income[]>([]);
  incomeTypeList = signal<IncomeType[]>([]);
  inputData: any;
  options: any;

  selectedYear: Date = new Date('2024-01-01');

  constructor(incomeService: IncomeService, private cd: ChangeDetectorRef) {
    this.incomeList = incomeService.incomeList;
    this.incomeTypeList = incomeService.incomeTypeList;

    effect(() => {
      this.initChart();
    });
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

    const filteredData = this.incomeList().filter(
      (income) =>
        new Date(income.date).getFullYear() === this.selectedYear.getFullYear()
    );

    this.inputData = {
      labels: [
        'Gennaio',
        'Febbraio',
        'Marzo',
        'Aprile',
        'Maggio',
        'Giugno',
        'Luglio',
        'Agosto',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre',
      ],
      datasets: [],
    };

    let incomeTotal = 0;
    this.incomeTypeList().forEach((incomeType) => {
      let dataValue = this.getIncomeGroupedByType(
        filteredData,
        incomeType.name
      );
      dataValue.forEach((i) => (incomeTotal += i));
      let dataset = {
        type: 'bar',
        label: incomeType.name,
        data: dataValue,
      };
      this.inputData.datasets.push(dataset);
    });

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        title: {
          display: true, // Mostra il titolo
          text: 'Income', // Testo del titolo
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
          text:
            'Total: ' +
            incomeTotal.toLocaleString('it-IT', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            ' €',
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
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
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

  getIncomeGroupedByType(incomeList: Income[], typeName: string) {
    let incomePerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    incomeList = incomeList.filter(
      (income) => income.incomeType.name == typeName
    );
    incomeList.forEach((income) => {
      let incomeMonth = (income.date as Date).getMonth();
      incomePerMonth[incomeMonth] += income.amount;
    });
    return incomePerMonth;
  }
}
