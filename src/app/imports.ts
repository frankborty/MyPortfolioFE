import { NgModule } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        DatePickerModule,
        FormsModule,
        CalendarModule,
        InputIcon,
        IconField,
        DialogModule,
        TableModule,
        InputNumberModule,
        TextareaModule,
        SelectModule,
        SelectButtonModule,
        MultiSelectModule,
        ContextMenuModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        DatePickerModule,
        FormsModule,
        CalendarModule,
        InputIcon, 
        IconField,
        DialogModule,
        TableModule,
        InputNumberModule,
        TextareaModule,
        SelectModule,
        SelectButtonModule,
        MultiSelectModule,
        ContextMenuModule
    ],
    providers: [  ]
  })
  export class ImportsModule {}
  