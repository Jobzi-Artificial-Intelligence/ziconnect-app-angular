import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalysisTask } from 'src/app/_models';
import { AnalysisResult } from 'src/app/_models/analysis-result/analysis-result.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalysisToolService {
  private _taskPredictionPath = 'task/prediction';
  private _taskEmployabilityImpactPath = 'task/socialimpact';
  private _taskResultPath = 'task/result';
  private _taskInfoPath = 'task/info';

  constructor(private _http: HttpClient) { }

  /**
   * POST new connectivity prediction analysis task
   * @param localityFile localities csv data file blob
   * @param schoolFile schools csv data file blob
   * @returns 
   */
  postNewPredictionAnalysis(schoolFile: File, localityFile: File) {
    const formData = new FormData();
    formData.append('locality_file', localityFile);
    formData.append('school_file', schoolFile);

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
  postNewEmployabilityImpactAnalysis(schoolHistoryFile: File, localityEmployabilityFile: File, homogenizeFeatures: Array<string>) {
    const formData = new FormData();
    formData.append('locality_history', localityEmployabilityFile);
    formData.append('school_history', schoolHistoryFile);

    if (homogenizeFeatures.length > 0) {
      formData.append('homogenize_columns', homogenizeFeatures.join(','));
    }

    return this._http.post<any>(`${environment.fastApiHost}${this._taskEmployabilityImpactPath}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Gets analysis task info by task id
   * @param taskId analysis task id
   * @returns 
   */
  getTaskInfo(taskId: string): Observable<AnalysisTask> {
    return this._http
      .get<any>(`${environment.fastApiHost}${this._taskInfoPath}/${taskId}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return new AnalysisTask().deserialize(data);
        })
      );
    ;
  }

  /**
   * Gets analysis task result by task id
   * @param taskId analysis task id
   * @returns 
   */
  getTaskResult(taskId: string): Observable<AnalysisResult> {
    return this._http
      .get<any>(`${environment.fastApiHost}${this._taskResultPath}/${taskId}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return new AnalysisResult().deserialize(data.taskResult);
        })
      );
    ;
  }
}
