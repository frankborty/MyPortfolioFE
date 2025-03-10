import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Asset } from '../../../interfaces/asset';

@Component({
  selector: 'app-assetCard',
  imports: [ImportsModule],
  templateUrl: './assetCard.component.html',
  styleUrls: ['./assetCard.component.css'],
})
export class AssetCardComponent implements OnInit, OnChanges {
  @Input() asset: Asset;

  assetResultPositive = false;
  assetValueDeltaString = '(--- $ / ---%)';

  //@Input() assetOperation : any;
  constructor() {
    this.asset = {
      id: -1,
      name: '',
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
    this.asset.pmc=39.944;
    if(this.asset.name.startsWith("X")){
      console.log("prova");
    }
    let assetDeltaAbs=this.asset.share*(this.asset.currentValue - this.asset.pmc);
    let assetDeltaRel=this.calculatePercentageChange(this.asset.pmc, this.asset.currentValue);
    this.assetResultPositive = assetDeltaAbs>0;
    this.assetValueDeltaString = `(${assetDeltaAbs.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })} / 
    ${assetDeltaRel.toLocaleString('it-IT', { style: 'percent', minimumFractionDigits: 2 })})`;
  }

  calculatePercentageChange(initialPrice: number, currentPrice: number): number {
    if (initialPrice === 0) {
      return 0; // Evita la divisione per zero
    }
    return ((currentPrice - initialPrice) / initialPrice);
  }
}
