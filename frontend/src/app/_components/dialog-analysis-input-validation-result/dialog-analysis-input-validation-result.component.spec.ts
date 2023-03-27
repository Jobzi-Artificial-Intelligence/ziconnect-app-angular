import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAnalysisInputValidationResultComponent } from './dialog-analysis-input-validation-result.component';

describe('DialogAnalysisInputValidationResultComponent', () => {
  let component: DialogAnalysisInputValidationResultComponent;
  let fixture: ComponentFixture<DialogAnalysisInputValidationResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAnalysisInputValidationResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAnalysisInputValidationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
