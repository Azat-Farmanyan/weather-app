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
    this.weatherService.lastSearchedCities.subscribe((lastCities) => {
      this.lastSearchedCitiesArray = lastCities;
    });
  }

  searchNewCity(activeCity: string) {
    this.weatherService.activeCity.next(activeCity);
  }
  ngOnDestroy(): void {
    this.lastCitiesSubs.unsubscribe();
  }
}
