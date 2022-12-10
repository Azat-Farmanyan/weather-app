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
}
