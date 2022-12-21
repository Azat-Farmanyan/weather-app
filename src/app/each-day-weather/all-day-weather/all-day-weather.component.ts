import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { listItemDayWeather } from 'src/app/core/interfaces/interfaces';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-all-day-weather',
  templateUrl: './all-day-weather.component.html',
  styleUrls: ['./all-day-weather.component.scss'],
})
export class AllDayWeatherComponent implements OnInit, OnDestroy {
  constructor(
    private weatherService: WeatherService,
    private activatedRoute: ActivatedRoute
  ) {}

  isLoading = false;
  errorMessage = '';

  fiveDayWeatherSubs: Subscription;
  activeCoordinates: Subscription;
  allDayWeather: listItemDayWeather[];

  ngOnInit(): void {
    this.fetchFiveDayWeather();
  }
  fetchFiveDayWeather() {
    this.isLoading = true;
    this.activeCoordinates =
      this.weatherService.activeCityCoordinates.subscribe(
        (coordinates) => {
          this.fiveDayWeatherSubs = this.weatherService
            .getFiveDayWeatherByCoordinates(coordinates.lat, coordinates.lon)
            .subscribe(
              (data) => {
                this.activatedRoute.params.subscribe((params: Params) => {
                  this.allDayWeather = (
                    data.list as listItemDayWeather[]
                  ).filter((el) => {
                    return el.dt_txt
                      ? el.dt_txt.split(' ')[0] === params['date']
                      : '';
                  });
                  this.isLoading = false;
                  console.log(this.allDayWeather);
                });
              },
              (error) => {
                this.isLoading = false;
                this.errorMessage = error.statusText;
              }
            );
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.statusText;
        }
      );
  }
  ngOnDestroy(): void {
    this.fiveDayWeatherSubs.unsubscribe();
    this.activeCoordinates.unsubscribe();
  }
}
