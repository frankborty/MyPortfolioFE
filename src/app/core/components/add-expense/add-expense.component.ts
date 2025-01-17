import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../../interfaces/expense';
import { ImportsModule } from '../../../imports';

@Component({
  selector: 'app-add-expense',
  imports: [ImportsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {
  private expense: Expense | undefined;

  constructor() { }

  
    
}
