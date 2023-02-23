import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  AnalysisToolComponent,
  CodeConductComponent,
  ContributorsComponent,
  DataSourceReferenceComponent,
  HomeComponent,
  InteractiveOsmMapComponent,
  LicenseComponent,
  PageNotFoundComponent
} from './_pages';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AnalysisToolComponent,
    AppComponent,
    CodeConductComponent,
    ContributorsComponent,
    DataSourceReferenceComponent,
    DialogSchoolColumnSelectorComponent,
    HomeComponent,
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
