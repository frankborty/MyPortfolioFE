import { Component, effect, EventEmitter, OnInit, Output } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { AssetOperation } from '../../../interfaces/assetOperation';
import { AssetService } from '../../../services/assetService/asset.service';
import { Asset } from '../../../interfaces/asset';

interface AssetWihOperation {
  asset: Asset;
  operation: AssetOperation;
  totalImport: number;
}

@Component({
  selector: 'app-assetOperationTable',
  imports: [ImportsModule],
  templateUrl: './assetOperationTable.component.html',
  styleUrls: ['./assetOperationTable.component.css'],
})
export class AssetOperationTableComponent implements OnInit {
  @Output() editAssetOperationCallBack = new EventEmitter<AssetOperation>();
  @Output() deleteAssetOperationCallBack = new EventEmitter<AssetOperation>();
  operationList : any;
  assetList : any;
  
  assetOperationList: AssetWihOperation[] = [];
  operationType = ['BUY', 'SELL'];
  financialAssetList: string[] = [];

  constructor(private assetService: AssetService) {
    this.assetList = assetService.assetList;
    this.operationList = assetService.assetOperationList;

    effect(() => {
      if(this.operationList().length > 0 && this.assetList().length > 0){
        this.prepareAssetOperationList();
      }}
    );
  }

  ngOnInit() {
  }

  prepareAssetOperationList() {
    this.assetOperationList = [];
    this.assetOperationList = this.operationList().map((o : AssetOperation) => {
      return {
        operation: o,
        asset: this.assetList().find((a : Asset) => a.id === o.assetId)!,
        totalImport: o.pmc * o.share,
      };
    });
  }

  editAssetOperation(assetOperation: AssetWihOperation) {
    this.editAssetOperationCallBack.emit(assetOperation.operation);
  }

  deleteAssetOperation(assetOperation: AssetWihOperation) {
    this.deleteAssetOperationCallBack.emit(assetOperation.operation);
  }
}

