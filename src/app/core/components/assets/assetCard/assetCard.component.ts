import { Component, Input, OnInit } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Asset } from '../../../interfaces/asset';

@Component({
  selector: 'app-assetCard',
  imports: [ImportsModule],
  templateUrl: './assetCard.component.html',
  styleUrls: ['./assetCard.component.css']
})
export class AssetCardComponent implements OnInit {
  @Input() asset: Asset;
  @Input() assetValue: number = 1245.30;
  @Input() assetDeltaAbs: number = -512.23;
  @Input() assetDeltaRel: number = -2.3;

  assetValueDeltaString = "(+123.45 $ / +1.2%)";

  //@Input() assetOperation : any;
  constructor() {
    this.asset = {
        id: -1,
        name: '',
        category: {
          id: -1,
          name: '',
          isInvested: false
        },
        isin: '',
        note: '',
        share: 0,
        url: '',
        pmc: 0,
        currentValue: 0,
        timeStamp: new Date()
      };
   }

  ngOnInit() {
  }

}
