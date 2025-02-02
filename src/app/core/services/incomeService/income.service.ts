import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  //#region  GET DATA
  getIncomes() {
    return this.http.get(`${this.apiUrl}/Income`, this.options)
    .pipe(catchError(this.errorHandler.handleError)); 
  }

  
  getIncomeTypes() {
    return this.http.get(`${this.apiUrl}/IncomeType`, this.options)
    .pipe(catchError(this.errorHandler.handleError)); 
  }
  //endregion

  //#region DELETE DATA
  deleteIncome(incomeIdList: number[]) {
    return this.http.request('delete', `${this.apiUrl}/Income/deleteList`, {
      body: incomeIdList,
      ...this.options
    }).pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion
}