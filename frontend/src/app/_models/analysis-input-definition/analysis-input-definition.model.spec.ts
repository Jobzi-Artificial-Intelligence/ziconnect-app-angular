import { AnalysisInputDefinition } from "./analysis-input-definition.model";

describe('Model: AnalysisInputDefinition', () => {

  it('should initialize all properties correctly', () => {
    const analysisInput = new AnalysisInputDefinition();

    expect(analysisInput.column).toEqual('');
    expect(analysisInput.dataType).toEqual('');
    expect(analysisInput.description).toEqual('');
    expect(analysisInput.example).toEqual('');
    expect(analysisInput.primaryKey).toEqual(false);
    expect(analysisInput.required).toEqual(false);
  });
});