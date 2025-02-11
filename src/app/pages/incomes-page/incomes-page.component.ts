import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { IncomeService } from '../../core/services/incomeService/income.service';
import { GlobalUtilityService } from '../../core/services/utils/global-utility.service';
import { Income } from '../../core/interfaces/income';
import { IncomeType } from '../../core/interfaces/incomeType';
import { IncomeTableComponent } from '../../core/components/income/incomeTable/incomeTable.component';
import { IncomeSummaryTableComponent } from '../../core/components/income/incomeSummaryTable/incomeSummaryTable.component';
import { ParamConfirmationDialogComponent } from '../../core/components/param-confirmation-dialog/param-confirmation-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditIncomeComponent } from '../../core/components/income/editIncome/editIncome.component';
import { OperationType } from '../../core/enum/oprationType';
import { IncomeStackedBarChartComponent } from '../../core/components/charts/incomeStackedBarChart/incomeStackedBarChart.component';

@Component({
  selector: 'app-incomes-page',
  imports: [ImportsModule, IncomeTableComponent, IncomeSummaryTableComponent, 
    EditIncomeComponent, ParamConfirmationDialogComponent, IncomeStackedBarChartComponent],
  providers: [
    ConfirmationService,
    MessageService,
    ParamConfirmationDialogComponent,
  ],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css'
})
export class IncomesPageComponent implements OnInit{
  @ViewChild(ParamConfirmationDialogComponent) confirmDialog!: ParamConfirmationDialogComponent;
  @ViewChild(EditIncomeComponent) editIncomeDialog!: EditIncomeComponent;

  incomList : Income[] = [];
  incomeTypeList : IncomeType[] = [];
  displayIncomeEditPanel : boolean = false;

  constructor(private incomeService : IncomeService,
      private globalUtils : GlobalUtilityService,
      private messageService : MessageService
    ) { }

  ngOnInit(): void {
    this.loadIncomes();
    this.loadIncomeTypes();
  }
    
  loadIncomes(){
    this.incomeService.getIncomes().subscribe({
      next: (data: any) => {
        data.map((income: Income) => {
          income.date = this.globalUtils.convertStringToDate(income.date.toString());
        });
        (data as Income[]).sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());
        this.incomList=data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  loadIncomeTypes(){
    this.incomeService.getIncomeTypes().subscribe({
      next: (data: any) => {
        this.incomeTypeList = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  showAddIncomeDialog(){
    let defaultIncome : Income = {
      id: -1,
      amount: 0,
      date: new Date(),
      note: "",
      incomeType : this.incomeTypeList[0]
    }
    this.editIncomeDialog.setIncomeToEdit(defaultIncome);
    this.editIncomeDialog.setCurrentOperation(OperationType.ADD);
    this.displayIncomeEditPanel=true;
  }


  showEditIncomeDialog(income : Income){
    this.editIncomeDialog.setIncomeToEdit(income);
    this.editIncomeDialog.setCurrentOperation(OperationType.EDIT);
    this.displayIncomeEditPanel=true;
  }

  addIncome(income: Income){
    this.displayIncomeEditPanel=false;
    if(income){
      income.date=this.globalUtils.convertDateToString(income.date);
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
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Errore durante l\' aggiunta dell\'income',
          });
        },
      });
    }
  }

  editIncome(income: Income){
    this.displayIncomeEditPanel=false;
    if(income){
      income.date=this.globalUtils.convertDateToString(income.date);
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
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Errore durante la modifica dell\'income',
          });
        },
      });
    }
  }

  deleteIncome(income: Income){
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
                console.error(error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Errore durante la cancellazione dell\'income',
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
