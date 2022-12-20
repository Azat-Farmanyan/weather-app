import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-last-searched-cities',
  templateUrl: './last-searched-cities.component.html',
  styleUrls: ['./last-searched-cities.component.scss'],
})
export class LastSearchedCitiesComponent implements OnInit, OnDestroy {
  lastSearchedCitiesArray: string[] = [];
  lastCitiesSubs: Subscription;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.lastCitiesSubs = this.weatherService.lastFiveSearchedCities.subscribe(
      (lastSearchedCitiesArrayData) => {
        this.lastSearchedCitiesArray = lastSearchedCitiesArrayData;
      }
    );
  }
  searchNewCity(activeCity: string) {
    this.weatherService.activeCity.next(activeCity);
  }
  deleteCurrentCity(deletedCity: string) {
    let lastSearchedArray: string[] = JSON.parse(
      localStorage.getItem('lastSearchedCities') || '[]'
    );
    lastSearchedArray = lastSearchedArray.filter((el) => el !== deletedCity);
    localStorage.setItem(
      'lastSearchedCities',
      JSON.stringify(lastSearchedArray)
    );
    this.weatherService.lastFiveSearchedCities.next(lastSearchedArray);
  }
  ngOnDestroy(): void {
    this.lastCitiesSubs.unsubscribe();
  }
}
