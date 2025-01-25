import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { Expense, ExpenseToAdd } from '../../core/interfaces/expense';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseCategory } from '../../core/interfaces/expenseCategory';
import { GlobalUtilityService } from '../../core/services/utils/global-utility.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ParamConfirmationDialogComponent } from '../../core/components/param-confirmation-dialog/param-confirmation-dialog.component';
import { OperationResult } from '../../core/enum/operationResult';
import { EditExpenseComponent } from '../../core/components/expense/edit-expense/edit-expense.component';
import { Nullable } from 'primeng/ts-helpers';
import { ExpenseTableComponent } from '../../core/components/expense/expenseTable/expenseTable.component';
import { AddExpenseComponent } from '../../core/components/expense/add-expense/add-expense.component';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ExpenseTotalLinearChartComponent } from '../../core/components/charts/expenseTotalLinearChart/expenseTotalLinearChart.component';

registerLocaleData(localeIt); // Registra il locale italiano

@Component({
  selector: 'app-expenses-page',
  imports: [ExpenseTableComponent, ImportsModule, 
    AddExpenseComponent, EditExpenseComponent, 
    ParamConfirmationDialogComponent, ExpenseTotalLinearChartComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './expenses-page.component.html',
  styleUrl: './expenses-page.component.css'
})
export class ExpensesPageComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent) confirmDialog!: ParamConfirmationDialogComponent;
  @ViewChild(EditExpenseComponent) editExpenseDialog!: EditExpenseComponent;
  @ViewChild(ExpenseTableComponent) expenseTable!: ExpenseTableComponent;

  displayAddExpenseDialog: boolean = false;
  displayEditExpenseDialog: boolean = false;
  expenseTypes: ExpenseType[] = [];
  expenseCategories: ExpenseCategory[] = [];
  originalExpenseList : Expense[] = [];
  filteredExpenseList : Expense[] = [];

  selectedYear : Date | Nullable = new Date();
  selectedMonth : Date | Nullable = new Date();
  totalMoneySpentString: string = '';

  constructor(private expenseService : ExpenseService,
    private globalUtils : GlobalUtilityService,
    private messageService : MessageService
  ) { }

  ngOnInit() {
    this.loadExpenses();
    this.loadExpenseTypes();
    this.loadExpenseCategories();
  }
  

  loadExpenses(){
    this.expenseService.getExpenses().subscribe({
      next: (data: any) => {
        this.originalExpenseList = data;
        this.originalExpenseList.map((expense: Expense) => {
          expense.date = this.globalUtils.convertStringToDate(expense.date.toString());
        });
        this.filterExpenses();
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
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  //#region Add Expense
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

  showAddExpenseDialog(){
    this.displayAddExpenseDialog = true ;
  }

  hideAddExpenseDialog(){
    this.displayAddExpenseDialog = false;
  }
  //#endregion

  //#region Delete Expense
  deleteExpenseList(): void {
   this.confirmDialog.confirmDelete("Sei sicuro di cancellare le spese selezionate?").then((confirmed) => {
      if (confirmed) {
        const expenseIds = this.expenseTable.selectedExpenseList.map(expense => expense.id);
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
    if (this.expenseTable?.selectedExpense) {
      const expenseId = this.expenseTable.selectedExpense.id;
      this.confirmDialog.confirmDelete("Sei sicuro di cancellare la spesa selezionata?").then((confirmed) => {
        if (confirmed) {
          this.expenseService.deleteExpense([expenseId]).subscribe({
            next: () => {
              this.loadExpenses();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Spesa cancellata con successo' });
            },
            error: (error: any) => {
              console.error(error)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Errore durante la cancellazione della spesa' });
            }
          });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Cancellazione annullata' });
        }
      });
    }
  }

  //#endregion
  
  //#region Edit Expense
  showEditExpenseDialog(){
    if(this.expenseTable?.selectedExpense){
      const expenseId = this.expenseTable.selectedExpense.id;
      const expense = this.originalExpenseList.find(expense => expense.id === expenseId);
      if(expense){
        this.editExpenseDialog.setExpenseToEdit(expense);
        this.displayEditExpenseDialog = true;
      }
    }
  }

  hideEditExpenseDialog(){
    this.displayEditExpenseDialog = false;
  }

  editNewExpense(expenseToAdd: ExpenseToAdd){
    if(expenseToAdd){
      const expenseId = this.expenseTable.selectedExpense!.id;
      expenseToAdd.date=this.globalUtils.convertDateToString(expenseToAdd.date);
      this.expenseService.editExpense(expenseId, expenseToAdd).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
    else
    {
      console.error('No expense selected to edit');
    }
    this.hideEditExpenseDialog();
  }
//#endregion
  
  //#region Filters
  filterExpenses() {
    if(this.selectedYear){
      this.filterYear();  
        this.filterMonth();
        if (this.selectedMonth) {
          this.selectedMonth = new Date(this.selectedMonth.setFullYear(this.selectedYear.getFullYear()));
        }
    }
    else{
      this.filteredExpenseList = this.originalExpenseList;
      this.selectedMonth = null;
    }
    let totalMoneySpent = 0;
    for (let i = 0; i < this.filteredExpenseList.length; i++) {
      totalMoneySpent += this.filteredExpenseList[i].amount;
    }
    this.totalMoneySpentString = totalMoneySpent.toFixed(2)+' €';
  }

  filterYear() {
    this.filteredExpenseList = this.originalExpenseList.filter((expense: Expense) => {
      if(expense.date instanceof Date){
        return expense.date.getFullYear() === this.selectedYear?.getFullYear();
      }
      return false;
    });
  }

  filterMonth() { 
    if(this.selectedMonth){
      this.filteredExpenseList = this.filteredExpenseList.filter((expense: Expense) => {
        if(expense.date instanceof Date){
          return expense.date.getMonth() === this.selectedMonth?.getMonth();
        }
        return false;
      });
    }
  }

  cleanTableSelection() {
    this.expenseTable.selectedExpenseList = [];
  }
  //#endregion
    
}