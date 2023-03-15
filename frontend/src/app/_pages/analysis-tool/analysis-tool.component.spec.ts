import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AngularMaterialModule } from 'src/app/material.module';
import { DialogAnaysisResultComponent, PageFooterComponent } from 'src/app/_components';
import { AnalysisInputType, AnalysisTaskStatus, AnalysisType } from 'src/app/_helpers';
import { DialogAnalysisFileRequirementsComponent } from 'src/app/_components';

import { AnalysisToolComponent } from './analysis-tool.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { AnalysisTask } from 'src/app/_models';
import { analysisTaskFromServer } from 'src/test/analysis-task';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';

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
      component.localityFileDropRef = {
        nativeElement: {
          value: 'test'
        }
      } as ElementRef;
      component.schoolHistoryFileDropRef = {
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

    it('should works for Employability Impact', () => {
      //@ts-ignore
      spyOn(component._alertService, 'showWarning');

      component.onSelectAnalysisTypeClick(AnalysisType.EmployabilityImpact);

      //@ts-ignore
      expect(component._alertService.showWarning).toHaveBeenCalledWith('This type of analysis will be available soon.');
    });
  });

  describe('#putAnalysisTaskOnStorage', () => {
    it('should exists', () => {
      expect(component.putAnalysisTaskOnStorage).toBeTruthy();
      expect(component.putAnalysisTaskOnStorage).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(window.localStorage, 'setItem');

      component.selectedAnalysisType = AnalysisType.ConnectivityPrediction;

      const analysisTask = new AnalysisTask().deserialize(analysisTaskFromServer);

      component.putAnalysisTaskOnStorage(analysisTask);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(`${AnalysisType[component.selectedAnalysisType]}_task`, analysisTask.toLocalStorageString());
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
