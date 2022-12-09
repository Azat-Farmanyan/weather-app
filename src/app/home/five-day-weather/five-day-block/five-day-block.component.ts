import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, Subscription } from 'rxjs';
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
  constructor(private weatherService: WeatherService) {}

  fiveDayWeather: fiveDayWeather;
  fiveDayWeatherGroupedByDate: listItemDayWeather[][] = [];

  todayWeather: listItemDayWeather[];
  day2Weather: listItemDayWeather[];
  day3Weather: listItemDayWeather[];
  day4Weather: listItemDayWeather[];
  day5Weather: listItemDayWeather[];
  day6Weather: listItemDayWeather[];

  activeCityCoordinatesSubs: Subscription;
  fiveDayWeatherSubs: Subscription;

  ngOnInit(): void {
    this.activeCityCoordinatesSubs =
      this.weatherService.activeCityCoordinates.subscribe(
        (activeCoordinates) => {
          this.fiveDayWeatherSubs = this.weatherService
            .getFiveDayWeatherByCoordinates(
              activeCoordinates.lat,
              activeCoordinates.lon
            )
            .subscribe((fiveDayWeatherData) => {
              console.log('get');

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
              for (const key in finalWeather) {
                if (Object.prototype.hasOwnProperty.call(finalWeather, key)) {
                  const element: listItemDayWeather[] = finalWeather[key];
                  this.fiveDayWeatherGroupedByDate.push(element);
                }
              }
              console.log(this.fiveDayWeatherGroupedByDate);
            });
        }
      );
  }

  ngOnDestroy(): void {
    this.activeCityCoordinatesSubs.unsubscribe();
    this.fiveDayWeatherSubs.unsubscribe();
  }
}
