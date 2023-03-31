import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from 'src/app/material.module';
import { AnalysisType, UtilHelper } from 'src/app/_helpers';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';
import { AnalysisTask, LocalityStatistics } from 'src/app/_models';
import { AnalysisResult } from 'src/app/_models/analysis-result/analysis-result.model';
import { of, throwError } from "rxjs";

import { analysisResultFromServer } from '../../../test/analysis-result';

import { DialogAnaysisResultComponent } from './dialog-anaysis-result.component';

describe('DialogAnaysisResultComponent', () => {
  let component: DialogAnaysisResultComponent;
  let fixture: ComponentFixture<DialogAnaysisResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMaterialModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [DialogAnaysisResultComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA, useValue: {
            analysisResult: new AnalysisResult(),
            analysisType: AnalysisType.ConnectivityPrediction,
            analysisTask: new AnalysisTask()
          } as IDialogAnalysisResultData
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogAnaysisResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#applyFilter', () => {
    it('should exists', () => {
      expect(component.applyFilter).toBeTruthy();
      expect(component.applyFilter).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const event = { target: { value: 'Filter Value' } } as any;

      component.applyFilter(event);
      expect(component.tableDataSource.filter).toEqual(event.target.value.trim().toLowerCase());
    });
  });

  describe('#buildResultsData', () => {
    it('should exists', () => {
      expect(component.buildResultsData).toBeTruthy();
      expect(component.buildResultsData).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(component, 'buildMetricsLineChart');

      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.analysisResult = analysisResult;

      component.buildResultsData();

      expect(component.buildMetricsLineChart);
      expect(component.tableDataSource.data).toBeDefined();
    });
  });

  describe('#buildMetricsLineChart', () => {
    it('should exists', () => {
      expect(component.buildMetricsLineChart).toBeTruthy();
      expect(component.buildMetricsLineChart).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.analysisResult = analysisResult;

      component.buildMetricsLineChart();

      expect(component.metricsChartResults).toBeDefined();
      expect(component.metricsChartResults.length).toBeGreaterThan(0);
    });
  });

  describe('#loadAnalysisResult', () => {
    it('should exists', () => {
      expect(component.loadAnalysisResult).toBeTruthy();
      expect(component.loadAnalysisResult).toEqual(jasmine.any(Function));
    });

    it('should works when has local storage result', async () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);
      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResultFromStorage').and.returnValue(analysisResult);
      spyOn(component, 'buildResultsData');

      component.loadAnalysisResult();

      //@ts-ignore
      expect(component._analysisToolService.getTaskResultFromStorage).toHaveBeenCalledWith(component.data.analysisType);
      expect(component.buildResultsData).toHaveBeenCalled();
      expect(component.loading).toEqual(false);
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResultFromStorage').and.returnValue(null);
      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResult').and.returnValue(throwError({ message: 'http error' }));

      component.data.analysisTask.id = 'abc-123';
      component.loadAnalysisResult();

      //@ts-ignore
      expect(component._analysisToolService.getTaskResultFromStorage).toHaveBeenCalledWith(component.data.analysisType);
      //@ts-ignore
      expect(component._analysisToolService.getTaskResult).toHaveBeenCalledWith(component.data.analysisTask.id);
      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Something went wrong getting result: http error');
    });

    it('should works when service return success', async () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      spyOn(component, 'buildResultsData');
      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResultFromStorage').and.returnValue(null);
      //@ts-ignore
      spyOn(component._analysisToolService, 'putTaskResultOnStorage').and.returnValue(null);
      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResult').and.returnValue(of(analysisResult));

      component.data.analysisTask.id = 'abc-123';
      component.loadAnalysisResult();

      expect(component.buildResultsData).toHaveBeenCalled();
      expect(component.loading).toEqual(false);

      //@ts-ignore
      expect(component._analysisToolService.getTaskResultFromStorage).toHaveBeenCalledWith(component.data.analysisType);
      //@ts-ignore
      expect(component._analysisToolService.putTaskResultOnStorage).toHaveBeenCalledWith(component.data.analysisType, jasmine.any(Object));
    });
  });

  describe('#onButtonExportClick', () => {
    it('should exists', () => {
      expect(component.onButtonExportClick).toBeTruthy();
      expect(component.onButtonExportClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(UtilHelper, 'exportFromObjectToCsv')
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.tableDataSource = new MatTableDataSource(analysisResult.resultSummary || new Array<LocalityStatistics>());

      component.onButtonExportClick();

      expect(UtilHelper.exportFromObjectToCsv).toHaveBeenCalledWith('result_summary.csv', jasmine.any(Object));
    });

    it('should works when throw error', () => {
      spyOn(UtilHelper, 'exportFromObjectToCsv').and.throwError('Export error');
      //@ts-ignore
      spyOn(component._alertService, 'showError');
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.tableDataSource = new MatTableDataSource(analysisResult.resultSummary || new Array<LocalityStatistics>());

      component.onButtonExportClick();

      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Error: Export error');
    });
  });

  describe('#tableFilterPredicate', () => {
    it('should exists', () => {
      expect(component.tableFilterPredicate).toBeTruthy();
      expect(component.tableFilterPredicate).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);
      if (analysisResult.resultSummary) {
        const localityStatistic = analysisResult.resultSummary[0];

        expect(component.tableFilterPredicate(localityStatistic, 'bra')).toEqual(true);
        expect(component.tableFilterPredicate(localityStatistic, 'abcdefg')).toEqual(false);
      }
    });
  });
});
