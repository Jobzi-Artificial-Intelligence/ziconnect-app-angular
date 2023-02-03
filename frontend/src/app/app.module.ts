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
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ShortNumberPipe } from './_pipes/short-number.pipe';
import {
  DialogSchoolColumnSelectorComponent,
  LocalityLayerPopupComponent,
  NavigationBarComponent,
  SchoolTableBottomSheetComponent
} from './_components';
import {
  CodeConductComponent,
  ContributorsComponent,
  DataSourceReferenceComponent,
  HomeComponent,
  InteractiveMapComponent,
  InteractiveOsmMapComponent,
  LicenseComponent,
  PageNotFoundComponent
} from './_pages';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    CodeConductComponent,
    ContributorsComponent,
    DataSourceReferenceComponent,
    DialogSchoolColumnSelectorComponent,
    HomeComponent,
    InteractiveMapComponent,
    InteractiveOsmMapComponent,
    LicenseComponent,
    LocalityLayerPopupComponent,
    NavigationBarComponent,
    PageNotFoundComponent,
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
    LeafletModule,
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
