import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AngularMaterialModule } from 'src/app/material.module';
import { PageFooterComponent } from 'src/app/_components';
import { AnalysisInputType } from 'src/app/_helpers';
import { DialogAnalysisFileRequirementsComponent } from 'src/app/_components';

import { AnalysisToolComponent } from './analysis-tool.component';

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
