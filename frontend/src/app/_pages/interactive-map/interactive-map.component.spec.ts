import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ElementRef } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "src/app/material.module";
import { SchoolTableBottomSheetComponent } from "src/app/_components";
import { AdministrativeLevel, City, LocalityMapAutocomplete, LocalityStatistics, Region, State } from "src/app/_models";
import { InteractiveMapComponent } from "./interactive-map.component";
import { ShortNumberPipe } from "src/app/_pipes/short-number.pipe";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { of, throwError } from 'rxjs';

import { geoJsonSample, geoJsonCities, geoJsonRegions, geoJsonStates } from "../../../test/geo-json-mock";
import { cityStats, regionStats, stateStats } from "../../../test/item-stats-mock";
import { citiesLocalityMapList, regionsLocalityMapList, statesLocalityMapList } from "../../../test/locality-map-mock";
import { localitiesMapAutocompleteResponseFromServer } from "../../../test/locality-map-autocomplete-mock";
import { localityStatisticsMunicipalities, localityStatisticsRegions, localityStatisticsStates } from "src/test/locality-statistics-mock";

describe('Component: InteractiveMap', () => {
  let component: InteractiveMapComponent;
  let fixture: ComponentFixture<InteractiveMapComponent>;

  let mockCitiesLocalityMap = [] as any;
  let mockRegionsLocalityMap = [] as any;
  let mockStatesLocalityMap = [] as any;
  let mockGeoJsonCities = {} as any;
  let mockGeoJsonRegions = {} as any;
  let mockGeoJsonStates = {} as any;
  let mockCityStats: LocalityStatistics;
  let mockRegionStats: LocalityStatistics;
  let mockStateStats: LocalityStatistics;

  const mockRegion = new Region('code01', 'Name01');
  const mockState = new State('code01', 'Name01', mockRegion);
  const mockMunicipality = new City('code01', 'Name01', mockState);

  class MockElementRef extends ElementRef {
    constructor() { super(undefined); }
    // nativeElement = {};
  }

  beforeEach(() => {
    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    TestBed.configureTestingModule({
      declarations: [InteractiveMapComponent, SchoolTableBottomSheetComponent, ShortNumberPipe],
      imports: [
        AngularMaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        GoogleMapsModule,
        HttpClientTestingModule,
        NgxChartsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '' },
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });

    // Clone object
    mockCitiesLocalityMap = JSON.parse(JSON.stringify(citiesLocalityMapList));
    mockRegionsLocalityMap = JSON.parse(JSON.stringify(regionsLocalityMapList));
    mockStatesLocalityMap = JSON.parse(JSON.stringify(statesLocalityMapList));
    mockGeoJsonCities = JSON.parse(JSON.stringify(geoJsonCities));
    mockGeoJsonRegions = JSON.parse(JSON.stringify(geoJsonRegions));
    mockGeoJsonStates = JSON.parse(JSON.stringify(geoJsonStates));
    mockCityStats = JSON.parse(JSON.stringify(cityStats));
    mockRegionStats = JSON.parse(JSON.stringify(regionStats));
    mockStateStats = JSON.parse(JSON.stringify(stateStats));

    fixture = TestBed.createComponent(InteractiveMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', async () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {

    it('should exists', () => {
      expect(component.ngOnInit).toBeTruthy();
      expect(component.ngOnInit).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      spyOn(component, 'initMapViewOptions');
      spyOn(component, 'watchLoadingMap');
      spyOn(component, 'loadLocalityStatistics');
      spyOn(component, 'loadRegionsGeoJson');
      spyOn(component, 'initRegionSelectOptions');
      spyOn(component, 'initStateSelectOptions');
      spyOn(component, 'initSearchLocationFilteredOptions');

      await component.ngOnInit();

      expect(component.initMapViewOptions).toHaveBeenCalled();
      expect(component.watchLoadingMap).toHaveBeenCalled();
      expect(component.loadLocalityStatistics).toHaveBeenCalled();
      expect(component.loadRegionsGeoJson).toHaveBeenCalled();
      expect(component.initRegionSelectOptions).toHaveBeenCalled();
      expect(component.initStateSelectOptions).toHaveBeenCalled();
      expect(component.initSearchLocationFilteredOptions).toHaveBeenCalled();
    });
  });

  //#region FILTER FUNCTIONS
  ////////////////////////////////////////////
  describe('#initRegionSelectOptions', () => {

    it('should exists', () => {
      expect(component.initRegionSelectOptions).toBeTruthy();
      expect(component.initRegionSelectOptions).toEqual(jasmine.any(Function));
    });

    it('should works when service throw error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getRegionsOfCountry').and.throwError('Error message');
      await component.initRegionSelectOptions().catch((error) => {
        expect(error.toString()).toEqual('Error: Error message');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getRegionsOfCountry').and.returnValue(throwError({ message: 'http error' }));
      await component.initRegionSelectOptions().catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('http error');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalledWith('Something went wrong retrieving region options: http error');
    });

    it('should works when service return success', async () => {
      const regionsResponse = [mockRegion];

      //@ts-ignore
      spyOn(component.localityMapService, 'getRegionsOfCountry').and.returnValue(of(regionsResponse));
      await component.initRegionSelectOptions();

      expect(component.mapFilter.regionOptions).toEqual(jasmine.any(Array));
      expect(component.mapFilter.regionOptions.length).toEqual(regionsResponse.length);
    });
  });

  describe('#initStateSelectOptions', () => {

    it('should exists', () => {
      expect(component.initStateSelectOptions).toBeTruthy();
      expect(component.initStateSelectOptions).toEqual(jasmine.any(Function));
    });

    it('should works when service throw error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getStatesOfCountry').and.throwError('Error message');
      await component.initStateSelectOptions().catch((error) => {
        expect(error.toString()).toEqual('Error: Error message');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getStatesOfCountry').and.returnValue(throwError({ message: 'http error' }));
      await component.initStateSelectOptions().catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('http error');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalledWith('Something went wrong retrieving state options: http error');
    });

    it('should works when service return success', async () => {
      const statesResponse = [mockState];

      //@ts-ignore
      spyOn(component.localityMapService, 'getStatesOfCountry').and.returnValue(of(statesResponse));
      await component.initStateSelectOptions();

      expect(component.mapFilter.stateOptions).toEqual(jasmine.any(Array));
      expect(component.mapFilter.stateOptions.length).toEqual(statesResponse.length);
    });
  });

  describe('#onChangeSelectedViewOption', () => {

    it('should exists', () => {
      expect(component.onChangeSelectedViewOption).toBeTruthy();
      expect(component.onChangeSelectedViewOption).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(component, 'toggleFilterSettingsExpanded');

      component.googleMap.data.addGeoJson(mockGeoJsonRegions, {
        idPropertyName: 'region_code'
      });

      component.googleMap.data.forEach(feature => { feature.setProperty('stats', mockRegionStats) })

      const viewOption = component.mapFilter.viewOptions.find(x => x.value === 'Prediction');
      if (viewOption) {
        const colors = viewOption.rangeColors.map(color => color.backgroundColor);

        component.filterForm.controls['selectedViewOption'].setValue(viewOption);
        component.onChangeSelectedViewOption({} as any);

        expect(component.toggleFilterSettingsExpanded).toHaveBeenCalledWith(false);

        // Testing fill color values
        component.googleMap.data.forEach(feature => {
          expect(colors.includes(feature.getProperty('fillColor'))).toBeTrue();
        });
      }
    });
  });

  describe('#onCountryClick', () => {

    it('should exists', () => {
      expect(component.onCountryClick).toBeTruthy();
      expect(component.onCountryClick).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      spyOn(component, 'loadLocalityStatistics');
      spyOn(component, 'loadRegionsGeoJson').and.callFake(() => {
        return new Promise((resolve, reject) => {
          component.googleMap.data.addGeoJson(mockGeoJsonRegions);
          resolve(null);
        });
      });
      spyOn(component.googleMap, 'fitBounds');

      component.googleMap.data.addGeoJson(mockGeoJsonRegions);

      await component.onCountryClick();

      expect(component.loadLocalityStatistics).toHaveBeenCalledWith(AdministrativeLevel.Region);
      expect(component.loadRegionsGeoJson).toHaveBeenCalled();
      expect(component.googleMap.fitBounds).toHaveBeenCalled();
    });
  });

  describe('#onLegendItemMouseEnter', () => {

    it('should exists', () => {
      expect(component.onLegendItemMouseEnter).toBeTruthy();
      expect(component.onLegendItemMouseEnter).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const rangeColorIndex = 0;

      component.googleMap.data.addGeoJson(mockGeoJsonRegions, { idPropertyName: 'region_code' });

      // Creates test scenario
      component.googleMap.data.forEach((feature) => {
        feature.setProperty('fillColorIndex', rangeColorIndex + 1);
        feature.setProperty('filtered', true);
        feature.setProperty('state', 'normal');
      });

      component.onLegendItemMouseEnter(rangeColorIndex);

      component.googleMap.data.forEach((feature) => {
        expect(feature.getProperty('state')).toEqual('unfocused');
      });
    });
  });

  describe('#onLegendItemMouseLeave', () => {

    it('should exists', () => {
      expect(component.onLegendItemMouseLeave).toBeTruthy();
      expect(component.onLegendItemMouseLeave).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonRegions, { idPropertyName: 'region_code' });

      // Creates test scenario
      component.googleMap.data.forEach((feature) => {
        feature.setProperty('filtered', true);
        feature.setProperty('state', 'unfocused');
      });

      component.onLegendItemMouseLeave();

      component.googleMap.data.forEach((feature) => {
        expect(feature.getProperty('state')).toEqual('normal');
      });
    });
  });

  describe('#onSelectCity', () => {

    it('should exists', () => {
      expect(component.onSelectCity).toBeTruthy();
      expect(component.onSelectCity).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      // Creating spy
      spyOn(component, 'zoomToFeature');
      spyOn(component, 'openStatsPanel');

      // Initializing variables and setting properties values for test scenario
      const cityFromGeoJson = mockGeoJsonCities.features[0].properties;
      const region = new Region(cityFromGeoJson.region_code, cityFromGeoJson.region_name);
      const state = new State(cityFromGeoJson.state_code, cityFromGeoJson.state_name, region);
      const city = new City(cityFromGeoJson.municipality_code, cityFromGeoJson.municipality_name, state);

      component.googleMap.data.addGeoJson(mockGeoJsonCities, { idPropertyName: 'municipality_code' });

      component.googleMap.data.forEach((feature) => {
        feature.setProperty('code', feature.getProperty('municipality_code'));
      });

      // Execute test function
      await component.onSelectCity(city);

      // Test result expectations
      expect(component.mapFilter.selectedCity).toEqual(city);

      const cityFeature = component.googleMap.data.getFeatureById(cityFromGeoJson.municipality_code);
      if (cityFeature) {
        expect(component.openStatsPanel).toHaveBeenCalledWith(cityFeature);
        expect(component.zoomToFeature).toHaveBeenCalledWith(cityFeature);
      }

      component.googleMap.data.forEach((feature) => {
        if (feature.getProperty('code') !== cityFromGeoJson.municipality_code) {
          expect(feature.getProperty('state')).toEqual('unfocused');
          expect(feature.getProperty('filtered')).toEqual(false);
        } else {
          expect(feature.getProperty('state')).toEqual('normal');
          expect(feature.getProperty('filtered')).toEqual(true);
        }
      });
    });
  });

  describe('#onSelectRegion', () => {

    it('should exists', () => {
      expect(component.onSelectRegion).toBeTruthy();
      expect(component.onSelectRegion).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      // Creating spy
      spyOn(component, 'loadLocalityStatistics');
      spyOn(component, 'loadStatesGeoJson');
      spyOn(component, 'openStatsPanel');
      spyOn(component, 'removeCitiesFromMap');
      spyOn(component, 'removeStatesFromMap');
      spyOn(component, 'zoomToFeature');

      // Initializing variables and setting properties values for test scenario
      const regionFromGeoJson = mockGeoJsonRegions.features[0].properties;
      const region = new Region(regionFromGeoJson.region_code, regionFromGeoJson.region_name);

      component.googleMap.data.addGeoJson(mockGeoJsonRegions, { idPropertyName: 'region_code' });

      component.googleMap.data.forEach((feature) => {
        feature.setProperty('code', feature.getProperty('region_code'));
      });

      // Execute test function
      await component.onSelectRegion(region);

      // Test result expectations
      expect(component.mapFilter.selectedCity).toEqual(undefined);
      expect(component.mapFilter.selectedRegion).toEqual(region);
      expect(component.mapFilter.selectedState).toEqual(undefined);

      component.googleMap.data.forEach((feature) => {
        if (feature.getProperty('code') !== regionFromGeoJson.region_code) {
          expect(feature.getProperty('state')).toEqual('unfocused');
          expect(feature.getProperty('filtered')).toEqual(false);
        } else {
          expect(feature.getProperty('state')).toEqual('normal');
          expect(feature.getProperty('filtered')).toEqual(true);
        }
      });

      expect(component.removeStatesFromMap).toHaveBeenCalled();
      expect(component.removeCitiesFromMap).toHaveBeenCalled();

      expect(component.loadLocalityStatistics).toHaveBeenCalledWith(AdministrativeLevel.State);

      const regionFeature = component.googleMap.data.getFeatureById(regionFromGeoJson.region_code);
      if (regionFeature) {
        expect(component.openStatsPanel).toHaveBeenCalledWith(regionFeature);
        expect(component.zoomToFeature).toHaveBeenCalledWith(regionFeature);
      }
    });
  });

  describe('#onSelectState', () => {

    it('should exists', () => {
      expect(component.onSelectState).toBeTruthy();
      expect(component.onSelectState).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      // Creating spy
      spyOn(component, 'loadLocalityStatistics');
      spyOn(component, 'loadCitiesGeoJson');
      spyOn(component, 'openStatsPanel');
      spyOn(component, 'removeCitiesFromMap');
      spyOn(component, 'zoomToFeature');

      // Initializing variables and setting properties values for test scenario
      const stateFromGeoJson = mockGeoJsonStates.features[0].properties;
      const region = new Region(stateFromGeoJson.region_code, stateFromGeoJson.region_name);
      const state = new State(stateFromGeoJson.state_code, stateFromGeoJson.state_name, region);

      component.googleMap.data.addGeoJson(mockGeoJsonStates, { idPropertyName: 'state_code' });

      component.googleMap.data.forEach((feature) => {
        feature.setProperty('code', feature.getProperty('state_code'));
      });

      // Execute test function
      await component.onSelectState(state);

      // Test result expectations
      expect(component.mapFilter.selectedCity).toEqual(undefined);
      expect(component.mapFilter.selectedRegion).toEqual(state.region);
      expect(component.mapFilter.selectedState).toEqual(state);

      expect(component.removeCitiesFromMap).toHaveBeenCalled();
      expect(component.loadLocalityStatistics).toHaveBeenCalledWith(AdministrativeLevel.Municipality);
      expect(component.loadCitiesGeoJson).toHaveBeenCalledWith(component.mapFilter.selectedCountry ?? '', state.region.code.toString(), state.code.toString());

      component.googleMap.data.forEach((feature) => {
        if (feature.getProperty('code') !== stateFromGeoJson.state_code) {
          expect(feature.getProperty('state')).toEqual('unfocused');
          expect(feature.getProperty('filtered')).toEqual(false);
        } else {
          expect(feature.getProperty('state')).toEqual('normal');
          expect(feature.getProperty('filtered')).toEqual(true);
        }
      });

      const cityFeature = component.googleMap.data.getFeatureById(stateFromGeoJson.state_code);
      if (cityFeature) {
        expect(component.openStatsPanel).toHaveBeenCalledWith(cityFeature);
        expect(component.zoomToFeature).toHaveBeenCalledWith(cityFeature);
      }
    });
  });
  //#endregion
  ////////////////////////////////////////////

  //#region MAP LOAD FUNCTION
  ////////////////////////////////////////////
  describe('#loadCitiesGeoJson', () => {

    it('should exists', () => {
      expect(component.loadCitiesGeoJson).toBeTruthy();
      expect(component.loadCitiesGeoJson).toEqual(jasmine.any(Function));
    });

    it('should works when service throw error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getCitiesByState').and.throwError('Error message');
      await component.loadCitiesGeoJson('', '', '').catch((error) => {
        expect(error.toString()).toEqual('Error: Error message');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getCitiesByState').and.returnValue(throwError({ message: 'http error' }));
      await component.loadCitiesGeoJson('', '', '').catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('http error');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalledWith('Something went wrong loading cities json: http error');
    });

    it('should works when service return success', async () => {
      spyOn(component, 'getLocalityStatisticsByMunicipalityCode').and.returnValue(localityStatisticsMunicipalities[0]);

      //@ts-ignore
      spyOn(component.localityMapService, 'getCitiesByState').and.returnValue(of(mockCitiesLocalityMap));
      await component.loadCitiesGeoJson('', '', '');

      let count = 0;
      component.googleMap.data.forEach(feature => count++);
      expect(count).toEqual(mockCitiesLocalityMap.length);
      expect(component.getLocalityStatisticsByMunicipalityCode).toHaveBeenCalled();
    });
  });

  describe('#loadLocalityStatistics', () => {

    it('should exists', () => {
      expect(component.loadLocalityStatistics).toBeTruthy();
      expect(component.loadLocalityStatistics).toEqual(jasmine.any(Function));
    });

    it('should works when service throw error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityStatisticsService, 'getStatisticsOfAdministrativeLevelLocalities').and.throwError('Error message');
      await component.loadLocalityStatistics(AdministrativeLevel.Region).catch((error) => {
        expect(error.toString()).toEqual('Error: Error message');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityStatisticsService, 'getStatisticsOfAdministrativeLevelLocalities').and.returnValue(throwError({ message: 'http error' }));
      await component.loadLocalityStatistics(AdministrativeLevel.Region).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('http error');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalledWith('Something went wrong loading locality statistics: http error');
    });

    it('should works for regions', async () => {
      component.mapFilter.selectedCountry = 'BR';

      //@ts-ignore
      spyOn(component.localityStatisticsService, 'getStatisticsOfAdministrativeLevelLocalities').and.returnValue(of(localityStatisticsRegions));
      await component.loadLocalityStatistics(AdministrativeLevel.Region);

      //@ts-ignore
      expect(component.localityStatisticsService.getStatisticsOfAdministrativeLevelLocalities).toHaveBeenCalledWith(AdministrativeLevel.Region, 'BR', '', '');
      expect(component.localityStatistics.length).toEqual(localityStatisticsRegions.length);
    });

    it('should works for states', async () => {
      component.mapFilter.selectedCountry = 'BR';
      component.mapFilter.selectedRegion = mockRegion;

      //@ts-ignore
      spyOn(component.localityStatisticsService, 'getStatisticsOfAdministrativeLevelLocalities').and.returnValue(of(localityStatisticsStates));
      await component.loadLocalityStatistics(AdministrativeLevel.State);

      //@ts-ignore
      expect(component.localityStatisticsService.getStatisticsOfAdministrativeLevelLocalities).toHaveBeenCalledWith(AdministrativeLevel.State, 'BR', mockRegion.code, '');
      expect(component.localityStatistics.length).toEqual(localityStatisticsStates.length);
    });

    it('should works for municipalities', async () => {
      component.mapFilter.selectedCountry = 'BR';
      component.mapFilter.selectedRegion = mockRegion;
      component.mapFilter.selectedState = mockState;

      //@ts-ignore
      spyOn(component.localityStatisticsService, 'getStatisticsOfAdministrativeLevelLocalities').and.returnValue(of(localityStatisticsMunicipalities));
      await component.loadLocalityStatistics(AdministrativeLevel.Municipality);

      //@ts-ignore
      expect(component.localityStatisticsService.getStatisticsOfAdministrativeLevelLocalities).toHaveBeenCalledWith(AdministrativeLevel.Municipality, 'BR', mockRegion.code, mockState.code);
      expect(component.localityStatistics.length).toEqual(localityStatisticsMunicipalities.length);
    });
  });

  describe('#loadRegionsGeoJson', () => {

    it('should exists', () => {
      expect(component.loadRegionsGeoJson).toBeTruthy();
      expect(component.loadRegionsGeoJson).toEqual(jasmine.any(Function));
    });

    it('should works when service throw error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getLocalityMapRegionsByCountry').and.throwError('Error message');
      await component.loadRegionsGeoJson().catch((error) => {
        expect(error.toString()).toEqual('Error: Error message');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getLocalityMapRegionsByCountry').and.returnValue(throwError({ message: 'http error' }));
      await component.loadRegionsGeoJson().catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('http error');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalledWith('Something went wrong loading regions localities: http error');
    });

    it('should works when service return success', async () => {
      spyOn(component, 'getLocalityStatisticsByRegionCode').and.returnValue(localityStatisticsRegions[0]);

      //@ts-ignore
      spyOn(component.localityMapService, 'getLocalityMapRegionsByCountry').and.returnValue(of(mockRegionsLocalityMap));
      await component.loadRegionsGeoJson();

      let count = 0;
      component.googleMap.data.forEach(feature => count++);
      expect(count).toEqual(mockRegionsLocalityMap.length);
      expect(component.getLocalityStatisticsByRegionCode).toHaveBeenCalled();
    });
  });

  describe('#loadStatesGeoJson', () => {

    it('should exists', () => {
      expect(component.loadStatesGeoJson).toBeTruthy();
      expect(component.loadStatesGeoJson).toEqual(jasmine.any(Function));
    });

    it('should works when service throw error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getStatesByRegion').and.throwError('Error message');
      await component.loadStatesGeoJson('', '').catch((error) => {
        expect(error.toString()).toEqual('Error: Error message');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getStatesByRegion').and.returnValue(throwError({ message: 'http error' }));
      await component.loadStatesGeoJson('', '').catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('http error');
      });

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalledWith('Something went wrong loading states json: http error');
    });

    it('should works when service return success', async () => {
      spyOn(component, 'getLocalityStatisticsByStateCode').and.returnValue(localityStatisticsStates[0]);

      //@ts-ignore
      spyOn(component.localityMapService, 'getStatesByRegion').and.returnValue(of(mockStatesLocalityMap));
      await component.loadStatesGeoJson('', '');

      let count = 0;
      component.googleMap.data.forEach(feature => count++);
      expect(count).toEqual(mockStatesLocalityMap.length);
      expect(component.getLocalityStatisticsByStateCode).toHaveBeenCalled();
    });
  });

  //#endregion
  ////////////////////////////////////////////

  //#region MAP MOUSE EVENTS
  ////////////////////////////////////////////

  describe('#getCenterJsonFromMapDataFeature', () => {

    it('should exists', () => {
      expect(component.getCenterJsonFromMapDataFeature).toBeTruthy();
      expect(component.getCenterJsonFromMapDataFeature).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonCities, {
        idPropertyName: 'municipality_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(mockGeoJsonCities.features[0].properties.municipality_code);
      if (dataFeature) {
        const bounds = new google.maps.LatLngBounds();
        component.processPoints(dataFeature?.getGeometry(), bounds.extend, bounds);

        const result = component.getCenterJsonFromMapDataFeature(dataFeature);
        expect(result).toEqual(bounds.getCenter().toJSON());
      }
    });
  });

  describe('#mouseClickInToRegion', () => {

    it('should exists', () => {
      expect(component.mouseClickInToRegion).toBeTruthy();
      expect(component.mouseClickInToRegion).toEqual(jasmine.any(Function));
    });

    it('should works for any adm_level', () => {
      spyOn(component, 'onSelectCity');
      spyOn(component, 'onSelectRegion');
      spyOn(component, 'onSelectState');

      const event = {
        feature: {
          getProperty: (propertyName: string) => {
            if (propertyName === 'code') return 'code01';
            if (propertyName === 'adm_level') return 'any';

            return '';
          }
        }
      } as any;

      component.mouseClickInToRegion(event);

      expect(component.onSelectCity).not.toHaveBeenCalled();
      expect(component.onSelectRegion).not.toHaveBeenCalled();
      expect(component.onSelectState).not.toHaveBeenCalled();
    });

    it('should works for city adm_level', () => {
      spyOn(component, 'onSelectCity');

      component.localityMapMunicipalities = mockCitiesLocalityMap;

      const municipality = component.localityMapMunicipalities[0].municipality;

      const event = {
        feature: {
          getProperty: (propertyName: string) => {
            if (propertyName === 'code') return municipality ? municipality.code : null;
            if (propertyName === 'adm_level') return 'municipality';

            return '';
          }
        }
      } as any;

      component.mouseClickInToRegion(event);
      if (municipality) {
        expect(component.onSelectCity).toHaveBeenCalledWith(municipality);
      }
    });

    it('should works for region adm_level', () => {
      spyOn(component, 'onSelectRegion');

      component.localityMapRegions = mockRegionsLocalityMap;

      const region = component.localityMapRegions[0].region;

      const event = {
        feature: {
          getProperty: (propertyName: string) => {
            if (propertyName === 'code') return region ? region.code : null;
            if (propertyName === 'adm_level') return 'region';

            return '';
          }
        }
      } as any;

      component.mouseClickInToRegion(event);

      if (region) {
        expect(component.onSelectRegion).toHaveBeenCalledWith(region);
      }
    });

    it('should works for state adm_level', () => {
      spyOn(component, 'onSelectState');

      component.localityMapStates = mockStatesLocalityMap;

      const state = component.localityMapStates[0].state;

      const event = {
        feature: {
          getProperty: (propertyName: string) => {
            if (propertyName === 'code') return state ? state.code : null;
            if (propertyName === 'adm_level') return 'state';

            return '';
          }
        }
      } as any;

      component.mouseClickInToRegion(event);

      if (state) {
        expect(component.onSelectState).toHaveBeenCalledWith(state);
      }
    });
  });

  describe('#mouseInToRegion', () => {
    beforeEach(() => {
      component.googleMap.data.forEach(feature => component.googleMap.data.remove(feature));
    });

    it('should exists', () => {
      expect(component.mouseInToRegion).toBeTruthy();
      expect(component.mouseInToRegion).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonCities, {
        idPropertyName: 'municipality_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(mockGeoJsonCities.features[0].properties.municipality_code);
      if (dataFeature) {
        spyOn(component.info, 'open');

        const geoJsonProperties = mockGeoJsonCities.features[0].properties;
        dataFeature.setProperty('code', geoJsonProperties.municipality_code);
        dataFeature.setProperty('name', geoJsonProperties.municipality_name);
        dataFeature.setProperty('state', 'normal');
        dataFeature.setProperty('stats', {});

        const event = {
          feature: dataFeature
        } as any;

        component.mouseInToRegion(event);

        expect(component.infoContent.content).toBeTruthy();
        expect(component.infoContent.content.code).toEqual(geoJsonProperties.municipality_code);
        expect(component.infoContent.content.name).toEqual(geoJsonProperties.municipality_name);
        expect(component.infoContent.content.stats).toEqual(jasmine.any(Object));
        expect(component.infoContent.content.type).toEqual(geoJsonProperties.adm_level);
        expect(event.feature.getProperty('state')).toEqual('hover');
        expect(component.info.open).toHaveBeenCalledWith(undefined, false);
      }
    });
  });

  describe('#mouseOutOfRegion', () => {

    it('should exists', () => {
      expect(component.mouseOutOfRegion).toBeTruthy();
      expect(component.mouseOutOfRegion).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonCities, {
        idPropertyName: 'municipality_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(mockGeoJsonCities.features[0].properties.municipality_code);
      if (dataFeature) {
        spyOn(component.info, 'close');

        dataFeature.setProperty('state', 'hover');

        const event = {
          feature: dataFeature
        } as any;

        component.mouseOutOfRegion(event);

        expect(event.feature.getProperty('state')).toEqual('normal');
        expect(component.info.close).toHaveBeenCalled();
      }
    });
  });

  describe('#zoomToFeature', () => {
    it('should exists', () => {
      expect(component.zoomToFeature).toBeTruthy();
      expect(component.zoomToFeature).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonCities, {
        idPropertyName: 'municipality_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(mockGeoJsonCities.features[0].properties.municipality_code);
      if (dataFeature) {
        spyOn(component.googleMap, 'fitBounds');

        var bounds = new google.maps.LatLngBounds();
        component.processPoints(dataFeature.getGeometry(), bounds.extend, bounds);

        component.zoomToFeature(dataFeature);

        expect(component.googleMap.fitBounds).toHaveBeenCalledWith(bounds);
      }
    });
  });

  //#endregion
  ////////////////////////////////////////////

  //#region MAP STATS PANEL
  ////////////////////////////////////////////
  describe('#closeStatsPanel', () => {

    it('should exists', () => {
      expect(component.removeCitiesFromMap).toBeTruthy();
      expect(component.removeCitiesFromMap).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.mapStatsPanel.item = {};
      component.mapStatsPanel.open = true;

      component.closeStatsPanel();

      expect(component.mapStatsPanel.item).toEqual(null);
      expect(component.mapStatsPanel.open).toEqual(false);
    });
  });

  describe('#getInternetAvailabilityPredictionUnitStr', () => {

    it('should exists', () => {
      expect(component.getInternetAvailabilityPredictionUnitStr).toBeTruthy();
      expect(component.getInternetAvailabilityPredictionUnitStr).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const predictionCount = 1500;
      const schoolsWithoutConnectivityDataCount = 3000;

      const predictionCountStr = new ShortNumberPipe().transform(predictionCount);
      const withoutDataCountStr = new ShortNumberPipe().transform(schoolsWithoutConnectivityDataCount);

      const result = component.getInternetAvailabilityPredictionUnitStr(predictionCount, schoolsWithoutConnectivityDataCount);

      expect(result).toEqual(`${predictionCountStr}/${withoutDataCountStr} schools`);
    });
  });

  describe('#getKeyValuePairToChartData', () => {

    it('should exists', () => {
      expect(component.getKeyValuePairToChartData).toBeTruthy();
      expect(component.getKeyValuePairToChartData).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const param = {
        'prop01': 'value01',
        'prop02': 'value02'
      };
      const expectedResult = [{
        name: 'prop01',
        value: 'value01'
      }, {
        name: 'prop02',
        value: 'value02'
      }];

      const result = component.getKeyValuePairToChartData(param);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('#getKeyValuePairToGroupedChartData', () => {

    it('should exists', () => {
      expect(component.getKeyValuePairToGroupedChartData).toBeTruthy();
      expect(component.getKeyValuePairToGroupedChartData).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const param = {
        'group01': {
          'item01': 'value01',
          'item02': 'value02'
        }
      };

      const expectedResult = [{
        name: 'group01',
        series: [{
          name: 'item01',
          value: 'value01'
        }, {
          name: 'item02',
          value: 'value02'
        }]
      }];

      const result = component.getKeyValuePairToGroupedChartData(param);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('#numberCardFormatPercentage', () => {

    it('should exists', () => {
      expect(component.numberCardFormatPercentage).toBeTruthy();
      expect(component.numberCardFormatPercentage).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      let result;

      result = component.numberCardFormatPercentage(75);
      expect(result).toEqual('75%');

      result = component.numberCardFormatPercentage({ value: 75 });
      expect(result).toEqual('75%');
    });
  });

  describe('#numberCardFormatShortNumber', () => {

    it('should exists', () => {
      expect(component.numberCardFormatShortNumber).toBeTruthy();
      expect(component.numberCardFormatShortNumber).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const result = component.numberCardFormatShortNumber({ value: 1500 });
      expect(result).toEqual(new ShortNumberPipe().transform(1500));
    });
  });

  describe('#openStatsPanel', () => {

    it('should exists', () => {
      expect(component.openStatsPanel).toBeTruthy();
      expect(component.openStatsPanel).toEqual(jasmine.any(Function));
    });

    it('should works without item stats', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonCities, {
        idPropertyName: 'municipality_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(mockGeoJsonCities.features[0].properties.municipality_code);
      if (dataFeature) {
        //@ts-ignore
        spyOn(component.alertService, 'showError');

        component.openStatsPanel(dataFeature);

        //@ts-ignore
        expect(component.alertService.showError).toHaveBeenCalledWith('Item statistics was not provided!');
      }
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonCities, {
        idPropertyName: 'municipality_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(mockGeoJsonCities.features[0].properties.municipality_code);
      if (dataFeature) {
        dataFeature.setProperty('stats', mockRegionStats);

        component.openStatsPanel(dataFeature);

        expect(component.mapStatsPanel.internetAvailabityPrediction).toEqual(mockRegionStats.schoolInternetAvailabilityPredicitionPercentage);
        expect(component.mapStatsPanel.internetAvailabityPredictionUnits).toEqual(component.getInternetAvailabilityPredictionUnitStr(regionStats.schoolInternetAvailabilityPredicitionCount, regionStats.schoolWithoutInternetAvailabilityCount));
        expect(component.mapStatsPanel.connectivityBySchoolRegion).toEqual(component.getKeyValuePairToGroupedChartData(regionStats.internetAvailabilityBySchoolRegion));
        expect(component.mapStatsPanel.connectivityBySchoolType).toEqual(component.getKeyValuePairToGroupedChartData(regionStats.internetAvailabilityBySchoolType));
        expect(component.mapStatsPanel.open).toBeTrue();
      }
    });
  });

  describe('#toggleStatsPanel', () => {

    it('should exists', () => {
      expect(component.toggleStatsPanel).toBeTruthy();
      expect(component.toggleStatsPanel).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const statsPanelOpen = component.mapStatsPanel.open;

      component.toggleStatsPanel();

      expect(component.mapStatsPanel.open).toEqual(!statsPanelOpen);
    });
  });

  //#endregion
  ////////////////////////////////////////////

  //#region MAP UTIL FUNCTIONs
  ////////////////////////////////////////////

  describe('#removeCitiesFromMap', () => {

    it('should exists', () => {
      expect(component.removeCitiesFromMap).toBeTruthy();
      expect(component.removeCitiesFromMap).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(mockGeoJsonCities);

      let citiesCount = 0;
      component.googleMap.data.forEach((feature) => {
        if (feature.getProperty('adm_level') === 'municipality') {
          citiesCount++;
        }
      });

      expect(citiesCount).toEqual(mockGeoJsonCities.features.length);

      component.removeCitiesFromMap();

      citiesCount = 0;
      component.googleMap.data.forEach((feature) => {
        if (feature.getProperty('adm_level') === 'municipality') {
          citiesCount++;
        }
      });

      expect(citiesCount).toEqual(0);
    });
  });

  describe('#removeStatesFromMap', () => {

    it('should exists', () => {
      expect(component.removeStatesFromMap).toBeTruthy();
      expect(component.removeStatesFromMap).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.googleMap.data.addGeoJson(geoJsonStates);

      let citiesCount = 0;
      component.googleMap.data.forEach((feature) => {
        if (feature.getProperty('adm_level') === 'state') {
          citiesCount++;
        }
      });

      expect(citiesCount).toEqual(geoJsonStates.features.length);

      component.removeStatesFromMap();

      citiesCount = 0;
      component.googleMap.data.forEach((feature) => {
        if (feature.getProperty('adm_level') === 'state') {
          citiesCount++;
        }
      });

      expect(citiesCount).toEqual(0);
    });
  });

  describe('#setMapElementFillColor', () => {

    it('should exists', () => {
      expect(component.setMapElementFillColor).toBeTruthy();
      expect(component.setMapElementFillColor).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      let element = {
        properties: {
          stats: <LocalityStatistics>{
            schoolInternetAvailabilityPercentage: 70,
            schoolInternetAvailabilityPredicitionPercentage: 50
          },
          fillColor: '',
          fillColorIndex: 0
        }
      };

      const viewOption = component.mapFilter.viewOptions.find(x => x.value === 'Connectivity');
      if (viewOption) {
        component.filterForm.controls['selectedViewOption'].setValue(viewOption);
      }

      const percentage = component.getPercentageValueForFillColor(element.properties.stats);
      const indexAtPercentage = component.getRangeColorIndex(percentage);

      component.setMapElementFillColor(element);

      expect(element.properties.fillColor).toEqual(component.getSelectedViewOption.rangeColors[indexAtPercentage].backgroundColor);
      expect(element.properties.fillColorIndex).toEqual(indexAtPercentage);
    });
  });

  describe('#setMapDataStyles', () => {
    it('should exists', () => {
      expect(component.setMapDataStyles).toBeTruthy();
      expect(component.setMapDataStyles).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const expectedResult = {
        strokeWeight: 0.5,
        strokeColor: '#fff',
        zIndex: 0,
        fillColor: '#000',
        fillOpacity: 0.75,
        visible: true,
      };

      component.googleMap.data.addGeoJson(geoJsonSample, {
        idPropertyName: 'id'
      });

      const dataFeature = component.googleMap.data.getFeatureById(geoJsonSample.features[0].properties.id);

      if (dataFeature) {
        let result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // normal state
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // hover state
        dataFeature.setProperty('state', 'hover');
        expectedResult.strokeWeight = 2;
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // unfocused state
        dataFeature.setProperty('state', 'unfocused');
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#dedede';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // with stats property
        dataFeature.setProperty('state', 'normal');
        dataFeature.setProperty('stats', {});
        dataFeature.setProperty('fillColor', '#fafafa')
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#fafafa';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);
      }
    });

    it('should works feature type equals city', () => {
      const expectedResult = {
        strokeWeight: 0.5,
        strokeColor: '#fff',
        zIndex: 3,
        fillColor: '#000',
        fillOpacity: 0.75,
        visible: true,
      };

      component.googleMap.data.addGeoJson(mockGeoJsonCities, {
        idPropertyName: 'municipality_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(mockGeoJsonCities.features[0].properties.municipality_code);

      if (dataFeature) {
        let result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // normal state
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // hover state
        dataFeature.setProperty('state', 'hover');
        expectedResult.strokeWeight = 2;
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // unfocused state
        dataFeature.setProperty('state', 'unfocused');
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#dedede';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // with stats property
        dataFeature.setProperty('state', 'normal');
        dataFeature.setProperty('stats', {});
        dataFeature.setProperty('fillColor', '#fafafa')
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#fafafa';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);
      }
    });

    it('should works feature type equals state', () => {
      const expectedResult = {
        strokeWeight: 0.5,
        strokeColor: '#fff',
        zIndex: 2,
        fillColor: '#000',
        fillOpacity: 0.75,
        visible: true,
      };

      component.googleMap.data.addGeoJson(geoJsonStates, {
        idPropertyName: 'state_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(geoJsonCities.features[0].properties.state_code);

      if (dataFeature) {
        let result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // normal state
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // hover state
        dataFeature.setProperty('state', 'hover');
        expectedResult.strokeWeight = 2;
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // unfocused state
        dataFeature.setProperty('state', 'unfocused');
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#dedede';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // with stats property
        dataFeature.setProperty('state', 'normal');
        dataFeature.setProperty('stats', {});
        dataFeature.setProperty('fillColor', '#fafafa')
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#fafafa';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);
      }
    });

    it('should works feature type equals region', () => {
      const expectedResult = {
        strokeWeight: 0.5,
        strokeColor: '#fff',
        zIndex: 1,
        fillColor: '#000',
        fillOpacity: 0.75,
        visible: true,
      };

      component.googleMap.data.addGeoJson(geoJsonRegions, {
        idPropertyName: 'region_code'
      });

      const dataFeature = component.googleMap.data.getFeatureById(geoJsonRegions.features[0].properties.region_code);

      if (dataFeature) {
        // normal state
        let result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // hover state
        dataFeature.setProperty('state', 'hover');
        expectedResult.strokeWeight = 2;
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // unfocused state
        dataFeature.setProperty('state', 'unfocused');
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#dedede';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);

        // with stats property
        dataFeature.setProperty('state', 'normal');
        dataFeature.setProperty('stats', {});
        dataFeature.setProperty('fillColor', '#fafafa')
        expectedResult.strokeWeight = 0.5;
        expectedResult.fillColor = '#fafafa';
        result = component.setMapDataStyles(dataFeature);
        expect(result).toEqual(expectedResult);
      }
    });
  });

  //#endregion
  ////////////////////////////////////////////

  //#region MAT-SELECT FUNCTIONS
  ////////////////////////////////////////////

  describe('#matSelectCompareCodes', () => {

    it('should exists', () => {
      expect(component.matSelectCompareCodes).toBeTruthy();
      expect(component.matSelectCompareCodes).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      let result = component.matSelectCompareCodes({}, {});
      expect(result).toEqual(true);

      result = component.matSelectCompareCodes({ code: '1' }, { code: '1' });
      expect(result).toEqual(true);

      result = component.matSelectCompareCodes({ code: '1' }, { code: '2' });
      expect(result).toEqual(false);
    });
  });

  describe('#onRegionSelectionChange', () => {

    it('should exists', () => {
      expect(component.onRegionSelectionChange).toBeTruthy();
      expect(component.onRegionSelectionChange).toEqual(jasmine.any(Function));
    });

    it('should works with selected region', () => {
      spyOn(component, 'onSelectRegion');
      spyOn(component, 'toggleFilterSettingsExpanded');

      const region = new Region('1', 'Region 1');
      component.mapFilter.selectedRegion = region;

      component.onRegionSelectionChange();

      expect(component.onSelectRegion).toHaveBeenCalledWith(component.mapFilter.selectedRegion);
      expect(component.toggleFilterSettingsExpanded).toHaveBeenCalledWith(false);
    });

    it('should works without selected region', () => {
      spyOn(component, 'loadRegionsGeoJson');

      component.googleMap.data.addGeoJson(geoJsonSample, {
        idPropertyName: 'id',
      });

      let count = 0;
      component.googleMap.data.forEach(x => count++);

      expect(count).toEqual(1);

      component.mapFilter.selectedRegion = undefined;

      component.onRegionSelectionChange();

      count = 0;
      component.googleMap.data.forEach(x => count++);

      expect(count).toEqual(0);

      expect(component.loadRegionsGeoJson).toHaveBeenCalledWith();
    });
  });

  describe('#onStateSelectionChange', () => {

    it('should exists', () => {
      expect(component.onStateSelectionChange).toBeTruthy();
      expect(component.onStateSelectionChange).toEqual(jasmine.any(Function));
    });

    it('should works with selected state', async () => {
      spyOn(component, 'onSelectRegion');
      spyOn(component, 'onSelectState');
      spyOn(component, 'toggleFilterSettingsExpanded');

      const region = new Region('1', 'Region 1');
      const state = new State('1', 'State 1', region);
      component.mapFilter.selectedState = state;

      await component.onStateSelectionChange();

      expect(component.onSelectRegion).toHaveBeenCalledWith(component.mapFilter.selectedState.region);
      expect(component.onSelectState).toHaveBeenCalledWith(component.mapFilter.selectedState);
      expect(component.toggleFilterSettingsExpanded).toHaveBeenCalledWith(false);
    });

    it('should works without selected state', async () => {
      spyOn(component, 'loadRegionsGeoJson');
      spyOn(component, 'toggleFilterSettingsExpanded');

      component.googleMap.data.addGeoJson(geoJsonSample, {
        idPropertyName: 'id',
      });

      let count = 0;
      component.googleMap.data.forEach(x => count++);

      expect(count).toEqual(1);

      component.mapFilter.selectedState = undefined;

      await component.onStateSelectionChange();

      count = 0;
      component.googleMap.data.forEach(x => count++);

      expect(count).toEqual(0);

      expect(component.loadRegionsGeoJson).toHaveBeenCalledWith();
      expect(component.toggleFilterSettingsExpanded).toHaveBeenCalledWith(false);
    });
  });

  //#endregion
  ////////////////////////////////////////////

  //#region SEARCH LOCATION AUTOCOMPLETE
  ////////////////////////////////////////////
  describe('#getSearchLocationAutocompleteText', () => {

    it('should exists', () => {
      expect(component.getSearchLocationAutocompleteText).toBeTruthy();
      expect(component.getSearchLocationAutocompleteText).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      let result;
      let locationAutocomplete = <LocalityMapAutocomplete>{
        name: 'Name01'
      };

      result = component.getSearchLocationAutocompleteText(locationAutocomplete);
      expect(result).toEqual(locationAutocomplete.name);

      locationAutocomplete = <LocalityMapAutocomplete>{};
      result = component.getSearchLocationAutocompleteText(locationAutocomplete);
      expect(result).toBeUndefined();
    });
  });

  describe('#initSearchLocationFilteredOptions', () => {

    it('should exists', () => {
      expect(component.initSearchLocationFilteredOptions).toBeTruthy();
      expect(component.initSearchLocationFilteredOptions).toEqual(jasmine.any(Function));
    });

    it('should works filter length > 3', fakeAsync(() => {
      spyOn(component, 'loadAutocompleteSearchOptions');

      component.initSearchLocationFilteredOptions();

      component.filterForm.controls.searchFilter.setValue('regio', { emitEvent: true });

      tick(2000);

      expect(component.loadAutocompleteSearchOptions).toHaveBeenCalled();
    }));

    it('should works filter length < 3', fakeAsync(() => {
      spyOn(component, 'loadAutocompleteSearchOptions');

      component.initSearchLocationFilteredOptions();

      component.filterForm.controls.searchFilter.setValue('re', { emitEvent: true });

      tick(2000);

      expect(component.loadingAutocomplete).toEqual(false);
    }));
  });

  describe('#loadAutocompleteSearchOptions', () => {
    it('should exists', () => {
      expect(component.loadAutocompleteSearchOptions).toBeTruthy();
      expect(component.loadAutocompleteSearchOptions).toEqual(jasmine.any(Function));
    });

    it('should works when server fail', () => {
      //@ts-ignore
      spyOn(component.alertService, 'showError');

      //@ts-ignore
      spyOn(component.localityMapService, 'getLocalityAutocompleteByCountry').and.returnValue(throwError({ message: 'http error' }));

      component.loadingAutocomplete = true;

      component.loadAutocompleteSearchOptions('region');

      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalled();
      //@ts-ignore
      expect(component.alertService.showError).toHaveBeenCalledWith('Something went wrong with autocomplete api calls: http error');
      expect(component.loadingAutocomplete).toEqual(false);
    });

    it('should works when server success', () => {
      //@ts-ignore
      spyOn(component.localityMapService, 'getLocalityAutocompleteByCountry').and.returnValue(of(localitiesMapAutocompleteResponseFromServer));

      component.loadingAutocomplete = true;

      component.loadAutocompleteSearchOptions('region');

      //@ts-ignore
      expect(component.searchLocationFilteredOptions).toEqual(jasmine.any(Array));
      expect(component.searchLocationFilteredOptions.length).toEqual(localitiesMapAutocompleteResponseFromServer.length);
      expect(component.loadingAutocomplete).toEqual(false);
    });
  });

  describe('#loadAutocompleteSearchOptions', () => {

    it('should exists', () => {
      expect(component.onSelectLocationSearchOption).toBeTruthy();
      expect(component.onSelectLocationSearchOption).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      // Creating spy
      spyOn(component, 'onSelectRegion');
      spyOn(component, 'onSelectState');
      spyOn(component, 'onSelectCity');

      // Initializing variables and setting properties values for test scenario
      const cityFromGeoJson = mockGeoJsonCities.features[0].properties;
      const region = new Region(cityFromGeoJson.region_code, cityFromGeoJson.region_name);
      const state = new State(cityFromGeoJson.state_code, cityFromGeoJson.state_name, region);
      const city = new City(cityFromGeoJson.municipality_code, cityFromGeoJson.municipality_name, state);

      let event = {
        option: {
          value: {}
        }
      } as MatAutocompleteSelectedEvent;

      // Test result expectations
      // Any selected location type
      await component.onSelectLocationSearchOption(event);
      expect(component.onSelectRegion).not.toHaveBeenCalled();
      expect(component.onSelectState).not.toHaveBeenCalled();
      expect(component.onSelectCity).not.toHaveBeenCalled();

      // Selected option type city
      event.option.value = <LocalityMapAutocomplete>{
        administrativeLevel: 'municipality',
        municipality: city
      }
      await component.onSelectLocationSearchOption(event);
      expect(component.onSelectRegion).toHaveBeenCalledWith(city.state.region);
      expect(component.onSelectState).toHaveBeenCalledWith(city.state);
      expect(component.onSelectCity).toHaveBeenCalledWith(city);

      // Selected option type state
      event.option.value = <LocalityMapAutocomplete>{
        administrativeLevel: 'state',
        state: state
      }
      await component.onSelectLocationSearchOption(event);
      expect(component.onSelectRegion).toHaveBeenCalledWith(state.region);
      expect(component.onSelectState).toHaveBeenCalledWith(state);

      // Selected option type region
      event.option.value = <LocalityMapAutocomplete>{
        administrativeLevel: 'region',
        region: region
      }
      await component.onSelectLocationSearchOption(event);
      expect(component.onSelectRegion).toHaveBeenCalledWith(region);
    })
  });

  //#endregion
  ////////////////////////////////////////////

  //#region UTIL FUNCTIONS
  ////////////////////////////////////////////
  describe('#getConnectivityPredictionBarColor', () => {

    it('should exists', () => {
      expect(component.getConnectivityPredictionBarColor).toBeTruthy();
      expect(component.getConnectivityPredictionBarColor).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const valueYes = 'Yes';
      const valueNo = 'No';
      const valueNA = 'NA';

      expect(component.getConnectivityPredictionBarColor(valueYes)).toEqual(component.schoolsPredictionColorScheme[valueYes]);
      expect(component.getConnectivityPredictionBarColor(valueNo)).toEqual(component.schoolsPredictionColorScheme[valueNo]);
      expect(component.getConnectivityPredictionBarColor(valueNA)).toEqual(component.schoolsPredictionColorScheme[valueNA]);

    });
  });

  describe('#getLocalityStatisticsByRegionCode', () => {

    it('should exists', () => {
      expect(component.getLocalityStatisticsByRegionCode).toBeTruthy();
      expect(component.getLocalityStatisticsByRegionCode).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.localityStatistics = localityStatisticsRegions;

      const localityStatistics = localityStatisticsRegions[0];

      const result = component.getLocalityStatisticsByRegionCode(localityStatistics.localityMap.regionCode.toString());

      expect(result).toEqual(localityStatistics);
    })
  });

  describe('#getLocalityStatisticsByStateCode', () => {

    it('should exists', () => {
      expect(component.getLocalityStatisticsByStateCode).toBeTruthy();
      expect(component.getLocalityStatisticsByStateCode).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.localityStatistics = localityStatisticsStates;

      const localityStatistics = localityStatisticsStates[0];

      const result = component.getLocalityStatisticsByStateCode(localityStatistics.localityMap.stateCode.toString());

      expect(result).toEqual(localityStatistics);
    })
  });

  describe('#getLocalityStatisticsByMunicipalityCode', () => {

    it('should exists', () => {
      expect(component.getLocalityStatisticsByMunicipalityCode).toBeTruthy();
      expect(component.getLocalityStatisticsByMunicipalityCode).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.localityStatistics = localityStatisticsMunicipalities;

      const localityStatistics = localityStatisticsMunicipalities[0];

      const result = component.getLocalityStatisticsByMunicipalityCode(localityStatistics.localityMap.municipalityCode.toString());

      expect(result).toEqual(localityStatistics);
    })
  });

  describe('#getStateCodesFromRegion', () => {

    it('should exists', () => {
      expect(component.getStateCodesFromRegion).toBeTruthy();
      expect(component.getStateCodesFromRegion).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const region = new Region('1', 'Region 1');
      const stateOptions = new Array<State>();
      stateOptions.push(new State('1', 'State 1', region));
      stateOptions.push(new State('2', 'State 2', region));

      component.mapFilter.stateOptions = stateOptions;

      let stateCodes = component.getStateCodesFromRegion(region.code.toString());

      expect(stateCodes).toBeTruthy();
      expect(stateCodes.length).toEqual(2);
      expect(stateCodes).toEqual(['1', '2']);

      stateCodes = component.getStateCodesFromRegion('2');

      expect(stateCodes).toBeTruthy();
      expect(stateCodes.length).toEqual(0);
    })
  });

  describe('#getPercentageValueForFillColor', () => {

    it('should exists', () => {
      expect(component.getPercentageValueForFillColor).toBeTruthy();
      expect(component.getPercentageValueForFillColor).toEqual(jasmine.any(Function));
    });

    it('should works for connectivity view', () => {
      const viewOption = component.mapFilter.viewOptions.find(x => x.value === 'Connectivity');
      if (viewOption) {
        component.filterForm.controls['selectedViewOption'].setValue(viewOption);
        const stats = <LocalityStatistics>{
          schoolInternetAvailabilityPredicitionPercentage: 50,
          schoolInternetAvailabilityCount: 80
        };

        const result = component.getPercentageValueForFillColor(stats)

        expect(result).toEqual(stats.schoolInternetAvailabilityPercentage);
      }
    });

    it('should works for connectivity prediction view', () => {
      const viewOption = component.mapFilter.viewOptions.find(x => x.value === 'Prediction');
      if (viewOption) {
        component.filterForm.controls['selectedViewOption'].setValue(viewOption);
        const stats = <LocalityStatistics>{
          schoolInternetAvailabilityPredicitionPercentage: 50,
          schoolInternetAvailabilityPercentage: 80
        };

        const result = component.getPercentageValueForFillColor(stats)

        expect(result).toEqual(stats.schoolInternetAvailabilityPredicitionPercentage);
      }
    });
  });

  describe('#getRangeColorIndex', () => {

    it('should exists', () => {
      expect(component.getRangeColorIndex).toBeTruthy();
      expect(component.getRangeColorIndex).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const rangeColors = component.getSelectedViewOption.rangeColors;

      // Testing for all range colors values
      rangeColors.forEach((color, index) => {
        expect(component.getRangeColorIndex(color.min)).toEqual(index);
        expect(component.getRangeColorIndex(color.max)).toEqual(index);
      });
    })
  });

  describe('#getRangeColorTooltipMessage', () => {

    it('should exists', () => {
      expect(component.getRangeColorTooltipMessage).toBeTruthy();
      expect(component.getRangeColorTooltipMessage).toEqual(jasmine.any(Function));
    });

    it('should works for connectivity view', () => {
      const viewOption = component.mapFilter.viewOptions.find(x => x.value === 'Connectivity');
      if (viewOption) {
        component.filterForm.controls['selectedViewOption'].setValue(viewOption);
        const tooltipMessage = component.getRangeColorTooltipMessage(0);

        expect(tooltipMessage).toEqual(`Between ${viewOption.rangeColors[0].min} and ${viewOption.rangeColors[0].max} percent of schools connected`);
      }
    });

    it('should works for connectivity prediction view', () => {
      const viewOption = component.mapFilter.viewOptions.find(x => x.value === 'Prediction');
      if (viewOption) {
        component.filterForm.controls['selectedViewOption'].setValue(viewOption);

        const tooltipMessage = component.getRangeColorTooltipMessage(0);

        expect(tooltipMessage).toEqual(`Between ${viewOption.rangeColors[0].min} and ${viewOption.rangeColors[0].max} percent of connectivity prediction`);
      }
    });
  });

  describe('#toggleFilterSettingsExpanded', () => {

    it('should exists', () => {
      expect(component.toggleFilterSettingsExpanded).toBeTruthy();
      expect(component.toggleFilterSettingsExpanded).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.filterSettingsExpanded = false;

      component.toggleFilterSettingsExpanded(true);

      expect(component.filterSettingsExpanded).toBeTrue();
    })
  });
  //#endregion
  ////////////////////////////////////////////
});
