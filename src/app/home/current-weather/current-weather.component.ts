import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { delay, Subscription, tap } from 'rxjs';
import {
  lonLat,
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
  error: {
    isError: boolean;
    errorText: string;
  } = {
    isError: false,
    errorText: '',
  };
  isLoading = false;
  activeCityName = '';
  activeCityData: todayWeather = {};
  weatherDescription: weatherDescription = {};
  weekDay = ''; // sunday, monday
  todayDate = ''; // dd/mm/yyy
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
        // .pipe(delay(2000))
        .subscribe(
          (city) => {
            if (city.length > 0) {
              localStorage.setItem('activeCity', activeCity);
              const activeCityCoordinates: lonLat = {
                lon: +city[0].lon,
                lat: +city[0].lat,
              };
              localStorage.setItem(
                'activeCityCoordinates',
                JSON.stringify(activeCityCoordinates)
              );
              this.weatherService.activeCityCoordinates.next(
                activeCityCoordinates
              );
              this.currentWeatherSubs = this.weatherService
                .getCurrentWeatherByCoordinates(city[0].lat, city[0].lon)
                .pipe(
                  tap((data: todayWeather) => {
                    // console.log(data);
                    this.weatherDescription = data.weather?.slice(
                      0
                    )[0] as weatherDescription;

                    this.weatherIconPath = this.weatherIconByCode(
                      this.weatherDescription.icon as string
                    );
                  })
                )
                .subscribe(
                  (currentWeatherData: todayWeather) => {
                    this.activeCityData = currentWeatherData;
                    this.isLoading = false;
                    this.loaderService.hide();
                  },
                  (error) => {
                    console.log(error);
                    this.error.errorText =
                      error.statusText + '!!!' + ' Please try later';
                  }
                );
            } else {
              this.weatherService.activeCity.next('Akhaltsikhe');
              this.isLoading = false;
              this.loaderService.hide();
            }
          },
          (error) => {
            console.log(error);
            this.error.errorText =
              error.statusText + '!!!' + ' Please try later';
          }
        );
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

    this.todayDate = dd + '/' + mm + '/' + yyyy; // dd/mm/yyy
  }

  weatherIconByCode(iconCode: string) {
    return 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png';
  }

  ngOnDestroy(): void {
    this.coordinateSubs.unsubscribe();
    this.currentWeatherSubs.unsubscribe();
    this.activeCitySubs.unsubscribe();
  }
}
