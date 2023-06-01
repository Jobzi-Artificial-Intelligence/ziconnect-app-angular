import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AdministrativeLevel, LocalityStatistics } from "src/app/_models";

@Injectable({
  providedIn: "root",
})
export class LocalityStatisticsService {
  private _localityMapColumns = [
    'id',
    'country_name',
    'country_code',
    'region_name',
    'region_code',
    'state_name',
    'state_abbreviation',
    'state_code',
    'municipality_name',
    'municipality_code',
    'adm_level'
  ];
  private _postgrestLocalityStatisticsPath = 'locality_statistics';

  constructor(private http: HttpClient) { }

  /**
   * Returns statistics of countries
   * @param countryCode country code
   * @returns Observable<LocalityStatistics[]>
   */
  getStatisticsOfCountries(): Observable<LocalityStatistics[]> {
    let query = `select=*,locality_map!inner(${this._localityMapColumns.join(',')})`;
    query += `&locality_map.adm_level=eq.${AdministrativeLevel.Country}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityStatisticsPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityStatistics().deserialize(item));
        })
      );
  }

  /**
   * Returns statistics of regions from specific coutry
   * @param countryCode country code
   * @returns Observable<LocalityStatistics[]>
   */
  getStatisticsOfRegions(countryCode: string): Observable<LocalityStatistics[]> {
    if (!countryCode) {
      throw new Error('ISO 2 digits country code not provided!');
    }

    let query = `select=*,locality_map!inner(${this._localityMapColumns.join(',')})`;
    query += `&locality_map.country_code=eq.${countryCode}`;
    query += `&locality_map.adm_level=eq.${AdministrativeLevel.Region}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityStatisticsPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityStatistics().deserialize(item));
        })
      );
  }

  /**
   * Returns statistics of states from contry/region
   * @param countryCode country code
   * @param regionCode region code
   * @returns Observable<LocalityStatistics[]>
   */
  getStatisticsOfStates(countryCode: string, regionCode: string): Observable<LocalityStatistics[]> {
    if (!countryCode) {
      throw new Error('ISO 2 digits country code not provided!');
    }

    if (!regionCode) {
      throw new Error('Region code not provided!');
    }

    let query = `select=*,locality_map!inner(${this._localityMapColumns.join(',')})`;
    query += `&locality_map.country_code=eq.${countryCode}`;
    query += `&locality_map.region_code=eq.${regionCode}`;
    query += `&locality_map.adm_level=eq.${AdministrativeLevel.State}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityStatisticsPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityStatistics().deserialize(item));
        })
      );
  }

  /**
   * Returns statistics of municipalities from contry/region/state
   * @param countryCode country code
   * @param regionCode region code
   * @param stateCode state code
   * @returns Observable<LocalityStatistics[]>
   */
  getStatisticsOfMunicipalities(countryCode: string, regionCode: string, stateCode: string): Observable<LocalityStatistics[]> {
    if (!countryCode) {
      throw new Error('ISO 2 digits country code not provided!');
    }

    if (!regionCode) {
      throw new Error('Region code not provided!');
    }

    if (!stateCode) {
      throw new Error('State code not provided!');
    }

    let query = `select=*,locality_map!inner(${this._localityMapColumns.join(',')})`;
    query += `&locality_map.country_code=eq.${countryCode}`;
    query += `&locality_map.region_code=eq.${regionCode}`;
    query += `&locality_map.state_code=eq.${stateCode}`;
    query += `&locality_map.adm_level=eq.${AdministrativeLevel.Municipality}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestLocalityStatisticsPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new LocalityStatistics().deserialize(item));
        })
      );
  }

  /**
   * Returns statistics of specific administrative level locality items
   * @param administrativeLevel enum AdministrativeLevel value: Country, Region, State or Municipality
   * @param countryCode country code
   * @param regionCode region code
   * @param stateCode state code
   * @returns Observable<LocalityStatistics[]>
   */
  getStatisticsOfAdministrativeLevelLocalities(administrativeLevel: AdministrativeLevel, countryCode: string | null, regionCode: string | null, stateCode: string | null): Observable<LocalityStatistics[]> {
    switch (administrativeLevel) {
      case AdministrativeLevel.Country:
        return this.getStatisticsOfCountries();
      case AdministrativeLevel.Region:
        return this.getStatisticsOfRegions(countryCode || '');
      case AdministrativeLevel.State:
        return this.getStatisticsOfStates(countryCode || '', regionCode || '');
      case AdministrativeLevel.Municipality:
        return this.getStatisticsOfMunicipalities(countryCode || '', regionCode || '', stateCode || '');
      default:
        return this.getStatisticsOfCountries();
    }
  }
}