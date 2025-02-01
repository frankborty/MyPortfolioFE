import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { IncomeService } from '../../core/services/incomeService/income.service';
import { GlobalUtilityService } from '../../core/services/utils/global-utility.service';
import { Income } from '../../core/interfaces/income';
import { IncomeType } from '../../core/interfaces/incomeType';
import { IncomeTableComponent } from '../../core/components/income/incomeTable/incomeTable.component';
import { IncomeSummaryTableComponent } from '../../core/components/income/incomeSummaryTable/incomeSummaryTable.component';

@Component({
  selector: 'app-incomes-page',
  imports: [ImportsModule, IncomeTableComponent, IncomeSummaryTableComponent],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css'
})
export class IncomesPageComponent implements OnInit{
  incomList : Income[] = [];
  incomTypeList : IncomeType[] = [];

  constructor(private incomeService : IncomeService,
      private globalUtils : GlobalUtilityService,
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
        this.incomTypeList = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}
