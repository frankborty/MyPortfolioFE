import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Expense, ExpenseToEdit } from '../../interfaces/expense';
import { ExpenseCategory } from '../../interfaces/expenseCategory';
import { ExpenseType } from '../../interfaces/expenseType';
import { GlobalUtilityService } from '../utils/global-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  public expenseCategoryList = signal<ExpenseCategory[]>([]);
  public expenseTypeList = signal<ExpenseType[]>([]);
  public expenseList = signal<Expense[]>([]);
  public expenseError = signal(false);
  public expenseErrorMessage = signal('');

  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private globalUtils: GlobalUtilityService
  ) {}

  //#region  GET DATA
  fetchExpenseCategoryList(): void {
    this.http
      .get<ExpenseCategory[]>(`${this.apiUrl}/ExpenseCategory`, this.options)
      .pipe(catchError(this.errorHandler.handleError))
      .subscribe({
        next: (data: ExpenseCategory[]) => {
          this.expenseCategoryList.set(
            data.sort((a, b) => a.name.localeCompare(b.name))
          );
        },
        error: (error: any) => {
          this.expenseError.set(true);
          this.expenseErrorMessage.set(error.message);
        },
      });
  }
  fetchExpenseTypeList(): void {
    this.http
      .get<ExpenseType[]>(`${this.apiUrl}/ExpenseType`, this.options)
      .pipe(catchError(this.errorHandler.handleError))
      .subscribe({
        next: (data: ExpenseType[]) => {
          this.expenseTypeList.set(
            data.sort((a, b) => a.name.localeCompare(b.name))
          );
        },
        error: (error: any) => {
          this.expenseError.set(true);
          this.expenseErrorMessage.set(error.message);
        },
      });
  }

  fetchExpenseList(): void {
    this.http
      .get<Expense[]>(`${this.apiUrl}/Expense`, this.options)
      .pipe(
        map((expenses) =>
          expenses.map((expense) => ({
            ...expense,
            date: this.globalUtils.parseDateIgnoreTimezone(expense.date.toString()), // Converte la stringa in Date
          }))
        ),
        catchError(this.errorHandler.handleError)
      )
      .subscribe((data) => {
        this.expenseList.set(
          data.sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime())
        );
      });
  }

  //#endregion

  //#region ADD DATA
  addExpense(expenseToAdd: ExpenseToEdit) {
    expenseToAdd.date.setHours(12); //pessimo modo per evitare problemi di timezone
    return this.http
      .post(`${this.apiUrl}/Expense`, expenseToAdd, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  addExpenseCategory(expenseCategoryName: string) {
    const url = `${
      this.apiUrl
    }/ExpenseCategory?expenseCategoryName=${encodeURIComponent(
      expenseCategoryName
    )}`;
    return this.http
      .post(url, null, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  addExpenseType(expenseType: ExpenseType) {
    return this.http
      .post(`${this.apiUrl}/ExpenseType`, expenseType, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  //#endregion

  //#region DELETE DATA
  deleteExpense(expenseIdList: number[]) {
    return this.http
      .request('delete', `${this.apiUrl}/Expense/deleteList`, {
        body: expenseIdList,
        ...this.options,
      })
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteExpenseCategory(expenseCategoryId: number) {
    const url = `${
      this.apiUrl
    }/ExpenseCategory?expenseCategoryId=${encodeURIComponent(
      expenseCategoryId
    )}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteExpenseType(expenseTypeId: number) {
    const url = `${this.apiUrl}/ExpenseType?expenseTypeId=${encodeURIComponent(
      expenseTypeId
    )}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.errorHandler.handleError));
  }

  //#endregion

  //region EDIT DATA
  editExpense(expenseId: number, expenseToAdd: ExpenseToEdit) {
    expenseToAdd.date.setHours(12); //pessimo modo per evitare problemi di timezone
    return this.http
      .put(`${this.apiUrl}/Expense/${expenseId}`, expenseToAdd, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  editExpenseCategory(
    expenseCategoryId: number,
    newExpenseCategory: ExpenseCategory
  ) {
    return this.http
      .put(
        `${this.apiUrl}/ExpenseCategory/${expenseCategoryId}`,
        newExpenseCategory,
        this.options
      )
      .pipe(catchError(this.errorHandler.handleError));
  }

  editExpenseType(expenseTypeId: number, newExpenseType: ExpenseType) {
    return this.http
      .put(
        `${this.apiUrl}/ExpenseType/${expenseTypeId}`,
        newExpenseType,
        this.options
      )
      .pipe(catchError(this.errorHandler.handleError));
  }

  //#endregion
}
