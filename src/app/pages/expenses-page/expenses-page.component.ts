import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { Expense, ExpenseToAdd } from '../../core/interfaces/expense';
import { AddExpenseComponent } from '../../core/components/add-expense/add-expense.component';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseCategory } from '../../core/interfaces/expenseCategory';
import { GlobalUtilityService } from '../../core/services/utils/global-utility.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-expenses-page',
  imports: [ImportsModule, AddExpenseComponent],
  templateUrl: './expenses-page.component.html',
  styleUrl: './expenses-page.component.css'
})
export class ExpensesPageComponent implements OnInit {
  displayAddExpenseDialog: boolean = false;
  expenseTypes: ExpenseType[] = [];
  expenseTypesString: ExpenseType[] = [];
  expenseCategories: ExpenseCategory[] = [];
  expenseCategoriesString: string[] = [];
  expenseList : Expense[] = [];
  selectedExpenseList: any[] = [];
  selectedExpense: Expense | null = null;
  contextMenuItems!: MenuItem[];

  constructor(public expenseService : ExpenseService,
    private globalUtils : GlobalUtilityService
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

  deleteExpenseList(){
    const idToDeleteList :number[]=this.selectedExpenseList.map(expense => expense.id);
    this.expenseService.deleteExpense(idToDeleteList).subscribe({
      next: () => {
        this.loadExpenses();
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  deleteExpense(): void {
    if(this.selectedExpense){
      this.expenseService.deleteExpense([this.selectedExpense.id]).subscribe({
        next: () => {
          this.loadExpenses();
          this.selectedExpense = null;
        },
        error: (error: any) => {
          console.error(error);
          this.selectedExpense = null;
        },
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