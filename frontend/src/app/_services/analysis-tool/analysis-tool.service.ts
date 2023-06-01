import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalysisType } from 'src/app/_helpers';
import { AnalysisTask } from 'src/app/_models';
import { AnalysisResult } from 'src/app/_models/analysis-result/analysis-result.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalysisToolService {
  private _taskPredictionPath = 'task/prediction';
  private _taskEmployabilityImpactPath = 'task/employability-impact';
  private _taskResultPath = 'task/result';
  private _taskInfoPath = 'task/info';

  public taskPredictionDownloadResultPath = `${environment.fastApiHost}task/prediction/result/`;

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
  postNewEmployabilityImpactAnalysis(schoolHistoryFile: File, localityEmployabilityFile: File, homogenizeFeatures: Array<string>, connectivityThresholdA: number, connectivityThresholdB: number, numMunicipalitiesThreshold: number) {
    const formData = new FormData();
    formData.append('employability_history_file', localityEmployabilityFile);
    formData.append('school_history_file', schoolHistoryFile);

    // if (homogenizeFeatures.length > 0) {
    //   formData.append('homogenize_columns', homogenizeFeatures.join(','));
    // }

    return this._http.post<any>(`${environment.fastApiHost}${this._taskEmployabilityImpactPath}`, formData, {
      reportProgress: true,
      observe: 'events',
      params: {
        'connectivity_threshold_A': connectivityThresholdA,
        'connectivity_threshold_B': connectivityThresholdB,
        'municipalities_threshold': numMunicipalitiesThreshold
      }
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
  getTaskResult(taskId: string, analysisType: AnalysisType): Observable<AnalysisResult> {
    return this._http
      .get<any>(`${environment.fastApiHost}${this._taskResultPath}/${taskId}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          this.putTaskResultOnStorage(analysisType, data.taskResult);
          return new AnalysisResult().deserialize(data.taskResult);
        })
      );
    ;
  }

  /**
   * Get analysis task result from local storage
   * @param analysisType task analysis type enum value
   * @returns AnalysisResult object or null value
   */
  getTaskResultFromStorage(analysisType: AnalysisType): AnalysisResult | null {
    const analysisResultStr = localStorage.getItem(`${AnalysisType[analysisType]}_result`);
    if (analysisResultStr) {
      return new AnalysisResult().deserialize(JSON.parse(analysisResultStr));
    }

    return null;
  }

  /**
   * Put task result from server into local storage
   * @param analysisType task analysis type enum value
   * @param analysisResult task analysis result object
   */
  putTaskResultOnStorage(analysisType: AnalysisType, analysisResult: any) {
    localStorage.setItem(`${AnalysisType[analysisType]}_result`, JSON.stringify(analysisResult));
  }
}
