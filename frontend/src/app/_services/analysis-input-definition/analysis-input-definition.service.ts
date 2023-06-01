import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalysisInputType } from 'src/app/_helpers';
import { AnalysisInputDefinition } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class AnalysisInputDefinitionService {
  private _assetsPath = '/assets/analysis-input-definition/';

  constructor(private _http: HttpClient) { }

  /**
   * Gets analysis task status by task id
   * @param taskId analysis task id
   * @returns 
   */
  getAnalysisInputDefinition(analysisInput: AnalysisInputType): Observable<AnalysisInputDefinition[]> {
    return this._http
      .get<any>(`${this._assetsPath}${analysisInput.toString().toLowerCase()}.json`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
    ;
  }
}
