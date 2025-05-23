import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { Income } from '../../interfaces/income';
import { IncomeType } from '../../interfaces/incomeType';
import { GlobalUtilityService } from '../utils/global-utility.service';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  public incomeList = signal<Income[]>([]);
  public incomeTypeList = signal<IncomeType[]>([]);
  public incomeError = signal(false);
  public incomeErrorMessage = signal('');

  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private globalUtils: GlobalUtilityService
  ) {}

  //#region GET DATA
  fetchIncomeList(): void {
    this.http
      .get<Income[]>(`${this.apiUrl}/Income`, this.options)
      .pipe(
        map((incomes) =>
          incomes.map((income) => ({
            ...income,
            date: this.globalUtils.parseDateIgnoreTimezone(income.date.toString()), // Converte la stringa in Date
          }))
        ),
        catchError(this.errorHandler.handleError)
      )
      .subscribe({
        next: (data: Income[]) => {
          this.incomeList.set(
            data.sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime())
          );
        },
        error: (error: any) => {
          this.incomeError.set(true);
          this.incomeErrorMessage.set(error.message);
        },
      });
  }
  
  fetchIncomeTypeList(): void {
    this.http
      .get<IncomeType[]>(`${this.apiUrl}/IncomeType`, this.options)
      .pipe(catchError(this.errorHandler.handleError))
      .subscribe({
        next: (data: IncomeType[]) => {
          this.incomeTypeList.set(
            data.sort((a, b) => a.name.localeCompare(b.name))
          );
        },
        error: (error: any) => {
          this.incomeError.set(true);
          this.incomeErrorMessage.set(error.message);
        },
      });
  }

  
  //endregion

  //#region ADD DATA
  addIncome(incomeToAdd: Income) {
    incomeToAdd.date.setHours(12); //pessimo modo per evitare problemi di timezone
    return this.http
      .post(`${this.apiUrl}/Income`, incomeToAdd, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  addIncomeType(incomeTypeName: string) {
    const url = `${this.apiUrl}/IncomeType?incomeType=${encodeURIComponent(
      incomeTypeName
    )}`;
    return this.http
      .post(url, null, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //#region DELETE DATA
  deleteIncome(incomeIdList: number[]) {
    return this.http
      .request('delete', `${this.apiUrl}/Income/deleteList`, {
        body: incomeIdList,
        ...this.options,
      })
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteIncomeType(incomeTypeId: number) {
    const url = `${this.apiUrl}/IncomeType?incomeTypeId=${encodeURIComponent(
      incomeTypeId
    )}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //#region EDIT DATA
  editIncome(incomeId: number, incomeToUpdate: Income) {
    incomeToUpdate.date.setHours(12); //pessimo modo per evitare problemi di timezone
    return this.http
      .put(`${this.apiUrl}/Income/${incomeId}`, incomeToUpdate, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  editIncomeType(incomeTypeId: number, incomeTypeToUpdate: IncomeType) {
    return this.http
      .put(
        `${this.apiUrl}/IncomeType/${incomeTypeId}`,
        incomeTypeToUpdate,
        this.options
      )
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion
}
