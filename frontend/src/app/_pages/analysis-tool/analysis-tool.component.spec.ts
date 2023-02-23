import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisToolComponent } from './analysis-tool.component';

describe('AnalysisToolComponent', () => {
  let component: AnalysisToolComponent;
  let fixture: ComponentFixture<AnalysisToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
