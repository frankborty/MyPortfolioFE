import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../../imports';
import { Asset } from '../../../interfaces/asset';
import { AssetCategory } from '../../../interfaces/assetCategory';
import { AssetService } from '../../../services/assetService/asset.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ParamConfirmationDialogComponent } from '../../paramConfirmationDialog/paramConfirmationDialog.component';

@Component({
  selector: 'app-assetCategorySetting',
  imports: [
    ImportsModule,
    ParamConfirmationDialogComponent,
    CheckboxModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './assetCategorySetting.component.html',
  styleUrls: ['./assetCategorySetting.component.css'],
})
export class AssetCategorySettingComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)
  confirmDialog!: ParamConfirmationDialogComponent;
  updatingItemCategory: AssetCategory;
    assetCategoryList = signal<AssetCategory[]>([]);
  booleanValue: Boolean[] = [true, false];

  constructor(
    private assetService: AssetService,
    private messageService: MessageService
  ) {
    
    this.assetCategoryList = assetService.assetCategoryList;
    this.updatingItemCategory = {
      id: -1,
      name: '',
      isInvested: false,
    };
  }

  ngOnInit() {
    this.loadAssetCategoryList();
  }

  loadAssetCategoryList() {
    this.assetService.fetchAssetCategoryList();
    this.assetService.fetchAssetList();
  }

  editAssetCategory(assetCategory: AssetCategory) {
    this.assetService
      .editAssetCategory(assetCategory.id, assetCategory)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'AssetCategory modificata con successo',
          });
          this.loadAssetCategoryList();
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

  onRowEditSave(assetCategory: AssetCategory) {
    if (
      assetCategory.name != this.updatingItemCategory?.name ||
      assetCategory.isInvested != this.updatingItemCategory.isInvested
    ) {
      this.editAssetCategory(assetCategory);
    }
    this.updatingItemCategory.id = -1;
  }

  onRowEditCancel() {
    if (this.updatingItemCategory.id != -1) {
      this.assetCategoryList().forEach((it) => {
        if (it.id == this.updatingItemCategory.id) {
          it.name = this.updatingItemCategory.name;
          it.isInvested = this.updatingItemCategory.isInvested;
          this.updatingItemCategory.id = -1;
          return;
        }
      });
    }
    this.updatingItemCategory.id = -1;
  }

  onRowEditStart(asset: Asset) {
    this.updatingItemCategory = JSON.parse(JSON.stringify(asset));
  }

  deleteAssetCategory(assetCategory: AssetCategory) {
    this.confirmDialog
      .confirmDelete(
        "Sei sicuro di cancellare l'assetCategory " + assetCategory.name + '?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.assetService.deleteAssetCategory(assetCategory.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'AssetCategory rimossa con successo',
              });
              this.loadAssetCategoryList();
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  error['message'] == 'Conflict'
                    ? "Impossibile cancellare l'assetCategory in quanto è associata ad almeno un asset"
                    : error,
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

  addNewAssetCategory() {
    const assetCategoryToAdd: AssetCategory = {
      id: -1,
      name: 'AAA_NewAssetCategory',
      isInvested: false,
    };
    this.assetService.addAssetCategory(assetCategoryToAdd).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'AssetCategory aggiunta con successo',
        });
        this.loadAssetCategoryList();
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
