import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetCardComponent } from '../../../core/components/assets/assetCard/assetCard.component';
import { FinancialAssetLineChartComponent } from '../../../core/components/charts/financialAssetLineChart/financialAssetLineChart.component';
import { Asset } from '../../../core/interfaces/asset';
import { AssetService } from '../../../core/services/assetService/asset.service';
import { ImportsModule } from '../../../imports';
import { AssetOperationTableComponent } from '../../../core/components/assets/assetOperationTable/assetOperationTable.component';
import { ParamConfirmationDialogComponent } from '../../../core/components/paramConfirmationDialog/paramConfirmationDialog.component';
import { AssetOperation } from '../../../core/interfaces/assetOperation';
import { AssetOperationType } from '../../../core/enum/assetOperationType';
import { EditAssetOperationComponent } from '../../../core/components/assets/editAssetOperation/editAssetOperation.component';
import { OperationType } from '../../../core/enum/operationType';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-financialAssetsPage',
  imports: [
    ImportsModule,
    FinancialAssetLineChartComponent,
    AssetCardComponent,
    AssetOperationTableComponent,
    ParamConfirmationDialogComponent,
    EditAssetOperationComponent,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    ParamConfirmationDialogComponent,
  ],
  templateUrl: './financialAssetsPage.component.html',
  styleUrls: ['./financialAssetsPage.component.css'],
})
export class FinancialAssetsPageComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)  confirmDialog!: ParamConfirmationDialogComponent;
  @ViewChild(EditAssetOperationComponent) editAssetOperationDialog!: EditAssetOperationComponent;
  @ViewChild(AssetOperationTableComponent) assetOperationTable!: AssetOperationTableComponent;
  displayAssetOperationEditPanel: boolean = false;
  assetList: Asset[] = [];
  constructor(
    private assetService: AssetService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAssetList();
  }

  loadAssetList() {
    this.assetService.getAssetWithValueList().subscribe({
      next: (data: Asset[]) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        this.assetList = data.filter((x) => x.category.isInvested);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  showAddAssetOperationDialog() {
    let defaultAssetOperation: AssetOperation = {
      assetOperationId: -1,
      assetId: -1,
      date: new Date(),
      pmc: 0,
      share: 0,
      operationType: AssetOperationType.BUY,
    };
    this.editAssetOperationDialog.setAssetOperationToEdit(
      defaultAssetOperation
    );
    this.editAssetOperationDialog.setCurrentOperation(OperationType.ADD);
    this.displayAssetOperationEditPanel = true;
  }

  addAssetOperation(assetOperation: AssetOperation) {
    this.displayAssetOperationEditPanel = false;
    if (assetOperation) {
      this.assetService.addAssetOperation(assetOperation).subscribe({
        next: () => {
          this.loadAssetList();
          this.assetOperationTable.loadDataAndPrepareAssetOperationList();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Operazione aggiunta con successo',
          });
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

  editAssetOperation(assetOperation: AssetOperation) {
      this.displayAssetOperationEditPanel = false;
      if (assetOperation) {
        this.assetService.editAssetOperation(assetOperation.assetOperationId, assetOperation).subscribe({
          next: () => {
            this.loadAssetList();
            this.assetOperationTable.loadDataAndPrepareAssetOperationList();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Operazione modificata con successo',
            });
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

  showEditAssetOperationDialog(assetOperation: AssetOperation) {
    this.editAssetOperationDialog.setAssetOperationToEdit(assetOperation);
    this.editAssetOperationDialog.setCurrentOperation(OperationType.EDIT);
    this.displayAssetOperationEditPanel = true;
  }

  deleteAssetOperation(assetOperation: AssetOperation) {
    if (assetOperation) {
      this.confirmDialog
        .confirmDelete(
          'Sei sicuro di cancellare l\'operazione ' +
          assetOperation.assetId +
            ' (' +
            assetOperation.operationType +
            ': ' +
            assetOperation.share +
            ' | ' +
            assetOperation.pmc +
            ')?'
        )
        .then((confirmed) => {
          if (confirmed) {
            this.assetService.deleteAssetOperation(assetOperation.assetOperationId).subscribe({
              next: () => {
                this.loadAssetList();
                this.assetOperationTable.loadDataAndPrepareAssetOperationList();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Operazione cancellata con successo',
                });
              },
              error: (error: any) => {
                console.error(error);
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
  }
}
