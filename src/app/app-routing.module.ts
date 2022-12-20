import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EachDayWeatherComponent } from './each-day-weather/each-day-weather.component';
import { EachDayModule } from './each-day-weather/each-day.module';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'each-day', component: EachDayWeatherComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'each-day',
    loadChildren: () =>
      import('./each-day-weather/each-day.module').then((m) => m.EachDayModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
