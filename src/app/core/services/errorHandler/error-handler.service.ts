import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { GlobalUtilityService } from '../utils/global-utility.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string = "Something went wrong!";

    if (error.status === HttpStatusCode.Unauthorized) {
      errorMessage = 'Unauthorized';
    } else if (error.status === HttpStatusCode.Forbidden) {
      errorMessage = 'Forbidden';
    } else if (error.status === HttpStatusCode.Conflict) {
      errorMessage = 'Conflict';
    } else if (error.status === 0) {
      errorMessage = 'Network error';
    }
    else{
      errorMessage =  error?.error?.detail || error?.error?.message || JSON.stringify(error?.error) || 'Unknown error';
    }

    return throwError(() => new Error(errorMessage));
  }
}
