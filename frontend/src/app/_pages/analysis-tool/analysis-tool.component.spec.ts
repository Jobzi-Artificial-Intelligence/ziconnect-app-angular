import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { AngularMaterialModule } from 'src/app/material.module';
import { DialogAnaysisResultComponent, PageFooterComponent } from 'src/app/_components';
import { AnalysisInputType, AnalysisTaskStatus, AnalysisType } from 'src/app/_helpers';
import { DialogAnalysisFileRequirementsComponent } from 'src/app/_components';

import { AnalysisToolComponent } from './analysis-tool.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { AnalysisTask } from 'src/app/_models';
import { analysisTaskFromServer } from 'src/test/analysis-task';
import { IAnalysisInputValidationResult, IDialogAnalysisResultData } from 'src/app/_interfaces';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

describe('AnalysisToolComponent', () => {
  let component: AnalysisToolComponent;
  let fixture: ComponentFixture<AnalysisToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AnalysisToolComponent,
        PageFooterComponent],
      imports: [
        AngularMaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getContactUsBodyErrorMessage', () => {
    it('should exists', () => {
      expect(component.getContactUsBodyErrorMessage).toBeTruthy();
      expect(component.getContactUsBodyErrorMessage).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      let result = '';
      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;
      component.storageTask = new AnalysisTask().deserialize(analysisTaskFromServer);

      result = component.getContactUsBodyErrorMessage();

      expect(result).toEqual('');

      component.storageTask.status = AnalysisTaskStatus.Failure;
      result = component.getContactUsBodyErrorMessage();

      expect(result.includes(component.storageTask.id.toString())).toEqual(true);
    });
  });

  describe('#initNewAnalysis', () => {
    it('should exists', () => {
      expect(component.initNewAnalysis).toBeTruthy();
      expect(component.initNewAnalysis).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const subject = new Subject<string>();
      component.poolTaskSubscription = subject.subscribe();
      component.schoolFileDropRef = {
        nativeElement: {
          value: 'test'
        }
      } as ElementRef;
      component.schoolHistoryFileDropRef = {
        nativeElement: {
          value: 'test'
        }
      } as ElementRef;
      component.localityFileDropRef = {
        nativeElement: {
          value: 'test'
        }
      } as ElementRef;
      component.localityEmployabilityFileDropRef = {
        nativeElement: {
          value: 'test'
        }
      } as ElementRef;

      spyOn(component.poolTaskSubscription, 'unsubscribe');
      spyOn(component, 'stopStatusCheckCountdown');

      component.initNewAnalysis();

      expect(component.localityFile).toBeUndefined();
      expect(component.schoolHistoryFile).toBeUndefined();
      expect(component.schoolFile).toBeUndefined();
      expect(component.storageTask).toEqual(null);
      expect(component.progress).toEqual(0);
      expect(component.localityFileDropRef.nativeElement.value).toEqual('');
      expect(component.localityEmployabilityFileDropRef.nativeElement.value).toEqual('');
      expect(component.schoolFileDropRef.nativeElement.value).toEqual('');
      expect(component.schoolHistoryFileDropRef.nativeElement.value).toEqual('');

      expect(component.stopStatusCheckCountdown).toHaveBeenCalled();
      expect(component.poolTaskSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('#loadStorageTask', () => {
    it('should exists', () => {
      expect(component.loadStorageTask).toBeTruthy();
      expect(component.loadStorageTask).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const analysisTaskFromStorage = {
        id: 'abc-123',
        status: 'PENDING',
        receivedAt: moment().format(),
        startedAt: moment().format(),
        failureAt: null,
        successAt: null
      };
      const analysisTaskFromStorageStr = JSON.stringify(analysisTaskFromStorage);

      spyOn(window.localStorage, 'getItem').and.returnValue(analysisTaskFromStorageStr);

      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;

      component.loadStorageTask();

      expect(component.storageTask).toBeDefined();
      expect(component.storageTask?.id).toEqual(analysisTaskFromStorage.id);
    });
  });

  describe('#ngOnDestroy', () => {
    it('should exists', () => {
      expect(component.ngOnDestroy).toBeTruthy();
      expect(component.ngOnDestroy).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const subject = new Subject<string>();
      component.poolTaskSubscription = subject.subscribe();

      spyOn(component.poolTaskSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(component.poolTaskSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('#onButtonNextClick', () => {
    it('should exists', () => {
      expect(component.onButtonNextClick).toBeTruthy();
      expect(component.onButtonNextClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;

      fixture.detectChanges();
      if (component.analysisStepper && component.analysisStepper.selected) {
        spyOn(component.analysisStepper, 'next');

        component.onButtonNextClick();

        expect(component.analysisStepper.selected.completed).toEqual(true);
        expect(component.analysisStepper.next).toHaveBeenCalledWith();
      }
    });
  });

  describe('#onButtonRemoveFileClick', () => {
    it('should exists', () => {
      expect(component.onButtonRemoveFileClick).toBeTruthy();
      expect(component.onButtonRemoveFileClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;
      component.schoolFileIsValid = true;

      fixture.detectChanges();
      if (component.analysisStepper) {
        spyOn(component.analysisStepper, 'reset');

        component.schoolFileDropRef = {
          nativeElement: {
            value: 'abc-123'
          }
        }

        component.onButtonRemoveFileClick('schoolFile');

        expect(component.schoolFile).toBeUndefined();
        if (component.schoolFileDropRef) {
          expect(component.schoolFileDropRef?.nativeElement.value).toEqual('');
        }
        expect(component.schoolFileIsValid).toEqual(false);
        expect(component.schoolFileValidationResult.length).toEqual(0);
        expect(component.analysisStepper.reset).toHaveBeenCalledWith();
      }
    });
  });

  describe('#onButtonRemoveStorageValueClick', () => {
    it('should exists', () => {
      expect(component.onButtonRemoveStorageValueClick).toBeTruthy();
      expect(component.onButtonRemoveStorageValueClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(component, 'onSelectAnalysisTypeClick');
      spyOn(window.localStorage, 'removeItem');

      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;
      const analysisTypeStr = AnalysisType[component.selectedAnalysisType];

      component.onButtonRemoveStorageValueClick();

      expect(window.localStorage.removeItem).toHaveBeenCalledWith(`${analysisTypeStr}_task`);
      expect(component.onSelectAnalysisTypeClick).toHaveBeenCalledWith(component.selectedAnalysisType);
    });
  });

  describe('#onButtonRetryCheckStatusClick', () => {
    it('should exists', () => {
      expect(component.onButtonRetryCheckStatusClick).toBeTruthy();
      expect(component.onButtonRetryCheckStatusClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      let analysisTask = new AnalysisTask().deserialize(analysisTaskFromServer);
      component.storageTask = analysisTask;
      component.storageTask.statusCheckCode = 500;
      component.storageTask.statusCheckMessage = 'error';

      const subject = new Subject<string>();
      component.poolTaskSubscription = subject.subscribe();
      component.poolTaskSubscription.unsubscribe();

      spyOn(component, 'poolStorageTask');

      component.onButtonRetryCheckStatusClick();

      expect(component.storageTask.statusCheckCode).toEqual(0);
      expect(component.storageTask.statusCheckMessage).toEqual('');
      expect(component.poolStorageTask).toHaveBeenCalled();
    });
  });

  describe('#onButtonStartAnalysisClick', () => {
    it('should exists', () => {
      expect(component.onButtonStartAnalysisClick).toBeTruthy();
      expect(component.onButtonStartAnalysisClick).toEqual(jasmine.any(Function));
    });

    it('should works for Connectivity Prediction', () => {
      spyOn(component, 'startNewPredictionAnalysis');
      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;

      component.onButtonStartAnalysisClick();

      expect(component.startNewPredictionAnalysis).toHaveBeenCalledWith();
    });

    it('should works for Employability Impact', () => {
      spyOn(component, 'startNewEmployabilityImpactAnalysis');
      component.selectedAnalysisType = AnalysisType.EmployabilityImpact;

      component.onButtonStartAnalysisClick();

      expect(component.startNewEmployabilityImpactAnalysis).toHaveBeenCalledWith();
    });
  });

  describe('#onButtonViewResultsClick', () => {
    it('should exists', () => {
      expect(component.onButtonViewResultsClick).toBeTruthy();
      expect(component.onButtonViewResultsClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      //@ts-ignore
      spyOn(component._dialogFileRequirements, 'open');

      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;
      component.storageTask = new AnalysisTask().deserialize(analysisTaskFromServer);

      component.onButtonViewResultsClick();

      //@ts-ignore
      expect(component._dialogFileRequirements.open).toHaveBeenCalledWith(DialogAnaysisResultComponent, {
        autoFocus: false,
        maxHeight: '90vh',
        maxWidth: '90vw',
        width: '100%',
        data: {
          analysisTask: component.storageTask,
          analysisType: component.selectedAnalysisType
        } as IDialogAnalysisResultData
      })
    });
  });

  describe('#onFileBrowserHandler', () => {
    it('should exists', () => {
      expect(component.onFileBrowserHandler).toBeTruthy();
      expect(component.onFileBrowserHandler).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      component.onFileBrowserHandler(mockEvent, 'schoolFile');

      expect(component.schoolFile).toBeDefined();
      expect(component.schoolFile).toEqual(mockFile);
    });
  });

  describe('#onFileDropped', () => {
    it('should exists', () => {
      expect(component.onFileDropped).toBeTruthy();
      expect(component.onFileDropped).toEqual(jasmine.any(Function));
    });

    it('should works when has no file', () => {
      //@ts-ignore
      spyOn(component._alertService, 'showWarning');

      component.onFileDropped({
        length: 0
      } as FileList, 'schoolFile');

      //@ts-ignore
      expect(component._alertService.showWarning).toHaveBeenCalledWith('Upload file not provided');
    });

    it('should works when has more than one file', () => {
      //@ts-ignore
      spyOn(component._alertService, 'showWarning');

      component.onFileDropped({
        length: 2
      } as FileList, 'schoolFile');

      //@ts-ignore
      expect(component._alertService.showWarning).toHaveBeenCalledWith('Only one file is allowed');
    });

    it('should works when has one file', () => {
      // Define a mock File object
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      // Create a mock FileList with one file
      const mockFileList = {
        0: mockFile,
        length: 1,
        item: () => mockFile,
        [Symbol.iterator]: function* () {
          yield mockFile;
        },
      } as FileList;

      component.onFileDropped(mockFileList, 'schoolFile');

      expect(component.schoolFile).toBeDefined();
      expect(component.schoolFile).toEqual(mockFileList[0]);
    });
  });

  describe('#onFileRequirementsClick', () => {
    it('should exists', () => {
      expect(component.onFileRequirementsClick).toBeTruthy();
      expect(component.onFileRequirementsClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      //@ts-ignore
      spyOn(component._dialogFileRequirements, 'open');

      component.onFileRequirementsClick(AnalysisInputType.Locality);

      //@ts-ignore
      expect(component._dialogFileRequirements.open).toHaveBeenCalledWith(DialogAnalysisFileRequirementsComponent, {
        width: '100%',
        data: AnalysisInputType.Locality
      });
    });
  });

  describe('#onSelectAnalysisTypeClick', () => {
    it('should exists', () => {
      expect(component.onSelectAnalysisTypeClick).toBeTruthy();
      expect(component.onSelectAnalysisTypeClick).toEqual(jasmine.any(Function));
    });

    it('should works for Connectivity Prediction without storage task', () => {
      spyOn(component, 'initNewAnalysis');
      spyOn(component, 'loadStorageTask');
      spyOn(component, 'scrollToSection');

      component.onSelectAnalysisTypeClick(AnalysisType.ConnectivityPrediction);

      expect(component.selectedAnalysisType).toEqual(AnalysisType.ConnectivityPrediction);
      expect(component.initNewAnalysis).toHaveBeenCalled();
      expect(component.scrollToSection).toHaveBeenCalledWith('sectionAnalysisSteps');
    });

    it('should works for Connectivity Prediction without storage task not failure or success status', () => {
      spyOn(component, 'initNewAnalysis');
      spyOn(component, 'loadStorageTask');
      spyOn(component, 'poolStorageTask');

      component.storageTask = new AnalysisTask().deserialize(analysisTaskFromServer);
      component.storageTask.status = AnalysisTaskStatus.Pending;

      component.onSelectAnalysisTypeClick(AnalysisType.ConnectivityPrediction);

      expect(component.selectedAnalysisType).toEqual(AnalysisType.ConnectivityPrediction);
      expect(component.initNewAnalysis).toHaveBeenCalled();
      expect(component.poolStorageTask).toHaveBeenCalled();
    });
  });

  describe('#onStepSelectionChange', () => {
    it('should exists', () => {
      expect(component.onStepSelectionChange).toBeTruthy();
      expect(component.onStepSelectionChange).toEqual(jasmine.any(Function));
    });

    it('should works for schoolFile', async () => {
      const validationResult = new Array<IAnalysisInputValidationResult>();
      validationResult.push({
        valid: true,
        message: 'Success validation!'
      } as IAnalysisInputValidationResult)

      //@ts-ignore
      spyOn(component._analysisInputValidationService, 'validateSchoolInputFile').and.returnValue(Promise.resolve(validationResult));

      const mockEvent = { selectedIndex: 1, previouslySelectedIndex: 0 } as StepperSelectionEvent;

      component.schoolFile = new File(['schools'], 'schools.csv', { type: 'application/csv' });

      await component.onStepSelectionChange(mockEvent);

      //@ts-ignore
      expect(component._analysisInputValidationService.validateSchoolInputFile).toHaveBeenCalled();
      expect(component.schoolFileIsValid).toEqual(true);
      expect(component.schoolFileValidationResult).toEqual(validationResult);
    });

    it('should works for schoolHistoryFile', async () => {
      const validationResult = new Array<IAnalysisInputValidationResult>();
      validationResult.push({
        valid: true,
        message: 'Success validation!'
      } as IAnalysisInputValidationResult)

      //@ts-ignore
      spyOn(component._analysisInputValidationService, 'validateSchoolHistoryInputFile').and.returnValue(Promise.resolve(validationResult));

      const mockEvent = { selectedIndex: 1, previouslySelectedIndex: 0 } as StepperSelectionEvent;

      component.schoolHistoryFile = new File(['schools'], 'schools.csv', { type: 'application/csv' });

      await component.onStepSelectionChange(mockEvent);

      //@ts-ignore
      expect(component._analysisInputValidationService.validateSchoolHistoryInputFile).toHaveBeenCalled();
      expect(component.schoolHistoryFileIsValid).toEqual(true);
      expect(component.schoolHistoryFileValidationResult).toEqual(validationResult);
    });

    it('should works for localityFile', async () => {
      const validationResult = new Array<IAnalysisInputValidationResult>();
      validationResult.push({
        valid: true,
        message: 'Success validation!'
      } as IAnalysisInputValidationResult)

      //@ts-ignore
      spyOn(component._analysisInputValidationService, 'validateLocalityInputFile').and.returnValue(Promise.resolve(validationResult));

      const mockEvent = { selectedIndex: 1, previouslySelectedIndex: 0 } as StepperSelectionEvent;

      component.localityFile = new File(['localities'], 'localities.csv', { type: 'application/csv' });

      await component.onStepSelectionChange(mockEvent);

      //@ts-ignore
      expect(component._analysisInputValidationService.validateLocalityInputFile).toHaveBeenCalled();
      expect(component.localityFileIsValid).toEqual(true);
      expect(component.localityFileValidationResult).toEqual(validationResult);
    });

    it('should works for localityEmployabilityFile', async () => {
      const validationResult = new Array<IAnalysisInputValidationResult>();
      validationResult.push({
        valid: true,
        message: 'Success validation!'
      } as IAnalysisInputValidationResult)

      //@ts-ignore
      spyOn(component._analysisInputValidationService, 'validateLocalityEmployabilityInputFile').and.returnValue(Promise.resolve(validationResult));

      const mockEvent = { selectedIndex: 1, previouslySelectedIndex: 0 } as StepperSelectionEvent;

      component.localityEmployabilityFile = new File(['localities'], 'localities.csv', { type: 'application/csv' });

      await component.onStepSelectionChange(mockEvent);

      //@ts-ignore
      expect(component._analysisInputValidationService.validateLocalityEmployabilityInputFile).toHaveBeenCalled();
      expect(component.localityEmployabilityFileIsValid).toEqual(true);
      expect(component.localityEmployabilityFileValidationResult).toEqual(validationResult);
    });
  });

  describe('poolStorageTask', () => {

    beforeEach(() => {
      jasmine.clock().uninstall();
      jasmine.clock().install();

      component.storageTask = new AnalysisTask().deserialize(analysisTaskFromServer);
    });

    afterEach(() => {
      clearInterval(component.statusCheckInterval);
      jasmine.clock().uninstall();
    });

    it('should exists', () => {
      expect(component.poolStorageTask).toBeTruthy();
      expect(component.poolStorageTask).toEqual(jasmine.any(Function));
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskInfo').and.returnValue(throwError({ message: 'http error' }));

      component.poolStorageTask();

      jasmine.clock().tick(31000);

      expect(component.loadingPoolTask).toEqual(false);
    });

    it('should works when service return error 404', async () => {
      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskInfo').and.returnValue(throwError({ message: 'http error', status: 404 }));

      component.poolStorageTask();

      jasmine.clock().tick(31000);

      expect(component.loadingPoolTask).toEqual(false);
      expect(component.storageTask?.statusCheckMessage).toEqual('We were unable to locate your analysis, or its storage time has expired. You can either discard it and start a new analysis.');
    });

    it('should works when service return task info', async () => {
      const analysisTask = new AnalysisTask().deserialize(analysisTaskFromServer);
      analysisTask.status = AnalysisTaskStatus.Pending;
      //@ts-ignore
      spyOn(component._alertService, 'showError');
      spyOn(component, 'putAnalysisTaskOnStorage');
      spyOn(component, 'stopStatusCheckCountdown');

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskInfo').and.returnValue(of(analysisTask));

      component.poolStorageTask();

      jasmine.clock().tick(31000);

      expect(component.loadingPoolTask).toEqual(false);
      expect(component.putAnalysisTaskOnStorage).toHaveBeenCalled();
      expect(component.stopStatusCheckCountdown).not.toHaveBeenCalled();
    });

    it('should works when service return success or failure task info', async () => {
      const analysisTask = new AnalysisTask().deserialize(analysisTaskFromServer);
      analysisTask.status = AnalysisTaskStatus.Failure;
      //@ts-ignore
      spyOn(component._alertService, 'showError');
      spyOn(component, 'putAnalysisTaskOnStorage');
      spyOn(component, 'stopStatusCheckCountdown');

      //@ts-ignore
      spyOn(component._analysisToolService, 'getTaskInfo').and.returnValue(of(analysisTask));

      component.poolStorageTask();

      jasmine.clock().tick(31000);

      expect(component.loadingPoolTask).toEqual(false);
      expect(component.putAnalysisTaskOnStorage).toHaveBeenCalled();
      expect(component.stopStatusCheckCountdown).toHaveBeenCalled();
    });
  });

  describe('#putAnalysisTaskOnStorage', () => {
    it('should exists', () => {
      expect(component.putAnalysisTaskOnStorage).toBeTruthy();
      expect(component.putAnalysisTaskOnStorage).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      spyOn(window.localStorage, 'setItem');

      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;

      const analysisTask = new AnalysisTask().deserialize(analysisTaskFromServer);

      await component.putAnalysisTaskOnStorage(analysisTask);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(`${AnalysisType[component.selectedAnalysisType]}_task`, analysisTask.toLocalStorageString());
    });
  });

  describe('#removeAnalysisResultFromStorage', () => {
    it('should exists', () => {
      expect(component.removeAnalysisResultFromStorage).toBeTruthy();
      expect(component.removeAnalysisResultFromStorage).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(window.localStorage, 'removeItem');

      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;

      component.removeAnalysisResultFromStorage();

      expect(window.localStorage.removeItem).toHaveBeenCalledWith(`${AnalysisType[component.selectedAnalysisType]}_result`);
    });
  });

  describe('#scrollToSection', () => {
    it('should exists', () => {
      expect(component.scrollToSection).toBeTruthy();
      expect(component.scrollToSection).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(window, 'scrollTo');

      component.scrollToSection('sectionTypeSelection');

      expect(window.scrollTo).toHaveBeenCalled();

    });
  });

  describe('#startNewEmployabilityImpactAnalysis', () => {
    it('should exists', () => {
      expect(component.startNewEmployabilityImpactAnalysis).toBeTruthy();
      expect(component.startNewEmployabilityImpactAnalysis).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      //@ts-ignore
      spyOn(component._alertService, 'showWarning');
      component.schoolHistoryFile = undefined;
      component.localityEmployabilityFile = undefined;

      component.startNewEmployabilityImpactAnalysis();

      //@ts-ignore
      expect(component._alertService.showWarning).toHaveBeenCalledWith('One or more input file were not provided!');

      component.schoolHistoryFile = new File(['schools'], 'schools.csv', { type: 'application/csv' });
      component.localityEmployabilityFile = undefined;

      component.startNewEmployabilityImpactAnalysis();
    });

    it('should works when service return error', async () => {
      component.schoolHistoryFile = new File(['schools'], 'schools_history.csv', { type: 'application/csv' });
      component.localityEmployabilityFile = new File(['localities'], 'locality_employability.csv', { type: 'application/csv' });

      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._analysisToolService, 'postNewEmployabilityImpactAnalysis').and.returnValue(throwError({ message: 'http error' }));

      component.startNewEmployabilityImpactAnalysis();

      //@ts-ignore
      expect(component._analysisToolService.postNewEmployabilityImpactAnalysis).toHaveBeenCalledWith(component.schoolHistoryFile, component.localityEmployabilityFile);
      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Something went wrong starting new analysis: http error');
      expect(component.loadingStartTask).toEqual(false);
    });

    it('should works when service return upload progress event', async () => {
      component.schoolHistoryFile = new File(['schools'], 'schools_history.csv', { type: 'application/csv' });
      component.localityEmployabilityFile = new File(['localities'], 'locality_employability.csv', { type: 'application/csv' });

      const mockEvent = {
        type: HttpEventType.UploadProgress,
        loaded: 70,
        total: 100
      };

      //@ts-ignore
      spyOn(component._analysisToolService, 'postNewEmployabilityImpactAnalysis').and.returnValue(of(mockEvent));

      component.startNewEmployabilityImpactAnalysis();

      expect(component.progress).toEqual(70);
    });

    it('should works when service return http response', async () => {
      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;
      component.schoolHistoryFile = new File(['schools'], 'schools_history.csv', { type: 'application/csv' });
      component.localityEmployabilityFile = new File(['localities'], 'locality_employability.csv', { type: 'application/csv' });

      const mockEvent = new HttpResponse({ body: { task_id: 123 }, status: 200, statusText: 'OK' });

      spyOn(component, 'putAnalysisTaskOnStorage');
      spyOn(component, 'poolStorageTask');
      spyOn(component, 'removeAnalysisResultFromStorage');

      //@ts-ignore
      spyOn(component._analysisToolService, 'postNewEmployabilityImpactAnalysis').and.returnValue(of(mockEvent));

      component.startNewEmployabilityImpactAnalysis();

      expect(component.putAnalysisTaskOnStorage).toHaveBeenCalled()
      expect(component.poolStorageTask).toHaveBeenCalled()
      expect(component.removeAnalysisResultFromStorage).toHaveBeenCalled();
    });
  });

  describe('#startNewPredictionAnalysis', () => {
    it('should exists', () => {
      expect(component.startNewPredictionAnalysis).toBeTruthy();
      expect(component.startNewPredictionAnalysis).toEqual(jasmine.any(Function));
    });

    it('should works without all input files', () => {
      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;
      component.schoolFile = undefined;
      component.localityFile = undefined;

      //@ts-ignore
      spyOn(component._alertService, 'showWarning');

      component.startNewPredictionAnalysis();

      //@ts-ignore
      expect(component._alertService.showWarning).toHaveBeenCalledWith('One or more input file were not provided!');

      component.schoolFile = new File(['schools'], 'schools.csv', { type: 'application/csv' });

      component.startNewPredictionAnalysis();

      //@ts-ignore
      expect(component._alertService.showWarning).toHaveBeenCalledWith('One or more input file were not provided!');
    });

    it('should works when service return error', async () => {
      component.schoolFile = new File(['schools'], 'schools.csv', { type: 'application/csv' });
      component.localityFile = new File(['localities'], 'localities.csv', { type: 'application/csv' });

      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._analysisToolService, 'postNewPredictionAnalysis').and.returnValue(throwError({ message: 'http error' }));

      component.startNewPredictionAnalysis();

      //@ts-ignore
      expect(component._analysisToolService.postNewPredictionAnalysis).toHaveBeenCalledWith(component.schoolFile, component.localityFile);
      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Something went wrong starting new analysis: http error');
      expect(component.loadingStartTask).toEqual(false);
    });

    it('should works when service return upload progress event', async () => {
      component.schoolFile = new File(['schools'], 'schools.csv', { type: 'application/csv' });
      component.localityFile = new File(['localities'], 'localities.csv', { type: 'application/csv' });

      const mockEvent = {
        type: HttpEventType.UploadProgress,
        loaded: 70,
        total: 100
      };

      //@ts-ignore
      spyOn(component._analysisToolService, 'postNewPredictionAnalysis').and.returnValue(of(mockEvent));

      component.startNewPredictionAnalysis();

      expect(component.progress).toEqual(70);
    });

    it('should works when service return http response', async () => {
      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;
      component.schoolFile = new File(['schools'], 'schools.csv', { type: 'application/csv' });
      component.localityFile = new File(['localities'], 'localities.csv', { type: 'application/csv' });

      const mockEvent = new HttpResponse({ body: { task_id: 123 }, status: 200, statusText: 'OK' });

      spyOn(component, 'putAnalysisTaskOnStorage');
      spyOn(component, 'poolStorageTask');

      //@ts-ignore
      spyOn(component._analysisToolService, 'postNewPredictionAnalysis').and.returnValue(of(mockEvent));

      component.startNewPredictionAnalysis();

      expect(component.putAnalysisTaskOnStorage).toHaveBeenCalled()
      expect(component.poolStorageTask).toHaveBeenCalled()
    });
  });

  describe('startStatusCheckCountdown', () => {

    beforeEach(() => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
    });

    afterEach(() => {
      clearInterval(component.statusCheckInterval);
      jasmine.clock().uninstall();
    });

    it('should set remaining time to 30', () => {
      component.startStatusCheckCountdown();
      expect(component.statusCheckTimeLeft).toEqual(30);
    });

    it('must call setInterval with correct time and correct interval', () => {
      spyOn(window, 'setInterval').and.callThrough();

      component.startStatusCheckCountdown();
      expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 1000);
    });

    it('must decrement remaining time by 1 every second', () => {
      component.startStatusCheckCountdown();

      expect(component.statusCheckTimeLeft).toEqual(30);
      jasmine.clock().tick(1000);
      expect(component.statusCheckTimeLeft).toEqual(29);
      jasmine.clock().tick(1000);
      expect(component.statusCheckTimeLeft).toEqual(28);
    });

    it('should call stopStatusCheckCountdown when remaining time reaches zero', () => {
      spyOn(component, 'stopStatusCheckCountdown');

      component.startStatusCheckCountdown();

      jasmine.clock().tick(31000);
      expect(component.stopStatusCheckCountdown).toHaveBeenCalled();
    });
  });

  describe('#stopStatusCheckCountdown', () => {
    it('should exists', () => {
      expect(component.stopStatusCheckCountdown).toBeTruthy();
      expect(component.stopStatusCheckCountdown).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.statusCheckInterval = { name: '' };

      spyOn(window, 'clearInterval');

      component.stopStatusCheckCountdown();

      expect(window.clearInterval).toHaveBeenCalled();
    });
  });
});
