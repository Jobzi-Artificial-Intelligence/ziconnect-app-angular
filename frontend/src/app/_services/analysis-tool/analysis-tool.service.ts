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
  private _taskEmployabilityImpactPath = 'task/employability-impact';
  private _taskResultPath = 'task/result';

  constructor(private _http: HttpClient) { }

  /**
   * POST new connectivity prediction analysis task
   * @param localityFile localities csv data file blob
   * @param schoolFile schools csv data file blob
   * @returns 
   */
  postNewPredictionAnalysis(schoolFile: File, localityFile: File) {
    const formData = new FormData();
    formData.append('localityFile', localityFile);
    formData.append('schoolFile', schoolFile);

    return this._http.post<any>(`${environment.fastApiHost}${this._taskPredictionPath}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * POST new Employability impact analysis task
   * @param localityFile localities csv data file blob
   * @param schoolHistoryFile school history csv data file blob
   * @returns 
   */
  postNewEmployabilityImpactAnalysis(schoolHistoryFile: File, localityFile: File) {
    const formData = new FormData();
    formData.append('localityFile', localityFile);
    formData.append('schoolHistoryFile', schoolHistoryFile);

    return this._http.post<any>(`${environment.fastApiHost}${this._taskEmployabilityImpactPath}`, formData, {
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
          return new AnalysisTask().deserialize(data);
        })
      );
    ;
  }
}
