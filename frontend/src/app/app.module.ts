import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import { ShortNumberPipe } from './_pipes/short-number.pipe';
import { DialogSchoolColumnSelectorComponent, NavigationBarComponent, SchoolTableBottomSheetComponent } from './_components';
import { CodeConductComponent, DataSourceReferenceComponent, HomeComponent, InteractiveMapComponent } from './_pages';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    CodeConductComponent,
    DataSourceReferenceComponent,
    DialogSchoolColumnSelectorComponent,
    HomeComponent,
    InteractiveMapComponent,
    NavigationBarComponent,
    SchoolTableBottomSheetComponent,
    ShortNumberPipe,],
  exports: [ShortNumberPipe],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GoogleMapsModule,
    HttpClientModule,
    NgxChartsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    },
    ShortNumberPipe
  ]
})
export class AppModule { }
