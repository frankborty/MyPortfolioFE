import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../../imports';
import { ExpenseCategory } from '../../../interfaces/expenseCategory';
import { ExpenseService } from '../../../services/expenseService/expense.service';
import { ParamConfirmationDialogComponent } from '../../param-confirmation-dialog/param-confirmation-dialog.component';
import { ExpenseType } from '../../../interfaces/expenseType';

@Component({
  selector: 'app-expenseTypeSetting',
  imports: [ImportsModule, ParamConfirmationDialogComponent],
  providers: [MessageService],
  templateUrl: './expenseTypeSetting.component.html',
  styleUrls: ['./expenseTypeSetting.component.css']
})
export class ExpenseTypeSettingComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)
  confirmDialog!: ParamConfirmationDialogComponent;
  updatingItemType: ExpenseType;
  expenseTypeList: ExpenseType[] = [];
  expenseCategoryList: ExpenseCategory[] = [];

  constructor(
    private expenseService: ExpenseService,
    private messageService: MessageService
  ) {
    this.updatingItemType = {
      id: -1,
      name: '',
      category: {
        id: -1,
        name: ''
      }
    };
  }

  ngOnInit() {
    this.loadExpenseCategories();
    this.loadExpenseTypes();
  }

  loadExpenseCategories() {
    this.expenseService.getExpenseCategories().subscribe({
      next: (data: any) => {
        (data as ExpenseCategory[]).sort((a, b) => a.name.localeCompare(b.name));
        this.expenseCategoryList = data;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  loadExpenseTypes() {
    this.expenseService.getExpenseTypes().subscribe({
      next: (data: any) => {
        (data as ExpenseType[]).sort((a, b) => a.name.localeCompare(b.name));
        this.expenseTypeList = data;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  editExpenseType(expenseType: ExpenseType) {
    this.expenseService.editExpenseType(expenseType.id, expenseType).subscribe({
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
        this.loadExpenseTypes();
      },
    });
  }

  onRowEditSave(expenseType: ExpenseType) {
    if (expenseType.name != this.updatingItemType?.name || expenseType.category.id!=this.updatingItemType.category.id) {
      this.editExpenseType(expenseType);
    }
    this.updatingItemType.id = -1;
  }

  onRowEditCancel() {
    if (this.updatingItemType.id != -1) {
      this.expenseTypeList.forEach((it) => {
        if (it.id == this.updatingItemType.id) {
          it.name = this.updatingItemType.name;
          it.category.id = this.updatingItemType.category.id;
          it.category.name = this.updatingItemType.category.name;
          this.updatingItemType.id = -1;
          return;
        }
      });
    }
    this.updatingItemType.id = -1;
  }

  onRowEditStart(expenseType: ExpenseType) {
    this.updatingItemType.id = expenseType.id;
    this.updatingItemType.name = expenseType.name;
    this.updatingItemType.category.id = expenseType.category.id;
    this.updatingItemType.category.name = expenseType.category.name;
  }

  deleteExpenseType(expenseType: ExpenseType) {
    this.confirmDialog
      .confirmDelete(
        'Sei sicuro di cancellare il tipo ' + expenseType.name + '?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.expenseService.deleteExpenseType(expenseType.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'ExpenseType rimosso con successo',
              });
              this.loadExpenseTypes();
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

  addNewExpenseType() {
    const expenseTypeToAdd : ExpenseType = {
      id: -1,
      name: "AA_NewExpenseType",
      category: this.expenseCategoryList[0]
    } 
    this.expenseService.addExpenseType(expenseTypeToAdd).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'ExpenseCategory aggiunta con successo',
        });
        this.loadExpenseTypes();
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
