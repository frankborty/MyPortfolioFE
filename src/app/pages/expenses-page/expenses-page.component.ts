import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { Expense } from '../../core/interfaces/expense';
import { AddExpenseComponent } from '../../core/components/add-expense/add-expense.component';
import { ExpenseService } from '../../core/services/expenseService/expense.service';

@Component({
  selector: 'app-expenses-page',
  imports: [ImportsModule, AddExpenseComponent],
  templateUrl: './expenses-page.component.html',
  styleUrl: './expenses-page.component.css'
})
export class ExpensesPageComponent implements OnInit {
  displayAddExpenseDialog: boolean = false;
  expenseList : Expense[] = [];
  constructor(public expenseService : ExpenseService) { }

  ngOnInit() {
    this.expenseService.getExpenses().subscribe({
      next: (data: any) => {
        this.expenseList = data;
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