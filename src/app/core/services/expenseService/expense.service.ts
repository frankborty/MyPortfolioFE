import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { catchError, tap } from 'rxjs';
import { ExpenseToAdd } from '../../interfaces/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  //#region  GET DATA
  getExpenses() {
    return this.http.get(`${this.apiUrl}/Expense`, this.options)
    .pipe(catchError(this.errorHandler.handleError)); 
  }

  getExpenseTypes() {
    return this.http.get(`${this.apiUrl}/ExpenseType`, this.options)
    .pipe(catchError(this.errorHandler.handleError)); 
  }

  getExpenseCategories() {
    return this.http.get(`${this.apiUrl}/ExpenseCategory`, this.options)
    .pipe(catchError(this.errorHandler.handleError)); 
  }

  getExpenseCategoryTypes() {
    return this.http.get(`${this.apiUrl}/categoriesAndTypes`, this.options)
    .pipe(catchError(this.errorHandler.handleError)); 
  }
  //#endregion

  //#region ADD DATA
  postExpense(expenseToAdd : ExpenseToAdd) {
    return this.http.post(`${this.apiUrl}/Expense`, expenseToAdd, this.options)
    .pipe(catchError(this.errorHandler.handleError));  
  }
  //#endregion

  //#region DELETE DATA
  deleteExpense(expenseIdList: number[]) {
    return this.http.request('delete', `${this.apiUrl}/Expense/deleteList`, {
      body: expenseIdList,
      ...this.options
    }).pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //region EDIT DATA
  editExpense(expenseId: number, expenseToAdd: ExpenseToAdd) {
    return this.http.put(`${this.apiUrl}/Expense/${expenseId}`, expenseToAdd, this.options)
    .pipe(catchError(this.errorHandler.handleError)); 
  }

  //#endregion
}
