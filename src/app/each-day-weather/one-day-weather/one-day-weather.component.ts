import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import {
  todayWeather,
  weatherDescription,
} from 'src/app/core/interfaces/interfaces';
import { DateService } from 'src/app/core/services/date.service';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-one-day-weather',
  templateUrl: './one-day-weather.component.html',
  styleUrls: ['./one-day-weather.component.scss'],
})
export class OneDayWeatherComponent implements OnInit, OnDestroy {
  todayWeather: todayWeather;
  weatherDescription: weatherDescription = {};
  todayDate = this.dateService.formatDate(new Date()).split(' ')[0];
  weatherIconPath = 'http://openweathermap.org/img/wn/01d@2x.png';
  // otherDayWeather:
  today = false;
  isLoading = false;

  activeCoordinatesSubs: Subscription;
  currentWeatherSubs: Subscription;

  constructor(
    private weatherService: WeatherService,
    private activatedRoute: ActivatedRoute,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const activeDate = params['date']; // yyyy-mm-dd
      if (activeDate === this.todayDate) {
        this.today = true;
        this.fetchTodayData();
        console.log('today');
      } else {
        this.today = false;
        console.log('not today');
      }
      // console.log(this.allDayWeather);
    });
  }

  fetchTodayData() {
    this.isLoading = true;
    this.activeCoordinatesSubs =
      this.weatherService.activeCityCoordinates.subscribe(
        (coordinates) => {
          this.currentWeatherSubs = this.weatherService
            .getCurrentWeatherByCoordinates(
              String(coordinates.lat),
              String(coordinates.lon)
            )
            .pipe(
              tap((data: todayWeather) => {
                this.weatherService.currentWeatherData.next(data);

                this.weatherDescription = data.weather?.slice(
                  0
                )[0] as weatherDescription;

                this.weatherIconPath = this.weatherService.weatherIconByCode(
                  this.weatherDescription.icon as string
                );
              })
            )
            .subscribe((currentWeatherData) => {
              this.todayWeather = currentWeatherData;
              console.log(this.todayWeather);

              this.isLoading = false;
            });
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
  }
  ngOnDestroy(): void {
    if (this.today) {
      this.activeCoordinatesSubs.unsubscribe();
      this.currentWeatherSubs.unsubscribe();
    }
  }
}
