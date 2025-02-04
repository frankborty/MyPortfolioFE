import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Income } from '../../../interfaces/income';
import { IncomeType } from '../../../interfaces/incomeType';
import { IncomeService } from '../../../services/incomeService/income.service';
import { OperationResult } from '../../../enum/operationResult';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GlobalUtilityService } from '../../../services/utils/global-utility.service';
import { ParamConfirmationDialogComponent } from '../../param-confirmation-dialog/param-confirmation-dialog.component';
import { EditIncomeComponent } from '../editIncome/editIncome.component';

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

  selectedYear: any;
  selectedMonth: any;

  constructor() {}

  deleteIncome(income: Income) {
    this.deleteIncomeCallBack.emit(income);
  }

  editIncome(income: Income) {
    this.editIncomeCallBack.emit(income);
  }
}
