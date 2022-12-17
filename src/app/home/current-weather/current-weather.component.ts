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
import { DateService } from 'src/app/core/services/date.service';
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
  lastUpdate = this.dateService.formatDate(new Date());
  weatherIconPath = 'http://openweathermap.org/img/wn/11d@2x.png';

  coordinateSubs: Subscription;
  currentWeatherSubs: Subscription;
  activeCitySubs: Subscription;

  constructor(
    private weatherService: WeatherService,
    private loaderService: LoaderService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.activeCitySubs = this.weatherService.activeCity.subscribe(
      (activeCityName) => {
        this.getCurrentWeather(activeCityName);
        this.getDate('long');

        let lastSearchedArray: string[] = JSON.parse(
          localStorage.getItem('lastSearchedCities') || '[]'
        );
        if (!lastSearchedArray.includes(activeCityName)) {
          lastSearchedArray.unshift(activeCityName);
          lastSearchedArray = lastSearchedArray.slice(0, 5);
          this.weatherService.lastFiveSearchedCities.next(lastSearchedArray);

          localStorage.setItem(
            'lastSearchedCities',
            JSON.stringify(lastSearchedArray)
          );
        }
      }
    );
  }
  getCurrentWeather(activeCity: string) {
    this.lastUpdate = this.dateService.formatDate(new Date());

    this.isLoading = true;
    if (!!activeCity) {
      this.loaderService.show();
      this.coordinateSubs = this.weatherService
        .getCoordinates(activeCity)
        // .pipe(delay(2000))
        .subscribe(
          (city) => {
            if (city.length > 0) {
              localStorage.setItem('activeCity', activeCity);
              this.activeCityName = activeCity;

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

                    this.weatherIconPath =
                      this.weatherService.weatherIconByCode(
                        this.weatherDescription.icon as string
                      );
                  })
                )
                .subscribe(
                  (currentWeatherData: todayWeather) => {
                    this.activeCityData = currentWeatherData;
                    this.weatherService.currentWeatherData.next(
                      currentWeatherData
                    );
                    this.isLoading = false;
                    this.loaderService.hide();
                  },
                  (error) => {
                    console.log(error);
                    this.isLoading = false;
                    this.error.errorText = error.statusText;
                  }
                );
            } else {
              // this.weatherService.activeCity.next('Akhaltsikhe');
              this.isLoading = false;
              this.loaderService.hide();
            }
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
            this.error.errorText = error.statusText;
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

  ngOnDestroy(): void {
    this.coordinateSubs.unsubscribe();
    this.currentWeatherSubs.unsubscribe();
    this.activeCitySubs.unsubscribe();
  }
}
