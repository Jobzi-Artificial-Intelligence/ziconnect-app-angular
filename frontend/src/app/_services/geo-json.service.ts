import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class GeoJsonService {
  geoJsonFilePath = 'assets/geojson';

  constructor(private http: HttpClient, private baseHref: String) { }

  /**
   * Gets geo json data from brazilian regions
   * @returns Json
   */
  getCountries() {
    return this.http.get(`${this.baseHref}${this.geoJsonFilePath}/countries/countries.json`, { responseType: 'json' });
  }

  /**
   * Gets geo json data from brazilian regions
   * @returns Json
   */
  getRegions() {
    return this.http.get(`${this.baseHref}${this.geoJsonFilePath}/regions/br_regions_ibge_2020.json`, { responseType: 'json' });
  }

  /**
   * Gets geo json data from brazilian states
   * @returns Json
   */
  getStates() {
    return this.http.get(`${this.baseHref}${this.geoJsonFilePath}/states/br_states_ibge_2020.json`, { responseType: 'json' });
  }

  /**
   * Gets geo json data from brazilian states by region code
   * @returns Json
   */
  getStatesByRegion(regionCode: String) {
    return this.http.get(`${this.baseHref}${this.geoJsonFilePath}/states/region_${regionCode}_states_ibge_2020.json`, { responseType: 'json' });
  }

  /**
   * Gets geo json data from brazilian cities by state pcode value
   * @returns Json
   */
  getCitiesByStateInitials(stateInitials: string) {
    return this.http.get(`${this.baseHref}${this.geoJsonFilePath}/cities/${stateInitials.toLowerCase()}_cities_ibge_2020.json`, { responseType: 'json' });
  }
}
