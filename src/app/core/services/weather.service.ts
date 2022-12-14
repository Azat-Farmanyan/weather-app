import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';
import {
  APIkey,
  coordinateHTTP,
  fiveDayWeatherHTTP,
  oneDayWeatherHTTP,
} from 'src/app/core/constants/constants';
import {
  fiveDayWeather,
  listItemDayWeather,
  lonLat,
  todayWeather,
} from '../interfaces/interfaces';

export interface coordinates {
  lat: string;
  lon: string;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  activeCity = new BehaviorSubject<string>(
    (localStorage.getItem('activeCity') as string)
      ? (localStorage.getItem('activeCity') as string)
      : 'Akhaltsikhe'
  );
  activeCityCoordinates = new BehaviorSubject<lonLat>(
    JSON.parse(
      localStorage.getItem('activeCityCoordinates') as string
    ) as lonLat
  );
  currentWeatherData = new BehaviorSubject<todayWeather>({});
  fiveDayWeatherData = new BehaviorSubject<fiveDayWeather>({});
  allDayWeatherData = new BehaviorSubject<listItemDayWeather[]>([]);
  otherDayData = new Subject<listItemDayWeather>();

  lastFiveSearchedCities = new BehaviorSubject<string[]>(
    JSON.parse(localStorage.getItem('lastSearchedCities') || '[]')
  );

  // weatherIconPath = 'http://openweathermap.org/img/wn/11d@2x.png';

  constructor(private http: HttpClient) {}

  getCoordinates(cityName: string) {
    return this.http.get<[coordinates]>(coordinateHTTP, {
      params: {
        q: cityName,
        limit: 1,
        appid: APIkey,
      },
    });
  }
  getCurrentWeatherByCoordinates(lat: string, lon: string) {
    return this.http.get<todayWeather>(oneDayWeatherHTTP, {
      params: {
        lon: lon,
        lat: lat,
        appid: APIkey,
        lang: 'en',
        units: 'metric',
      },
    });
  }
  getFiveDayWeatherByCoordinates(lat: number, lon: number) {
    return this.http.get<fiveDayWeather>(fiveDayWeatherHTTP, {
      params: {
        lon: lon,
        lat: lat,
        appid: APIkey,
        lang: 'en',
        units: 'metric',
      },
    });
  }
  weatherIconByCode(iconCode: string) {
    return 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png';
  }
}
