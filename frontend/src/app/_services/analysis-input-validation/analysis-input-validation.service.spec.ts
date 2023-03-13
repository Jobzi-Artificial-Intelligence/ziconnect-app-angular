import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AnalysisInputValidationService } from './analysis-input-validation.service';

describe('AnalysisInputValidationService', () => {
  let httpTestingController: HttpTestingController;
  let service: AnalysisInputValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(AnalysisInputValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
