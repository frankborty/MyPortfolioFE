import { Component, OnInit } from '@angular/core';
import { AssetValueList, AssetValueSummary } from '../../../interfaces/assetValueSummary';
import { ImportsModule } from '../../../../imports';
import { GlobalUtilityService } from '../../../services/utils/global-utility.service';
import { MessageService } from 'primeng/api';
import { ParamConfirmationDialogComponent } from '../../param-confirmation-dialog/param-confirmation-dialog.component';
import { AssetService } from '../../../services/assetService/asset.service';
import { AssetCategory } from '../../../interfaces/assetCategory';

@Component({
  selector: 'app-assetsSummaryTable',
  imports: [ImportsModule, ParamConfirmationDialogComponent],
  providers: [MessageService],
  templateUrl: './assetsSummaryTable.component.html',
  styleUrls: ['./assetsSummaryTable.component.css'],
})
export class AssetsSummaryTableComponent implements OnInit {

  assetValueSummaryOriginal: AssetValueSummary[] = [];
  assetValueSummaryFiltered: AssetValueSummary[] = [];
  assetValueSummaryToUpdate: AssetValueSummary;
  assetSumTotalByMonth: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
  assetDeltaByMonth: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];  

  selectedYear: Date = new Date('2024-01-01'); //da sistemare con il 2025
  monthIndexArray: number[]= [0,1,2,3,4,5,6,7,8,9,10,11];

  constructor(private assetService: AssetService,
    private messageService: MessageService
  ) {
    this.assetValueSummaryToUpdate = {
      asset: {
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
      },
      assetValueList: []
    };
  }

  ngOnInit() {
    this.loadAssetsSummaryByMonth();
  }

  loadAssetsSummaryByMonth() {
    this.assetService.getAssetsSummaryByMonth().subscribe({
      next: (data: AssetValueSummary[]) => {
        this.assetValueSummaryOriginal = data;
        this.filterAssetValueSummary();
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  filterAssetValueSummary() {
    this.assetValueSummaryFiltered = [];
    this.assetValueSummaryOriginal.forEach((assetSummary) => {
      this.assetValueSummaryFiltered.push({
        asset: assetSummary.asset,
        assetValueList: this.prepareAssetValueList(assetSummary)
      });
    });
    this.calculateSumTotalByMonth();
    this.calculateDeltaByMonth();
  }

  prepareAssetValueList(assetSummary: AssetValueSummary) : AssetValueList[] {
    let assetValueList: AssetValueList[] = [];
    for(let i = 0; i < 12; i++) {
      assetValueList.push({
        id: 0,
        assetId: -1,
        value: 0,
        note: '',
        timeStamp: new Date(this.selectedYear.getFullYear(), i+1, 1)
      });
    }
    assetSummary.assetValueList.forEach((assetValue) => {
      if(assetValue.timeStamp.getFullYear() == this.selectedYear.getFullYear()) {
        assetValueList[assetValue.timeStamp.getMonth()].value = assetValue.value;
        assetValueList[assetValue.timeStamp.getMonth()].note = assetValue.note;
      }
    });
    return assetValueList;
  }

  calculateSumTotalByMonth() {
    this.assetSumTotalByMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
    this.assetValueSummaryFiltered.forEach((assetSummary) => {
      assetSummary.assetValueList.forEach((assetValue, index) => {
        this.assetSumTotalByMonth[index] += assetValue.value;
      });
    });
  }

  calculateDeltaByMonth() {
    this.assetDeltaByMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
    for(let i = 0; i < 12; i++) {
      if(i == 0) {
        this.assetDeltaByMonth[i] = 0;
      } else {
        this.assetDeltaByMonth[i] = this.assetSumTotalByMonth[i] - this.assetSumTotalByMonth[i-1];
      }
    }
  }

  CalculateCategoryGroupHeaderMonth(assetCategory: AssetCategory, monthIndex: number): number {
    return this.assetValueSummaryFiltered
    .filter(asset => asset.asset.category.name === assetCategory.name)
    .reduce((acc, asset) => acc + asset.assetValueList[monthIndex].value, 0);
  }

  openEditValueDialog(assetValueSummaryToUpdate: AssetValueSummary) {
    console.log(assetValueSummaryToUpdate);
    //apro il dialog per la modifica del valore
  }

  onRowEditStart(assetValueSummaryToUpdate: AssetValueSummary) {
    this.assetValueSummaryToUpdate = JSON.parse(JSON.stringify(assetValueSummaryToUpdate));
  }
    
  onRowEditSave(assetValueSummaryUpdated: AssetValueSummary) {
    if(this.assetValueSummaryToUpdate.asset.category.id != -1) { 
      this.saveAssetValueType(assetValueSummaryUpdated);
    }
  }
    
  onRowEditCancel() {
    this.assetValueSummaryFiltered.forEach((assetSummary) => {
      if (assetSummary.asset.name == this.assetValueSummaryToUpdate.asset.name) {
        for(let i = 0; i < 12; i++) {
          assetSummary.assetValueList[i].value = this.assetValueSummaryToUpdate.assetValueList[i].value;
        }
        this.assetValueSummaryToUpdate.asset.category.id = -1;
        return;
      }
    });
  }

  saveAssetValueType(asset: AssetValueSummary) {
    asset.assetValueList.forEach((assetValue) => {
      assetValue.value = assetValue.value ?? 0;
      assetValue.note = assetValue.note ?? '';
    });
    this.assetService.updateAssetValueSummary(asset).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'ExpenseType modificata con successo',
        });
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.loadAssetsSummaryByMonth();
      },
    });
  } 
}
