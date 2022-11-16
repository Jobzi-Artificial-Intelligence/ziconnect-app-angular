import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { LocalityGeometry, LocalityGeometryAutocomplete } from "../../_models";


@Injectable({
  providedIn: "root",
})
export class LocalityGeometryService {
  private _postgrestLocalityGeometryPath = 'locality_geometry';
  private _viewLocalityGeometryAutocompltePath = 'view_locality_geometry_autocomplete';

  constructor(private http: HttpClient) { }

  /**
   * Gets list of localitities geometry where administrative level equals country
   * @returns LocalityGeometry[]
   */
  getCountries(): Observable<LocalityGeometry[]> {
    const query = `adm_level=eq.country`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityGeometryPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityGeometry().deserialize(item));
        })
      );
  }

  /**
   * Gets list of localitities geometry where administrative level equals region
   * @param countryId 2 digits country code
   * @returns LocalityGeometry[]
   */
  getRegionsByCountry(countryId: string): Observable<LocalityGeometry[]> {
    const query = `adm_level=eq.region&country_id=eq.${countryId}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityGeometryPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityGeometry().deserialize(item));
        })
      );
  }

  /**
   * Gets list of localitities geometry where administrative level equals state
   * @param countryId 2 digits country code
   * @param regionId region id
   * @returns LocalityGeometry[]
   */
  getStatesByRegion(countryId: string, regionId: string): Observable<LocalityGeometry[]> {
    const query = `adm_level=eq.state&country_id=eq.${countryId}&region_id=eq.${regionId}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityGeometryPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityGeometry().deserialize(item));
        })
      );
  }

  /**
   * Gets list of localitities geometry where administrative level equals state
   * @param countryId 2 digits country code
   * @param regionId region id
   * @param stateId state id
   * @returns LocalityGeometry[]
   */
  getCitiesByState(countryId: string, regionId: string, stateId: string): Observable<LocalityGeometry[]> {
    const query = `adm_level=eq.city&country_id=eq.${countryId}&region_id=eq.${regionId}&state_id=eq.${stateId}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityGeometryPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityGeometry().deserialize(item));
        })
      );
  }

  /**
   * Get GeoJson feature collection type from locality geometry array
   * @param localityGeometryList LocalityGeometry[]
   * @returns FeatureColletion Json
   */
  getFeatureCollectionFromLocalityList(localityGeometryList: LocalityGeometry[]) {
    if (localityGeometryList.length === 0) {
      throw new Error('Get Feature Collection: Locality list was not provided!');
    }

    return {
      type: 'FeatureCollection',
      features: localityGeometryList.map((item) => item.geometry)
    }
  }

  /**
   * Gets list of localitities geometry where administrative level equals region
   * @param countryId 2 digits country code
   * @param string string value to search
   * @returns LocalityGeometryAutocomplete[]
   */
  getLocalityAutocompleteByCountry(countryId: string, search: string): Observable<LocalityGeometryAutocomplete[]> {
    let query = `country_id=eq.${countryId}`;
    query += `&name=ilike.${search.replace(' ', '*')}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._viewLocalityGeometryAutocompltePath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityGeometryAutocomplete().deserialize(item));
        })
      );
  }
}
