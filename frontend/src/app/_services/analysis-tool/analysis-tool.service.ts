import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalysisToolService {
  // TODO: Replace with correct url
  private _taskPredictionUrl = 'http://backend-homolog.jobzi.com:8004/task/prediction';

  constructor(private _http: HttpClient) { }

  /**
   * POST new analysis task
   * @param file csv data file blob
   * @returns 
   */
  postNewPredictionAnalysis(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this._http.post<any>(this._taskPredictionUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
