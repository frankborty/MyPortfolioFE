import { Component, OnInit } from '@angular/core';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseCategory } from '../../core/interfaces/expenseCategory';
import { AssetSettingComponent } from '../../core/components/settings/assetSetting/assetSetting.component';
import { ExpenseCategorySettingComponent } from '../../core/components/settings/expenseCategorySetting/expenseCategorySetting.component';
import { ExpenseTypeSettingComponent } from '../../core/components/settings/expenseTypeSetting/expenseTypeSetting.component';
import { IncomeTypeSettingComponent } from '../../core/components/settings/incomeTypeSetting/incomeTypeSetting.component';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ImportsModule } from '../../imports';
import { AssetCategorySettingComponent } from '../../core/components/settings/assetCategorySetting/assetCategorySetting.component';

@Component({
  selector: 'app-setting-page',
  imports: [ImportsModule, IncomeTypeSettingComponent, ExpenseCategorySettingComponent, ExpenseTypeSettingComponent, AssetSettingComponent, AssetCategorySettingComponent],
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {
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
