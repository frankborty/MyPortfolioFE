import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Asset } from '../../../interfaces/asset';
import { FinancialAssetDetailsCardComponent } from '../financialAssetDetailsCard/financialAssetDetailsCard.component';
import { AssetOperation } from '../../../interfaces/assetOperation';

@Component({
  selector: 'app-assetCard',
  imports: [ImportsModule, FinancialAssetDetailsCardComponent],
  templateUrl: './assetCard.component.html',
  styleUrls: ['./assetCard.component.css'],
})
export class AssetCardComponent implements OnInit, OnChanges {
  @Output() addAssetOperationCallBack = new EventEmitter<number>();
  @Output() updateAssetValueCallBack = new EventEmitter<number>();
  @Input() asset: Asset;
  @Input() assetOperationList: AssetOperation[] = [];

  assetResultPositive = false;
  assetValueDeltaString = '--- $ / ---%';
  detailsPanelVisible = false;

  //@Input() assetOperation : any;
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

  ngOnInit() {}

  ngOnChanges() {
    this.updateAssetData();
  }

  updateAssetData() {
    let assetDeltaAbs = (this.asset.currentValue - this.asset.pmc) * this.asset.share;
    let assetDeltaRel = this.calculatePercentageChange(
      this.asset.pmc,
      this.asset.currentValue
    );
    this.assetResultPositive = assetDeltaAbs >= 0;
    this.assetValueDeltaString = `${assetDeltaAbs.toLocaleString('it-IT', {
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

  addOperation(asset: Asset) {
    this.addAssetOperationCallBack.emit(asset.id);
  }

  updateValue(asset: Asset) {
    this.updateAssetValueCallBack.emit(asset.id);
  }

  showDetails() {
    this.detailsPanelVisible = true;
  }
}
