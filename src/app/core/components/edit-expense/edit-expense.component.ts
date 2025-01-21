import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expenseService/expense.service';
import { Expense, ExpenseToAdd } from '../../interfaces/expense';
import { ExpenseType } from '../../interfaces/expenseType';
import { SelectChangeEvent } from 'primeng/select';

@Component({
  selector: 'app-edit-expense',
  imports: [ImportsModule],
  templateUrl: './edit-expense.component.html',
  styleUrl: './edit-expense.component.css'
})
export class EditExpenseComponent implements OnInit {
  @Output() editNewExpenseCallBack = new EventEmitter<ExpenseToAdd>();

  expenseTypes: ExpenseType[] = [];
  selectedType: ExpenseType | undefined;
  editExpenseForm : FormGroup;

  constructor(private expenseService: ExpenseService) { 
    this.editExpenseForm = new FormGroup({
      expName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      expAmount: new FormControl('', [Validators.required, Validators.min(0.01)]),
      expDate: new FormControl('', Validators.required),
      expType: new FormControl('', Validators.required),
      expCategory: new FormControl('', Validators.required),
      expNote: new FormControl(''),
    });
    console.log('EditExpenseComponent constructor');
  }

  ngOnInit(): void {
    this.expenseService.getExpenseTypes().subscribe({
      next: (data: any) => {
        this.expenseTypes = data;
        if (this.expenseTypes.length > 0) {
          this.selectedType = this.expenseTypes[0];
          this.editExpenseForm.get('expType')?.setValue(this.selectedType);
          this.editExpenseForm.get('expCategory')?.setValue(this.expenseTypes[0].category.name);
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
    console.log('EditExpenseComponent ngOnInit');
  }

  setExpenseToEdit(expense: Expense){
    this.editExpenseForm.patchValue({
      expName: expense.description,
      expAmount: expense.amount,
      expDate: expense.date,
      expType: expense.expenseType,
      expCategory: expense.expenseType?.category?.name,
      expNote: expense.note
    });
  }

  changeSelectedType($event: SelectChangeEvent) {
    this.selectedType = $event.value;
    this.editExpenseForm.get('expCategory')?.setValue(this.selectedType?.category.name); 
  }

  onUserSave() {
    if(this.editExpenseForm.invalid){
      console.log('Form is invalid');
      return;
    }
    
    const formValue = this.editExpenseForm.value;
    const expenseToAdd : ExpenseToAdd= {
      description: formValue.expName,
      amount: formValue.expAmount,
      date: formValue.expDate,
      note: formValue.expNote,
      expenseType: formValue.expType.name
    };
    this.editNewExpenseCallBack.emit(expenseToAdd);
    this.editExpenseForm.reset();
  }
    
}
