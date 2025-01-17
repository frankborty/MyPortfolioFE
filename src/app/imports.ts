import { NgModule } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        DatePickerModule,
        FormsModule,
        CalendarModule,
        InputIcon,
        IconField,
        DialogModule,
        TableModule
    ],
    exports: [
        CommonModule,
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        DatePickerModule,
        FormsModule,
        CalendarModule,
        InputIcon, 
        IconField,
        DialogModule,
        TableModule
    ],
    providers: [  ]
  })
  export class ImportsModule {}
  