import { Component } from '@angular/core';
import { ImportsModule } from './imports';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './core/components/topBar/topBar.component';

@Component({
  selector: 'app-root',
  imports: [ImportsModule, RouterOutlet, TopBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyPortfolioFE';
}
