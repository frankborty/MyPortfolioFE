import { Injectable } from '@angular/core';
import { format, parse } from 'date-fns';
import { MessageService } from 'primeng/api';
import { OperationResult } from '../../enum/operationResult';
import { toZonedTime } from 'date-fns-tz';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalUtilityService {
  convertDateToYearMonthString(date: Date): string {
    const dateTouse = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
    return format(dateTouse, 'yyyyMM');
  }

  convertDateToItaString(date: any): string {
    const zonedDate = toZonedTime(date, 'UTC');
    return format(zonedDate, 'dd/MM/yyyy');
  }

  parseDateIgnoreTimezone(dateStr: string): Date {
    const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  getErrorMsg(error: HttpErrorResponse): string {
    if (error.status === HttpStatusCode.Unauthorized) {
      return 'Unauthorized';
    } else if (error.status === HttpStatusCode.Forbidden) {
      return 'Forbidden';
    } else if (error.status === HttpStatusCode.Conflict) {
      return 'Conflict';
    } else if (error.status === 0) {
      return 'Network error';
    }

    return error?.error?.detail || error?.error?.message || JSON.stringify(error?.error) || 'Unknown error';
  }
  
}
