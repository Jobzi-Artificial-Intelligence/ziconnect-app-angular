import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-interactive-osm-map',
  templateUrl: './interactive-osm-map.component.html',
  styleUrls: ['./interactive-osm-map.component.scss']
})
export class InteractiveOsmMapComponent implements OnInit {
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
  //#endregion
  ////////////////////////////////////////////

  constructor() { }

  ngOnInit(): void {
    console.log('Not implemented load map');
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;

    this.map.addControl(Leaflet.control.zoom({
      position: 'bottomright'
    }));
  }
}
