import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Asset } from '../../../interfaces/asset';
import { AssetService } from '../../../services/assetService/asset.service';
import { AssetOperation } from '../../../interfaces/assetOperation';

@Component({
  selector: 'app-financialAssetDetailsCard',
  imports: [ImportsModule],
  templateUrl: './financialAssetDetailsCard.component.html',
  styleUrls: ['./financialAssetDetailsCard.component.css']
})
export class FinancialAssetDetailsCardComponent implements OnInit, OnChanges {

  @Input() asset: Asset;
  @Input() operationList: AssetOperation[] = [];
  
  assetOperationList: AssetOperation[] = [];
  assetResultPositive = false;
  assetValueDeltaString = '--- € | --- € / ---%';
  detailsPanelVisible= false;

  constructor() {
    this.asset = {
      id: -1,
      name: '',
      pyName: '',
      category: {
        id: -1,
        name: '',
        isInvested: false,
      },
      isin: '',
      note: '',
      share: 0,
      url: '',
      pmc: 0,
      currentValue: 0,
      timeStamp: new Date(),
    };
   }

  ngOnInit() {
  }

  ngOnChanges() {
    this.updateAssetData();
    if(this.operationList.length > 0){
      this.assetOperationList=this.operationList.filter(o=>o.assetId===this.asset.id);
    }
  }

  updateAssetData() {
    let assetDeltaAbs =
      (this.asset.currentValue - this.asset.pmc) * this.asset.share;
    let assetDeltaRel = this.calculatePercentageChange(
      this.asset.pmc,
      this.asset.currentValue
    );
    this.assetResultPositive = assetDeltaAbs >= 0;
    this.assetValueDeltaString = `
    ${assetDeltaAbs.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
    })} / 
    ${assetDeltaRel.toLocaleString('it-IT', {
      style: 'percent',
      minimumFractionDigits: 2,
    })}`;
  }

  calculatePercentageChange(
    initialPrice: number,
    currentPrice: number
  ): number {
    if (initialPrice === 0) {
      return 0; // Evita la divisione per zero
    }
    return (currentPrice - initialPrice) / initialPrice;
  }

}
