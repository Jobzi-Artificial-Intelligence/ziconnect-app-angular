import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/material.module';
import { AnalysisInputType } from 'src/app/_helpers';
import { of, throwError } from "rxjs";

import { DialogAnalysisFileRequirementsComponent } from './dialog-analysis-file-requirements.component';
import { AnalysisInputDefinition } from 'src/app/_models';

describe('DialogAnalysisFileRequirementsComponent', () => {
  let component: DialogAnalysisFileRequirementsComponent;
  let fixture: ComponentFixture<DialogAnalysisFileRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMaterialModule, HttpClientTestingModule],
      declarations: [DialogAnalysisFileRequirementsComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: AnalysisInputType.Locality }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAnalysisFileRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#loadAnalysisInputDefinition', () => {
    it('should exists', () => {
      expect(component.loadAnalysisInputDefinition).toBeTruthy();
      expect(component.loadAnalysisInputDefinition).toEqual(jasmine.any(Function));
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(throwError({ message: 'http error' }));

      component.analysisInputType = AnalysisInputType.Locality;
      component.loadAnalysisInputDefinition();

      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Something went wrong: http error');
    });

    it('should works when service return success', async () => {
      const analysisInputDefinitionResponse = [{
        "column": "id",
        "dataType": "integer",
        "required": true,
        "primaryKey": true,
        "description": "Unique location identifier",
        "example": "1"
      }];

      //@ts-ignore
      spyOn(component._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(of(analysisInputDefinitionResponse));

      component.analysisInputType = AnalysisInputType.Locality;
      component.loadAnalysisInputDefinition();

      expect(component.tableDataSource.data.length).toEqual(1);
    });
  });
});
