import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Income } from '../../interfaces/income';
import { IncomeType } from '../../interfaces/incomeType';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  //#region  GET DATA
  getIncomes() {
    return this.http
      .get(`${this.apiUrl}/Income`, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getIncomeTypes() {
    return this.http
      .get(`${this.apiUrl}/IncomeType`, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //endregion

  //#region ADD DATA
  addIncome(incomeToAdd: Income) {
    return this.http
      .post(`${this.apiUrl}/Income`, incomeToAdd, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  addIncomeType(incomeTypeName: string) {
    const url = `${this.apiUrl}/IncomeType?incomeType=${encodeURIComponent(incomeTypeName)}`;
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
    const url = `${this.apiUrl}/IncomeType?incomeTypeId=${encodeURIComponent(incomeTypeId)}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //#region EDIT DATA
  editIncome(incomeId: number, incomeToUpdate: Income) {
    return this.http
      .put(`${this.apiUrl}/Income/${incomeId}`, incomeToUpdate, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  editIncomeType(incomeTypeId: number, incomeTypeToUpdate: IncomeType) {
    return this.http
      .put(`${this.apiUrl}/IncomeType/${incomeTypeId}`, incomeTypeToUpdate, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion
}
