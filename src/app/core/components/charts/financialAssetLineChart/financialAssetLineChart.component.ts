import { ChangeDetectorRef, Component, effect, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { TimeFrame } from '../../../enum/timeFrame.enum';
import { AssetValueSummary } from '../../../interfaces/assetValueSummary';
import { AssetService } from '../../../services/assetService/asset.service';

@Component({
  selector: 'app-financialAssetLineChart',
    imports: [ImportsModule],
  templateUrl: './financialAssetLineChart.component.html',
  styleUrls: ['./financialAssetLineChart.component.css']
})
export class FinancialAssetLineChartComponent implements OnInit {
  @Output() updateAllAssetValueCallBack = new EventEmitter();
  assetTotalValueList = signal<AssetValueSummary[]>([]);
  assetUnitValueList = signal<AssetValueSummary[]>([]);
  inputData: any;
  options: any;

  selectedTimeFrame = TimeFrame.ALL;
  timeFrameOptions: TimeFrame[] = [TimeFrame.ALL, TimeFrame.LYEAR];

  chartOptions: any[] = [
    { label: 'Unitario', value: 'unit' },
    { label: 'Totale', value: 'total' },
  ];
  chartType: string = 'unit';

  constructor(
    private assetService: AssetService,
    private cd: ChangeDetectorRef
  ) {
    this.assetTotalValueList = assetService.assetSummaryByMonth;
    this.assetUnitValueList = assetService.assetUnitPriceByMonth;

    effect(() => {
      if(this.assetTotalValueList().length > 0 && this.assetUnitValueList().length > 0){
        this.initChart();
      }
    });
  }

  ngOnInit() {
  }

  refreshData() {
    //this.updateAllAssetValueCallBack.emit();
    this.assetService.fetchAssetsSummaryByMonth();
    this.assetService.fetchAssetsUnitPriceByMonth();
    this.initChart();
  }

  updateAllValue() {
    this.updateAllAssetValueCallBack.emit();
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

    const allDatesArray: Date[] = [];

    let assetValueList: AssetValueSummary[] = [];
    if (this.chartType === 'unit') {
      assetValueList = this.assetUnitValueList().filter(x=>x.asset.category.isInvested && !x.asset.name.startsWith("M."));
    } else {
      assetValueList = this.assetTotalValueList().filter(x=>x.asset.category.isInvested && !x.asset.name.startsWith("M."));
    }

    assetValueList.forEach((assetSummary) => {
      assetSummary.assetValueList.forEach((assetValue) => {
        allDatesArray.push(assetValue.timeStamp);
      });
    });



    const uniqueDates = this.removeDuplicateDates(allDatesArray);
    // Se hai ancora bisogno di un array (ordinato) dopo aver raccolto tutte le date uniche
    const allDatesList = this.filterDate(
      [...uniqueDates].sort((a, b) => a.getTime() - b.getTime())
    );

    this.inputData = {
      labels: allDatesList.map(
        (x) =>
          x.getMonth()+1 +
          '/' +
          x.toISOString().substring(2, 4)
      ),
      datasets: [],
    };


    assetValueList.forEach((assetSummary) => {
      //creo il set di dati d usare nel dataset
      const datasetValue = allDatesList.map((date) => {
        const dataPoint = assetSummary.assetValueList.find(
          (item) =>
            new Date(
              item.timeStamp.getFullYear(),
              item.timeStamp.getMonth(),
              item.timeStamp.getDate()
            ).getTime() === date.getTime()
        );
        return dataPoint ? dataPoint.value : null;
      });
      let dataset = {
        label: assetSummary.asset.name,
        data: Array.from(datasetValue),
      };
      this.inputData.datasets.push(dataset);
    });
    if (this.chartType === 'total') {
      const sumArray: number[] = new Array(allDatesList.length).fill(0);
      this.inputData.datasets.forEach(
        (dataset: { label: string; data: (number | null)[] }) => {
          dataset.data.forEach((value, index) => {
            if (index < sumArray.length) {
              // Evita errori in caso di lunghezze diverse
              sumArray[index] += value ?? 0;
            }
          });
        }
      );

      let sumDataSet = {
        label: 'Total',
        data: sumArray,
        hidden: true,
      };
      this.inputData.datasets.push(sumDataSet);
    }

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          title: {
            display: true, // Mostra il titolo
            text:
              this.chartType == 'unit' ? 'Valore Unitario' : 'Valore Totale', // Testo del titolo
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
            label: (tooltipItem: any) => {
              const formattedString = `${
                tooltipItem.dataset.label
              }: ${tooltipItem.formattedValue.toLocaleString('it-IT')} €`;
              return formattedString;
            },
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
      spanGaps: true,
    };
    this.cd.markForCheck();
  }

  filterDate(dateList: Date[]): Date[] {
    let filteredDate: Date[] = [];
    const nowDate = new Date();
    let startDate = new Date('2000-01-01T00:00:00');
    switch (this.selectedTimeFrame) {
      case TimeFrame.LYEAR:
        startDate = new Date(nowDate.setFullYear(nowDate.getFullYear() - 1));
        break;
      case TimeFrame.LMONTH:
        startDate = new Date(nowDate.setMonth(nowDate.getMonth() - 1));
        break;
      case TimeFrame.LWEEK:
        startDate = new Date(nowDate.setDate(nowDate.getDate() - 7));
        break;
    }
    filteredDate = dateList.filter((date) => date > startDate);

    return filteredDate;
  }

  removeDuplicateDates(dates: Date[]): Date[] {
    dates.map((date) => {
      if(date.getFullYear()==2025 && date.getMonth()==4 && date.getDay()==29){
        const nuovaData = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        console.log(nuovaData);
      }
    });

    return Array.from(
      new Set(
        dates.map((date) =>
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime()
        )
      )
    ).map((timestamp) => new Date(timestamp));
  }
}
