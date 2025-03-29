import { Routes } from '@angular/router';
import { ExpenseTotalPageComponent } from './pages/expensePages/expenseTotalPage/expenseTotalPage.component';
import { ExpenseFilterPageComponent } from './pages/expensePages/expenseFilterPage/expenseFilterPage.component';
import { AssetsPageComponent } from './pages/assetPages/assetsPage/assetsPage.component';
import { FinancialAssetsPageComponent } from './pages/assetPages/financialAssetsPage/financialAssetsPage.component';
import { IncomesPageComponent } from './pages/incomesPage/incomesPage.component';
import { SettingPageComponent } from './pages/settingPage/settingPage.component';


export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' }, // Route di default
    { path: 'assets', component: AssetsPageComponent },
    { path: 'assets/total', component: AssetsPageComponent },
    { path: 'assets/financial', component: FinancialAssetsPageComponent },
    { path: 'income', component: IncomesPageComponent },
    { path: 'expenses/total', component: ExpenseTotalPageComponent },
    { path: 'expenses/partial', component: ExpenseFilterPageComponent },
    { path: 'settings', component: SettingPageComponent }
];