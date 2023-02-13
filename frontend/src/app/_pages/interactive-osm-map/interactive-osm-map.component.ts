import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { GeoJsonObject } from 'geojson';
import * as Leaflet from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs/operators';
import { MapViewOptionValue } from 'src/app/_helpers';
import { IMapFilter, IMapViewOption, ILocalityLayer, IMapLocalityLayer, IMapStatsPanel, IMapInfoWindowContent } from 'src/app/_interfaces';
import { AdministrativeLevel, City, LocalityMap, LocalityMapAutocomplete, LocalityStatistics, Region, State } from 'src/app/_models';
import { ShortNumberPipe } from 'src/app/_pipes/short-number.pipe';
import { AlertService, LocalityLayerPopupService, LocalityMapService, LocalityStatisticsService } from 'src/app/_services';

@Component({
  selector: 'app-interactive-osm-map',
  templateUrl: './interactive-osm-map.component.html',
  styleUrls: ['./interactive-osm-map.component.scss']
})
export class InteractiveOsmMapComponent implements OnInit {
  title = 'Jobzi - Interactive Map';
  filterForm!: FormGroup<any>;
  searchLocationFilteredOptions: LocalityMapAutocomplete[] = new Array<LocalityMapAutocomplete>();

  // LOCALITY MAP LIST
  localityMapRegions: LocalityMap[] = new Array<LocalityMap>();
  localityMapStates: LocalityMap[] = new Array<LocalityMap>();
  localityMapMunicipalities: LocalityMap[] = new Array<LocalityMap>();

  filterSettingsExpanded = false;
  loadingMap: BehaviorSubject<boolean>;
  loadingMessage = '';
  loadingAutocomplete = false;

  localityStatistics: LocalityStatistics[] = new Array<LocalityStatistics>();

  //#region LEAFLET MAP OPTIONS
  ////////////////////////////////////////////
  map!: Leaflet.Map;
  mapOptions = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    attributionControl: false,
    keyboard: false,
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

  mapRegionLayers: IMapLocalityLayer = {};
  mapStateLayers: IMapLocalityLayer = {};
  mapMunicipalityLayers: IMapLocalityLayer = {};

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
  constructor(private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private localityLayerService: LocalityLayerPopupService,
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
    await this.initRegionSelectOptions();
    await this.initStateSelectOptions();

    this.initSearchLocationFilteredOptions();
  }

  async onMapReady($event: Leaflet.Map) {
    this.map = $event;

    // Add attribution control
    const attribution = Leaflet.control.attribution({
      position: 'bottomleft'
    });
    attribution.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');

    this.map.addControl(attribution);

    // Add zoom control
    this.map.addControl(Leaflet.control.zoom({
      position: 'bottomleft'
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

    // regions update fill color
    for (const [key, value] of Object.entries(this.mapRegionLayers)) {
      this.updateLayerFillColorByViewOption(value.feature, value.layer);
    }

    // state update fill color
    for (const [key, value] of Object.entries(this.mapStateLayers)) {
      this.updateLayerFillColorByViewOption(value.feature, value.layer);
    }

    // municipality update fill color
    for (const [key, value] of Object.entries(this.mapMunicipalityLayers)) {
      this.updateLayerFillColorByViewOption(value.feature, value.layer);
    }
  }

  async onCountryClick() {
    // Remove all locality layers
    this.removeAllLocalityLayersFromMap();

    // Clear all filters
    this.mapFilter.selectedCity = undefined;
    this.mapFilter.selectedRegion = undefined;
    this.mapFilter.selectedState = undefined;

    // Load regions statistics from country
    await this.loadLocalityStatistics(AdministrativeLevel.Region);

    // Load regions from country
    await this.loadRegionsGeoJson();

    // Reset view to initial map view position
    this.map.setView(this.mapOptions.center, this.mapOptions.zoom);

    this.closeStatsPanel();
  }

  // Sets state property of the map data item to unfocused when range color different from the one passed in the param
  onLegendItemMouseEnter(rangeColorIndex: number) {
    // highlight region by range color index
    this.setLayerStateUnfocusedByColorIndex(rangeColorIndex, this.mapRegionLayers);

    // highlight state by range color index
    this.setLayerStateUnfocusedByColorIndex(rangeColorIndex, this.mapStateLayers);

    // highlight municipality by range color index
    this.setLayerStateUnfocusedByColorIndex(rangeColorIndex, this.mapMunicipalityLayers);
  }

  // Sets map data item state property to normal
  onLegendItemMouseLeave() {
    // back region layers to state normal
    this.setLayerStateUnfocusedToNormalState(this.mapRegionLayers);

    // back state layers to state normal
    this.setLayerStateUnfocusedToNormalState(this.mapStateLayers);

    // back municipality layers to state normal
    this.setLayerStateUnfocusedToNormalState(this.mapMunicipalityLayers);
  }

  async onSelectCity(municipality: City, withZoom: boolean = true) {
    this.mapFilter.selectedCity = municipality;

    // Unfocus unselected municipalities
    for (const [key, value] of Object.entries(this.mapMunicipalityLayers)) {
      if (value.feature.properties.code !== municipality.code) {
        value.feature.properties.state = 'unfocused';
        value.feature.properties.filtered = false;
      } else {
        value.feature.properties.state = 'normal';
        value.feature.properties.filtered = true;
      }

      value.layer.setStyle(this.setMapDataStyles(value.feature));
    }

    // Unfocus states
    for (const [key, value] of Object.entries(this.mapStateLayers)) {
      value.feature.properties.state = 'unfocused';
      value.feature.properties.filtered = false;
      value.layer.setStyle(this.setMapDataStyles(value.feature));
    }

    // Municipality Zoom and open statistics panel
    const municipalityLayer = this.mapMunicipalityLayers[municipality.code.toString()];
    if (municipalityLayer) {
      if (withZoom) {
        this.zoomToLayerBounds(municipalityLayer.layer.getBounds());
      }
      this.openStatsPanel(municipalityLayer.feature);
    }
  }

  async onSelectRegion(region: Region, withZoom: boolean = true) {
    this.mapFilter.selectedCity = undefined;
    this.mapFilter.selectedState = undefined;

    // Unfocus unselected regions
    for (const [key, value] of Object.entries(this.mapRegionLayers)) {
      if (value.feature.properties.code !== region.code) {
        value.feature.properties.state = 'unfocused';
        value.feature.properties.filtered = false;
      } else {
        value.feature.properties.state = 'normal';
        value.feature.properties.filtered = true;
      }

      value.layer.setStyle(this.setMapDataStyles(value.feature));
    }

    // Remove any state from map
    this.removeStateLayersFromMap();

    // Remove any cities from map
    this.removeMunicipalityLayersFromMap();

    this.mapFilter.selectedRegion = region;

    // Load states statistics from selected region
    await this.loadLocalityStatistics(AdministrativeLevel.State);

    // // Load states from selected region
    await this.loadStatesGeoJson(this.mapFilter.selectedCountry, region.code.toString());

    // Region Zoom and open statistics panel
    const regionLayer = this.mapRegionLayers[region.code.toString()];
    if (regionLayer) {
      if (withZoom) {
        this.zoomToLayerBounds(regionLayer.layer.getBounds());
      }
      this.openStatsPanel(regionLayer.feature);
    }
  }

  async onSelectState(state: State, withZoom: boolean = true) {
    this.mapFilter.selectedCity = undefined;
    this.mapFilter.selectedRegion = state.region;
    this.mapFilter.selectedState = state;

    // Unfocus unselected states
    for (const [key, value] of Object.entries(this.mapStateLayers)) {
      if (value.feature.properties.code !== state.code) {
        value.feature.properties.state = 'unfocused';
        value.feature.properties.filtered = false;
      } else {
        value.feature.properties.state = 'normal';
        value.feature.properties.filtered = true;
      }

      value.layer.setStyle(this.setMapDataStyles(value.feature));
    }

    // Unfocus regions
    for (const [key, value] of Object.entries(this.mapRegionLayers)) {
      value.feature.properties.state = 'unfocused';
      value.feature.properties.filtered = false;
      value.layer.setStyle(this.setMapDataStyles(value.feature));
    }

    // Remove current cities before loads new
    this.removeMunicipalityLayersFromMap();

    // Load municipalities statistics from selected state
    await this.loadLocalityStatistics(AdministrativeLevel.Municipality);

    // Add load cities
    await this.loadCitiesGeoJson(this.mapFilter.selectedCountry, state.region.code.toString(), state.code.toString());

    // State Zoom and open statistics panel
    const stateLayer = this.mapStateLayers[state.code.toString()];
    if (stateLayer) {
      if (withZoom) {
        this.zoomToLayerBounds(stateLayer.layer.getBounds());
      }
      this.openStatsPanel(stateLayer.feature);
    }
  }

  setLayerStateUnfocusedByColorIndex(rangeColorIndex: number, localityLayers: IMapLocalityLayer) {
    // highlight locality layer by range color index
    for (const [key, value] of Object.entries(localityLayers)) {
      if (value.feature.properties.fillColorIndex !== rangeColorIndex && value.feature.properties.filtered as Boolean) {
        value.feature.properties.state = 'unfocused';
        value.layer.setStyle(this.setMapDataStyles(value.feature));
      }
    }
  }

  setLayerStateUnfocusedToNormalState(localityLayers: IMapLocalityLayer) {
    for (const [key, value] of Object.entries(localityLayers)) {
      if (value.feature.properties.state === 'unfocused' && value.feature.properties.filtered as Boolean) {
        value.feature.properties.state = 'normal';
        value.layer.setStyle(this.setMapDataStyles(value.feature));
      }
    }
  }

  //#endregion
  ////////////////////////////////////////////

  //#region MAP LOAD FUNCTIONS
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

              // ADD MUNICIPALITY LAYER
              this.map.addLayer(Leaflet.geoJSON(featureCollection as GeoJsonObject, {
                style: this.setMapDataStyles,
                onEachFeature: (feature, layer) => {
                  this.mapMunicipalityLayers[feature.properties.code] = {
                    feature: feature,
                    layer: layer
                  } as ILocalityLayer;

                  layer.bindTooltip(this.getFeaturePopup(feature));

                  layer.on('click', this.onMapMunicipalityClick, this);
                  layer.on('mouseover', this.onMapMouseOverLayer, this);
                  layer.on('mouseout', this.onMapMouseOutLayer, this);
                }
              }));

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

            // ADD REGION LAYER
            this.map.addLayer(Leaflet.geoJSON(featureCollection as GeoJsonObject, {
              style: this.setMapDataStyles,
              onEachFeature: (feature, layer) => {
                this.mapRegionLayers[feature.properties.code] = {
                  feature: feature,
                  layer: layer
                } as ILocalityLayer;

                layer.bindTooltip(this.getFeaturePopup(feature));

                layer.on('click', this.onMapRegionClick, this);
                layer.on('mouseover', this.onMapMouseOverLayer, this);
                layer.on('mouseout', this.onMapMouseOutLayer, this);
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

              // ADD STATE LAYER
              this.map.addLayer(Leaflet.geoJSON(featureCollection as GeoJsonObject, {
                style: this.setMapDataStyles,
                onEachFeature: (feature, layer) => {
                  this.mapStateLayers[feature.properties.code] = {
                    feature: feature,
                    layer: layer
                  } as ILocalityLayer;

                  layer.bindTooltip(this.getFeaturePopup(feature));

                  layer.on('click', this.onMapStateClick, this);
                  layer.on('mouseover', this.onMapMouseOverLayer, this);
                  layer.on('mouseout', this.onMapMouseOutLayer, this);
                }
              }));

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

  //#region MAP MOUSE FUNCTIONS
  ////////////////////////////////////////////
  onMapMouseOverLayer(e: any) {
    if (e.target.feature.properties.state !== 'unfocused') {
      e.target.feature.properties.state = 'hover';
    } else {
      e.target.feature.properties.state = 'unfocused-hover';
    }

    e.target.setStyle(this.setMapDataStyles(e.target.feature));
  }

  /**
   * Responds to the mouse-out event on a map layer (state or city).
   *
   */
  onMapMouseOutLayer(e: any) {
    if (e.target.feature.properties.state === 'unfocused-hover') {
      e.target.feature.properties.state = 'unfocused';
    } else if (e.target.feature.properties.state !== 'unfocused') {
      // reset the hover state, returning the border to normal
      e.target.feature.properties.state = 'normal';
    }

    e.target.setStyle(this.setMapDataStyles(e.target.feature));
  }

  onMapRegionClick(e: any) {
    const regionCode = e.target.feature.properties.code;
    const regionMap = this.localityMapRegions.find(x => x.regionCode === regionCode);

    if (regionMap && regionMap.region) {
      this.onSelectRegion(regionMap.region);
    }
    this.zoomToLayerBounds(e.target.getBounds());
  }

  onMapStateClick(e: any) {
    const stateCode = e.target.feature.properties.code;
    const stateMap = this.localityMapStates.find(x => x.stateCode === stateCode);

    if (stateMap && stateMap.state) {
      this.onSelectState(stateMap.state);
    }
    this.zoomToLayerBounds(e.target.getBounds());
  }

  onMapMunicipalityClick(e: any) {
    const municipalityCode = e.target.feature.properties.code;
    const municipalityMap = this.localityMapMunicipalities.find(x => x.municipalityCode === municipalityCode);

    if (municipalityMap && municipalityMap.municipality) {
      this.onSelectCity(municipalityMap.municipality);
    }

    this.zoomToLayerBounds(e.target.getBounds());
  }

  //#endregion
  ////////////////////////////////////////////

  //#region MAP STATISTICS PANEL
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
   * @param {any} feature
   */
  openStatsPanel(feature: any) {
    this.mapStatsPanel.item = feature;
    this.mapStatsPanel.itemName = feature.properties.name;
    this.mapStatsPanel.itemStats = feature.properties.stats as LocalityStatistics;
    this.mapStatsPanel.itemType = feature.properties.adm_level;

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

  //#region MAP UTIL FUNCTIONS
  ////////////////////////////////////////////

  getFeaturePopup(feature: any) {
    return this.localityLayerService.compilePopup(<IMapInfoWindowContent>{
      name: feature.properties.name,
      code: feature.properties.code,
      stats: feature.properties.stats,
      type: feature.properties.adm_level
    });
  }

  /**
   * Remove all locality layer from map layers list
   */
  removeAllLocalityLayersFromMap() {
    this.removeMunicipalityLayersFromMap();
    this.removeStateLayersFromMap();
    this.removeRegionLayersFromMap();
  }

  /**
   * Remove all region layers from map layers list
   */
  removeRegionLayersFromMap() {
    for (const [key, value] of Object.entries(this.mapRegionLayers)) {
      this.map.removeLayer(value.layer);
    }
    this.mapRegionLayers = <IMapLocalityLayer>{};
  }

  /**
   * Remove all state layers from map layers list
   */
  removeStateLayersFromMap() {
    for (const [key, value] of Object.entries(this.mapStateLayers)) {
      this.map.removeLayer(value.layer);
    }
    this.mapStateLayers = <IMapLocalityLayer>{};
  }

  /**
   * Remove all state municipality from map layers list
   */
  removeMunicipalityLayersFromMap() {
    for (const [key, value] of Object.entries(this.mapMunicipalityLayers)) {
      this.map.removeLayer(value.layer);
    }
    this.mapMunicipalityLayers = <IMapLocalityLayer>{};
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
   * @param {any} feature
   */
  setMapDataStyles(feature: any) {
    let strokeWidth = 0.5;
    let strokeColor = '#fff';

    let featureStats = feature.properties.stats;

    if (feature.properties.state === 'hover') {
      strokeWidth = 2;
    }

    let fillColor = '#000';
    if (featureStats) {
      fillColor = feature.properties.fillColor;
    }

    if (feature.properties.state === 'unfocused') {
      fillColor = '#dedede';
    }

    if (feature.properties.state === 'unfocused-hover') {
      fillColor = '#F7CCA9';
      strokeColor = '#D9A981';
      strokeWidth = 2;
    }

    return {
      weight: strokeWidth,
      color: strokeColor,
      fillColor: fillColor,
      fillOpacity: 0.75,
    };
  }

  /**
   * Execute map zoom to the bounds from feature bounds
   * @param bounds feature layer bounds
   */
  zoomToLayerBounds(bounds: any) {
    this.map.fitBounds(bounds);
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
      this.removeAllLocalityLayersFromMap();

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
      this.removeAllLocalityLayersFromMap();

      this.loadRegionsGeoJson();
    }

    // collapse filters panel
    this.toggleFilterSettingsExpanded(false);
  }

  updateLayerFillColorByViewOption(feature: any, layer: Leaflet.GeoJSON) {
    const elementStats = feature.properties.stats as LocalityStatistics;
    const percentage = this.getPercentageValueForFillColor(elementStats);

    const indexAtPercentage = this.getRangeColorIndex(percentage);
    feature.properties.fillColor = this.getSelectedViewOption.rangeColors[indexAtPercentage].backgroundColor;
    feature.properties.fillColorIndex = indexAtPercentage;
    layer.setStyle(this.setMapDataStyles(feature));
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
          await this.onSelectRegion(selectedOption.municipality.state.region, false);
          await this.onSelectState(selectedOption.municipality.state, false);
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
          await this.onSelectRegion(selectedOption.state.region, false);
          this.onSelectState(selectedOption.state);
        }
        break;
      default:
        break;
    }
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

  getLocalityStatisticsByMunicipalityCode(municipalityCode: string) {
    return this.localityStatistics.find(x => x.localityMap.municipalityCode === municipalityCode);
  }

  getLocalityStatisticsByRegionCode(regionCode: string) {
    return this.localityStatistics.find(x => x.localityMap.regionCode === regionCode);
  }

  getLocalityStatisticsByStateCode(stateCode: string) {
    return this.localityStatistics.find(x => x.localityMap.stateCode === stateCode);
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
