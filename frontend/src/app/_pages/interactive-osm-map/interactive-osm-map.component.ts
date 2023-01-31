import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GeoJsonObject } from 'geojson';
import * as Leaflet from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { MapViewOptionValue } from 'src/app/_helpers';
import { IMapFilter, IMapViewOption } from 'src/app/_interfaces';
import { AdministrativeLevel, LocalityMap, LocalityStatistics, Region, State } from 'src/app/_models';
import { AlertService, LocalityMapService, LocalityStatisticsService } from 'src/app/_services';

@Component({
  selector: 'app-interactive-osm-map',
  templateUrl: './interactive-osm-map.component.html',
  styleUrls: ['./interactive-osm-map.component.scss']
})
export class InteractiveOsmMapComponent implements OnInit {
  title = 'Jobzi - Interactive Map';
  public filterForm!: FormGroup<any>;

  // LOCALITY MAP LIST
  localityMapRegions: LocalityMap[] = new Array<LocalityMap>();

  loadingMap: BehaviorSubject<boolean>;
  loadingMessage = '';
  loadingAutocomplete = false;

  localityStatistics: LocalityStatistics[] = new Array<LocalityStatistics>();

  //#region LEAFLET MAP OPTIONS
  ////////////////////////////////////////////
  map!: Leaflet.Map;
  mapOptions = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 5,
    zoomControl: false,
    center: { lat: -15.0110132, lng: -53.3649369 }
  }

  mapFilter: IMapFilter = {
    regionOptions: new Array<Region>(),
    stateOptions: new Array<State>(),
    selectedCountry: 'BR',
    selectedCity: undefined,
    selectedState: undefined,
    selectedSchoolRegion: '',
    selectedSchoolType: '',
    viewOptions: new Array<IMapViewOption>()
  };

  mapRegionsLayers: any = {};

  //#endregion
  ////////////////////////////////////////////

  //#region COMPONENT INITIALIZATION
  ////////////////////////////////////////////
  constructor(private alertService: AlertService,
    private localityMapService: LocalityMapService,
    private localityStatisticsService: LocalityStatisticsService
  ) {
    this.loadingMap = new BehaviorSubject<boolean>(false);
  }

  async ngOnInit() {
    // INITIALIZE MAP VIEW OPTIONS
    this.initMapViewOptions();

    // INITIALIZE FILTER FORM FIELDS
    this.filterForm = new FormGroup<any>({
      searchFilter: new FormControl(),
      selectedSchoolRegion: new FormControl<string>(''),
      selectedSchoolType: new FormControl<string>(''),
      selectedViewOption: new FormControl<IMapViewOption>(this.mapFilter.viewOptions[0])
    });

    // INIT OBSERVABLES
    this.watchLoadingMap();

    await this.loadLocalityStatistics(AdministrativeLevel.Region);
  }

  async onMapReady($event: Leaflet.Map) {
    this.map = $event;

    this.map.addControl(Leaflet.control.zoom({
      position: 'bottomright'
    }));

    await this.loadRegionsGeoJson();
  }

  initMapViewOptions() {
    // Connectivity View Option
    this.mapFilter.viewOptions.push({
      name: 'Connectivity Map',
      description: 'Map elements are displayed with colors according to the connectivity percentage',
      rangeColors: [
        { min: 0, max: 19, color: '#202124', backgroundColor: '#eff3ff' },
        { min: 20, max: 39, color: '#202124', backgroundColor: '#bdd7e7' },
        { min: 40, max: 59, color: '#fff', backgroundColor: '#6baed6' },
        { min: 60, max: 79, color: '#fff', backgroundColor: '#3182bd' },
        { min: 80, max: 100, color: '#fff', backgroundColor: '#08519c' }
      ],
      value: MapViewOptionValue.Connectivity
    } as IMapViewOption);

    // Prediction View Option
    this.mapFilter.viewOptions.push({
      name: 'Prediction Map',
      description: 'Map elements are displayed with colors according to the predicted connectivity percentage',
      rangeColors: [
        { min: 0, max: 19, color: '#202124', backgroundColor: '#ACDDB6' },
        { min: 20, max: 39, color: '#202124', backgroundColor: '#74C286' },
        { min: 40, max: 59, color: '#fff', backgroundColor: '#20A14E' },
        { min: 60, max: 79, color: '#fff', backgroundColor: '#0D7434' },
        { min: 80, max: 100, color: '#fff', backgroundColor: '#004616' }
      ],
      value: MapViewOptionValue.Prediction
    } as IMapViewOption)
  }
  //#endregion
  ////////////////////////////////////////////

  //#region MAP LOAD FUNCTIONS
  ////////////////////////////////////////////
  async loadLocalityStatistics(administrativeLevel: AdministrativeLevel) {
    return new Promise((resolve, reject) => {
      this.loadingMap.next(true);
      this.loadingMessage = 'Loading stats...';

      try {
        this.localityStatisticsService
          .getStatisticsOfAdministrativeLevelLocalities(
            administrativeLevel,
            this.mapFilter.selectedCountry,
            this.mapFilter.selectedRegion ? this.mapFilter.selectedRegion.code.toString() : '',
            this.mapFilter.selectedState ? this.mapFilter.selectedState.code.toString() : ''
          )
          .subscribe(
            (data) => {
              this.localityStatistics = data;

              this.loadingMap.next(false);
              this.loadingMessage = '';
              resolve(null);
            },
            (error) => {
              this.loadingMap.next(false);
              this.loadingMessage = '';
              this.alertService.showError(`Something went wrong loading locality statistics: ${error.message}`);
              resolve(null);
            }
          );
      } catch (error: any) {
        this.loadingMap.next(false);
        this.loadingMessage = '';

        this.alertService.showError(error);

        reject(error);
      }
    });
  }

  async loadRegionsGeoJson() {
    return new Promise((resolve, reject) => {
      this.loadingMap.next(true)
      this.loadingMessage = 'Loading regions...';

      try {
        this.localityMapService.getLocalityMapRegionsByCountry('BR').subscribe(
          (data: any) => {
            this.localityMapRegions = data;

            const featureCollection = this.localityMapService.getFeatureCollectionFromLocalityList(data);

            // BUILD STATS
            for (let index = 0; index < featureCollection.features.length; index++) {
              const element = featureCollection.features[index];
              element.properties.code = element.properties['region_code'];
              element.properties.filtered = true;
              element.properties.name = element.properties['region_name'];
              element.properties.stats = this.getLocalityStatisticsByRegionCode(element.properties.code);

              //SET FILL COLOR
              if (element.properties.stats) {
                this.setMapElementFillColor(element);
              }
            }

            // ADD REGION LAYER
            this.map.addLayer(Leaflet.geoJSON(featureCollection as GeoJsonObject, {
              style: this.setMapDataStyles,
              onEachFeature: (feature, layer) => {
                this.mapRegionsLayers[feature.properties.code] = layer;

                layer.on('click', this.onMapRegionClick, this);
              }
            }));

            this.loadingMap.next(false);
            this.loadingMessage = '';

            resolve(null);
          },
          (error) => {
            this.loadingMap.next(false);
            this.loadingMessage = '';
            this.alertService.showError(`Something went wrong loading regions localities: ${error.message}`);

            reject(error);
          }
        );
      } catch (error: any) {
        this.loadingMap.next(false);
        this.loadingMessage = '';

        this.alertService.showError(error);

        reject(error);
      }
    });
  }
  //#endregion
  ////////////////////////////////////////////

  //#region MAP MOUSE FUNCTIONS
  ////////////////////////////////////////////
  onMapRegionClick(e: any) {
    const regionCode = e.feature.getProperty('code');
    const regionMap = this.localityMapRegions.find(x => x.regionCode === regionCode);

    if (regionMap && regionMap.region) {
      //this.onSelectRegion(regionMap.region);
    }
    this.map.fitBounds(e.target.getBounds());
  }

  //#endregion
  ////////////////////////////////////////////

  //#region MAP UTIL FUNCTIONS
  ////////////////////////////////////////////
  /**
   * Sets GeoJson fill color properties according to the color range percentage index value
   * @param element GeoJson data
   */
  setMapElementFillColor(element: any) {
    const percentage = this.getPercentageValueForFillColor(element.properties.stats as LocalityStatistics);

    let indexAtPercentage = this.getRangeColorIndex(percentage);
    element.properties.fillColor = this.getSelectedViewOption.rangeColors[indexAtPercentage].backgroundColor;
    element.properties.fillColorIndex = indexAtPercentage;
  }

  /**
   * Applies a gradient style based on column.
   * This is the callback passed to data.setStyle() and is called for each row in
   * the data set. Check out the docs for Data.StylingFunction.
   *
   * @param {any} feature
   */
  setMapDataStyles(feature: any) {
    const elementType = feature.properties['adm_level'];
    let outlineWeight = 0.5, zIndex = 0;

    switch (elementType) {
      case 'region':
        zIndex = 1;
        break;
      case 'state':
        zIndex = 2;
        break;
      case 'municipality':
        zIndex = 3;
        break;
      default:
        break;
    }

    let featureStats = feature.properties.stats;

    if (feature.properties.state === 'hover') {
      outlineWeight = 2;
    }

    let fillColor = '#000';
    if (featureStats) {
      fillColor = feature.properties.fillColor;
    }

    if (feature.properties.state === 'unfocused') {
      fillColor = '#dedede';
    }

    return {
      weight: outlineWeight,
      color: '#fff',
      fillColor: fillColor,
      fillOpacity: 0.75,
    };
  }
  //#endregion
  ////////////////////////////////////////////

  //#region STATISTICS PANEL FUNCTIONS
  ////////////////////////////////////////////
  //#endregion
  ////////////////////////////////////////////

  //#region UTIL FUNCTIONS
  ////////////////////////////////////////////
  get getSelectedViewOption(): IMapViewOption {
    return this.filterForm.controls.selectedViewOption.value;
  }

  getLocalityStatisticsByRegionCode(regionCode: string) {
    return this.localityStatistics.find(x => x.localityMap.regionCode === regionCode);
  }

  /**
   * Returns the value of the percentage field according to the value of the selected view option
   * @param stats general stats object
   * @returns number
   */
  getPercentageValueForFillColor(stats: LocalityStatistics) {
    return this.getSelectedViewOption.value === MapViewOptionValue.Prediction ? stats.schoolInternetAvailabilityPredicitionPercentage : stats.schoolInternetAvailabilityPercentage;
  }

  /**
   * Gets range color index by percentage value
   * @param percentage number
   * @returns index at range color as number
   */
  getRangeColorIndex(percentage: number) {
    const indexAt = Math.trunc(percentage / 20);

    if (indexAt === this.getSelectedViewOption.rangeColors.length) return indexAt - 1;

    return indexAt;
  }
  //#endregion
  ////////////////////////////////////////////

  //#region WATCH FUNCTIONS
  ////////////////////////////////////////////
  watchLoadingMap() {
    this.loadingMap.asObservable().subscribe((value) => {
      if (value) {
        this.filterForm.controls.searchFilter.disable();
      } else {
        this.filterForm.controls.searchFilter.enable();
      }
    })
  }
  //#endregion
  ////////////////////////////////////////////
}
