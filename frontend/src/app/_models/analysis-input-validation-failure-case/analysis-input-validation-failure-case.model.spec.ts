import { AnalysisInputValidationFailureCase } from "./analysis-input-validation-failure-case.model";

import { analysisInputValidationFailureCasesFromServer } from '../../../test/analysis-input-validation-failure-case';

describe('Model: AnalysisInputValidationFailureCase', () => {

  it('should initialize all properties correctly', () => {
    const analysisInput = new AnalysisInputValidationFailureCase();

    expect(analysisInput.check).toEqual('');
    expect(analysisInput.checkNumber).toEqual('');
    expect(analysisInput.column).toEqual('');
    expect(analysisInput.failureCase).toEqual('');
    expect(analysisInput.index).toEqual(0);
    expect(analysisInput.schemaContext).toEqual('');
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const analysisInput = new AnalysisInputValidationFailureCase();

      expect(analysisInput.deserialize).toBeTruthy();
      expect(analysisInput.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const failureCase = analysisInputValidationFailureCasesFromServer[0];
      const analysisInputFailureCase = new AnalysisInputValidationFailureCase().deserialize(failureCase);

      expect(analysisInputFailureCase.check).toEqual(failureCase.check);
      expect(analysisInputFailureCase.column).toEqual(failureCase.column);
      expect(analysisInputFailureCase.failureCase).toEqual(failureCase.failure_case);
      expect(analysisInputFailureCase.index).toEqual(failureCase.index);
      expect(analysisInputFailureCase.schemaContext).toEqual(failureCase.schema_context);
    });
  });
});