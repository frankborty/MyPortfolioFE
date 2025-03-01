import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Asset } from '../../../interfaces/asset';
import { AssetCategory } from '../../../interfaces/assetCategory';
import { AssetService } from '../../../services/assetService/asset.service';
import { ParamConfirmationDialogComponent } from '../../param-confirmation-dialog/param-confirmation-dialog.component';
import { ImportsModule } from '../../../../imports';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assetSetting',
  imports: [ImportsModule, ParamConfirmationDialogComponent, FormsModule],
  providers: [MessageService],
  templateUrl: './assetSetting.component.html',
  styleUrls: ['./assetSetting.component.css'],
})
export class AssetSettingComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)
  confirmDialog!: ParamConfirmationDialogComponent;
  updatingItem: Asset;
  assetList: Asset[] = [];
  assetCategoryList: AssetCategory[] = [];

  constructor(
    private assetService: AssetService,
    private messageService: MessageService
  ) {
    this.updatingItem = {
      id: -1,
      name: '',
      isin: '',
      note: '',
      url: '',
      share: 0,
      avgPrice: 0,
      timeStamp: '',
      category: {
        id: -1,
        name: '',
        isInvested: false,
      },
    };
  }

  ngOnInit() {
    this.loadAssetList();
    this.loadAssetCategoryList();
  }

  loadAssetList() {
    this.assetService.getAssetList().subscribe({
      next: (data: any) => {
        (data as Asset[]).sort((a, b) => a.name.localeCompare(b.name));
        this.assetList = data;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  loadAssetCategoryList() {
    this.assetService.getAssetCategoryList().subscribe({
      next: (data: any) => {
        (data as AssetCategory[]).sort((a, b) => a.name.localeCompare(b.name));
        this.assetCategoryList = data;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  editAsset(asset: Asset) {
    this.assetService.editAsset(asset.id, asset).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Asset modificato con successo',
        });
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.loadAssetList();
      },
    });
  }

  onRowEditSave(asset: Asset) {
    if (
      asset.name != this.updatingItem?.name ||
      asset.category.id != this.updatingItem.category.id ||
      asset.isin != this.updatingItem.isin ||
      asset.note != this.updatingItem.note
    ) {
      this.editAsset(asset);
    }
    this.updatingItem.id = -1;
  }

  onRowEditCancel() {
    if (this.updatingItem.id != -1) {
      this.assetList.forEach((it) => {
        if (it.id == this.updatingItem.id) {
          it.name = this.updatingItem.name;
          it.category.id = this.updatingItem.category.id;
          it.category.name = this.updatingItem.category.name;
          this.updatingItem.id = -1;
          return;
        }
      });
    }
    this.updatingItem.id = -1;
  }

  onRowEditStart(asset: Asset) {
    this.updatingItem = JSON.parse(JSON.stringify(asset));
  }

  deleteAsset(asset: Asset) {
    this.confirmDialog
      .confirmDelete(
        "Operazione non reversibile. Sei sicuro di cancellare l'asset " +
          asset.name +
          '?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.assetService.deleteAsset(asset.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Asset rimossa con successo',
              });
              this.loadAssetList();
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error,
              });
            },
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Cancellazione annullata',
          });
        }
      });
  }

  addNewAsset() {
    const assetToAdd: Asset = {
      id: -1,
      name: 'AAA_NewAsset',
      isin: '',
      note: '',
      url: '',
      share: 0,
      avgPrice: 0,
      timeStamp: '',
      category: this.assetCategoryList[0],
    };
    this.assetService.addAsset(assetToAdd).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Asset aggiunta con successo',
        });
        this.loadAssetList();
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }
}
