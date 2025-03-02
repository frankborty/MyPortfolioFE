import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { FinancialAssetLineChartComponent } from "../../../core/components/charts/financialAssetLineChart/financialAssetLineChart.component";
import { AssetService } from '../../../core/services/assetService/asset.service';
import { Asset } from '../../../core/interfaces/asset';
import { AssetCardComponent } from '../../../core/components/assets/assetCard/assetCard.component';

@Component({
  selector: 'app-financialAssets-page',
  imports: [ImportsModule, FinancialAssetLineChartComponent, AssetCardComponent],
  templateUrl: './financialAssets-page.component.html',
  styleUrls: ['./financialAssets-page.component.css']
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
