import * as Leaflet from 'leaflet';

export interface ILocalityLayer {
  feature: any,
  layer: Leaflet.GeoJSON
}

export interface IMapLocalityLayer {
  [key: string]: ILocalityLayer
}