import { Injectable } from '@angular/core';
import { format, parse } from 'date-fns';
import { MessageService } from 'primeng/api';
import { OperationResult } from '../../enum/operationResult';
import { toZonedTime } from 'date-fns-tz';

@Injectable({
  providedIn: 'root',
})
export class GlobalUtilityService {
  convertStringToDate(stringDate: string): Date {
    const format = 'yyyyMMdd_HHmmss';
    const date = parse(stringDate, format, new Date());
    return date;
  }

  convertDateToString(date: any): string {
    const zonedDate = toZonedTime(date, 'UTC');
    return format(zonedDate, 'yyyyMMdd_HHmmss');
  }

  convertStringToYearMonthString(date: string): string {
    return date.substring(0, 6);
  }

  convertDateToItaString(date: any): string {
    const zonedDate = toZonedTime(date, 'UTC');
    return format(zonedDate, 'dd/MM/yyyy');
  }

  showOperationResult(
    messageService: MessageService,
    resultValue: OperationResult,
    resultDetail: string
  ) {
    if (resultValue == OperationResult.OK) {
      messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: resultDetail,
        life: 3000,
      });
    } else if (resultValue == OperationResult.KO) {
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: resultDetail,
        life: 3000,
      });
    } else {
      messageService.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: resultDetail,
        life: 3000,
      });
    }
  }
}
