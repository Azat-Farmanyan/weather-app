import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { listItemDayWeather } from 'src/app/core/interfaces/interfaces';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-one-hour-block',
  templateUrl: './one-hour-block.component.html',
  styleUrls: ['./one-hour-block.component.scss'],
})
export class OneHourBlockComponent implements OnInit, OnChanges {
  @Input() eachHourData: listItemDayWeather;
  constructor(private weatherService: WeatherService) {}
  time = '';
  date = '';
  weatherIconPath = '';
  weatherDescription = '';
  temp = '';

  ngOnChanges(): void {
    this.time = this.eachHourData ? this.eachHourData.dt_txt.split(' ')[1] : '';
    this.date = this.eachHourData ? this.eachHourData.dt_txt.split(' ')[0] : '';
    this.weatherIconPath = this.weatherService.weatherIconByCode(
      this.eachHourData.weather[0].icon
    );
    this.weatherDescription = this.eachHourData.weather[0].description;
    this.temp = String(Math.round(this.eachHourData.main.temp));
  }

  ngOnInit(): void {}
}
