import { Component, OnInit } from '@angular/core';
import { AssetCardComponent } from '../../../core/components/assets/assetCard/assetCard.component';
import { FinancialAssetLineChartComponent } from '../../../core/components/charts/financialAssetLineChart/financialAssetLineChart.component';
import { Asset } from '../../../core/interfaces/asset';
import { AssetService } from '../../../core/services/assetService/asset.service';
import { ImportsModule } from '../../../imports';

@Component({
  selector: 'app-financialAssetsPage',
    imports: [ImportsModule, FinancialAssetLineChartComponent, AssetCardComponent],
  templateUrl: './financialAssetsPage.component.html',
  styleUrls: ['./financialAssetsPage.component.css']
})
export class FinancialAssetsPageComponent implements OnInit {

  assetList : Asset[]=[];
  constructor(private assetService: AssetService) { }

  ngOnInit() {
    this.loadAssetList();
  }

  loadAssetList() {
    this.assetService.getAssetList().subscribe({
      next: (data: Asset[]) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        this.assetList = data.filter(x => x.category.isInvested);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

}
