import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/material.module';

import { AnalysisToolComponent } from './analysis-tool.component';

describe('AnalysisToolComponent', () => {
  let component: AnalysisToolComponent;
  let fixture: ComponentFixture<AnalysisToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysisToolComponent],
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
});
