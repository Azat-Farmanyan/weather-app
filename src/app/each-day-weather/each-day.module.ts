import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllDayWeatherComponent } from './all-day-weather/all-day-weather.component';
import { RouterModule, Routes } from '@angular/router';
import { OneDayWeatherComponent } from './one-day-weather/one-day-weather.component';
import { EachDayWeatherComponent } from './each-day-weather.component';

const routes: Routes = [{ path: '', component: EachDayWeatherComponent }];

@NgModule({
  declarations: [
    OneDayWeatherComponent,
    EachDayWeatherComponent,
    AllDayWeatherComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class EachDayModule {}