import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IncomeStackedBarChartComponent } from '../../core/components/charts/incomeStackedBarChart/incomeStackedBarChart.component';
import { EditIncomeComponent } from '../../core/components/income/editIncome/editIncome.component';
import { IncomeSummaryTableComponent } from '../../core/components/income/incomeSummaryTable/incomeSummaryTable.component';
import { IncomeTableComponent } from '../../core/components/income/incomeTable/incomeTable.component';
import { OperationType } from '../../core/enum/operationType';
import { Income } from '../../core/interfaces/income';
import { IncomeType } from '../../core/interfaces/incomeType';
import { IncomeService } from '../../core/services/incomeService/income.service';
import { GlobalUtilityService } from '../../core/services/utils/global-utility.service';
import { ImportsModule } from '../../imports';
import { ParamConfirmationDialogComponent } from '../../core/components/paramConfirmationDialog/paramConfirmationDialog.component';

@Component({
  selector: 'app-incomesPage',
  imports: [
    ImportsModule,
    IncomeTableComponent,
    IncomeSummaryTableComponent,
    EditIncomeComponent,
    ParamConfirmationDialogComponent,
    IncomeStackedBarChartComponent,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    ParamConfirmationDialogComponent,
  ],
  templateUrl: './incomesPage.component.html',
  styleUrls: ['./incomesPage.component.css'],
})
export class IncomesPageComponent implements OnInit {
  @ViewChild(ParamConfirmationDialogComponent)
  confirmDialog!: ParamConfirmationDialogComponent;
  @ViewChild(EditIncomeComponent) editIncomeDialog!: EditIncomeComponent;

  displayIncomeEditPanel: boolean = false;

  constructor(
    private incomeService: IncomeService,
    private globalUtils: GlobalUtilityService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
  }

  loadIncomes() {
    this.incomeService.fetchIncomeList();    
  }

  loadIncomeTypes() {
    this.incomeService.fetchIncomeTypeList();
  }

  showAddIncomeDialog() {
    let defaultIncome: Income = {
      id: -1,
      amount: 0,
      date: new Date(),
      note: '',
      incomeType: this.incomeService.incomeTypeList()[0],
    };
    this.editIncomeDialog.setIncomeToEdit(defaultIncome);
    this.editIncomeDialog.setCurrentOperation(OperationType.ADD);
    this.displayIncomeEditPanel = true;
  }

  showEditIncomeDialog(income: Income) {
    this.editIncomeDialog.setIncomeToEdit(income);
    this.editIncomeDialog.setCurrentOperation(OperationType.EDIT);
    this.displayIncomeEditPanel = true;
  }

  addIncome(income: Income) {
    this.displayIncomeEditPanel = false;
    if (income) {
      this.incomeService.addIncome(income).subscribe({
        next: () => {
          this.loadIncomes();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Income aggiunta con successo',
          });
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
      });
    }
  }

  editIncome(income: Income) {
    this.displayIncomeEditPanel = false;
    if (income) {
      this.incomeService.editIncome(income.id, income).subscribe({
        next: () => {
          this.loadIncomes();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Income modificata con successo',
          });
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
      });
    }
  }

  deleteIncome(income: Income) {
    if (income) {
      this.confirmDialog
        .confirmDelete(
          "Sei sicuro di cancellare l'entrata " +
            income.incomeType.name +
            ' (' +
            income.amount +
            '€ | ' +
            this.globalUtils.convertDateToItaString(income.date) +
            ')?'
        )
        .then((confirmed) => {
          if (confirmed) {
            this.incomeService.deleteIncome([income.id]).subscribe({
              next: () => {
                this.loadIncomes();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Income cancellata con successo',
                });
              },
              error: (error: any) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error,
                });
              },
            });
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Cancelled',
              detail: 'Cancellazione annullata',
            });
          }
        });
    }
  }
}
