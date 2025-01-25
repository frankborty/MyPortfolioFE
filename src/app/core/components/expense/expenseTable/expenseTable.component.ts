import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { MenuItem } from 'primeng/api';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';
import { ExpenseCategory } from '../../../interfaces/expenseCategory';

@Component({
  selector: 'app-expenseTable',
  imports: [ImportsModule],
  templateUrl: './expenseTable.component.html',
  styleUrls: ['./expenseTable.component.css']
})
export class ExpenseTableComponent implements OnInit {
  @Input() expenseList : Expense[] = [];
  @Input() expenseTypeList : ExpenseType[] = [];
  @Input() expenseCategoryList : ExpenseCategory[] = [];
  @Output() editExpenseEvent = new EventEmitter<Expense>();
  @Output() deleteExpenseEvent = new EventEmitter<Expense>();

  contextMenuItems!: MenuItem[];
  selectedExpenseList: Expense[] = [];
  selectedExpense: Expense | null = null;

  constructor(){ }

  ngOnInit() {
    this.contextMenuItems = [
      { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => this.showEditExpenseDialog() },
      { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteExpense() }
    ];
  }

  showEditExpenseDialog() {
    if (this.selectedExpense) {
      this.editExpenseEvent.emit();
    }
  }

  deleteExpense(): void {
    if (this.selectedExpense) {
      this.deleteExpenseEvent.emit();
    }
  }
}
