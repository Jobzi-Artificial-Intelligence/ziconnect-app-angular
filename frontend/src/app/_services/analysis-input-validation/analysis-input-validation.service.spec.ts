import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnalysisInputDefinition } from 'src/app/_models';
import { of, Subject, throwError } from 'rxjs';

import { AnalysisInputValidationService } from './analysis-input-validation.service';
import { IAnalysisInputValidationResult } from 'src/app/_interfaces';

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

  describe('#validateLocalityInputFile', () => {
    it('should exists', () => {
      expect(service.validateLocalityInputFile).toBeTruthy();
      expect(service.validateLocalityInputFile).toEqual(jasmine.any(Function));
    });

    it('should works when server success', async () => {
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(of(new Array<AnalysisInputDefinition>()));

      const schoolFile = new File([], 'localities.csv', { type: 'text/csv' });

      const result = await service.validateLocalityInputFile(schoolFile);

      expect(Array.isArray(result)).toBeTrue();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should works when server error', async () => {
      const mockService = {
        getAnalysisInputDefinition: () => Promise.reject('Erro na Promise')
      };
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(throwError({ message: 'http error' }));

      const schoolFile = new File([], 'localities.csv', { type: 'text/csv' });

      const result = await service.validateLocalityInputFile(schoolFile).catch((error) => {
        // Verifique se o erro foi tratado corretamente
        expect(error).toEqual(new Array<IAnalysisInputValidationResult>());
      });
    });
  });

  describe('#validateLocalityEmployabilityInputFile', () => {
    it('should exists', () => {
      expect(service.validateLocalityEmployabilityInputFile).toBeTruthy();
      expect(service.validateLocalityEmployabilityInputFile).toEqual(jasmine.any(Function));
    });

    it('should works when server success', async () => {
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(of(new Array<AnalysisInputDefinition>()));

      const schoolFile = new File([], 'localities.csv', { type: 'text/csv' });

      const result = await service.validateLocalityEmployabilityInputFile(schoolFile);

      expect(Array.isArray(result)).toBeTrue();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should works when server error', async () => {
      const mockService = {
        getAnalysisInputDefinition: () => Promise.reject('Erro na Promise')
      };
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(throwError({ message: 'http error' }));

      const schoolFile = new File([], 'localities.csv', { type: 'text/csv' });

      const result = await service.validateLocalityEmployabilityInputFile(schoolFile).catch((error) => {
        // Verifique se o erro foi tratado corretamente
        expect(error).toEqual(new Array<IAnalysisInputValidationResult>());
      });
    });
  });

  describe('#validateSchoolInputFile', () => {
    it('should exists', () => {
      expect(service.validateSchoolInputFile).toBeTruthy();
      expect(service.validateSchoolInputFile).toEqual(jasmine.any(Function));
    });

    it('should works when server success', async () => {
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(of(new Array<AnalysisInputDefinition>()));

      const schoolFile = new File([], 'schools.csv', { type: 'text/csv' });

      const result = await service.validateSchoolInputFile(schoolFile);

      expect(Array.isArray(result)).toBeTrue();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should works when server error', async () => {
      const mockService = {
        getAnalysisInputDefinition: () => Promise.reject('Erro na Promise')
      };
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(throwError({ message: 'http error' }));

      const schoolFile = new File([], 'schools.csv', { type: 'text/csv' });

      const result = await service.validateSchoolInputFile(schoolFile).catch((error) => {
        // Verifique se o erro foi tratado corretamente
        expect(error).toEqual(new Array<IAnalysisInputValidationResult>());
      });
    });
  });

  describe('#validateSchoolHistoryInputFile', () => {
    it('should exists', () => {
      expect(service.validateSchoolHistoryInputFile).toBeTruthy();
      expect(service.validateSchoolHistoryInputFile).toEqual(jasmine.any(Function));
    });

    it('should works when server success', async () => {
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(of(new Array<AnalysisInputDefinition>()));

      const schoolFile = new File([], 'schools.csv', { type: 'text/csv' });

      const result = await service.validateSchoolHistoryInputFile(schoolFile);

      expect(Array.isArray(result)).toBeTrue();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should works when server error', async () => {
      const mockService = {
        getAnalysisInputDefinition: () => Promise.reject('Erro na Promise')
      };
      //@ts-ignore
      spyOn(service._analysisInputDefinitionService, 'getAnalysisInputDefinition').and.returnValue(throwError({ message: 'http error' }));

      const schoolFile = new File([], 'schools.csv', { type: 'text/csv' });

      const result = await service.validateSchoolHistoryInputFile(schoolFile).catch((error) => {
        // Verifique se o erro foi tratado corretamente
        expect(error).toEqual(new Array<IAnalysisInputValidationResult>());
      });
    });
  });

  describe('#validateInputFile', () => {
    it('should exists', () => {
      expect(service.validateInputFile).toBeTruthy();
      expect(service.validateInputFile).toEqual(jasmine.any(Function));
    });

    it('should works for empty file', async () => {
      const schoolFile = new File([], 'schools.csv', { type: 'text/csv' });
      let mockSchoolFileDefinition = new AnalysisInputDefinition();

      const results = await service.validateInputFile([mockSchoolFileDefinition], schoolFile) as Array<any>;

      expect(Array.isArray(results)).toBeTrue();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeDefined();
      expect(results[0].valid).toEqual(false);
      expect(results[0].message).toEqual('The file is empty');
    });

    it('should works for non empty file', async () => {
      const schoolFile = new File(['school_code,school_name'], 'schools.csv', { type: 'text/csv' });
      let mockSchoolFileDefinition = new AnalysisInputDefinition();

      const results = await service.validateInputFile([mockSchoolFileDefinition], schoolFile) as Array<any>;

      expect(Array.isArray(results)).toBeTrue();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeDefined();
      expect(results[0].valid).toEqual(true);
      expect(results[0].message).toEqual('The file is not empty');
    });

    it('should works for non empty file without enough lines', async () => {
      const schoolFile = new File(['school_code,school_name'], 'schools.csv', { type: 'text/csv' });
      let mockSchoolFileDefinition = new AnalysisInputDefinition();

      const results = await service.validateInputFile([mockSchoolFileDefinition], schoolFile) as Array<any>;

      expect(Array.isArray(results)).toBeTrue();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeDefined();
      expect(results[1].valid).toEqual(false);
      expect(results[1].message).toEqual('The file does not have enough lines');
    });

    it('should works for enough lines file', async () => {
      const schoolFile = new File(['school_code,school_name\n100253,school name test'], 'schools.csv', { type: 'text/csv' });
      let mockSchoolFileDefinition = new AnalysisInputDefinition();

      const results = await service.validateInputFile([mockSchoolFileDefinition], schoolFile) as Array<any>;

      expect(Array.isArray(results)).toBeTrue();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeDefined();
      expect(results[1].valid).toEqual(true);
      expect(results[1].message).toEqual('The file has 2 lines');
    });

    it('should works for non match row columns', async () => {
      const schoolFile = new File(['school_code,school_name\n100253\n100253\n100253\n100253\n100253\n100253'], 'schools.csv', { type: 'text/csv' });
      let mockSchoolFileDefinition = new Array<AnalysisInputDefinition>();
      mockSchoolFileDefinition.push({
        column: 'school_code'
      } as AnalysisInputDefinition);
      mockSchoolFileDefinition.push({
        column: 'school_name'
      } as AnalysisInputDefinition);

      const results = await service.validateInputFile(mockSchoolFileDefinition, schoolFile) as Array<any>;

      expect(Array.isArray(results)).toBeTrue();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeDefined();
      expect(results[1].valid).toEqual(true);
      expect(results[1].message).toEqual('The file has 7 lines');
      expect(results[3].valid).toEqual(false);
      expect(results[3].message).toEqual('has 6 rows with less or more than 2 columns. rows: [2,3,4,5,6,...]');
    });

    it('should works missing header columns', async () => {
      const schoolFile = new File(['school_code,school_name\n100253,school name test\n100253'], 'schools.csv', { type: 'text/csv' });
      const mockFileDefinition = new Array<AnalysisInputDefinition>();
      mockFileDefinition.push({
        column: 'school_code'
      } as AnalysisInputDefinition);
      mockFileDefinition.push({
        column: 'school_name'
      } as AnalysisInputDefinition);
      mockFileDefinition.push({
        column: 'student_count'
      } as AnalysisInputDefinition);

      const results = await service.validateInputFile(mockFileDefinition, schoolFile) as Array<any>;

      expect(Array.isArray(results)).toBeTrue();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeDefined();
      expect(results[2].valid).toEqual(false);
      expect(results[2].message).toEqual('Some columns are missing from the header row: [student_count]');
      expect(results[3].valid).toEqual(false);
      expect(results[3].message).toEqual('has 1 rows with less or more than 2 columns. rows: [3]');
    });
  });
});
