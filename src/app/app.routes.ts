import { Routes } from '@angular/router';
import { AssetsPageComponent } from './pages/assets-page/assets-page.component';
import { IncomesPageComponent } from './pages/incomes-page/incomes-page.component';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';


export const routes: Routes = [
    { path: 'assets', component: AssetsPageComponent },
    { path: 'income', component: IncomesPageComponent },
    { path: 'expenses', component: ExpensesPageComponent },
];