import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Subscription } from 'rxjs';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  inputForm: FormGroup;
  typing = false;

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
    if (inputCityName) {
      this.weatherService.activeCity.next(inputCityName);
      this.inputForm.reset();
      this.closeInput();
    }
  }
}
