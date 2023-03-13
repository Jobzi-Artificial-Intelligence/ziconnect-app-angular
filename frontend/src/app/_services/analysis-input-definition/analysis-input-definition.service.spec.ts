import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnalysisInputType } from 'src/app/_helpers';
import { AnalysisInputDefinition } from 'src/app/_models';

import { AnalysisInputDefinitionService } from './analysis-input-definition.service';

describe('AnalysisInputDefinitionService', () => {
  let httpTestingController: HttpTestingController;
  let service: AnalysisInputDefinitionService;

  let endpointAssetsUri = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(AnalysisInputDefinitionService);

    //@ts-ignore
    endpointAssetsUri = `${service._assetsPath}`;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAnalysisInputDefinition', () => {
    it('should exists', () => {
      expect(service.getAnalysisInputDefinition).toBeDefined();
      expect(service.getAnalysisInputDefinition).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getAnalysisInputDefinition(AnalysisInputType.Locality).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointAssetsUri}${AnalysisInputType.Locality.toString().toLocaleLowerCase()}.json`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const inputDefinition = {
        "column": "id",
        "dataType": "string",
        "required": true,
        "primaryKey": true,
        "description": "Unique location identifier",
        "example": "1"
      } as AnalysisInputDefinition;

      const expectedData: AnalysisInputDefinition[] = new Array<AnalysisInputDefinition>();
      expectedData.push(inputDefinition);

      service
        .getAnalysisInputDefinition(AnalysisInputType.Locality)
        .subscribe(data => {
          expect(data[0]).toEqual(inputDefinition);
          done();
        });

      const testRequest = httpTestingController.expectOne(`${endpointAssetsUri}${AnalysisInputType.Locality.toString().toLocaleLowerCase()}.json`);
      testRequest.flush(expectedData);
    });
  });
});
