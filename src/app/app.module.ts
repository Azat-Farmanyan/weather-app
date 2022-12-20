import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './home/search/search.component';
import { CurrentWeatherComponent } from './home/current-weather/current-weather.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ModalComponent } from './shared/modal/modal.component';
import { FiveDayBlockComponent } from './home/five-day-weather/five-day-block/five-day-block.component';
import { OneDayWidgetComponent } from './home/five-day-weather/one-day-widget/one-day-widget.component';
import { LastSearchedCitiesComponent } from './home/last-searched-cities/last-searched-cities.component';
import { HomeComponent } from './home/home.component';
import { EachDayWeatherComponent } from './each-day-weather/each-day-weather.component';
import { EachDayModule } from './each-day-weather/each-day.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { WeatherService } from './core/services/weather.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    CurrentWeatherComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    FiveDayBlockComponent,
    OneDayWidgetComponent,
    LastSearchedCitiesComponent,
    HomeComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EachDayModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
