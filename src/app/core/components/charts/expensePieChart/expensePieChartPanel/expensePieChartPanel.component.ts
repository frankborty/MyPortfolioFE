import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ImportsModule } from '../../../../../imports';
import { Expense } from '../../../../interfaces/expense';
import { ExpenseCategory } from '../../../../interfaces/expenseCategory';
import { ExpenseTypePieChartComponent } from '../expenseTypePieChart/expenseTypePieChart.component';
import { ExpenseCategoryPieChartComponent } from '../expenseCategoryPieChart/expenseCategoryPieChart.component';

@Component({
  selector: 'app-expensePieChartPanel',
  imports: [ImportsModule, ExpenseTypePieChartComponent, ExpenseCategoryPieChartComponent],
  templateUrl: './expensePieChartPanel.component.html',
  styleUrls: ['./expensePieChartPanel.component.css']
})
export class ExpensePieChartPanelComponent implements OnChanges {
  @Input() expenseList: Expense[] = [];
  @Input() expenseCategoryList: ExpenseCategory[] = [];

  filteredExpenseList: Expense[] = [];

  selectedYear : Date = new Date("2025-01-01");
  selectedMonth : Date = new Date("2025-01-01");
  selectedCategoryList : ExpenseCategory[] = [];

  
  constructor(private cd: ChangeDetectorRef) {}

  
  ngOnChanges(changes: SimpleChanges): void {
    // Controlla se expenseList è stato modificato
    if (changes['expenseCategoryList']) {
      this.selectedCategoryList=this.expenseCategoryList;
    }
    this.filterData();
  }

  filterData(){
    if(this.expenseList.length==0 || this.expenseCategoryList.length==0){
      return;
    }
    this.filteredExpenseList = this.expenseList;
    if(this.selectedYear){
      let selectedYearNumber = this.selectedYear.getFullYear();
      this.filteredExpenseList = this.filteredExpenseList.filter(e => (e.date as Date).getFullYear() == selectedYearNumber);
    }
    if(this.selectedMonth){
      let selectedMonthNumber = this.selectedMonth.getMonth();
      this.filteredExpenseList = this.filteredExpenseList.filter(e => (e.date as Date).getMonth() == selectedMonthNumber);
    }

    if(this.selectedCategoryList){
      let nomiCategorieSelezionate = this.selectedCategoryList.map(c => c.name);
      this.filteredExpenseList = this.filteredExpenseList.filter(e => 
        nomiCategorieSelezionate.includes(e.expenseType.category.name)
      );
    }
  }

}
