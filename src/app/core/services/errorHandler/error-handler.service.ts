import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === HttpStatusCode.Unauthorized) {
      return throwError(() => new Error('Unauthorized'));
    } else if (error.status === HttpStatusCode.Forbidden) {
      return throwError(() => new Error('Forbidden'));
    } else if (error.status === HttpStatusCode.Conflict) {
      return throwError(() => new Error('Conflict'));
    } else if (error.status === 0) {
      return throwError(() => new Error('Network error'));
    }

    return throwError(() => new Error(`${error.error.detail || error.error.message || error.error}`));
  }
}
