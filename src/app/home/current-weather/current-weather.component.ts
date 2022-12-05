import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { delay, Subscription, tap } from 'rxjs';
import {
  todayWeather,
  weatherDescription,
} from 'src/app/core/interfaces/interfaces';
import { WeatherService } from 'src/app/core/services/weather.service';
import { LoaderService } from 'src/app/shared/loading-spinner/loader.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  isLoading = false;
  activeCityName = '';
  activeCityData: todayWeather = {};
  weatherDescription: weatherDescription = {};
  weekDay = '';
  todayDate = '';
  weatherIconPath = 'http://openweathermap.org/img/wn/11d@2x.png';

  coordinateSubs: Subscription;
  currentWeatherSubs: Subscription;
  activeCitySubs: Subscription;

  constructor(
    private weatherService: WeatherService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.activeCitySubs = this.weatherService.activeCity.subscribe(
      (activeCityName) => {
        console.log('🚀', activeCityName);
        this.activeCityName = activeCityName;
        this.getCurrentWeather(activeCityName);
        this.getDate('long');
      }
    );
  }
  getCurrentWeather(activeCity: string) {
    if (!!activeCity) {
      this.loaderService.show();
      this.isLoading = true;
      this.coordinateSubs = this.weatherService
        .getCoordinates(activeCity)
        .pipe(delay(2000))
        .subscribe((city) => {
          if (city.length > 0) {
            this.currentWeatherSubs = this.weatherService
              .getCurrentWeatherByCoordinates(city[0].lat, city[0].lon)
              .pipe(
                tap((data) => {
                  this.weatherDescription = data.weather?.slice(
                    0
                  )[0] as weatherDescription;

                  this.weatherIconPath =
                    'http://openweathermap.org/img/wn/' +
                    this.weatherDescription.icon +
                    '@2x.png';
                })
              )
              .subscribe((currentWeatherData: todayWeather) => {
                this.activeCityData = currentWeatherData;
                this.isLoading = false;
                this.loaderService.hide();
              });
          } else {
            this.weatherService.activeCity.next('Akhaltsikhe');
            this.isLoading = false;
            this.loaderService.hide();
          }
        });
    }
  }

  getDate(dayType: 'short' | 'long') {
    const day = new Date().getDay(); //return 0 to 6
    let weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let weekdayLong = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    this.weekDay = dayType === 'short' ? weekdayShort[day] : weekdayLong[day];

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    this.todayDate = mm + '/' + dd + '/' + yyyy;
  }

  ngOnDestroy(): void {
    this.coordinateSubs.unsubscribe();
    this.currentWeatherSubs.unsubscribe();
    this.activeCitySubs.unsubscribe();
  }
}
