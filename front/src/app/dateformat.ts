import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  monthsArray: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && dateParts[0]) {
        return { day: Number(dateParts[0]), month: null, year: null };
      } else if (dateParts.length === 2 && dateParts[0] && dateParts[1]) {
        return {
          day: Number(dateParts[0]),
          month: Number(dateParts[1]),
          year: null,
        };
      } else if (
        dateParts.length === 3 &&
        dateParts[0] &&
        dateParts[1] &&
        dateParts[2]
      ) {
        return {
          day: Number(dateParts[0]),
          month: Number(dateParts[1]),
          year: Number(dateParts[2]),
        };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date
      ? `${!isNaN(date.day) ? ('0' + date.day).slice(-2) : ''}-${
      this.monthsArray[date.month - 1]
      }-${date.year}`
      : '';

    // return date
    // ? `${!isNaN(date.day) ? ('0' + date.day).slice(-2) : ''}/${
    // !isNaN(date.month) ? ('0' + date.month).slice(-2) : ''
    // }/${date.year}`
    // : '';
  }
}
