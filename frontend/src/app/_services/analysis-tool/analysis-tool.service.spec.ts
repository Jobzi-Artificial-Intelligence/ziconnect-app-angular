import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AnalysisToolService } from './analysis-tool.service';

describe('AnalysisToolService', () => {
  let service: AnalysisToolService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(AnalysisToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
