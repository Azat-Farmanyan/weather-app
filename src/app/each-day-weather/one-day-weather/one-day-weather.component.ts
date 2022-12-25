import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import {
  fiveDayWeather,
  listItemDayWeather,
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
  todayTemp = '';

  otherDate = '';
  otherDayData: listItemDayWeather;
  otherDayWeatherDescription = '';
  activeCity = '';
  otherDayTemp = '-';
  otherWeekDay = '';

  weatherIconPath = '';
  // otherDayWeather:
  today = false;
  isLoading = false;

  activeCoordinatesSubs: Subscription;
  currentWeatherSubs: Subscription;
  fiveDayWeatherSubs: Subscription;

  constructor(
    private weatherService: WeatherService,
    private activatedRoute: ActivatedRoute,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const activeDate = params['date']; // yyyy-mm-dd

      this.otherWeekDay = this.dateService.getWeekDay('long', activeDate);

      this.activeCity = params['activeCity'];
      if (activeDate === this.todayDate) {
        this.today = true;
        this.fetchTodayData();
        // console.log('today');
      } else {
        this.today = false;
        this.otherDate = activeDate;
        // console.log('not today');

        let coordinatesString = localStorage.getItem('activeCityCoordinates');
        if (coordinatesString) {
          const coordinates: { lon: string; lat: string } =
            JSON.parse(coordinatesString);

          this.fiveDayWeatherSubs = this.weatherService
            .getFiveDayWeatherByCoordinates(+coordinates.lat, +coordinates.lon)
            .subscribe((fiveDayWeatherData) => {
              this.isLoading = false;
              let otherDaysWeatherData: listItemDayWeather[] = [];
              if (fiveDayWeatherData.list) {
                otherDaysWeatherData = fiveDayWeatherData.list;

                const currentDayListItems: listItemDayWeather[] =
                  otherDaysWeatherData.filter((listItem) => {
                    return listItem.dt_txt.split(' ')[0] === activeDate;
                  });
                const middleWeatherIndex = Math.floor(
                  currentDayListItems.length / 2
                );
                this.otherDayData = currentDayListItems[middleWeatherIndex];

                this.otherDayTemp = String(
                  Math.round(this.otherDayData.main!.temp)
                );
                this.otherDayWeatherDescription =
                  this.otherDayData.weather[0].description;

                this.weatherIconPath = this.weatherService.weatherIconByCode(
                  this.otherDayData.weather[0].icon
                );
              }
            });
        }
      }
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

              if (this.todayWeather.main!.temp) {
                this.todayTemp = String(
                  Math.round(this.todayWeather.main!.temp)
                );
              }
              // console.log(this.todayWeather);

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
    } else {
      this.fiveDayWeatherSubs.unsubscribe();
    }
  }
}
