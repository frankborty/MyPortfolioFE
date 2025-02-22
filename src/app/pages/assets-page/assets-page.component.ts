import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { AssetsSummaryTableComponent } from '../../core/components/assets/assetsSummaryTable/assetsSummaryTable.component';
import { AssetTotalBarChartComponent } from '../../core/components/charts/assetTotalBarChart/assetTotalBarChart.component';

@Component({
  selector: 'app-assets-page',
  imports: [ImportsModule, AssetsSummaryTableComponent, AssetTotalBarChartComponent],
  templateUrl: './assets-page.component.html',
  styleUrl: './assets-page.component.css'
})
export class AssetsPageComponent {

}
