import {
  Component,
  effect,
  Input,
  OnChanges,
  OnInit,
  signal,
} from '@angular/core';
import { Income } from '../../../interfaces/income';
import { IncomeType } from '../../../interfaces/incomeType';
import { ImportsModule } from '../../../../imports';
import { IncomeService } from '../../../services/incomeService/income.service';

interface IncomeTypeSummary {
  name: string;
  total: number;
  average: number;
  count: number;
  monthIncome: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  description: string;
}

@Component({
  selector: 'app-incomeSummaryTable',
  imports: [ImportsModule],
  templateUrl: './incomeSummaryTable.component.html',
  styleUrls: ['./incomeSummaryTable.component.css'],
})
export class IncomeSummaryTableComponent implements OnInit {
  incomeList = signal<Income[]>([]);
  incomeTypeList = signal<IncomeType[]>([]);

  incomeTypeSummaryList: IncomeTypeSummary[] = [];

  totalSum: number = 0;
  totalCount: number = 0;
  totalAvg: number = 0;
  totalPerMese: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  selectedYear: Date = new Date();

  constructor(incomeService: IncomeService) {
    this.incomeList = incomeService.incomeList;
    this.incomeTypeList = incomeService.incomeTypeList;

    effect(() => {
      if (this.incomeList().length > 0 && this.incomeList().length > 0) {
        this.processInputData();
      }
    });
  }

  ngOnInit() {}


  processInputData() {
    this.incomeTypeSummaryList = [];

    this.initAllValue();

    let filteredByYear = this.incomeList().filter(
      (income) =>
        new Date(income.date).getFullYear() === this.selectedYear.getFullYear()
    );

    this.initAllValue();

    filteredByYear.forEach((currentIncome) => {
      const existingItem = this.incomeTypeSummaryList.find(
        (item) => item.name === currentIncome.incomeType.name
      );
      if (existingItem) {
        this.updateIncome(existingItem, currentIncome);
      } else {
        this.addNewIncome(currentIncome);
      }
    });
    this.updateTotalValue();
  }

  initAllValue() {
    this.incomeTypeSummaryList = [];
    this.totalSum = 0;
    this.totalCount = 0;
    this.totalAvg = 0;
    this.totalPerMese = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.incomeTypeList().forEach((incomeType) => {
      const incomeToAdd: IncomeTypeSummary = {
        name: incomeType.name,
        total: 0,
        count: 0,
        average: 0,
        monthIncome: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        description: '',
      };
      this.incomeTypeSummaryList.push(incomeToAdd);
    });
  }

  addNewIncome(currentIncome: Income) {
    const monthIndex = (currentIncome.date as Date).getMonth();
    const incomeToAdd: IncomeTypeSummary = {
      name: currentIncome.incomeType.name,
      total: currentIncome.amount,
      count: 1,
      average: currentIncome.amount / 12,
      monthIncome: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      description: currentIncome.note,
    };
    incomeToAdd.monthIncome[monthIndex] = currentIncome.amount;
    this.incomeTypeSummaryList.push(incomeToAdd);
  }

  updateIncome(existingItem: IncomeTypeSummary, currentIncome: Income) {
    const monthIndex = (currentIncome.date as Date).getMonth();
    existingItem.total += currentIncome.amount;
    existingItem.count++;
    existingItem.average = existingItem.total / 12;
    existingItem.monthIncome[monthIndex] = currentIncome.amount;
    if (currentIncome.note != '') {
      existingItem.description += '; ' + currentIncome.note;
    }
  }

  initSummaryList() {
    this.totalSum = 0;
    this.totalCount = 0;
    this.totalAvg = 0;
    this.totalPerMese = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  updateTotalValue() {
    this.incomeTypeSummaryList.forEach((incomeSummary) => {
      this.totalSum += incomeSummary.total;
      this.totalCount += incomeSummary.count;
      this.totalAvg += incomeSummary.total / 12;
      for (let index = 0; index < 12; index++) {
        this.totalPerMese[index] += incomeSummary.monthIncome[index];
      }
    });
  }
}
