import { Injectable } from '@angular/core';
import { format, parse } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class GlobalUtilityService {

  convertStringToDate(stringDate: string): Date {
    const format = "yyyyMMdd_hhmmss";
    const date = parse(stringDate, format, new Date());
    return date;
  }

  convertDateToString(date : any): string{
    return format(date, 'yyyyMMdd_HHmmss');
  }
}
