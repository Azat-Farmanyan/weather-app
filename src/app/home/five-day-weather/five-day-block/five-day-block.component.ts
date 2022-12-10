import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, first, Subscription } from 'rxjs';
import {
  fiveDayWeather,
  listItemDayWeather,
} from 'src/app/core/interfaces/interfaces';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-five-day-block',
  templateUrl: './five-day-block.component.html',
  styleUrls: ['./five-day-block.component.scss'],
})
export class FiveDayBlockComponent implements OnInit, OnDestroy {
  isLoading = false;
  error = false;
  errorText = '';

  fiveDayWeather: fiveDayWeather;
  fiveDayWeatherGroupedByDate: listItemDayWeather[][] = [];

  activeCityCoordinatesSubs: Subscription;
  fiveDayWeatherSubs: Subscription;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.activeCityCoordinatesSubs =
      this.weatherService.activeCityCoordinates.subscribe(
        (activeCoordinates) => {
          this.isLoading = true;
          this.fiveDayWeatherSubs = this.weatherService
            .getFiveDayWeatherByCoordinates(
              activeCoordinates.lat,
              activeCoordinates.lon
            )
            .subscribe(
              (fiveDayWeatherData) => {
                this.fiveDayWeather = fiveDayWeatherData;
                const list = fiveDayWeatherData.list;
                let finalWeather: { [key: string]: listItemDayWeather[] } = {};
                list.forEach((games) => {
                  const date = games.dt_txt.split(' ')[0];
                  if (finalWeather[date]) {
                    finalWeather[date].push(games);
                  } else {
                    finalWeather[date] = [games];
                  }
                });

                this.fiveDayWeatherGroupedByDate = [];
                for (const key in finalWeather) {
                  if (Object.prototype.hasOwnProperty.call(finalWeather, key)) {
                    const element: listItemDayWeather[] = finalWeather[key];
                    this.fiveDayWeatherGroupedByDate.push(element);
                  }
                }
                this.isLoading = false;
              },
              (errorData) => {
                this.isLoading = false;
                this.error = true;
                this.errorText = errorData.statusText;
              }
            );
        }
      );
  }

  ngOnDestroy(): void {
    this.activeCityCoordinatesSubs.unsubscribe();
    this.fiveDayWeatherSubs.unsubscribe();
  }
}
