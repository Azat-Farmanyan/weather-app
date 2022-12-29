import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  listItemDayWeather,
  todayWeather,
} from 'src/app/core/interfaces/interfaces';
import { DateService } from 'src/app/core/services/date.service';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-weather-description',
  templateUrl: './weather-description.component.html',
  styleUrls: ['./weather-description.component.scss'],
})
export class WeatherDescriptionComponent implements OnInit, OnDestroy {
  constructor(
    private weatherService: WeatherService,
    private activatedRoute: ActivatedRoute,
    private dateService: DateService
  ) {}

  todayDate = this.dateService.formatDate(new Date()).split(' ')[0];

  data: any = [];

  currentWeatherSubs: Subscription;
  otherDayWeatherSubs: Subscription;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const activeDate = params['date']; // yyyy-mm-dd

      if (activeDate === this.todayDate) {
        //today
        this.currentWeatherSubs =
          this.weatherService.currentWeatherData.subscribe(
            (data: todayWeather) => {
              if (!!data) {
                this.data = data.main;
                if (this.data) {
                  this.data = Object.entries(this.data);
                  console.log(this.data);
                }
              }
            }
          );
      } else {
        this.otherDayWeatherSubs = this.weatherService.otherDayData.subscribe(
          (data: listItemDayWeather) => {
            this.data = data.main;
            this.data = Object.entries(this.data);
            console.log(this.data);
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentWeatherSubs) {
      this.currentWeatherSubs.unsubscribe();
    }
    if (this.otherDayWeatherSubs) {
      this.otherDayWeatherSubs.unsubscribe();
    }
  }
}
