import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-last-searched-cities',
  templateUrl: './last-searched-cities.component.html',
  styleUrls: ['./last-searched-cities.component.scss'],
})
export class LastSearchedCitiesComponent implements OnInit {
  lastSearchedCitiesArray: string[] = [];
  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.lastSearchedCities.subscribe((lastCities) => {
      this.lastSearchedCitiesArray = lastCities;
    });
  }

  searchNewCity(activeCity: string) {
    this.weatherService.activeCity.next(activeCity);
  }
}
