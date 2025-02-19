import { Component, OnInit } from '@angular/core';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseCategory } from '../../core/interfaces/expenseCategory';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ImportsModule } from '../../imports';
import { IncomeTypeSettingComponent } from '../../core/components/settings/incomeTypeSetting/incomeTypeSetting.component';
import { ExpenseCategorySettingComponent } from '../../core/components/settings/expenseCategorySetting/expenseCategorySetting.component';
import { ExpenseTypeSettingComponent } from '../../core/components/settings/expenseTypeSetting/expenseTypeSetting.component';

@Component({
  selector: 'app-settting-page',
  imports: [ImportsModule, IncomeTypeSettingComponent, ExpenseCategorySettingComponent, ExpenseTypeSettingComponent],
  templateUrl: './settting-page.component.html',
  styleUrls: ['./settting-page.component.css']
})
export class SetttingPageComponent implements OnInit {
  expenseTypeList : ExpenseType[]=[];
  expenseCategoryList: ExpenseCategory[]=[];

  constructor(private expenseService: ExpenseService
  ) { }

  ngOnInit() {
  }

  loadExpenseTypes() {
    this.expenseService.getExpenseTypes().subscribe({
      next: (data: any) => {
        this.expenseTypeList = data;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  loadExpenseCategories() {
    this.expenseService.getExpenseCategories().subscribe({
      next: (data: any) => {
        this.expenseCategoryList = data;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
