import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { AssetOperation } from '../../../interfaces/assetOperation';
import { AssetService } from '../../../services/assetService/asset.service';
import { Asset } from '../../../interfaces/asset';
import { forkJoin } from 'rxjs';

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
  operationList: AssetOperation[] = [];
  assetList: Asset[] = [];
  assetOperationList: AssetWihOperation[] = [];
  operationType = ['BUY', 'SELL'];
  financialAssetList: string[] = [];

  constructor(private assetService: AssetService) {}

  ngOnInit() {
    this.loadDataAndPrepareAssetOperationList();
  }

  public loadDataAndPrepareAssetOperationList() {
    // Utilizza forkJoin per eseguire entrambe le chiamate HTTP in parallelo
    forkJoin({
      operations: this.assetService.getAssetOperationList(),
      assets: this.assetService.getAssetList(),
    }).subscribe({
      next: (results) => {
        // Una volta che entrambe le chiamate sono completate, assegna i dati
        this.operationList = results.operations.sort(
          (a, b) => (b.date as Date).getTime() - (a.date as Date).getTime()
        );
        this.assetList = results.assets.filter((a) => a.category.isInvested);

        // Chiamata a prepareAssetOperationList dopo che entrambe le liste sono caricate
        this.prepareAssetOperationList();
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  prepareAssetOperationList() {
    this.assetOperationList = [];
    this.assetOperationList = this.operationList.map((o) => {
      return {
        operation: o,
        asset: this.assetList.find((a) => a.id === o.assetId)!,
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
