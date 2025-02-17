import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../../imports';
import { IncomeType } from '../../../interfaces/incomeType';
import { IncomeService } from '../../../services/incomeService/income.service';
import { ParamConfirmationDialogComponent } from '../../param-confirmation-dialog/param-confirmation-dialog.component';
import { ExpenseCategory } from '../../../interfaces/expenseCategory';
import { ExpenseService } from '../../../services/expenseService/expense.service';

@Component({
  selector: 'app-expenseCategorySetting',
  imports: [ImportsModule, ParamConfirmationDialogComponent],
  providers: [MessageService],
  templateUrl: './expenseCategorySetting.component.html',
  styleUrls: ['./expenseCategorySetting.component.css']
})
export class ExpenseCategorySettingComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)
  confirmDialog!: ParamConfirmationDialogComponent;
  updatingItemCategory: ExpenseCategory;
  expenseCategoryList: ExpenseCategory[] = [];
  constructor(
    private expenseService: ExpenseService,
    private messageService: MessageService
  ) {
    this.updatingItemCategory = {
      id: -1,
      name: '',
    };
  }

  ngOnInit() {
    this.loadExpenseCategories();
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

  editExpenseCategory(expenseCategory: ExpenseCategory) {
    this.expenseService.editExpenseCategory(expenseCategory.id, expenseCategory).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'ExpenseCategory modificata con successo',
        });
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Errore durante l'update: " + error,
        });
        this.loadExpenseCategories();
      },
    });
  }

  onRowEditSave(expenseCategory: ExpenseCategory) {
    if (expenseCategory.name != this.updatingItemCategory?.name) {
      this.editExpenseCategory(expenseCategory);
    }
    this.updatingItemCategory.id = -1;
  }

  onRowEditCancel() {
    if (this.updatingItemCategory.id != -1) {
      this.expenseCategoryList.forEach((it) => {
        if (it.id == this.updatingItemCategory.id) {
          it.name = this.updatingItemCategory.name;
          this.updatingItemCategory.id = -1;
          return;
        }
      });
    }
    this.updatingItemCategory.id = -1;
  }

  onRowEditStart(expenseCategory: ExpenseCategory) {
    this.updatingItemCategory.id = expenseCategory.id;
    this.updatingItemCategory.name = expenseCategory.name;
  }

  deleteExpenseCategory(expenseCategory: ExpenseCategory) {
    this.confirmDialog
      .confirmDelete(
        'Sei sicuro di cancellare la categoria ' + expenseCategory.name + '?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.expenseService.deleteExpenseCategory(expenseCategory.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'ExpenseCategory rimossa con successo',
              });
              this.loadExpenseCategories();
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Errore durante la cancellazione: ' + error,
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

  addNewExpenseCategory() {
    this.expenseService.addExpenseCategory('Unknown').subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'ExpenseCategory aggiunta con successo',
        });
        this.loadExpenseCategories();
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Errore durante l'aggiunta: " + error,
        });
      },
    });
  }
}
