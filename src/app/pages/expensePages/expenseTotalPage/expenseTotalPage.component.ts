import { Component, OnInit } from '@angular/core';
import { ExpenseTotalLinearChartComponent } from '../../../core/components/charts/expenseTotalLinearChart/expenseTotalLinearChart.component';
import { ExpenseTotalTypeBarChartComponent } from '../../../core/components/charts/expenseTotalTypeBarChart/expenseTotalTypeBarChart.component';
import { ExpenseSummaryTableComponent } from '../../../core/components/expense/expenseSummaryTable/expenseSummaryTable.component';
import { Expense } from '../../../core/interfaces/expense';
import { ExpenseCategory } from '../../../core/interfaces/expenseCategory';
import { ExpenseType } from '../../../core/interfaces/expenseType';
import { ExpenseService } from '../../../core/services/expenseService/expense.service';
import { GlobalUtilityService } from '../../../core/services/utils/global-utility.service';
import { ImportsModule } from '../../../imports';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt); // Registra il locale italiano

@Component({
  selector: 'app-expenseTotalPage',
  imports: [ImportsModule, ExpenseTotalLinearChartComponent,
      ExpenseTotalTypeBarChartComponent, ExpenseSummaryTableComponent],
  templateUrl: './expenseTotalPage.component.html',
  styleUrls: ['./expenseTotalPage.component.css']
})
export class ExpenseTotalPageComponent implements OnInit {
  originalExpenseList : Expense[] = [];
  expenseTypes: ExpenseType[] = [];
  expenseCategories: ExpenseCategory[] = [];

  constructor(private expenseService : ExpenseService,
    private globalUtils : GlobalUtilityService,
  ) { }

  ngOnInit() {
    this.loadExpenses();
    this.loadExpenseTypes();
    this.loadExpenseCategories();
  }
  
  loadExpenses(){
    this.expenseService.getExpenses().subscribe({
      next: (data: Expense[]) => {
        this.originalExpenseList = data;
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
}