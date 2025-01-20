import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { Expense, ExpenseToAdd } from '../../core/interfaces/expense';
import { AddExpenseComponent } from '../../core/components/add-expense/add-expense.component';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseCategory } from '../../core/interfaces/expenseCategory';
import { GlobalUtilityService } from '../../core/services/utils/global-utility.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ParamConfirmationDialogComponent } from '../../core/components/param-confirmation-dialog/param-confirmation-dialog.component';
import { OperationResult } from '../../core/enum/operationResult';

@Component({
  selector: 'app-expenses-page',
  imports: [ImportsModule, AddExpenseComponent, ParamConfirmationDialogComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './expenses-page.component.html',
  styleUrl: './expenses-page.component.css'
})
export class ExpensesPageComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent) confirmDialog!: ParamConfirmationDialogComponent;

  displayAddExpenseDialog: boolean = false;
  expenseTypes: ExpenseType[] = [];
  expenseTypesString: ExpenseType[] = [];
  expenseCategories: ExpenseCategory[] = [];
  expenseCategoriesString: string[] = [];
  expenseList : Expense[] = [];
  selectedExpenseList: any[] = [];
  selectedExpense: Expense | null = null;
  contextMenuItems!: MenuItem[];

  constructor(private expenseService : ExpenseService,
    private globalUtils : GlobalUtilityService,
    private messageService : MessageService
  ) { }

  ngOnInit() {
    this.loadExpenses();
    this.loadExpenseTypes();
    this.loadExpenseCategories();
    this.contextMenuItems = [
      { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => this.editExpense() },
      { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteExpense() }
  ];
  }
  

  loadExpenses(){
    this.selectedExpenseList=[];
    this.expenseService.getExpenses().subscribe({
      next: (data: any) => {
        this.expenseList = data;
        this.expenseList.map((expense: Expense) => {
          expense.date = this.globalUtils.convertStringToDate(expense.date.toString());
        });
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  loadExpenseTypes(){
    this.expenseService.getExpenseTypes().subscribe({
      next: (data: any) => {
        this.expenseTypes = data;
        this.expenseTypesString = data.map((expenseType: ExpenseType) => {
          return expenseType.name;
        });
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  loadExpenseCategories(){
    this.expenseService.getExpenseCategories().subscribe({
      next: (data: any) => {
        this.expenseCategories = data;
        this.expenseCategoriesString = data.map((expenseCategory: ExpenseCategory) => {
          return expenseCategory.name;
        });
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  addNewExpense(expenseToAdd: ExpenseToAdd){
    expenseToAdd.date=this.globalUtils.convertDateToString(expenseToAdd.date);
    this.expenseService.postExpense(expenseToAdd).subscribe({
      next: () => {
        this.loadExpenses();
      },
      error: (error: any) => {
        console.error(error);
      },
    });
    this.hideAddExpenseDialog();
  }

  deleteExpenseList(): void {
    this.confirmDialog.confirmDelete("Sei sicuro di cancellare le spese selezionate?").then((confirmed) => {
      if (confirmed) {
        const expenseIds = this.selectedExpenseList.map(expense => expense.id);
        this.expenseService.deleteExpense(expenseIds).subscribe({
          next: () => {
            this.globalUtils.showOperationResult(this.messageService, OperationResult.OK, "Spese cancellate con successo");
            this.loadExpenses();
          },
          error: (error: any) => {
            this.globalUtils.showOperationResult(this.messageService, OperationResult.OK, 'Errore durante la cancellazione delle spese: '+error);
          }
        });
      } else {
        this.globalUtils.showOperationResult(this.messageService, OperationResult.INFO, 'Cancellazione annullata');
      }
    });
  }


  deleteExpense(): void {
    if (this.selectedExpense) {
      this.confirmDialog.confirmDelete("Sei sicuro di cancellare la spesa selezionata?").then((confirmed) => {
        if (confirmed) {
          this.expenseService.deleteExpense([this.selectedExpense!.id]).subscribe({
            next: () => {
              this.loadExpenses();
              this.selectedExpense = null;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Spesa cancellata con successo' });
            },
            error: (error: any) => {
              console.error(error);
              this.selectedExpense = null;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Errore durante la cancellazione della spesa' });
            }
          });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Cancellazione annullata' });
        }
      });
    }
  }


  editExpense(): void {
    throw new Error('Method not implemented.');
  }

  showAddExpenseDialog(){
    this.displayAddExpenseDialog = true;
  }

  hideAddExpenseDialog(){
    this.displayAddExpenseDialog = false;
  }
}