import {
  Component,
  effect,
  EventEmitter,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Income } from '../../../interfaces/income';
import { IncomeType } from '../../../interfaces/incomeType';
import { ImportsModule } from '../../../../imports';
import { IncomeService } from '../../../services/incomeService/income.service';
import { OperationType } from '../../../enum/operationType';

import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeIt); // Registra il locale italiano

@Component({
  selector: 'app-editIncome',
  imports: [ImportsModule],
  templateUrl: './editIncome.component.html',
  styleUrls: ['./editIncome.component.css'],
})
export class EditIncomeComponent implements OnInit {
  @Output() editIncomeCallBack = new EventEmitter<Income>();
  @Output() addIncomeCallBack = new EventEmitter<Income>();
  public incomeTypeList = signal<IncomeType[]>([]);
  selectedIncomeType: IncomeType | undefined;
  editIncomeForm: FormGroup;
  currentIncomeId: number = -1;
  currentOperation: OperationType = OperationType.EDIT;

  constructor(private incomeService: IncomeService) {
    this.incomeTypeList = this.incomeService.incomeTypeList;

    effect(() => {
      if (this.incomeTypeList().length > 0) {
        this.selectedIncomeType = this.incomeTypeList()[0];
        this.editIncomeForm.get('expType')?.setValue(this.selectedIncomeType); //CHECK: non ho quel campo!
      }
    });

    this.editIncomeForm = new FormGroup({
      incType: new FormControl('', Validators.required),
      incAmount: new FormControl('', [
        Validators.required,
        Validators.min(0.01),
      ]),
      incDate: new FormControl('', Validators.required),
      incNote: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  setCurrentOperation(opType: OperationType) {
    this.currentOperation = opType;
  }

  setIncomeToEdit(income: Income) {
    this.currentIncomeId = income.id;
    this.editIncomeForm.patchValue({
      incType: income.incomeType,
      incAmount: income.amount,
      incDate: income.date,
      incNote: income.note,
    });
  }

  onUserSave() {
    if (this.editIncomeForm.invalid) {
      return;
    }
    const formValue = this.editIncomeForm.value;
    const workItem: Income = {
      id: this.currentIncomeId,
      incomeType: formValue.incType,
      amount: formValue.incAmount,
      date: formValue.incDate,
      note: formValue.incNote,
    };
    this.editIncomeForm.reset();
    if (this.currentOperation == OperationType.EDIT) {
      this.editIncomeCallBack.emit(workItem);
    } else {
      this.addIncomeCallBack.emit(workItem);
    }
  }
}
