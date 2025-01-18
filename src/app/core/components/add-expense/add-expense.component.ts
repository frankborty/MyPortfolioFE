import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expenseService/expense.service';
import { Expense } from '../../interfaces/expense';
import { ExpenseType } from '../../interfaces/expenseType';
import { SelectChangeEvent } from 'primeng/select';

@Component({
  selector: 'app-add-expense',
  imports: [ImportsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent implements OnInit {

  expenseTypes: ExpenseType[] = [];
  selectedType: ExpenseType | undefined;
  testForm : FormGroup;

  constructor(private expenseService: ExpenseService) { 
    this.testForm = new FormGroup({
      expName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      expAmount: new FormControl('', [Validators.required, Validators.min(0.01)]),
      expDate: new FormControl(new Date(), Validators.required),
      expType: new FormControl(this.selectedType, Validators.required),
      expCategory: new FormControl(this.selectedType?.category.name, Validators.required),
      expNote: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.expenseService.getExpenseTypes().subscribe({
      next: (data: any) => {
        this.expenseTypes = data;
        if (this.expenseTypes.length > 0) {
          this.selectedType = this.expenseTypes[0];
          this.testForm.get('expType')?.setValue(this.selectedType);
          this.testForm.get('expCategory')?.setValue(this.expenseTypes[0].category.name);
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  changeSelectedType($event: SelectChangeEvent) {
    this.selectedType = $event.value;
    this.testForm.get('expCategory')?.setValue(this.selectedType?.category.name); 
  }

  onUserSave() {
    const formValue = this.testForm.value;
    if(this.testForm.valid) {
      console.log(formValue);
    }
  }
    
}
