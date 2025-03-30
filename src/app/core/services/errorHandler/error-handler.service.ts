import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { GlobalUtilityService } from '../utils/global-utility.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private globalUtils : GlobalUtilityService) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(this.globalUtils.getErrorMsg(error)));
  }
}
