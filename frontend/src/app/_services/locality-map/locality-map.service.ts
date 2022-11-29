import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { LocalityMap, LocalityMapAutocomplete } from "../../_models";


@Injectable({
  providedIn: "root",
})
export class LocalityMapService {
  private _postgrestLocalityMapPath = 'locality_map';
  private _viewLocalityMapAutocompletePath = 'view_locality_map_autocomplete';

  constructor(private http: HttpClient) { }

  /**
   * Gets list of localitities geometry where administrative level equals country
   * @returns LocalityMap[]
   */
  getCountries(): Observable<LocalityMap[]> {
    const query = `adm_level=eq.country`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityMapPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityMap().deserialize(item));
        })
      );
  }

  /**
   * Gets list of localitities geometry where administrative level equals region
   * @param countryId 2 digits country code
   * @returns LocalityMap[]
   */
  getRegionsByCountry(countryId: string): Observable<LocalityMap[]> {
    const query = `adm_level=eq.region&country_code=eq.${countryId}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityMapPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityMap().deserialize(item));
        })
      );
  }

  /**
   * Gets list of localitities geometry where administrative level equals state
   * @param countryId 2 digits country code
   * @param regionId region id
   * @returns LocalityMap[]
   */
  getStatesByRegion(countryId: string, regionId: string): Observable<LocalityMap[]> {
    const query = `adm_level=eq.state&country_code=eq.${countryId}&region_code=eq.${regionId}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityMapPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityMap().deserialize(item));
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
  getCitiesByState(countryId: string, regionId: string, stateId: string): Observable<LocalityMap[]> {
    const query = `adm_level=eq.municipality&country_code=eq.${countryId}&region_code=eq.${regionId}&state_code=eq.${stateId}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityMapPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityMap().deserialize(item));
        })
      );
  }

  /**
   * Get GeoJson feature collection type from locality geometry array
   * @param localityGeometryList LocalityGeometry[]
   * @returns FeatureColletion Json
   */
  getFeatureCollectionFromLocalityList(localityGeometryList: LocalityMap[]) {
    if (localityGeometryList.length === 0) {
      throw new Error('Get Feature Collection: Locality list was not provided!');
    }

    return {
      type: 'FeatureCollection',
      features: localityGeometryList.map((item) => {
        // include new localityMapId property
        item.geometry.properties.localityMapId = item.id;

        return item.geometry;
      })
    }
  }

  /**
   * Gets list of localitities geometry where administrative level equals region
   * @param countryId 2 digits country code
   * @param string string value to search
   * @returns LocalityMapAutocomplete[]
   */
  getLocalityAutocompleteByCountry(countryId: string, term: string): Observable<LocalityMapAutocomplete[]> {
    // Clean term
    // Remove spaces at start and end
    let searchString = term.trim();
    // Replace white space between words by *
    searchString = searchString.replace(' ', '*');
    // Add * at end of string like as % like database where clause
    searchString += '*';

    let query = `country_code=eq.${countryId}`;
    query += `&limit=5`;
    query += `&name=ilike.${searchString.replace(' ', '*')}`;
    query += `&order=name.asc`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._viewLocalityMapAutocompletePath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityMapAutocomplete().deserialize(item));
        })
      );
  }
}
