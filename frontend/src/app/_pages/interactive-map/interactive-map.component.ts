import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { AdministrativeLevel, City, LocalityMap, LocalityMapAutocomplete, LocalityStatistics, Region, State } from '../../_models';
import { AlertService, LocalityMapService, LocalityStatisticsService } from '../../_services';
import { APP_BASE_HREF } from '@angular/common';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap } from "rxjs/operators";
import { ShortNumberPipe } from 'src/app/_pipes/short-number.pipe';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

enum MapViewOptionValue {
  Connectivity = 'Connectivity',
  Prediction = 'Prediction'
}

//#region INTERFACES
////////////////////////////////////////////
interface IMapInfoWindowContent {
  code: string,
  name: string,
  type: string,
  stats: LocalityStatistics | null
}

export interface IMapFilter {
  regionOptions: Array<Region>;
  stateOptions: Array<State>;
  selectedCity?: City;
  selectedCountry: string,
  selectedRegion?: Region;
  selectedState?: State;
  selectedSchoolRegion: String,
  selectedSchoolType: String,
  viewOptions: Array<IMapViewOption>,
}

export interface IMapRangeColor {
  min: number;
  max: number;
  color: string;
  backgroundColor: string;
}

export interface IMapStatsPanel {
  open: boolean;
  item: any;
  itemName: string;
  itemStats: LocalityStatistics;
  itemType: string;
  cardsInnerPadding: number;
  generalCardsData: Array<any>;
  generalCardsConnectivityData: Array<any>;
  connectivityBySchoolRegion: Array<any>;
  connectivityBySchoolType: Array<any>;
  connectivityPredictionBySchoolRegion: Array<any>;
  connectivityPredictionBySchoolType: Array<any>;
  schoolsConnectivity: Array<any>;
  schoolsConnectivityPrediction: Array<any>;
  internetAvailabityPrediction: number;
  internetAvailabityPredictionUnits: string;
}

export interface IMapViewOption {
  name: string,
  description: string,
  rangeColors: IMapRangeColor[],
  value: MapViewOptionValue
}
//#endregion
////////////////////////////////////////////

/**
 * @deprecated Component is deprecated; use InteractiveOsmMapComponent instead.
 */
@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.scss']
})
export class InteractiveMapComponent implements OnInit {

  //#region VIEWCHIELD DEFINITIONS
  ////////////////////////////////////////////
  @ViewChild(GoogleMap, { static: false }) googleMap!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  @ViewChild(FormGroupDirective, { static: true }) filterFormElement: any;

  public statsPanelDiv!: ElementRef;
  //#endregion
  ////////////////////////////////////////////

  title = 'Jobzi - Interactive Map';
  public filterForm!: FormGroup<any>;

  searchLocationFilteredOptions: LocalityMapAutocomplete[] = new Array<LocalityMapAutocomplete>();
  infoContent = {
    selectedSchool: null,
    content: {} as IMapInfoWindowContent
  };

  // Locality Map List
  localityMapRegions: LocalityMap[] = new Array<LocalityMap>();
  localityMapStates: LocalityMap[] = new Array<LocalityMap>();
  localityMapMunicipalities: LocalityMap[] = new Array<LocalityMap>();

  filterSettingsExpanded = false;
  loadingMap: BehaviorSubject<boolean>;
  loadingMessage = '';
  loadingAutocomplete = false;
  localityStatistics: LocalityStatistics[] = new Array<LocalityStatistics>();
  selectedSchool: any;

  //#region GOOGLE MAPS CONFIGS
  ////////////////////////////////////////////
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

  mapStyle: google.maps.MapTypeStyle[] = [{
    stylers: [{ visibility: 'off' }],
  }, {
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#523735' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }, { color: '#fcfcfc' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }, { color: '#bfd4ff' }],
  }
  ];

  mapOptions = {
    center: { lat: -15.0110132, lng: -53.3649369 },
    mapTypeControl: false,
    streetViewControl: false,
    styles: this.mapStyle,
    zoom: 5
  };

  mapStatsPanel: IMapStatsPanel = {
    open: false,
    item: null,
    itemName: '',
    itemStats: {} as LocalityStatistics,
    itemType: '',
    cardsInnerPadding: 8,
    generalCardsData: new Array<any>(),
    generalCardsConnectivityData: new Array<any>(),
    connectivityBySchoolRegion: new Array<any>(),
    connectivityBySchoolType: new Array<any>(),
    connectivityPredictionBySchoolRegion: new Array<any>(),
    connectivityPredictionBySchoolType: new Array<any>(),
    schoolsConnectivity: new Array<any>(),
    schoolsConnectivityPrediction: new Array<any>(),
    internetAvailabityPrediction: 0,
    internetAvailabityPredictionUnits: ''
  };

  schoolsConnectivityColorScheme: Color = {
    name: 'PieSchoolsConnectivityScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#56d132', '#f95e5d', '#C7B42C',],
  };

  schoolsPredictionColorScheme: any = {
    'Yes': '#56d132',
    'No': '#f95e5d',
    'NA': '#C7B42C'
  };
  //#endregion
  ////////////////////////////////////////////

  //#region COMPONENT INITIALIZATION
  ////////////////////////////////////////////

  constructor(
    private alertService: AlertService,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private ref: ChangeDetectorRef,
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
    await this.loadRegionsGeoJson();
    await this.initRegionSelectOptions();
    await this.initStateSelectOptions();

    this.initSearchLocationFilteredOptions();

    // MAP EVENTS
    this.googleMap.data.setStyle(this.setMapDataStyles);
    this.googleMap.data.addListener('mouseover', this.mouseInToRegion.bind(this));
    this.googleMap.data.addListener('mouseout', this.mouseOutOfRegion.bind(this));
    this.googleMap.data.addListener('click', this.mouseClickInToRegion.bind(this));
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

  //#region FILTER FUNCTIONS
  ////////////////////////////////////////////

  async initRegionSelectOptions() {
    try {
      await this.localityMapService
        .getRegionsOfCountry(this.mapFilter.selectedCountry)
        .toPromise()
        .then((data) => {
          this.mapFilter.regionOptions = data;
        })
        .catch((error) => {
          this.alertService.showError(`Something went wrong retrieving region options: ${error.message}`);
        });
    } catch (error: any) {
      this.alertService.showError(error);
    }
  }

  async initStateSelectOptions() {
    try {
      await this.localityMapService
        .getStatesOfCountry(this.mapFilter.selectedCountry)
        .toPromise()
        .then((data) => {
          this.mapFilter.stateOptions = data;
        })
        .catch((error) => {
          this.alertService.showError(`Something went wrong retrieving state options: ${error.message}`);
        });
    } catch (error: any) {
      this.alertService.showError(error);
    }
  }

  onChangeSelectedViewOption(e: any) {
    // collapse filters panel
    this.toggleFilterSettingsExpanded(false);

    this.googleMap.data.forEach(element => {
      const elementStats = element.getProperty('stats') as LocalityStatistics;
      const percentage = this.getPercentageValueForFillColor(elementStats);

      const indexAtPercentage = this.getRangeColorIndex(percentage);
      element.setProperty('fillColor', this.getSelectedViewOption.rangeColors[indexAtPercentage].backgroundColor);
      element.setProperty('fillColorIndex', indexAtPercentage);
    });
  }

  async onCountryClick() {
    // Remove all map data
    this.googleMap.data.forEach(x => this.googleMap.data.remove(x));

    // Clear all filters
    this.selectedSchool = null;
    this.mapFilter.selectedCity = undefined;
    this.mapFilter.selectedRegion = undefined;
    this.mapFilter.selectedState = undefined;

    // Load regions statistics from country
    await this.loadLocalityStatistics(AdministrativeLevel.Region);

    // Load regions from country
    await this.loadRegionsGeoJson();

    // Execute map fit bound by regions data features
    var bounds = new google.maps.LatLngBounds();
    this.googleMap.data.forEach(function (feature) {
      feature.getGeometry()?.forEachLatLng(function (latlng) {
        bounds.extend(latlng);
      });
    });

    this.googleMap.fitBounds(bounds);

    this.ref.detectChanges();

    this.closeStatsPanel();
  }

  // Sets state property of the map data item to unfocused when range color different from the one passed in the param
  onLegendItemMouseEnter(rangeColorIndex: number) {
    this.googleMap.data.forEach(element => {
      if (element.getProperty('fillColorIndex') !== rangeColorIndex && element.getProperty('filtered') as Boolean) {
        element.setProperty('state', 'unfocused');
      }
    });
  }

  // Sets map data item state property to normal
  onLegendItemMouseLeave() {
    this.googleMap.data.forEach(element => {
      if (element.getProperty('state') === 'unfocused' && element.getProperty('filtered') as Boolean) {
        element.setProperty('state', 'normal');
      }
    });
  }

  async onSelectCity(city: City) {
    this.mapFilter.selectedCity = city;

    // Unfocus unselected cities
    this.googleMap.data.forEach(x => {
      const cityCode = x.getProperty('code');

      if (cityCode !== city.code) {
        x.setProperty('state', 'unfocused');
        x.setProperty('filtered', false);
      } else {
        x.setProperty('state', 'normal');
        x.setProperty('filtered', true);
      }
    });

    let cityFeature = this.googleMap.data.getFeatureById(city.code.toString());
    if (cityFeature) {
      this.zoomToFeature(cityFeature);
      this.openStatsPanel(cityFeature);
    }

    this.ref.detectChanges();
  }

  async onSelectRegion(region: Region) {
    this.mapFilter.selectedCity = undefined;
    this.mapFilter.selectedState = undefined;

    // Unfocus unselected regions
    this.googleMap.data.forEach(x => {
      const regionCode = x.getProperty('code');

      if (regionCode !== region.code) {
        x.setProperty('state', 'unfocused');
        x.setProperty('filtered', false);
      } else {
        x.setProperty('state', 'normal');
        x.setProperty('filtered', true);
      }
    });

    // Remove any state from map
    this.removeStatesFromMap();

    // Remove any cities from map
    this.removeCitiesFromMap();

    this.mapFilter.selectedRegion = region;

    // Load states statistics from selected region
    await this.loadLocalityStatistics(AdministrativeLevel.State);

    // Load states from selected region
    await this.loadStatesGeoJson(this.mapFilter.selectedCountry, region.code.toString());

    // Region Zoom
    const regionFeature = this.googleMap.data.getFeatureById(region.code.toString());
    if (regionFeature) {
      this.zoomToFeature(regionFeature);
      this.openStatsPanel(regionFeature);
    }

    this.ref.detectChanges();
  }

  async onSelectState(state: State) {
    this.mapFilter.selectedCity = undefined;
    this.mapFilter.selectedRegion = state.region;
    this.mapFilter.selectedState = state;

    // Unfocus unselected states
    this.googleMap.data.forEach(x => {
      const stateCode = x.getProperty('code');

      if (stateCode !== state.code) {
        x.setProperty('state', 'unfocused');
        x.setProperty('filtered', false);
      } else {
        x.setProperty('state', 'normal');
        x.setProperty('filtered', true);
      }
    });

    // Remove current cities before loads new
    this.removeCitiesFromMap();

    // Load municipalities statistics from selected state
    await this.loadLocalityStatistics(AdministrativeLevel.Municipality);

    // Add load cities
    await this.loadCitiesGeoJson(this.mapFilter.selectedCountry, state.region.code.toString(), state.code.toString());

    // State Zoom
    const stateFeature = this.googleMap.data.getFeatureById(state.code.toString());
    if (stateFeature) {
      this.zoomToFeature(stateFeature);
      this.openStatsPanel(stateFeature);
    }

    this.ref.detectChanges();
  }

  //#endregion
  ////////////////////////////////////////////

  //#region SEARCH LOCATION AUTOCOMPLETE
  ////////////////////////////////////////////
  /**
   * Returns the selected location name to the autocomplete field.
   * @param autocompleLocation Selected autocomplete location
   * @returns Selected location name or null value.
   */
  getSearchLocationAutocompleteText(autocompleLocation: LocalityMapAutocomplete) {
    return autocompleLocation ? autocompleLocation.name : '';
  }

  /**
  * Initializes the city autocomplete options filter.
  */
  initSearchLocationFilteredOptions() {
    this.filterForm.controls.searchFilter.valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(1000),
        tap((res) => {
          this.searchLocationFilteredOptions = new Array<LocalityMapAutocomplete>();
          if (res !== null && res.length >= 3) {
            this.loadingAutocomplete = true;
          } else {
            this.loadingAutocomplete = false;
          }
        }),
      ).subscribe((filterValue: any) => {
        if (filterValue && filterValue.length > 0) {
          this.loadAutocompleteSearchOptions(filterValue);
        }
      });
  }

  loadAutocompleteSearchOptions(filterValue: string) {
    this.localityMapService
      .getLocalityAutocompleteByCountry(this.mapFilter.selectedCountry, filterValue)
      .subscribe((data) => {
        this.searchLocationFilteredOptions = data;
        this.loadingAutocomplete = false;
      }, (error) => {
        this.loadingAutocomplete = false;
        this.alertService.showError(`Something went wrong with autocomplete api calls: ${error.message}`);
      });
  }

  /**
  * Executes map loading features by autocomplete selected option
  * @param event Event object that is emitted when an autocomplete option is selected.
  */
  async onSelectLocationSearchOption(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value as LocalityMapAutocomplete;

    switch (selectedOption.administrativeLevel) {
      case 'municipality':
        if (selectedOption.municipality) {
          await this.onSelectRegion(selectedOption.municipality.state.region);
          await this.onSelectState(selectedOption.municipality.state);
          this.onSelectCity(selectedOption.municipality);
        }
        break;
      case 'region':
        if (selectedOption.region) {
          this.onSelectRegion(selectedOption.region);
        }
        break;
      case 'state':
        if (selectedOption.state) {
          await this.onSelectRegion(selectedOption.state.region);
          this.onSelectState(selectedOption.state);
        }
        break;
      default:
        break;
    }
  }
  //#endregion
  ////////////////////////////////////////////

  //#region MAP LOAD FUNCTION
  ////////////////////////////////////////////

  async loadCitiesGeoJson(countryCode: string, regionCode: string, stateCode: string) {
    return new Promise((resolve, reject) => {
      this.loadingMap.next(true);
      this.loadingMessage = 'Loading municipalities...';

      try {
        this.localityMapService
          .getCitiesByState(countryCode, regionCode, stateCode)
          .subscribe(
            (data: any) => {
              this.localityMapMunicipalities = data;

              const featureCollection = this.localityMapService.getFeatureCollectionFromLocalityList(data);

              //build stats
              for (let index = 0; index < featureCollection.features.length; index++) {
                const element = featureCollection.features[index];
                element.properties.code = element.properties['municipality_code'];
                element.properties.filtered = true;
                element.properties.name = element.properties['municipality_name'];
                element.properties.stats = this.getLocalityStatisticsByMunicipalityCode(element.properties.code);

                //SET FILL COLOR
                if (element.properties.stats) {
                  this.setMapElementFillColor(element);
                }
              }

              this.googleMap.data.addGeoJson(featureCollection, {
                idPropertyName: 'municipality_code'
              });

              this.loadingMap.next(false);
              this.loadingMessage = '';

              resolve(null);
            },
            (error) => {
              this.loadingMap.next(false);
              this.loadingMessage = '';

              this.alertService.showError(`Something went wrong loading cities json: ${error.message}`);
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

            this.googleMap.data.addGeoJson(featureCollection, {
              idPropertyName: 'region_code',
            });

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

  async loadStatesGeoJson(countryCode: string, regionCode: string) {
    return new Promise((resolve, reject) => {
      this.loadingMap.next(true)
      this.loadingMessage = 'Loading states...';

      try {
        this.localityMapService
          .getStatesByRegion(countryCode, regionCode)
          .subscribe(
            (data: any) => {
              this.localityMapStates = data;

              const featureCollection = this.localityMapService.getFeatureCollectionFromLocalityList(data);

              //build stats
              for (let index = 0; index < featureCollection.features.length; index++) {
                const element = featureCollection.features[index];
                element.properties.code = element.properties['state_code'];
                element.properties.filtered = true;
                element.properties.name = element.properties['state_name'];
                element.properties.stats = this.getLocalityStatisticsByStateCode(element.properties.code);

                //SET FILL COLOR
                if (element.properties.stats) {
                  this.setMapElementFillColor(element);
                }
              }

              this.googleMap.data.addGeoJson(featureCollection, {
                idPropertyName: 'state_code',
              });

              this.loadingMap.next(false);
              this.loadingMessage = '';

              resolve(null);
            },
            (error) => {
              this.loadingMap.next(false);
              this.loadingMessage = '';
              this.alertService.showError(`Something went wrong loading states json: ${error.message}`);

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

  //#region MAP MOUSE EVENTS
  ////////////////////////////////////////////
  getCenterJsonFromMapDataFeature(feature: google.maps.Data.Feature) {
    var bounds = new google.maps.LatLngBounds();

    this.processPoints(feature.getGeometry(), bounds.extend, bounds);
    return bounds.getCenter().toJSON();
  }

  /**
   * Responds to the mouse-in event on a map shape (state).
   *
   * @param {?google.maps.MapMouseEvent} e
   */
  mouseInToRegion(e: any) {
    if (e.feature.getProperty('state') !== 'unfocused') {
      // set the hover state so the setStyle function can change the border
      e.feature.setProperty('state', 'hover');
    }

    this.selectedSchool = null;
    this.infoContent.content = {
      name: e.feature.getProperty('name'),
      code: e.feature.getProperty('code'),
      stats: e.feature.getProperty('stats'),
      type: e.feature.getProperty('adm_level')
    } as IMapInfoWindowContent;

    this.info.position = this.getCenterJsonFromMapDataFeature(e.feature);
    this.info.open(undefined, false);

    this.ref.detectChanges();
  }

  /**
   * Responds to the mouse-out event on a map shape (state or city).
   *
   */
  mouseOutOfRegion(e: any) {
    if (e.feature.getProperty('state') !== 'unfocused') {
      // reset the hover state, returning the border to normal
      e.feature.setProperty('state', 'normal');
    }

    this.info.close();
  }

  /**
   * Responds to the mouse-click event on a map shape (state or city)
   * Zooms to the boundaries of the clicked polygon
   * @param {?google.maps.MapMouseEvent} e
   */
  mouseClickInToRegion(e: any) {
    switch (e.feature.getProperty('adm_level')) {
      case 'region':
        const regionCode = e.feature.getProperty('code');
        const regionMap = this.localityMapRegions.find(x => x.regionCode === regionCode);

        if (regionMap && regionMap.region) {
          this.onSelectRegion(regionMap.region);
        }
        break;
      case 'state':
        const selectedStateCode = e.feature.getProperty('code');
        const stateMap = this.localityMapStates.find(x => x.stateCode === selectedStateCode);

        if (stateMap && stateMap.state) {
          this.onSelectState(stateMap.state);
        }
        break;
      case 'municipality':
        const municipalityCode = e.feature.getProperty('code');
        const municipalityMap = this.localityMapMunicipalities.find(x => x.municipalityCode === municipalityCode);

        if (municipalityMap && municipalityMap.municipality) {
          this.onSelectCity(municipalityMap.municipality);
        }
        break;
      default:
        return;
    }
  }

  /**
   * Process point bounds from geometry
   * @param geometry
   * @param callback
   * @param thisArg
   */
  processPoints(geometry: any, callback: any, thisArg: any) {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      let geometryArray = geometry.getArray();
      for (let index = 0; index < geometryArray.length; index++) {
        const element = geometryArray[index];
        this.processPoints(element, callback, thisArg);
      }
    }
  }

  /**
   * Execute map zoom to the bounds from google maps data item feature
   * @param feature google.maps.Data.Feature
   */
  zoomToFeature(feature: google.maps.Data.Feature) {
    var bounds = new google.maps.LatLngBounds();

    this.processPoints(feature.getGeometry(), bounds.extend, bounds);
    this.googleMap.fitBounds(bounds);
  }
  //#endregion
  ////////////////////////////////////////////

  //#region MAP STATS PANEL
  ////////////////////////////////////////////
  /**
  * Closes stats panel
  */
  closeStatsPanel() {
    this.mapStatsPanel.item = null;
    this.mapStatsPanel.open = false;
    this.ref.detectChanges();
  }

  /**
   * Get linear-gauge units property value
   * @param predictionCount count of predictions
   * @param schoolsWithoutConnectivityDataCount count of schools without connectivity data
   * @returns units string
   */
  getInternetAvailabilityPredictionUnitStr(predictionCount: number = 0, schoolsWithoutConnectivityDataCount: number = 0) {
    const predictionCountStr = new ShortNumberPipe().transform(predictionCount);
    const withoutDataCountStr = new ShortNumberPipe().transform(schoolsWithoutConnectivityDataCount);

    return `${predictionCountStr}/${withoutDataCountStr} schools`;
  }

  /**
   * Return array objects with chart data format from common key pair object values
   * @param obj object
   * @returns array objects with chart data format
   */
  getKeyValuePairToChartData(obj: Object) {
    return Object.entries(obj).map(([key, value]) => {
      return {
        name: key,
        value: value
      }
    });
  }

  /**
   * Return array objects with grouped chart data format from common key pair object values.
   * The key pair value should be a key pair too.
   * @param obj object
   * @returns array objects with chart data format
   */
  getKeyValuePairToGroupedChartData(obj: Object) {
    return Object.entries(obj).map(([key, value]) => {
      return {
        name: key,
        series: this.getKeyValuePairToChartData(value)
      }
    });
  }

  /**
   * Formats number card item value with percentage symbol suffix
   * @param item number card item object
   * @returns formatted string
   */
  numberCardFormatPercentage(item: any) {
    const newValue = Math.trunc(typeof item === 'object' ? item.value : item);
    return `${newValue}%`;
  }

  /**
   * Formats number card item value with short number pipe
   * @param item number card item object
   * @returns formatted string
   */
  numberCardFormatShortNumber(item: any) {
    return `${new ShortNumberPipe().transform(item.value)}`;
  }

  /**
   * Open stats panel from map data feature item
   * @param {google.maps.Data.Feature} feature
   */
  openStatsPanel(feature: google.maps.Data.Feature) {
    this.mapStatsPanel.item = feature;
    this.mapStatsPanel.itemName = feature.getProperty('name');
    this.mapStatsPanel.itemStats = feature.getProperty('stats') as LocalityStatistics;
    this.mapStatsPanel.itemType = feature.getProperty('adm_level');

    if (this.mapStatsPanel.itemStats) {
      this.mapStatsPanel.generalCardsData = [{
        name: 'Schools',
        value: this.mapStatsPanel.itemStats.schoolCount
      }, {
        name: 'Students',
        value: this.mapStatsPanel.itemStats.studentCount
      }];

      this.mapStatsPanel.generalCardsConnectivityData = [{
        name: 'Connectivity',
        value: this.mapStatsPanel.itemStats.schoolInternetAvailabilityPercentage
      }, {
        name: 'Without Data',
        value: this.mapStatsPanel.itemStats.schoolWithoutInternetAvailabilityPercentage
      }];

      this.mapStatsPanel.internetAvailabityPrediction = this.mapStatsPanel.itemStats.schoolInternetAvailabilityPredicitionPercentage;
      this.mapStatsPanel.internetAvailabityPredictionUnits = this.getInternetAvailabilityPredictionUnitStr(this.mapStatsPanel.itemStats.schoolInternetAvailabilityPredicitionCount, this.mapStatsPanel.itemStats.schoolWithoutInternetAvailabilityCount);

      // Internet availability charts
      this.mapStatsPanel.schoolsConnectivity = this.getKeyValuePairToChartData(this.mapStatsPanel.itemStats.internetAvailabilityByValue).sort((a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0);
      this.mapStatsPanel.connectivityBySchoolRegion = this.getKeyValuePairToGroupedChartData(this.mapStatsPanel.itemStats.internetAvailabilityBySchoolRegion);
      this.mapStatsPanel.connectivityBySchoolType = this.getKeyValuePairToGroupedChartData(this.mapStatsPanel.itemStats.internetAvailabilityBySchoolType);

      // Internet availability prediction charts
      this.mapStatsPanel.schoolsConnectivityPrediction = this.getKeyValuePairToChartData(this.mapStatsPanel.itemStats.internetAvailabilityPredictionByValue).sort((a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0);
      this.mapStatsPanel.connectivityPredictionBySchoolRegion = this.getKeyValuePairToGroupedChartData(this.mapStatsPanel.itemStats.internetAvailabilityPredictionBySchoolRegion);
      this.mapStatsPanel.connectivityPredictionBySchoolType = this.getKeyValuePairToGroupedChartData(this.mapStatsPanel.itemStats.internetAvailabilityPredictionBySchoolType);

      // Open stats panel
      this.mapStatsPanel.open = true;

      // Scroll to top
      const statsPanelInnerContainerDiv = document.getElementById('stats-panel-inner-container');
      if (statsPanelInnerContainerDiv) {
        statsPanelInnerContainerDiv.scrollTo({
          top: 0
        });
      }

      this.ref.detectChanges();
    } else {
      this.alertService.showError('Item statistics was not provided!');
    }
  }

  toggleStatsPanel() {
    this.mapStatsPanel.open = !this.mapStatsPanel.open;
    this.ref.detectChanges();
  }
  //#endregion
  ////////////////////////////////////////////

  //#region MAP UTIL FUNCTIONs
  ////////////////////////////////////////////

  /**
   * Remove all cities features from map
   */
  removeCitiesFromMap() {
    this.googleMap.data.forEach(element => {
      if (element.getProperty('adm_level') === 'municipality') {
        this.googleMap.data.remove(element);
      }
    });
  }

  /**
   * Remove all states features from map
   */
  removeStatesFromMap() {
    this.googleMap.data.forEach(element => {
      if (element.getProperty('adm_level') === 'state') {
        this.googleMap.data.remove(element);
      }
    });
  }

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
   * @param {google.maps.Data.Feature} feature
   */
  setMapDataStyles(feature: google.maps.Data.Feature) {
    const elementType = feature.getProperty('adm_level');
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

    let featureStats = feature.getProperty('stats');

    if (feature.getProperty('state') === 'hover') {
      outlineWeight = 2;
    }

    let fillColor = '#000';
    if (featureStats) {
      fillColor = feature.getProperty('fillColor');
    }

    if (feature.getProperty('state') === 'unfocused') {
      fillColor = '#dedede';
    }

    return {
      strokeWeight: outlineWeight,
      strokeColor: '#fff',
      zIndex: zIndex,
      fillColor: fillColor,
      fillOpacity: 0.75,
      visible: true,
    };
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

  //#region MAT-SELECT FUNCTIONS
  ////////////////////////////////////////////
  /**
   * Compare objects for programmatically selection
   * @param obj1 object
   * @param obj2 object
   * @returns true when objects are equals
   */
  matSelectCompareCodes(obj1: any, obj2: any): boolean {
    return obj1 && obj2 && obj1.code === obj2.code;
  }

  /**
   * Event emitted when change region filter selection. Execute region selection and zoom in.
   */
  onRegionSelectionChange() {
    if (this.mapFilter.selectedRegion) {
      this.onSelectRegion(this.mapFilter.selectedRegion);
    } else {
      this.googleMap.data.forEach(x => {
        this.googleMap.data.remove(x);
      });

      this.loadRegionsGeoJson();
    }

    // collapse filters panel
    this.toggleFilterSettingsExpanded(false);
  }

  /**
   * Event emitted when change state filter selection. Gets state geojson, execute state selection and zoom in.
   */
  async onStateSelectionChange() {
    // Prevent missing selected value after onSelectRegion call
    const selectedState = this.mapFilter.selectedState;

    if (selectedState) {
      await this.onSelectRegion(selectedState.region);
      this.onSelectState(selectedState);
    } else {
      this.googleMap.data.forEach(x => {
        this.googleMap.data.remove(x);
      });

      this.loadRegionsGeoJson();
    }

    // collapse filters panel
    this.toggleFilterSettingsExpanded(false);
  }
  //#endregion
  ////////////////////////////////////////////

  //#region UTIL FUNCTIONS
  ////////////////////////////////////////////

  get getSelectedViewOption(): IMapViewOption {
    return this.filterForm.controls.selectedViewOption.value;
  }

  getConnectivityPredictionBarColor = (value: any) => {
    return this.schoolsPredictionColorScheme[value];
  }

  getLocalityStatisticsByRegionCode(regionCode: string) {
    return this.localityStatistics.find(x => x.localityMap.regionCode === regionCode);
  }

  getLocalityStatisticsByStateCode(stateCode: string) {
    return this.localityStatistics.find(x => x.localityMap.stateCode === stateCode);
  }

  getLocalityStatisticsByMunicipalityCode(municipalityCode: string) {
    return this.localityStatistics.find(x => x.localityMap.municipalityCode === municipalityCode);
  }

  getStateCodesFromRegion(regionCode: string): Array<string> {
    return this.mapFilter.stateOptions.filter(x => x.region.code === regionCode).map(x => x.code.toString());
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

  getRangeColorTooltipMessage(index: number) {
    const suffixes = {
      Connectivity: 'schools connected',
      Prediction: 'connectivity prediction'
    } as any;

    const suffix = suffixes[this.getSelectedViewOption.value];
    const rangeColor = this.getSelectedViewOption.rangeColors[index];

    return `Between ${rangeColor.min} and ${rangeColor.max} percent of ${suffix}`;
  }

  toggleFilterSettingsExpanded(expanded: boolean) {
    this.filterSettingsExpanded = expanded;
  }

  //#endregion
  ////////////////////////////////////////////
}
