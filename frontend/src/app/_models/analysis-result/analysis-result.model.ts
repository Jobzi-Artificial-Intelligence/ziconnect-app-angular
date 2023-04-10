import { AnalysisInputValidationResult } from "../analysis-input-validation-result/analysis-input-validation-result.model";
import { AnalysisResultMetrics } from "../analysis-result-metrics/analysis-result-metrics.model";
import { Deserializable } from "../deserializable.model";
import { LocalityStatistics } from "../locality-statistics/locality-statistics.model";

export class AnalysisResult implements Deserializable {
  modelMetrics: AnalysisResultMetrics | null;
  resultSummary: Array<LocalityStatistics> | null;
  schemaError: { [key: string]: AnalysisInputValidationResult } | null;
  scenarioDistribution: { [key: string]: Array<number> } | null;

  constructor() {
    this.modelMetrics = null;
    this.resultSummary = null;
    this.schemaError = null;
    this.scenarioDistribution = null;
  }

  deserialize(input: any): this {
    let inputControl = input;

    if (input.exc_type && input.exc_type === 'TableSchemaError') {
      inputControl = input.exc_message;
    }

    if (inputControl) {
      if (inputControl.model_metrics) {
        this.modelMetrics = new AnalysisResultMetrics().deserialize(input.model_metrics);
      }

      if (inputControl.result_summary && inputControl.result_summary.length > 0) {
        this.resultSummary = (inputControl.result_summary as Array<any>).map((item) => {
          return new LocalityStatistics().deserializeFromAnalysisResult(item);
        });
      }

      if (inputControl.table_schemas) {
        this.schemaError = {};
        Object.keys(inputControl.table_schemas).forEach((key) => {
          if (this.schemaError) {
            this.schemaError[key] = new AnalysisInputValidationResult().deserialize(inputControl.table_schemas[key]);
          }
        });
      }

      if (inputControl.scenario_distribution) {
        this.scenarioDistribution = input.scenario_distribution;
      }
    }

    return this;
  }
}