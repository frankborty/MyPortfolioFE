import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Income } from '../../../interfaces/income';
import { IncomeType } from '../../../interfaces/incomeType';
import { IncomeService } from '../../../services/incomeService/income.service';

@Component({
  selector: 'app-incomeTable',
  imports: [ImportsModule],
  templateUrl: './incomeTable.component.html',
  styleUrls: ['./incomeTable.component.css'],
})
export class IncomeTableComponent {
  incomeList: any;
  incomeTypeList: any;
  
  @Output() editIncomeCallBack = new EventEmitter<Income>();
  @Output() deleteIncomeCallBack = new EventEmitter<Income>();

  constructor(incomeService : IncomeService) {
    this.incomeList = incomeService.incomeList;
    this.incomeTypeList = incomeService.incomeTypeList;
  }

  deleteIncome(income: Income) {
    this.deleteIncomeCallBack.emit(income);
  }

  editIncome(income: Income) {
    this.editIncomeCallBack.emit(income);
  }
}
