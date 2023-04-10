import { AnalysisResultMetrics } from "../analysis-result-metrics/analysis-result-metrics.model";
import { Deserializable } from "../deserializable.model";
import { LocalityStatistics } from "../locality-statistics/locality-statistics.model";

export class AnalysisResult implements Deserializable {
  modelMetrics: AnalysisResultMetrics | undefined;
  resultSummary: Array<LocalityStatistics> | undefined;

  constructor() {
    this.modelMetrics = undefined;
    this.resultSummary = undefined;
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
    }

    return this;
  }
}