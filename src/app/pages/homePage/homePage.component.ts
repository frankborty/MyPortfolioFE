import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ImportsModule } from '../../imports';
import { Expense } from '../../core/interfaces/expense';
import { ExpenseSummaryTableComponent } from '../../core/components/expense/expenseSummaryTable/expenseSummaryTable.component';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseTableComponent } from '../../core/components/expense/expenseTable/expenseTable.component';
import { ExpenseCategory } from '../../core/interfaces/expenseCategory';

@Component({
  selector: 'app-homePage',
  imports: [ImportsModule],
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.css'],
})
export class HomePageComponent implements OnInit {
  expenseList: Expense[] = [];
  expenseTypeList: ExpenseType[] = [];
  expenseCategoryList: ExpenseCategory[] = [];
  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenseList();
    this.loadExpenseTypeList();
    this.loadExpenseCategoryList();
  }

  loadExpenseList() {
    this.expenseService.fetchExpenseList();
  }

  loadExpenseTypeList() {
    this.expenseService.fetchExpenseTypeList();
  }

  loadExpenseCategoryList() {
    this.expenseService.fetchExpenseCategoryList();
  }
}
