import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from 'src/app/material.module';
import { AnalysisType } from 'src/app/_helpers';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';
import { AnalysisTask } from 'src/app/_models';
import { AnalysisResult } from 'src/app/_models/analysis-result/analysis-result.model';

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
});
