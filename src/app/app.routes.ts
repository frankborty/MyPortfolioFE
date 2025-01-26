import { Routes } from '@angular/router';
import { AssetsPageComponent } from './pages/assets-page/assets-page.component';
import { IncomesPageComponent } from './pages/incomes-page/incomes-page.component';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
import { ExpenseTotalPageComponent } from './pages/expensePages/expenseTotalPage/expenseTotalPage.component';
import { ExpenseFilterPageComponent } from './pages/expensePages/expenseFilterPage/expenseFilterPage.component';


export const routes: Routes = [
    { path: 'assets', component: AssetsPageComponent },
    { path: 'income', component: IncomesPageComponent },
    { path: 'expenses', component: ExpensesPageComponent },
    { path: 'expenses/total', component: ExpenseTotalPageComponent },
    { path: 'expenses/partial', component: ExpenseFilterPageComponent }
];