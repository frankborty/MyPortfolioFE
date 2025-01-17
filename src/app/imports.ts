import { NgModule } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';

@NgModule({
    imports: [
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        DatePickerModule,
        FormsModule,
        CalendarModule,
        InputIcon,
        IconField
    ],
    exports: [
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        DatePickerModule,
        FormsModule,
        CalendarModule,
        InputIcon, 
        IconField
    ],
    providers: [  ]
  })
  export class ImportsModule {}
  