import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';
import { ExpenseCategory } from '../../../interfaces/expenseCategory';
import { ExpenseService } from '../../../services/expenseService/expense.service';

@Component({
  selector: 'app-expenseTable',
  imports: [ImportsModule],
  templateUrl: './expenseTable.component.html',
  styleUrls: ['./expenseTable.component.css'],
})
export class ExpenseTableComponent {
  public expenseList = signal<Expense[]>([]);
  public expenseTypeList = signal<ExpenseType[]>([]);
  public expenseCategoryList = signal<ExpenseCategory[]>([]);

  @Output() editExpenseCallBack = new EventEmitter<Expense>();
  @Output() deleteExpenseCallBack = new EventEmitter<Expense>();

  constructor(expenseService: ExpenseService) {
    this.expenseList = expenseService.expenseList;
    this.expenseTypeList = expenseService.expenseTypeList;
    this.expenseCategoryList = expenseService.expenseCategoryList;
  }

  deleteExpense(expense: Expense) {
    this.deleteExpenseCallBack.emit(expense);
  }

  editExpense(expense: Expense) {
    this.editExpenseCallBack.emit(expense);
  }
}
