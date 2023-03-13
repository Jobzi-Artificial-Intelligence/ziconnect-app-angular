
export class AnalysisInputDefinition {
  column: string;
  dataType: string;
  required: boolean;
  primaryKey: boolean;
  description: string;
  example: string;


  constructor() {
    this.column = '';
    this.dataType = '';
    this.required = false;
    this.primaryKey = false;
    this.description = '';
    this.example = '';
  }
}