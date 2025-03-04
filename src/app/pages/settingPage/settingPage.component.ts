import { Component, OnInit } from '@angular/core';
import { AssetCategorySettingComponent } from '../../core/components/settings/assetCategorySetting/assetCategorySetting.component';
import { AssetSettingComponent } from '../../core/components/settings/assetSetting/assetSetting.component';
import { ExpenseCategorySettingComponent } from '../../core/components/settings/expenseCategorySetting/expenseCategorySetting.component';
import { ExpenseTypeSettingComponent } from '../../core/components/settings/expenseTypeSetting/expenseTypeSetting.component';
import { IncomeTypeSettingComponent } from '../../core/components/settings/incomeTypeSetting/incomeTypeSetting.component';
import { ExpenseCategory } from '../../core/interfaces/expenseCategory';
import { ExpenseType } from '../../core/interfaces/expenseType';
import { ExpenseService } from '../../core/services/expenseService/expense.service';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-settingPage',
  imports: [
    ImportsModule,
    IncomeTypeSettingComponent,
    ExpenseCategorySettingComponent,
    ExpenseTypeSettingComponent,
    AssetSettingComponent,
    AssetCategorySettingComponent,
  ],
  templateUrl: './settingPage.component.html',
  styleUrls: ['./settingPage.component.css'],
})
export class SettingPageComponent implements OnInit {
  expenseTypeList: ExpenseType[] = [];
  expenseCategoryList: ExpenseCategory[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {}

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
