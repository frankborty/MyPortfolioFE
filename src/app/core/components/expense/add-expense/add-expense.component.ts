import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expenseService/expense.service';
import { ExpenseToAdd } from '../../../interfaces/expense';
import { SelectChangeEvent } from 'primeng/select';
import { ExpenseType } from '../../../interfaces/expenseType';

@Component({
  selector: 'app-add-expense',
  imports: [ImportsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent implements OnInit {
  @Output() addNewExpenseCallBack = new EventEmitter<ExpenseToAdd>();

  expenseTypes: ExpenseType[] = [];
  selectedType: ExpenseType | undefined;
  addForm : FormGroup;

  constructor(private expenseService: ExpenseService) { 
    this.addForm = new FormGroup({
      expName: new FormControl('PPP', [Validators.required, Validators.minLength(3)]),
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
          this.addForm.get('expType')?.setValue(this.selectedType);
          this.addForm.get('expCategory')?.setValue(this.expenseTypes[0].category.name);
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  changeSelectedType($event: SelectChangeEvent) {
    this.selectedType = $event.value;
    this.addForm.get('expCategory')?.setValue(this.selectedType?.category.name); 
  }

  onUserSave() {
    if(this.addForm.invalid){
      console.log('Form is invalid');
    }
    
    const formValue = this.addForm.value;
    const expenseToAdd : ExpenseToAdd= {
      description: formValue.expName,
      amount: formValue.expAmount,
      date: formValue.expDate,
      note: formValue.expNote,
      expenseType: formValue.expType.name
    };
    this.addNewExpenseCallBack.emit(expenseToAdd);
    this.addForm.reset();
  }
    
}
