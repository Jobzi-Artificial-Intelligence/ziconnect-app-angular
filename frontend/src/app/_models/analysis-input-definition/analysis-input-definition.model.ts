export class AnalysisInputDefinition {
  column: string;
  dataType: string;
  required: boolean;
  primaryKey: boolean;
  description: string;
  example: string;
  canHomogenize: boolean;


  constructor() {
    this.column = '';
    this.dataType = '';
    this.required = false;
    this.primaryKey = false;
    this.canHomogenize = false;
    this.description = '';
    this.example = '';
  }
}