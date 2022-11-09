import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class StatsService {
  private _csvStatsFileRootPath = 'assets/datasets/stats';

  constructor(private http: HttpClient, private baseHref: String) { }

  /**
   * Gets csv dataset file and convert to string
   * @returns Observable<string> with csv file content
   */
  getGeneralStatsByCountry(countryCode: string) {
    if (!countryCode) {
      throw new Error('ISO 2 digits country code not provided!');
    }

    return this.http.get(`${this.baseHref}${this._csvStatsFileRootPath}/${countryCode.toLowerCase()}.csv`, { responseType: 'text' });
  }
}
