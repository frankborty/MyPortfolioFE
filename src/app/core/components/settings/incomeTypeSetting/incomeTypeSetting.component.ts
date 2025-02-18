import { Component, OnInit, ViewChild } from '@angular/core';
import { IncomeType } from '../../../interfaces/incomeType';
import { IncomeService } from '../../../services/incomeService/income.service';
import { ImportsModule } from '../../../../imports';
import { MessageService } from 'primeng/api';
import { ParamConfirmationDialogComponent } from '../../param-confirmation-dialog/param-confirmation-dialog.component';

@Component({
  selector: 'app-incomeTypeSetting',
  imports: [ImportsModule, ParamConfirmationDialogComponent],
  providers: [MessageService],
  templateUrl: './incomeTypeSetting.component.html',
  styleUrls: ['./incomeTypeSetting.component.css'],
})
export class IncomeTypeSettingComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)
  confirmDialog!: ParamConfirmationDialogComponent;
  updatingItemType: IncomeType;
  incomeTypeList: IncomeType[] = [];
  constructor(
    private incomeService: IncomeService,
    private messageService: MessageService
  ) {
    this.updatingItemType = {
      id: -1,
      name: '',
    };
  }

  ngOnInit() {
    this.loadIncomeTypes();
  }

  loadIncomeTypes() {
    this.incomeService.getIncomeTypes().subscribe({
      next: (data: any) => {
        (data as IncomeType[]).sort((a, b) => a.name.localeCompare(b.name));
        this.incomeTypeList = data;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  editIncomeType(incomeType: IncomeType) {
    this.incomeService.editIncomeType(incomeType.id, incomeType).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'IncomeType modificata con successo',
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

  onRowEditSave(incomeType: IncomeType) {
    if (incomeType.name != this.updatingItemType?.name) {
      this.editIncomeType(incomeType);
    }
    this.updatingItemType.id = -1;
  }

  onRowEditCancel() {
    if (this.updatingItemType.id != -1) {
      this.incomeTypeList.forEach((it) => {
        if (it.id == this.updatingItemType.id) {
          it.name = this.updatingItemType.name;
          this.updatingItemType.id = -1;
          return;
        }
      });
    }
    this.updatingItemType.id = -1;
  }

  onRowEditStart(incomeType: IncomeType) {
    this.updatingItemType.id = incomeType.id;
    this.updatingItemType.name = incomeType.name;
  }

  deleteIncomeType(incomeType: IncomeType) {
    this.confirmDialog
      .confirmDelete(
        'Sei sicuro di cancellare il tipo ' + incomeType.name + '?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.incomeService.deleteIncomeType(incomeType.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'IncomeType rimossa con successo',
              });
              this.loadIncomeTypes();
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

  addNewIncomeType() {
    this.incomeService.addIncomeType('Unknown').subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'IncomeType aggiunta con successo',
        });
        this.loadIncomeTypes();
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
