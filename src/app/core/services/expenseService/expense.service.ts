import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getExpenses() {
    return this.http.get(`${this.apiUrl}/Expense`, this.options)
    .pipe(tap(console.debug), catchError(this.errorHandler.handleError)); 
  }
}
