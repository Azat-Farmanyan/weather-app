import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { listItemDayWeather } from 'src/app/core/interfaces/interfaces';
import { DateService } from 'src/app/core/services/date.service';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-one-day-widget',
  templateUrl: './one-day-widget.component.html',
  styleUrls: ['./one-day-widget.component.scss'],
})
export class OneDayWidgetComponent implements OnInit, OnChanges {
  @Input() weatherData: listItemDayWeather[] = [];
  @Input() today: string = 'Today';
  date = 'undefined';
  longDate = '';
  weekDay = '';
  averageTemp = '';
  weatherIconPath = 'http://openweathermap.org/img/wn/11d@2x.png';
  middleWeather = 0;
  activeCity = 'undefined';
  temp = 'none';

  constructor(
    private dateService: DateService,
    private weatherService: WeatherService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnChanges() {
    this.longDate = this.weatherData[0].dt_txt.split(' ')[0];

    this.date = this.weatherData[0].dt_txt
      .split(' ')[0]
      .split('-')
      .splice(1)
      .reverse()
      .join('/');

    this.middleWeather =
      this.middleWeather === 1 ? 1 : Math.floor(this.weatherData.length / 2);

    this.weekDay = this.dateService.getWeekDay(
      'short',
      this.weatherData[0].dt_txt
    );
    this.weatherIconPath = this.weatherService.weatherIconByCode(
      this.weatherData[this.middleWeather].weather[0].icon
    );
    this.temp = String(this.weatherData[this.middleWeather].main.temp);
  }

  ngOnInit(): void {
    const activeCity = localStorage.getItem('activeCity');
    if (activeCity) {
      this.activeCity = JSON.stringify(activeCity).split('"').join('');
    }
  }
}
