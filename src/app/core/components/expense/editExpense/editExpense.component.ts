import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImportsModule } from '../../../../imports';
import { OperationType } from '../../../enum/oprationType';
import { Expense } from '../../../interfaces/expense';
import { ExpenseType } from '../../../interfaces/expenseType';
import { ExpenseService } from '../../../services/expenseService/expense.service';
import { SelectChangeEvent } from 'primeng/select';

@Component({
  selector: 'app-editExpense',
  imports: [ImportsModule],
  templateUrl: './editExpense.component.html',
  styleUrls: ['./editExpense.component.css']
})
export class EditExpenseComponent implements OnInit {
  @Output() editExpenseCallBack = new EventEmitter<Expense>();
  @Output() addExpenseCallBack = new EventEmitter<Expense>();

  expenseTypeList : ExpenseType[] = [];
  selectedExpenseType: ExpenseType | undefined;
  editExpenseForm : FormGroup;
  currentExpenseId : number = -1;
  currentOperation : OperationType = OperationType.EDIT;

  constructor(private expenseService : ExpenseService) { 
    this.editExpenseForm = new FormGroup({
      expDescription: new FormControl('', [Validators.required, Validators.minLength(3)]),
      expAmount: new FormControl('', [Validators.required, Validators.min(0.01)]),
      expDate: new FormControl('', Validators.required),
      expType: new FormControl('', Validators.required),
      expCategory: new FormControl('', Validators.required),
      expNote: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.expenseService.getExpenseTypes().subscribe({
      next: (data: any) => {
        this.expenseTypeList = data;
        if (this.expenseTypeList.length > 0) {
          this.selectedExpenseType = this.expenseTypeList[0];
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  changeSelectedType($event: SelectChangeEvent) {    
    let expenseCategory = ($event.value as ExpenseType).category;
    this.editExpenseForm.get('expCategory')?.setValue(expenseCategory.name); 
  }

  setCurrentOperation(opType : OperationType){
    this.currentOperation = opType;
  }

  setExpenseToEdit(expense: Expense){
    this.currentExpenseId = expense.id;
    this.editExpenseForm.patchValue({
      expDescription: expense.description,
      expAmount: expense.amount.toLocaleString("it-IT"), //non dovrebbe essere necessario ma sennò non gestisce i decimali
      expDate: expense.date,
      expType: expense.expenseType,
      expCategory: expense.expenseType.category.name,
      expNote: expense.note
    });
  }


  onUserSave() {
    if(this.editExpenseForm.invalid){
      console.log('Form is invalid');
      return;
    }
    const formValue = this.editExpenseForm.value;
    const workItem : Expense = {
      id : this.currentExpenseId,
      description: formValue.expDescription,
      amount: formValue.expAmount,
      date: formValue.expDate,
      note: formValue.expNote,
      expenseType: formValue.expType,
    };

    this.editExpenseForm.reset();
    if(this.currentOperation==OperationType.EDIT){
      this.editExpenseCallBack.emit(workItem);   
    }
    else{
      this.addExpenseCallBack.emit(workItem)
    } 
  }
}
