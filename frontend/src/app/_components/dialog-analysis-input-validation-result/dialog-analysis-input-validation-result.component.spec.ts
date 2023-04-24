import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';
import { of, throwError } from "rxjs";

import { DialogAnalysisInputValidationResultComponent } from './dialog-analysis-input-validation-result.component';
import { AngularMaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnalysisType } from 'src/app/_helpers';
import { AnalysisTask } from 'src/app/_models';
import { AnalysisResult } from 'src/app/_models/analysis-result/analysis-result.model';
import { analysisResultFromServer } from 'src/test/analysis-result';

describe('DialogAnalysisInputValidationResultComponent', () => {
  let component: DialogAnalysisInputValidationResultComponent;
  let fixture: ComponentFixture<DialogAnalysisInputValidationResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMaterialModule, NoopAnimationsModule, HttpClientTestingModule],
      declarations: [DialogAnalysisInputValidationResultComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA, useValue: {
            analysisType: AnalysisType.ConnectivityPrediction,
            analysisTask: new AnalysisTask()
          } as IDialogAnalysisResultData
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAnalysisInputValidationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#loadAnalysisResult', () => {
    it('should exists', () => {
      expect(component.loadAnalysisResult).toBeTruthy();
      expect(component.loadAnalysisResult).toEqual(jasmine.any(Function));
    });

    // *** CONNECTIVITY PREDICTION *** //
    it('should works when has local storage result', async () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);
      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResultFromStorage').and.returnValue(analysisResult);
      spyOn(component, 'loadLocalityFileFailureCases');
      spyOn(component, 'loadSchoolFileFailureCases');

      component.loadAnalysisResult();

      //@ts-ignore
      expect(component._analysisToolService.getTaskResultFromStorage).toHaveBeenCalledWith(component.data.analysisType);
      expect(component.loadLocalityFileFailureCases).toHaveBeenCalled();
      expect(component.loadSchoolFileFailureCases).toHaveBeenCalled();
      expect(component.loading).toEqual(false);
    });

    // *** EMPLOYABILITY IMPACT *** //
    it('should works when has local storage result', async () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);
      component.data.analysisType = AnalysisType.EmployabilityImpact;

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResultFromStorage').and.returnValue(analysisResult);
      spyOn(component, 'loadLocalityEmployabilityFileFailureCases');
      spyOn(component, 'loadSchoolHistoryFileFailureCases');

      component.loadAnalysisResult();

      //@ts-ignore
      expect(component._analysisToolService.getTaskResultFromStorage).toHaveBeenCalledWith(component.data.analysisType);
      expect(component.loadLocalityEmployabilityFileFailureCases).toHaveBeenCalled();
      expect(component.loadSchoolHistoryFileFailureCases).toHaveBeenCalled();
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
      expect(component._analysisToolService.getTaskResult).toHaveBeenCalledWith(component.data.analysisTask.id, component.data.analysisType);
      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Something went wrong getting result: http error');
    });

    // *** CONNECTIVITY PREDICTION *** //
    it('should works when service return success', async () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResultFromStorage').and.returnValue(null);
      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResult').and.returnValue(of(analysisResult));
      spyOn(component, 'loadLocalityFileFailureCases');
      spyOn(component, 'loadSchoolFileFailureCases');

      component.data.analysisTask.id = 'abc-123';
      component.loadAnalysisResult();

      expect(component.loading).toEqual(false);

      //@ts-ignore
      expect(component._analysisToolService.getTaskResultFromStorage).toHaveBeenCalledWith(component.data.analysisType);
      expect(component.loadLocalityFileFailureCases).toHaveBeenCalled();
      expect(component.loadSchoolFileFailureCases).toHaveBeenCalled();
    });

    // *** EMPLOYABILITY IMPACT *** //
    it('should works when service return success', async () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);
      component.data.analysisType = AnalysisType.EmployabilityImpact;

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResultFromStorage').and.returnValue(null);
      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskResult').and.returnValue(of(analysisResult));
      spyOn(component, 'loadLocalityEmployabilityFileFailureCases');
      spyOn(component, 'loadSchoolHistoryFileFailureCases');

      component.data.analysisTask.id = 'abc-123';
      component.loadAnalysisResult();

      expect(component.loading).toEqual(false);

      //@ts-ignore
      expect(component._analysisToolService.getTaskResultFromStorage).toHaveBeenCalledWith(component.data.analysisType);
      expect(component.loadLocalityEmployabilityFileFailureCases).toHaveBeenCalled();
      expect(component.loadSchoolHistoryFileFailureCases).toHaveBeenCalled();
    });
  });

  describe('#loadLocalityEmployabilityFileFailureCases', () => {
    it('should exists', () => {
      expect(component.loadLocalityEmployabilityFileFailureCases).toBeTruthy();
      expect(component.loadLocalityEmployabilityFileFailureCases).toEqual(jasmine.any(Function));
    });

    it('should works', function () {
      component.analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.loadLocalityEmployabilityFileFailureCases();

      expect(component.localityEmployabilityFileAnalysisInputValidation).toBeDefined();
      expect(component.tableLocalityEmployabilityFileFailureCasesDataSource).toBeDefined();
      expect(component.tableLocalityEmployabilityFileFailureCasesDataSource.data.length).toBeGreaterThan(0);
    });
  });

  describe('#loadLocalityFileFailureCases', () => {
    it('should exists', () => {
      expect(component.loadLocalityFileFailureCases).toBeTruthy();
      expect(component.loadLocalityFileFailureCases).toEqual(jasmine.any(Function));
    });

    it('should works', function () {
      component.analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.loadLocalityFileFailureCases();

      expect(component.localityFileAnalysisInputValidation).toBeDefined();
      expect(component.tableLocalityFileFailureCasesDataSource).toBeDefined();
      expect(component.tableLocalityFileFailureCasesDataSource.data.length).toBeGreaterThan(0);
    });
  });

  describe('#loadSchoolFileFailureCases', () => {
    it('should exists', () => {
      expect(component.loadSchoolFileFailureCases).toBeTruthy();
      expect(component.loadSchoolFileFailureCases).toEqual(jasmine.any(Function));
    });

    it('should works', function () {
      component.analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.loadSchoolFileFailureCases();

      expect(component.schoolFileAnalysisInputValidation).toBeDefined();
      expect(component.tableSchoolFileFailureCasesDataSource).toBeDefined();
      expect(component.tableSchoolFileFailureCasesDataSource.data.length).toBeGreaterThan(0);
    });
  });

  describe('#loadSchoolHistoryFileFailureCases', () => {
    it('should exists', () => {
      expect(component.loadSchoolHistoryFileFailureCases).toBeTruthy();
      expect(component.loadSchoolHistoryFileFailureCases).toEqual(jasmine.any(Function));
    });

    it('should works', function () {
      component.analysisResult = new AnalysisResult().deserialize(analysisResultFromServer.taskResult);

      component.loadSchoolHistoryFileFailureCases();

      expect(component.schoolHistoryFileAnalysisInputValidation).toBeDefined();
      expect(component.tableSchoolHistoryFileFailureCasesDataSource).toBeDefined();
      expect(component.tableSchoolHistoryFileFailureCasesDataSource.data.length).toBeGreaterThan(0);
    });
  });
});
