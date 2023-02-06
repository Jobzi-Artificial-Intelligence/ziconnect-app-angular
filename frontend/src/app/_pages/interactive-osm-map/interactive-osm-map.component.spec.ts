import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularMaterialModule } from 'src/app/material.module';
import { AdministrativeLevel, LocalityStatistics, Region, State } from 'src/app/_models';
import { of, throwError } from 'rxjs';

import { InteractiveOsmMapComponent } from './interactive-osm-map.component';
import { municipalityLayers, regionLayers, stateLayers } from 'src/test/locality-map-layers';
import { ShortNumberPipe } from 'src/app/_pipes/short-number.pipe';
import { regionStats } from 'src/test/item-stats-mock';

describe('InteractiveOsmMapComponent', () => {
  let component: InteractiveOsmMapComponent;
  let fixture: ComponentFixture<InteractiveOsmMapComponent>;

  const mockRegion = new Region('code01', 'Name01');
  const mockState = new State('code01', 'Name01', mockRegion);

  let mockMunicipalityLayers = municipalityLayers;
  let mockStateLayers = stateLayers;
  let mockRegionLayers = regionLayers;
  let mockRegionStats: LocalityStatistics;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveOsmMapComponent, ShortNumberPipe],
      imports: [
        AngularMaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        LeafletModule,
        NgxChartsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    // Clone object
    mockRegionStats = JSON.parse(JSON.stringify(regionStats));

    fixture = TestBed.createComponent(InteractiveOsmMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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
      spyOn(component, 'initRegionSelectOptions');
      spyOn(component, 'initStateSelectOptions');
      spyOn(component, 'initSearchLocationFilteredOptions');

      await component.ngOnInit();

      expect(component.initMapViewOptions).toHaveBeenCalled();
      expect(component.watchLoadingMap).toHaveBeenCalled();
      expect(component.loadLocalityStatistics).toHaveBeenCalled();
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
      spyOn(component, 'updateLayerFillColorByViewOption');

      component.mapMunicipalityLayers = mockMunicipalityLayers;
      component.mapRegionLayers = mockRegionLayers;
      component.mapStateLayers = mockStateLayers;

      const viewOption = component.mapFilter.viewOptions.find(x => x.value === 'Prediction');
      if (viewOption) {
        component.filterForm.controls['selectedViewOption'].setValue(viewOption);
        component.onChangeSelectedViewOption({} as any);

        expect(component.toggleFilterSettingsExpanded).toHaveBeenCalledWith(false);
        expect(component.updateLayerFillColorByViewOption).toHaveBeenCalled();
        expect(component.updateLayerFillColorByViewOption).toHaveBeenCalledTimes(3);
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
      spyOn(component, 'loadRegionsGeoJson');
      spyOn(component, 'closeStatsPanel');
      spyOn(component.map, 'setView');

      await component.onCountryClick();

      expect(component.loadLocalityStatistics).toHaveBeenCalledWith(AdministrativeLevel.Region);
      expect(component.loadRegionsGeoJson).toHaveBeenCalled();
      expect(component.closeStatsPanel).toHaveBeenCalled();
      expect(component.map.setView).toHaveBeenCalledWith(component.mapOptions.center, component.mapOptions.zoom);
    });
  });

  describe('#onLegendItemMouseEnter', () => {

    it('should exists', () => {
      expect(component.onLegendItemMouseEnter).toBeTruthy();
      expect(component.onLegendItemMouseEnter).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const rangeColorIndex = 0;

      spyOn(component, 'setLayerStateUnfocusedByColorIndex');

      component.onLegendItemMouseEnter(rangeColorIndex);

      expect(component.setLayerStateUnfocusedByColorIndex).toHaveBeenCalledWith(rangeColorIndex, component.mapRegionLayers);
      expect(component.setLayerStateUnfocusedByColorIndex).toHaveBeenCalledWith(rangeColorIndex, component.mapStateLayers);
      expect(component.setLayerStateUnfocusedByColorIndex).toHaveBeenCalledWith(rangeColorIndex, component.mapMunicipalityLayers);
    });
  });

  describe('#onLegendItemMouseLeave', () => {

    it('should exists', () => {
      expect(component.onLegendItemMouseLeave).toBeTruthy();
      expect(component.onLegendItemMouseLeave).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(component, 'setLayerStateUnfocusedToNormalState');

      component.onLegendItemMouseLeave();

      expect(component.setLayerStateUnfocusedToNormalState).toHaveBeenCalledWith(component.mapRegionLayers);
      expect(component.setLayerStateUnfocusedToNormalState).toHaveBeenCalledWith(component.mapStateLayers);
      expect(component.setLayerStateUnfocusedToNormalState).toHaveBeenCalledWith(component.mapMunicipalityLayers);
    });
  });

  //#endregion
  ////////////////////////////////////////////

  //#region MAP STATS PANEL
  ////////////////////////////////////////////

  describe('#closeStatsPanel', () => {

    it('should exists', () => {
      expect(component.closeStatsPanel).toBeTruthy();
      expect(component.closeStatsPanel).toEqual(jasmine.any(Function));
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
      component.mapRegionLayers = mockRegionLayers;
      const dataFeature = component.mapRegionLayers[Object.keys(component.mapRegionLayers)[0]].feature;
      if (dataFeature) {
        dataFeature.properties.stats = null;

        //@ts-ignore
        spyOn(component.alertService, 'showError');

        component.openStatsPanel(dataFeature);

        //@ts-ignore
        expect(component.alertService.showError).toHaveBeenCalledWith('Item statistics was not provided!');
      }
    });

    it('should works', () => {
      component.mapRegionLayers = mockRegionLayers;
      const dataFeature = component.mapRegionLayers[Object.keys(component.mapRegionLayers)[0]].feature;
      if (dataFeature) {
        dataFeature.properties.stats = mockRegionStats;

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
});
