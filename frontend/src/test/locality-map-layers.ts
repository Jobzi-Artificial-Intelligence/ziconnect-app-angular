import { ILocalityLayer, IMapLocalityLayer } from "src/app/_interfaces";
import * as Leaflet from 'leaflet';
import { geoJsonCities, geoJsonRegions, geoJsonStates } from "./geo-json-mock";
import { GeoJsonObject } from "geojson";

let mapRegionLayers: IMapLocalityLayer = {};
let mapStateLayers: IMapLocalityLayer = {};
let mapMunicipalityLayers: IMapLocalityLayer = {};

Leaflet.geoJSON(geoJsonRegions as GeoJsonObject, {
  onEachFeature: (feature, layer) => {
    mapRegionLayers[feature.properties.code] = {
      feature: feature,
      layer: layer
    } as ILocalityLayer;
  }
});

Leaflet.geoJSON(geoJsonStates as GeoJsonObject, {
  onEachFeature: (feature, layer) => {
    mapStateLayers[feature.properties.code] = {
      feature: feature,
      layer: layer
    } as ILocalityLayer;
  }
});

Leaflet.geoJSON(geoJsonCities as GeoJsonObject, {
  onEachFeature: (feature, layer) => {
    mapMunicipalityLayers[feature.properties.code] = {
      feature: feature,
      layer: layer
    } as ILocalityLayer;
  }
});

export const regionLayers = mapRegionLayers;
export const stateLayers = mapStateLayers;
export const municipalityLayers = mapMunicipalityLayers;