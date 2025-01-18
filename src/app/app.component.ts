import { Component } from '@angular/core';
import { ImportsModule } from './imports';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './core/components/top-bar/top-bar.component';
import { AddExpenseComponent } from "./core/components/add-expense/add-expense.component";

@Component({
  selector: 'app-root',
  imports: [ImportsModule, RouterOutlet, TopBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyBadPortfolioSite';
}
