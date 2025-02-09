import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';
import { ExpenseCategory } from '../../../interfaces/expenseCategory';

@Component({
  selector: 'app-expenseTable',
  imports: [ImportsModule],
  templateUrl: './expenseTable.component.html',
  styleUrls: ['./expenseTable.component.css']
})

export class ExpenseTableComponent {
  @Input() expenseList: Expense[] = [];
  @Input() expenseTypeList: ExpenseType[] = [];
  @Input() expenseCategoryList: ExpenseCategory[] = [];
  
  @Output() editExpenseCallBack = new EventEmitter<Expense>();
  @Output() deleteExpenseCallBack = new EventEmitter<Expense>();

  constructor() {}

  deleteExpense(expense: Expense) {
    this.deleteExpenseCallBack.emit(expense);
  }

  editExpense(expense: Expense) {
    this.editExpenseCallBack.emit(expense);
  }
}
