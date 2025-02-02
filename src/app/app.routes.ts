import { Routes } from '@angular/router';
import { AssetsPageComponent } from './pages/assets-page/assets-page.component';
import { IncomesPageComponent } from './pages/incomes-page/incomes-page.component';
import { ExpenseTotalPageComponent } from './pages/expensePages/expenseTotalPage/expenseTotalPage.component';
import { ExpenseFilterPageComponent } from './pages/expensePages/expenseFilterPage/expenseFilterPage.component';


export const routes: Routes = [
    { path: '', redirectTo: '/income', pathMatch: 'full' }, // Route di default
    { path: 'assets', component: AssetsPageComponent },
    { path: 'income', component: IncomesPageComponent },
    { path: 'expenses/total', component: ExpenseTotalPageComponent },
    { path: 'expenses/partial', component: ExpenseFilterPageComponent }
];