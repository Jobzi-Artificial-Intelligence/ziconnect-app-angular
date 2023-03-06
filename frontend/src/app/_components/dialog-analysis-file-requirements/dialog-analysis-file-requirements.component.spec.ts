import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAnalysisFileRequirementsComponent } from './dialog-analysis-file-requirements.component';

describe('DialogAnalysisFileRequirementsComponent', () => {
  let component: DialogAnalysisFileRequirementsComponent;
  let fixture: ComponentFixture<DialogAnalysisFileRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAnalysisFileRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAnalysisFileRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
