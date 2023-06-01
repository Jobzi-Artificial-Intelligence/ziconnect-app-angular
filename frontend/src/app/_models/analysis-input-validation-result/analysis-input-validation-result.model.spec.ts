import { AnalysisInputValidationResult } from "./analysis-input-validation-result.model";

import { analysisInputValidationResultFromServer } from '../../../test/analysis-input-validation-result';

describe('Model: AnalysisInputValidationFailureCase', () => {

  it('should initialize all properties correctly', () => {
    const analysisInput = new AnalysisInputValidationResult();

    expect(analysisInput.isOk).toEqual(true);
    expect(analysisInput.failureCases).toEqual(jasmine.any(Array));
    expect(analysisInput.failureCases.length).toEqual(0);
    expect(analysisInput.failureRows).toEqual(jasmine.any(Array));
    expect(analysisInput.failureRows.length).toEqual(0);

  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const analysisInput = new AnalysisInputValidationResult();

      expect(analysisInput.deserialize).toBeTruthy();
      expect(analysisInput.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const inputValidationResult = analysisInputValidationResultFromServer;
      const analysisInputValidationResult = new AnalysisInputValidationResult().deserialize(inputValidationResult);

      expect(analysisInputValidationResult.isOk).toEqual(inputValidationResult.is_ok);
      expect(analysisInputValidationResult.failureCases).toEqual(jasmine.any(Array));
      expect(analysisInputValidationResult.failureCases.length).toEqual(inputValidationResult.failure_cases.length);
      expect(analysisInputValidationResult.failureRows).toEqual(jasmine.any(Array));
      expect(analysisInputValidationResult.failureRows.length).toEqual(inputValidationResult.failure_rows.length);
    });
  });
});