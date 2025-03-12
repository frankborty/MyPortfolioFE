import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/assetService/asset.service';
import { AssetValueSummary } from '../../../interfaces/assetValueSummary';
import { ImportsModule } from '../../../../imports';
import { GlobalUtilityService } from '../../../services/utils/global-utility.service';

enum TimeFrame {
  LYEAR = 'Last Year',
  LMONTH = 'Last Month',
  LWEEK = 'Last Week',
  ALL = 'All',
}

@Component({
  selector: 'app-financialAssetLineChart',
  imports: [ImportsModule],
  templateUrl: './financialAssetLineChart.component.html',
  styleUrls: ['./financialAssetLineChart.component.css'],
})
export class FinancialAssetLineChartComponent implements OnInit {
  assetValueList: AssetValueSummary[] = [];
  inputData: any;
  options: any;

  selectedTimeFrame = TimeFrame.ALL;
  timeFrameOptions: TimeFrame[] = [
    TimeFrame.ALL,
    TimeFrame.LWEEK,
    TimeFrame.LMONTH,
    TimeFrame.LYEAR,
  ];

  constructor(
    private assetService: AssetService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAssetsValueList();
  }

  loadAssetsValueList() {
    this.assetService.getAssetsSummaryByMonth().subscribe({
      next: (data: AssetValueSummary[]) => {
        this.assetValueList = data.filter((x) => x.asset.category.isInvested);
        this.initChart();
      },
      error: (error: any) => {
        console.error(error);
      },
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

    // Creiamo un Set direttamente invece di un array
    const allDatesArray: Date[] = [];

    this.assetValueList.forEach((assetSummary) => {
      assetSummary.assetValueList.forEach((assetValue) => {
        allDatesArray.push(assetValue.timeStamp);
      });
    });

    const uniqueDates = this.removeDuplicateDates(allDatesArray);
    // Se hai ancora bisogno di un array (ordinato) dopo aver raccolto tutte le date uniche
    const allDatesList = this.filterDate(
      [...uniqueDates].sort((a, b) => a.getTime() - b.getTime())
    );
    //rimuovo i duplicati

    this.inputData = {
      labels: allDatesList.map(
        (x) =>
          x.toISOString().substring(5, 7) +
          '/' +
          x.toISOString().substring(0, 4)
      ),
      datasets: [],
    };

    this.assetValueList.forEach((assetSummary) => {
      //creo il set di dati d usare nel dataset
      const datasetValue = allDatesList.map((date) => {
        const dataPoint = assetSummary.assetValueList.find(
          (item) => item.timeStamp.getTime() === date.getTime()
        );
        return dataPoint ? dataPoint.value : null;
      });
      let dataset = {
        label: assetSummary.asset.name,
        data: Array.from(datasetValue),
      };
      this.inputData.datasets.push(dataset);
    });

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          title: {
            display: true, // Mostra il titolo
            text: 'Investimenti totali', // Testo del titolo
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
    return Array.from(new Set(dates.map((date) => date.getTime()))) // Rimuove i duplicati con un Set di timestamp
      .map((timestamp) => new Date(timestamp)); // Converte di nuovo in Date
  }
}
