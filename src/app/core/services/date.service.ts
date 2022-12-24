import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  getWeekDay(dayType: 'short' | 'long', date: string) {
    const day = new Date(date).getDay(); //return 0 to 6

    // console.log(day);

    let weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let weekdayLong = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const weekDay = dayType === 'short' ? weekdayShort[day] : weekdayLong[day];
    return weekDay;
  }

  formatDate(date: Date) {
    // 2022-12-10 11:45:43
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
