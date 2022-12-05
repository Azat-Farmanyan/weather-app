import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Subscription } from 'rxjs';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;
  typing = false;

  coordinateSubs: Subscription;
  currentWeatherSubs: Subscription;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.inputForm = new FormGroup({
      cityName: new FormControl(''),
    });
  }
  closeInput() {
    this.typing = false;
  }
  setNewCity() {
    const inputCityName = this.inputForm.value.cityName;
    this.weatherService.activeCity.next(inputCityName);
    this.inputForm.reset();
    this.closeInput();
  }

  // getCurrentWeather() {
  //   const inputCityName = this.inputForm.value.cityName;
  //   if (!!inputCityName) {
  //     this.coordinateSubs = this.weatherService
  //       .getCoordinates(inputCityName)
  //       .subscribe((city) => {
  //         if (city.length > 0) {
  //           console.log(city);
  //           // get => city.name = 'Tbilisi'
  //           this.currentWeatherSubs = this.weatherService
  //             .getCurrentWeatherByCoordinates(city[0].lat, city[0].lon)
  //             .subscribe((weatherData) => {
  //               console.log(weatherData);
  //               this.inputForm.reset();
  //             });
  //         }
  //       });
  //   }
  // }
  getForFiveDayWeather() {
    const inputCityName = this.inputForm.value.cityName;
    if (!!inputCityName) {
      this.coordinateSubs = this.weatherService
        .getCoordinates(inputCityName)
        .subscribe((city) => {
          if (city.length > 0) {
            console.log(city);
            this.currentWeatherSubs = this.weatherService
              .getFiveDayWeatherByCoordinates(city[0].lat, city[0].lon)
              .subscribe((weatherData) => {
                console.log(weatherData);
                this.inputForm.reset();
                this.closeInput();
              });
          }
        });
    }
  }
  ngOnDestroy(): void {
    this.coordinateSubs.unsubscribe();
    this.currentWeatherSubs.unsubscribe();
  }
}
