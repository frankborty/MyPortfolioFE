import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../../imports';
import { ExpenseCategory } from '../../../interfaces/expenseCategory';
import { ExpenseService } from '../../../services/expenseService/expense.service';
import { ParamConfirmationDialogComponent } from '../../paramConfirmationDialog/paramConfirmationDialog.component';
import { ExpenseType } from '../../../interfaces/expenseType';

@Component({
  selector: 'app-expenseCategorySetting',
  imports: [ImportsModule, ParamConfirmationDialogComponent],
  providers: [MessageService],
  templateUrl: './expenseCategorySetting.component.html',
  styleUrls: ['./expenseCategorySetting.component.css'],
})
export class ExpenseCategorySettingComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)
  confirmDialog!: ParamConfirmationDialogComponent;
  updatingItemCategory: ExpenseCategory;
  expenseTypeList : any;
  expenseCategoryList : any;

  constructor(
    private expenseService: ExpenseService,
    private messageService: MessageService
  ) {
    this.expenseTypeList = expenseService.expenseTypeList;
    this.expenseCategoryList = expenseService.expenseCategoryList;
    effect(() => {      
      let updateError = this.expenseService.expenseError();
      if (updateError) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.expenseService.expenseErrorMessage(),
        });
        this.expenseService.expenseError.set(false);
      }
    });

    this.updatingItemCategory = {
      id: -1,
      name: '',
    };
  }

  ngOnInit() {}

  loadExpenseCategories() {
    this.expenseService.fetchExpenseCategoryList();
    this.expenseService.fetchExpenseTypeList();
  }

  editExpenseCategory(expenseCategory: ExpenseCategory) {
    this.expenseService
      .editExpenseCategory(expenseCategory.id, expenseCategory)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'ExpenseCategory modificata con successo',
          });
          this.loadExpenseCategories();
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

  onRowEditSave(expenseCategory: ExpenseCategory) {
    if (expenseCategory.name != this.updatingItemCategory?.name) {
      this.editExpenseCategory(expenseCategory);
    }
    this.updatingItemCategory.id = -1;
  }

  onRowEditCancel() {
    if (this.updatingItemCategory.id != -1) {
      this.expenseCategoryList().forEach((it : ExpenseCategory) => {
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
          this.expenseService
            .deleteExpenseCategory(expenseCategory.id)
            .subscribe({
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

  addNewExpenseCategory() {
    this.expenseService.addExpenseCategory('AA_NewExpenseCategory').subscribe({
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
          detail: error,
        });
      },
    });
  }
}
function signal<T>(arg0: never[]) {
  throw new Error('Function not implemented.');
}
