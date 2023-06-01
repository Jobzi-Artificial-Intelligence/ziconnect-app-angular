import { ILocalityLayer, IMapLocalityLayer } from "src/app/_interfaces";
import * as Leaflet from 'leaflet';
import { geoJsonCities, geoJsonRegions, geoJsonStates } from "./geo-json-mock";
import { GeoJsonObject } from "geojson";

let mapRegionLayers: IMapLocalityLayer = {};
let mapStateLayers: IMapLocalityLayer = {};
let mapMunicipalityLayers: IMapLocalityLayer = {};

let cloneMunicipalitiesGeoJson = JSON.parse(JSON.stringify(geoJsonCities));
let cloneRegionsGeoJson = JSON.parse(JSON.stringify(geoJsonRegions));
let cloneStatesGeoJson = JSON.parse(JSON.stringify(geoJsonStates));

Leaflet.geoJSON(cloneRegionsGeoJson as GeoJsonObject, {
  onEachFeature: (feature, layer) => {
    mapRegionLayers[feature.properties.region_code] = {
      feature: feature,
      layer: layer
    } as ILocalityLayer;
  }
});

Leaflet.geoJSON(cloneStatesGeoJson as GeoJsonObject, {
  onEachFeature: (feature, layer) => {
    mapStateLayers[feature.properties.state_code] = {
      feature: feature,
      layer: layer
    } as ILocalityLayer;
  }
});

Leaflet.geoJSON(cloneMunicipalitiesGeoJson as GeoJsonObject, {
  onEachFeature: (feature, layer) => {
    mapMunicipalityLayers[feature.properties.municipality_code] = {
      feature: feature,
      layer: layer
    } as ILocalityLayer;
  }
});

export const regionLayers = mapRegionLayers;
export const stateLayers = mapStateLayers;
export const municipalityLayers = mapMunicipalityLayers;