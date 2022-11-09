import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { SchoolCsvHelper } from '../../_helpers/schoolCsv.helper';
import { IGeneralStats } from '../../_helpers/statsCsv.helper';
import { City, Region, School, State } from '../../_models';
import { AlertService, LocalityGeometryService, SchoolService } from '../../_services';
import { APP_BASE_HREF } from '@angular/common';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from "rxjs/operators";
import { ShortNumberPipe } from 'src/app/_pipes/short-number.pipe';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StatsService } from 'src/app/_services';
import { StatsCsvHelper } from 'src/app/_helpers';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ISchoolTableParam, SchoolTableBottomSheetComponent } from 'src/app/_components/school-table-bottom-sheet/school-table-bottom-sheet.component';

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
  stats: IGeneralStats
}

export interface ILocationAutocomplete {
  code: string,
  city?: City,
  locationType: 'Region' | 'State' | 'City'
  name: string,
  region?: Region,
  state?: State
}

export interface IMapFilter {
  regionOptions: Array<Region>;
  searchLocationOptions: Array<ILocationAutocomplete>;
  stateOptions: Array<State>;
  selectedCity?: City;
  selectedCountry?: string,
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
  itemStats: IGeneralStats;
  itemType: string;
  cardsInnerPadding: number;
  generalCardsData: Array<any>;
  generalCardsConnectivityData: Array<any>;
  connectivityBySchoolRegion: Array<any>;
  connectivityBySchoolType: Array<any>;
  schoolsConnectivity: Array<any>;
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
  public filterForm!: FormGroup;
  private localityGeometryService: LocalityGeometryService;
  searchLocationFilteredOptions: Observable<ILocationAutocomplete[]> | undefined;
  infoContent = {
    selectedSchool: null,
    content: {} as IMapInfoWindowContent
  };
  csvHelper!: SchoolCsvHelper;
  filterSettingsExpanded = false;
  statsCsvHelper!: StatsCsvHelper;
  loadingMap: BehaviorSubject<boolean>;
  loadingMessage = '';
  schools: School[] = new Array<School>();
  schoolMarkers: any[] = [];
  selectedSchool: any;

  //#region GOOGLE MAPS CONFIGS
  ////////////////////////////////////////////
  mapFilter: IMapFilter = {
    regionOptions: new Array<Region>(),
    stateOptions: new Array<State>(),
    selectedCountry: 'BR',
    selectedCity: undefined,
    selectedState: undefined,
    searchLocationOptions: new Array<ILocationAutocomplete>(),
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
    itemStats: {} as IGeneralStats,
    itemType: '',
    cardsInnerPadding: 8,
    generalCardsData: new Array<any>(),
    generalCardsConnectivityData: new Array<any>(),
    connectivityBySchoolRegion: new Array<any>(),
    connectivityBySchoolType: new Array<any>(),
    schoolsConnectivity: new Array<any>(),
    internetAvailabityPrediction: 0,
    internetAvailabityPredictionUnits: ''
  };

  schoolsConnectivityColorScheme: Color = {
    name: 'PieSchoolsConnectivityScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C',],
  };
  //#endregion
  ////////////////////////////////////////////

  //#region COMPONENT INITIALIZATION
  ////////////////////////////////////////////

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private ref: ChangeDetectorRef,
    private _bottomSheet: MatBottomSheet
  ) {
    this.localityGeometryService = new LocalityGeometryService(this.httpClient);
    this.loadingMap = new BehaviorSubject<boolean>(false);
  }

  async ngOnInit() {
    // INITIALIZE MAP VIEW OPTIONS
    this.initMapViewOptions();

    // INITIALIZE FILTER FORM FIELDS
    this.filterForm = new FormGroup({
      searchFilter: new FormControl(),
      selectedSchoolRegion: new FormControl(''),
      selectedSchoolType: new FormControl(''),
      selectedViewOption: new FormControl(this.mapFilter.viewOptions[0])
    });

    // INIT OBSERVABLES
    this.watchLoadingMap();

    await this.loadGeneralStats('BR');

    this.loadRegionsGeoJson();

    this.initLocationSearchOptions();
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

  onChangeSelectedViewOption(e: any) {
    // collapse filters panel
    this.toggleFilterSettingsExpanded(false);

    this.googleMap.data.forEach(element => {
      const elementStats = element.getProperty('stats') as IGeneralStats;
      const percentage = this.getPercentageValueForFillColor(elementStats);

      const indexAtPercentage = this.getRangeColorIndex(percentage);
      element.setProperty('fillColor', this.getSelectedViewOption.rangeColors[indexAtPercentage].backgroundColor);
      element.setProperty('fillColorIndex', indexAtPercentage);
    });
  }

  async onCountryClick() {
    // Remove all school markers
    this.schoolMarkers = [];

    // Remove all map data
    this.googleMap.data.forEach(x => this.googleMap.data.remove(x));

    // Clear all filters
    this.selectedSchool = null;
    this.mapFilter.selectedCity = undefined;
    this.mapFilter.selectedRegion = undefined;
    this.mapFilter.selectedState = undefined;

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

    // Add schools markers
    await this.addSchoolMarker(city.code);

    // City Zoom
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

    // Remove any schools from map
    this.schools = [];
    this.schoolMarkers = [];

    this.mapFilter.selectedRegion = region;

    // Load states from selected region
    await this.loadStatesGeoJson(this.mapFilter.selectedCountry ?? '', region.code.toString());

    // Region Zoom
    const regionFeature = this.googleMap.data.getFeatureById(region.code.toString());
    if (regionFeature) {
      this.zoomToFeature(regionFeature);
      this.openStatsPanel(regionFeature);
    }

    this.ref.detectChanges();
  }

  async onSelectState(state: State) {
    this.schools = [];
    this.schoolMarkers = [];
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

    // Add load cities
    await this.loadCitiesGeoJson(this.mapFilter.selectedCountry ?? '', state.region.code.toString(), state.code.toString());

    // Load state schools
    await this.loadSchools(state.code.toString());

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
   * Filter search options
   * @param value string to be filtered
   * @returns Array<string>
   */
  private _searchFilter(value: string | ILocationAutocomplete): ILocationAutocomplete[] {
    let filterValue = '';

    if (typeof value == 'string') {
      filterValue = value.toLowerCase();
    } else {
      return [value as ILocationAutocomplete];
    }

    if (filterValue.length < 3) {
      return [];
    }

    return this.mapFilter.searchLocationOptions.filter(option => option.name.toLowerCase().includes(filterValue)).sort(this.compareSort);
  }

  /**
   * Compare object name properties for sort array
   * @param a source object
   * @param b compare object
   * @returns boolean
   */
  private compareSort(a: any, b: any) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  /**
   * Returns the selected location name to the autocomplete field.
   * @param autocompleLocation Selected autocomplete location
   * @returns Selected location name or null value.
   */
  getSearchLocationAutocompleteText(autocompleLocation: ILocationAutocomplete) {
    return autocompleLocation ? autocompleLocation.name : '';
  }

  /**
  * Initializes the city autocomplete options filter.
  */
  initSearchLocationFilteredOptions() {
    this.searchLocationFilteredOptions = this.filterForm.controls.searchFilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._searchFilter(value || ''))
      );
  }

  /**
   * Initializes location autocomplete options
   */
  initLocationSearchOptions() {
    if (this.statsCsvHelper && this.statsCsvHelper.meta) {
      let regionsOptions = [] as any;
      let statesOptions = [] as any;
      let citiesOptions = [] as any;

      if (this.statsCsvHelper.meta.regions && this.statsCsvHelper.meta.regions.length > 0) {
        regionsOptions = this.statsCsvHelper.meta.regions.map(region => {
          return {
            code: region.code,
            name: region.name,
            locationType: 'Region',
            region: region
          } as ILocationAutocomplete;
        });
      }

      if (this.statsCsvHelper.meta.states && this.statsCsvHelper.meta.states.length > 0) {
        statesOptions = this.statsCsvHelper.meta.states.map(state => {
          return {
            code: state.code,
            name: state.name,
            locationType: 'State',
            state: state
          } as ILocationAutocomplete;
        });
      }

      if (this.statsCsvHelper.meta.cities && this.statsCsvHelper.meta.cities.length > 0) {
        citiesOptions = this.statsCsvHelper.meta.cities.map(city => {
          return {
            code: city.code,
            name: `${city.name}, ${city.state.name}`,
            locationType: 'City',
            city: city
          } as ILocationAutocomplete;
        });
      }

      this.mapFilter.searchLocationOptions = [...regionsOptions, ...statesOptions, ...citiesOptions];
    }
  }

  /**
  * Executes map loading features by autocomplete selected option
  * @param event Event object that is emitted when an autocomplete option is selected.
  */
  async onSelectLocationSearchOption(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value as ILocationAutocomplete;

    switch (selectedOption.locationType) {
      case 'City':
        if (selectedOption.city) {
          await this.onSelectRegion(selectedOption.city.state.region);
          await this.onSelectState(selectedOption.city.state);
          this.onSelectCity(selectedOption.city);
        }
        break;
      case 'Region':
        if (selectedOption.region) {
          this.onSelectRegion(selectedOption.region);
        }
        break;
      case 'State':
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

  /**
   * Adds schools markers to the map, based on selected city filter
   */
  async addSchoolMarker(cityCode: string) {
    this.schools = [];
    this.schoolMarkers = [];

    if (cityCode) {
      const schoolsFromState = this.csvHelper.getSchoolList();

      const schoolsFromCity = schoolsFromState.filter(x => x.city_code === cityCode);
      const markerColors: any = {
        'yes': '#01e64c',
        'no': '#fdf569',
        'na': '#fd7567'
      };

      schoolsFromCity.forEach(x => {
        this.schools.push(x);
        this.schoolMarkers.push({
          position: {
            lat: parseFloat(x.latitude.toString()),
            lng: parseFloat(x.longitude.toString()),
          },
          title: x.school_name,
          options: {
            zIndex: 100,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8.5,
              fillColor: markerColors[x.internet_availability_str.toLowerCase()],
              fillOpacity: 0.7,
              strokeWeight: 0.4
            },
          },
          schoolInfo: x,
        });
      });
    }
  }

  /**
   * Read dataset csv file. Load map data points and material table datasource.
   */
  async loadSchools(stateCode: string): Promise<School[]> {
    return new Promise((resolve, reject) => {
      this.loadingMap.next(true);
      this.loadingMessage = 'Loading schools data...';

      try {
        const schoolService = new SchoolService(this.httpClient, this.baseHref);

        schoolService.getSchoolsByStateCode('br', stateCode).subscribe(
          (data) => {
            // READ CSV DATASET FILE
            this.csvHelper = new SchoolCsvHelper(data);

            this.loadingMap.next(false);
            this.loadingMessage = '';

            // GET ALL SCHOOLS FROM FILE AND SET TO THE FILTER LIST
            resolve(this.csvHelper.getSchoolList());
          },
          (error) => {
            this.loadingMap.next(false);
            this.loadingMessage = '';
            this.alertService.showError(`Something went wrong reading the dataset file: ${error.message}`);
            resolve([]);
          }
        );
      } catch (error: any) {
        this.loadingMap.next(false);
        this.loadingMessage = '';

        this.alertService.showError(error);
        resolve([]);
      }
    })
  }

  async loadCitiesGeoJson(countryCode: string, regionCode: string, stateCode: string) {
    return new Promise((resolve, reject) => {
      this.loadingMap.next(true);
      this.loadingMessage = 'Loading cities...';

      try {
        this.localityGeometryService
          .getCitiesByState(countryCode, regionCode, stateCode)
          .subscribe(
            (data: any) => {
              const featureCollection = this.localityGeometryService.getFeatureCollectionFromLocalityList(data);

              //build stats
              for (let index = 0; index < featureCollection.features.length; index++) {
                const element = featureCollection.features[index];
                element.properties.code = element.properties['city_id'];
                element.properties.filtered = true;
                element.properties.name = element.properties['city_name'];
                element.properties.stats = this.statsCsvHelper.getStatsByCityCode(element.properties.code);

                //SET FILL COLOR
                if (element.properties.stats) {
                  this.setMapElementFillColor(element);
                }
              }

              this.googleMap.data.addGeoJson(featureCollection, {
                idPropertyName: 'city_id'
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

  async loadGeneralStats(countryCode: string) {
    return new Promise((resolve, reject) => {
      this.loadingMap.next(true);
      this.loadingMessage = 'Loading stats...';

      try {
        const statsService = new StatsService(this.httpClient, this.baseHref);

        statsService.getGeneralStatsByCountry(countryCode).subscribe(
          (data) => {
            // READ CSV GENERAL STATS FILE
            this.statsCsvHelper = new StatsCsvHelper(data);

            // SET MAP FILTER OPTIONS
            this.mapFilter.regionOptions = this.statsCsvHelper.meta.regions;
            this.mapFilter.stateOptions = this.statsCsvHelper.meta.states;

            this.loadingMap.next(false);
            this.loadingMessage = '';
            resolve(null);
          },
          (error) => {
            this.loadingMap.next(false);
            this.loadingMessage = '';
            this.alertService.showError(`Something went wrong reading the general stats file: ${error.message}`);
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
        this.localityGeometryService.getRegionsByCountry('BR').subscribe(
          (data: any) => {
            const featureCollection = this.localityGeometryService.getFeatureCollectionFromLocalityList(data);

            // BUILD STATS
            for (let index = 0; index < featureCollection.features.length; index++) {
              const element = featureCollection.features[index];
              element.properties.code = element.properties['region_id'];
              element.properties.filtered = true;
              element.properties.name = element.properties['region_name'];
              element.properties.stats = this.statsCsvHelper.getStatsByRegionCode(element.properties.code);

              //SET FILL COLOR
              if (element.properties.stats) {
                this.setMapElementFillColor(element);
              }
            }

            this.googleMap.data.addGeoJson(featureCollection, {
              idPropertyName: 'region_id',
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
        this.localityGeometryService
          .getStatesByRegion(countryCode, regionCode)
          .subscribe(
            (data: any) => {
              const featureCollection = this.localityGeometryService.getFeatureCollectionFromLocalityList(data);

              //build stats
              for (let index = 0; index < featureCollection.features.length; index++) {
                const element = featureCollection.features[index];
                element.properties.code = element.properties['state_id'];
                element.properties.filtered = true;
                element.properties.name = element.properties['state_name'];
                element.properties.stats = this.statsCsvHelper.getStatsByStateCode(element.properties.code);

                //SET FILL COLOR
                if (element.properties.stats) {
                  this.setMapElementFillColor(element);
                }
              }

              this.googleMap.data.addGeoJson(featureCollection, {
                idPropertyName: 'state_id',
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
        const region = this.statsCsvHelper.meta.regions.find(x => x.code === regionCode);

        if (region) {
          this.onSelectRegion(region);
        }
        break;
      case 'state':
        const selectedStateCode = e.feature.getProperty('code');
        const state = this.statsCsvHelper.meta.states.find(x => x.code.toLowerCase() === selectedStateCode.toLowerCase());

        if (state) {
          this.onSelectState(state);
        }
        break;
      case 'city':
        const cityCode = e.feature.getProperty('code');
        const city = this.statsCsvHelper.meta.cities.find(x => x.code.toLowerCase() === cityCode.toLowerCase());

        if (city) {
          this.onSelectCity(city);
        }
        break;
      default:
        return;
    }
  }

  /**
   * AT THE MARKER CLICK EVENT, SHOW MAP WINDOW WITH SUMMARY OF SCHOOL DATA
   */
  openSchoolInfo(marker: MapMarker, contentInfo: any) {
    this.selectedSchool = contentInfo;
    this.info.open(marker);
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
    this.mapStatsPanel.itemStats = feature.getProperty('stats') as IGeneralStats;
    this.mapStatsPanel.itemType = feature.getProperty('adm_level');

    if (this.mapStatsPanel.itemStats) {
      this.mapStatsPanel.generalCardsData = [{
        name: 'Schools',
        value: this.mapStatsPanel.itemStats.schoolsCount
      }, {
        name: 'Students',
        value: this.mapStatsPanel.itemStats.studentCount
      }];

      this.mapStatsPanel.generalCardsConnectivityData = [{
        name: 'Connectivity',
        value: this.mapStatsPanel.itemStats.schoolsConnectedPercentage
      }, {
        name: 'Without Data',
        value: this.mapStatsPanel.itemStats.schoolsWithoutConnectivityDataPercentage
      }];

      this.mapStatsPanel.internetAvailabityPrediction = this.mapStatsPanel.itemStats.schoolsInternetAvailabilityPredictionPercentage;
      this.mapStatsPanel.internetAvailabityPredictionUnits = this.getInternetAvailabilityPredictionUnitStr(this.mapStatsPanel.itemStats.schoolsInternetAvailabilityPredictionCount, this.mapStatsPanel.itemStats.schoolsWithoutConnectivityDataCount);
      this.mapStatsPanel.schoolsConnectivity = this.getKeyValuePairToChartData(this.mapStatsPanel.itemStats.byConnectivity).sort((a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0);
      this.mapStatsPanel.connectivityBySchoolRegion = this.getKeyValuePairToGroupedChartData(this.mapStatsPanel.itemStats.connectivityBySchoolRegion);
      this.mapStatsPanel.connectivityBySchoolType = this.getKeyValuePairToGroupedChartData(this.mapStatsPanel.itemStats.connectivityBySchoolType);

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
      if (element.getProperty('adm_level') === 'city') {
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
    const percentage = this.getPercentageValueForFillColor(element.properties.stats as IGeneralStats);

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
      case 'city':
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

  //#region SCHOOL TABLE FUNCTIONS
  ////////////////////////////////////////////
  onOpenSchoolTableClick() {
    let params = {
      stateCode: this.mapFilter.selectedState ? this.mapFilter.selectedState.code : null,
      stateCodes: null,
      schools: this.schools
    } as ISchoolTableParam;

    if (this.mapFilter.selectedRegion) {
      params.stateCodes = this.getStateCodesFromRegion(this.mapFilter.selectedRegion.code.toString());
    }

    this._bottomSheet.open(SchoolTableBottomSheetComponent, {
      data: params
    });
  }
  //#endregion
  ////////////////////////////////////////////

  //#region UTIL FUNCTIONS
  ////////////////////////////////////////////

  get getSelectedViewOption(): IMapViewOption {
    return this.filterForm.controls.selectedViewOption.value;
  }

  getStateCodesFromRegion(regionCode: string): Array<string> {
    return this.mapFilter.stateOptions.filter(x => x.region.code === regionCode).map(x => x.code.toString());
  }

  /**
   * Returns the value of the percentage field according to the value of the selected view option
   * @param stats general stats object
   * @returns number
   */
  getPercentageValueForFillColor(stats: IGeneralStats) {
    return this.getSelectedViewOption.value === MapViewOptionValue.Prediction ? stats.schoolsInternetAvailabilityPredictionPercentage : stats.schoolsConnectedPercentage;
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
