import { Deserializable } from "../deserializable.model";

export class AnalysisInputValidationFailureCase implements Deserializable {
  schemaContext: string;
  column: string;
  check: string;
  checkNumber: string;
  failureCase: string;
  index: number;


  constructor() {
    this.check = '';
    this.checkNumber = '';
    this.column = '';
    this.failureCase = '';
    this.index = 0;
    this.schemaContext = '';
  }

  deserialize(input: any): this {
    this.check = input.check;
    this.checkNumber = input.check_number;
    this.column = input.column;
    this.failureCase = input.failure_case;
    this.index = input.index;
    this.schemaContext = input.schema_context;

    return this;
  }
}