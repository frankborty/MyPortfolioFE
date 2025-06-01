import {
  ChangeDetectorRef,
  Component,
  effect,
  signal
} from '@angular/core';
import { ImportsModule } from '../../../../../imports';
import { Expense } from '../../../../interfaces/expense';
import { ExpenseCategory } from '../../../../interfaces/expenseCategory';
import { ExpenseTypePieChartComponent } from '../expenseTypePieChart/expenseTypePieChart.component';
import { ExpenseCategoryPieChartComponent } from '../expenseCategoryPieChart/expenseCategoryPieChart.component';
import { ExpenseService } from '../../../../services/expenseService/expense.service';

@Component({
  selector: 'app-expensePieChartPanel',
  imports: [
    ImportsModule,
    ExpenseTypePieChartComponent,
    ExpenseCategoryPieChartComponent,
  ],
  templateUrl: './expensePieChartPanel.component.html',
  styleUrls: ['./expensePieChartPanel.component.css'],
})
export class ExpensePieChartPanelComponent {
  public expenseList = signal<Expense[]>([]);
  public expenseCategoryList = signal<ExpenseCategory[]>([]);

  filteredExpenseList: Expense[] = [];

  selectedYear: Date = new Date();
  selectedMonth: Date = new Date();
  selectedCategoryList: ExpenseCategory[] = [];

  constructor(expenseService: ExpenseService, private cd: ChangeDetectorRef) {
    this.expenseList = expenseService.expenseList;
    this.expenseCategoryList = expenseService.expenseCategoryList;
    effect(() => {
      if (
        this.expenseList().length > 0 &&
        this.expenseCategoryList().length > 0
      ) {
        this.selectedCategoryList = this.expenseCategoryList();
        this.filterData();
      }
    });
  }

  filterData() {
    if (this.expenseList().length == 0 || this.expenseCategoryList().length == 0) {
      return;
    }
    this.filteredExpenseList = this.expenseList();
    if (this.selectedYear) {
      let selectedYearNumber = this.selectedYear.getFullYear();
      this.filteredExpenseList = this.filteredExpenseList.filter(
        (e) => (e.date as Date).getFullYear() == selectedYearNumber
      );
    }
    if (this.selectedMonth) {
      let selectedMonthNumber = this.selectedMonth.getMonth();
      this.filteredExpenseList = this.filteredExpenseList.filter(
        (e) => (e.date as Date).getMonth() == selectedMonthNumber
      );
    }

    if (this.selectedCategoryList) {
      let nomiCategorieSelezionate = this.selectedCategoryList.map(
        (c) => c.name
      );
      this.filteredExpenseList = this.filteredExpenseList.filter((e) =>
        nomiCategorieSelezionate.includes(e.expenseType.category.name)
      );
    }
  }
}
