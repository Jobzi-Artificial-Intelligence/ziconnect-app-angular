import { AnalysisInputValidationFailureCase } from "../analysis-input-validation-failure-case/analysis-input-validation-failure-case.model";
import { Deserializable } from "../deserializable.model";

export class AnalysisInputValidationResult implements Deserializable {
  isOk: boolean;
  failureCases: Array<AnalysisInputValidationFailureCase>;
  failureRows: Array<any>;

  constructor() {
    this.isOk = true;
    this.failureCases = new Array<AnalysisInputValidationFailureCase>();
    this.failureRows = new Array<any>();

  }

  deserialize(input: any): this {
    this.isOk = input.is_ok;
    if (input.failure_cases) {
      this.failureCases = input.failure_cases.map((failureCase: any) => {
        return new AnalysisInputValidationFailureCase().deserialize(failureCase);
      });
    }

    this.failureRows = input.failure_rows;

    return this;
  }
}