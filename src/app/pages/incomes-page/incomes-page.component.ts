import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-incomes-page',
  imports: [ImportsModule],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css'
})
export class IncomesPageComponent {
  date: Date | undefined;
}
