import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';

import { DialogAnalysisInputValidationResultComponent } from './dialog-analysis-input-validation-result.component';

describe('DialogAnalysisInputValidationResultComponent', () => {
  let component: DialogAnalysisInputValidationResultComponent;
  let fixture: ComponentFixture<DialogAnalysisInputValidationResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAnalysisInputValidationResultComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} as IDialogAnalysisResultData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAnalysisInputValidationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
