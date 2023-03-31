import { AnalysisInputValidationResult } from "../analysis-input-validation-result/analysis-input-validation-result.model";
import { AnalysisResultMetrics } from "../analysis-result-metrics/analysis-result-metrics.model";
import { Deserializable } from "../deserializable.model";
import { LocalityStatistics } from "../locality-statistics/locality-statistics.model";

export class AnalysisResult implements Deserializable {
  modelMetrics: AnalysisResultMetrics | null;
  resultSummary: Array<LocalityStatistics> | null;
  schemaError: { [key: string]: AnalysisInputValidationResult } | null;

  constructor() {
    this.modelMetrics = null;
    this.resultSummary = null;
    this.schemaError = null;
  }

  deserialize(input: any): this {
    if (input) {
      if (input.model_metrics) {
        this.modelMetrics = new AnalysisResultMetrics().deserialize(input.model_metrics);
      }

      if (input.result_summary && input.result_summary.length > 0) {
        this.resultSummary = (input.result_summary as Array<any>).map((item) => {
          return new LocalityStatistics().deserializeFromAnalysisResult(item);
        });
      }

      if (input.table_schemas) {
        this.schemaError = {};
        Object.keys(input.table_schemas).forEach((key) => {
          if (this.schemaError) {
            this.schemaError[key] = new AnalysisInputValidationResult().deserialize(input.table_schemas[key]);
          }
        });
      }
    }

    return this;
  }
}