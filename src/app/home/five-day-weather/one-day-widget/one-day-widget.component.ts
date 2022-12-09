import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { listItemDayWeather } from 'src/app/core/interfaces/interfaces';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-one-day-widget',
  templateUrl: './one-day-widget.component.html',
  styleUrls: ['./one-day-widget.component.scss'],
})
export class OneDayWidgetComponent implements OnInit, OnChanges {
  @Input() weatherData: listItemDayWeather[] = [];
  date = 'undefined';
  weekDay = '';
  averageTemp = '';
  constructor(private dateService: DateService) {}
  ngOnChanges() {
    this.date = this.weatherData[0].dt_txt
      .split(' ')[0]
      .split('-')
      .splice(1)
      .reverse()
      .join('/');

    this.weekDay = this.dateService.getWeekDay(
      'short',
      this.weatherData[0].dt_txt
    );
  }

  ngOnInit(): void {}
}
