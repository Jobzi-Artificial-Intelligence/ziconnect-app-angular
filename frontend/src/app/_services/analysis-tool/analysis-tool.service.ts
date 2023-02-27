import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalysisTask } from 'src/app/_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalysisToolService {
  private _taskPredictionPath = 'task/prediction';
  private _taskResultPath = 'task/result';

  constructor(private _http: HttpClient) { }

  /**
   * POST new analysis task
   * @param file csv data file blob
   * @returns 
   */
  postNewPredictionAnalysis(file: File) {
    const formData = new FormData();
    formData.append('predictionType', '1');
    formData.append('predictionFile', file);

    return this._http.post<any>(`${environment.fastApiHost}${this._taskPredictionPath}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Gets analysis task status by task id
   * @param taskId analysis task id
   * @returns 
   */
  getTaskResult(taskId: string): Observable<AnalysisTask> {
    return this._http
      .get<any>(`${environment.fastApiHost}${this._taskResultPath}/${taskId}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new AnalysisTask().deserialize(item));
        })
      );
    ;
  }
}
