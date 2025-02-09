import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Income } from '../../../interfaces/income';
import { IncomeType } from '../../../interfaces/incomeType';

@Component({
  selector: 'app-incomeTable',
  imports: [ImportsModule],
  templateUrl: './incomeTable.component.html',
  styleUrls: ['./incomeTable.component.css'],
})
export class IncomeTableComponent {
  @Input() incomeList: Income[] = [];
  @Input() incomeTypeList: IncomeType[] = [];
  
  @Output() editIncomeCallBack = new EventEmitter<Income>();
  @Output() deleteIncomeCallBack = new EventEmitter<Income>();

  constructor() {}

  deleteIncome(income: Income) {
    this.deleteIncomeCallBack.emit(income);
  }

  editIncome(income: Income) {
    this.editIncomeCallBack.emit(income);
  }
}
