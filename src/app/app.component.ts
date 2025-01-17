import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';


@Component({
  selector: 'app-root',
  imports: [ButtonModule, FloatLabelModule, InputTextModule, DatePickerModule, FormsModule, CalendarModule, InputIcon, IconField, InputTextModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyBadPortfolioSite';
  date: Date | undefined;
}
