import { Deserializable } from "../deserializable.model";

export class AnalysisTaskException implements Deserializable {
  exceptionType: string;
  exceptionMessage: any;

  constructor() {
    this.exceptionType = '';
    this.exceptionMessage = null;
  }

  deserialize(input: any): this {
    this.exceptionType = input.exc_type;
    this.exceptionMessage = input.exc_message;

    return this;
  }
}