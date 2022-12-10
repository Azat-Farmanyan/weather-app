import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { todayWeather } from 'src/app/core/interfaces/interfaces';
import { DateService } from 'src/app/core/services/date.service';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-current-weather-description',
  templateUrl: './current-weather-description.component.html',
  styleUrls: ['./current-weather-description.component.scss'],
})
export class CurrentWeatherDescriptionComponent implements OnInit, OnDestroy {
  currentWeatherData: todayWeather = {};
  isLoading = false;
  sunrise = '';
  sunset = '';
  currentWeatherSubs: Subscription;

  constructor(
    public weatherService: WeatherService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.currentWeatherSubs = this.weatherService.currentWeatherData.subscribe(
      (currentWeather: todayWeather) => {
        this.currentWeatherData = currentWeather;
        this.isLoading = false;
        this.sunrise = this.dateService.formatDate(
          new Date(
            this.currentWeatherData.sys?.sunrise
              ? this.currentWeatherData.sys?.sunrise * 1000
              : '0'
          )
        );
        this.sunset = this.dateService.formatDate(
          new Date(
            this.currentWeatherData.sys?.sunset
              ? this.currentWeatherData.sys?.sunset * 1000
              : '0'
          )
        );
      }
    );
  }
  ngOnDestroy() {
    this.currentWeatherSubs.unsubscribe();
  }
}
