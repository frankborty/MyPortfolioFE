import { Component } from '@angular/core';
import { ImportsModule } from './imports';

@Component({
  selector: 'app-root',
  imports: [ImportsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyBadPortfolioSite';
  date: Date | undefined;
}
