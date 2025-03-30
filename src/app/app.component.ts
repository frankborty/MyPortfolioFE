import { Component } from '@angular/core';
import { ImportsModule } from './imports';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './core/components/topBar/topBar.component';
import { AssetService } from './core/services/assetService/asset.service';
import { IncomeService } from './core/services/incomeService/income.service';
import { ExpenseService } from './core/services/expenseService/expense.service';

@Component({
  selector: 'app-root',
  imports: [ImportsModule, RouterOutlet, TopBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'MyPortfolioFE';

  constructor(
    assetService: AssetService,
    incomeService: IncomeService,
    expenseService: ExpenseService
  ) {
    assetService.fetchAssetList();
    assetService.fetchAssetCategoryList();
    assetService.fetchAssetsSummaryByMonth();
    assetService.fetchAssetsUnitPriceByMonth();
    assetService.fetchAssetWithValueList();
    assetService.fetchAssetOperationList();

    incomeService.fetchIncomeTypeList();
    incomeService.fetchIncomeList();

    expenseService.fetchExpenseList();
    expenseService.fetchExpenseTypeList();
    expenseService.fetchExpenseCategoryList();
  }
}
