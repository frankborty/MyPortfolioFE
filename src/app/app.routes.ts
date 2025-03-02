import { Routes } from '@angular/router';
import { AssetsPageComponent } from './pages/assetPages/assets-page/assets-page.component';
import { IncomesPageComponent } from './pages/incomes-page/incomes-page.component';
import { ExpenseTotalPageComponent } from './pages/expensePages/expenseTotalPage/expenseTotalPage.component';
import { ExpenseFilterPageComponent } from './pages/expensePages/expenseFilterPage/expenseFilterPage.component';
import { SettingPageComponent } from './pages/setting-page/setting-page.component';
import { FinancialAssetsPageComponent } from './pages/assetPages/financialAssets-page/financialAssets-page.component';


export const routes: Routes = [
    { path: '', redirectTo: 'assets/financial', pathMatch: 'full' }, // Route di default
    { path: 'assets', component: AssetsPageComponent },
    { path: 'assets/total', component: AssetsPageComponent },
    { path: 'assets/financial', component: FinancialAssetsPageComponent },
    { path: 'income', component: IncomesPageComponent },
    { path: 'expenses/total', component: ExpenseTotalPageComponent },
    { path: 'expenses/partial', component: ExpenseFilterPageComponent },
    { path: 'settings', component: SettingPageComponent }
];