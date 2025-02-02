import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Income } from '../../../interfaces/income';
import { IncomeType } from '../../../interfaces/incomeType';
import { IncomeService } from '../../../services/incomeService/income.service';
import { OperationResult } from '../../../enum/operationResult';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GlobalUtilityService } from '../../../services/utils/global-utility.service';
import { ParamConfirmationDialogComponent } from '../../param-confirmation-dialog/param-confirmation-dialog.component';

@Component({
  selector: 'app-incomeTable',
  imports: [ImportsModule, ParamConfirmationDialogComponent],
  providers: [ConfirmationService, MessageService, ParamConfirmationDialogComponent],
  templateUrl: './incomeTable.component.html',
  styleUrls: ['./incomeTable.component.css'],
})
export class IncomeTableComponent {
  @Input() incomeList: Income[] = [];
  @Input() incomeTypeList: IncomeType[] = [];
  
  @Output() reloadIncomeList = new EventEmitter();

  @ViewChild(ParamConfirmationDialogComponent) confirmDialog!: ParamConfirmationDialogComponent;
  
  selectedYear: any;
  selectedMonth: any;
  constructor(private incomeService: IncomeService,
      private globalUtils : GlobalUtilityService,
      private messageService : MessageService) {}


  deleteIncome(income: Income){
    if (income) {
      this.confirmDialog.confirmDelete("Sei sicuro di cancellare l'entrata "+income.incomeType.name+
        " ("+ income.amount+"€ | "+ this.globalUtils.convertDateToItaString(income.date)+")?").then((confirmed) => {
        if (confirmed) {
          this.incomeService.deleteIncome([-1]).subscribe({
            next: () => {
              this.reloadIncomeList.emit();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Spesa cancellata con successo' });
            },
            error: (error: any) => {
              console.error(error)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Errore durante la cancellazione della spesa' });
            }
          });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Cancellazione annullata' });
        }
      });
    }
  }

  editIncome(income: Income){
    
  }
}
