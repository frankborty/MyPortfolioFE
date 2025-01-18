import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { Expense } from '../../core/interfaces/expense';
import { AddExpenseComponent } from '../../core/components/add-expense/add-expense.component';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseCategory, ExpenseCategoryAndTypes } from '../../core/interfaces/expenseCategory';

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
  constructor(public expenseService : ExpenseService) { }

  ngOnInit() {
    this.loadExpenses();
    this.loadExpenseTypes();
    this.loadExpenseCategories();
  }

  loadExpenses(){
    this.expenseService.getExpenses().subscribe({
      next: (data: any) => {
        this.expenseList = data;
        this.expenseList.map((expense: Expense) => {
          expense.date = new Date(expense.date);
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

  showAddExpenseDialog(){
    this.displayAddExpenseDialog = true;
  }
}