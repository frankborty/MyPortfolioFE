import { Component } from '@angular/core';
import { AssetsSummaryTableComponent } from '../../../core/components/assets/assetsSummaryTable/assetsSummaryTable.component';
import { AssetTotalBarChartComponent } from '../../../core/components/charts/assetTotalBarChart/assetTotalBarChart.component';
import { ImportsModule } from '../../../imports';

@Component({
  selector: 'app-assetsPage',
    imports: [ImportsModule, AssetsSummaryTableComponent, AssetTotalBarChartComponent],
  templateUrl: './assetsPage.component.html',
  styleUrls: ['./assetsPage.component.css']
})
export class AssetsPageComponent {
}
