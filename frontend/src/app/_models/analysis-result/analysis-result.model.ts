import { AnalysisResultMetrics } from "../analysis-result-metrics/analysis-result-metrics.model";
import { Deserializable } from "../deserializable.model";
import { LocalityStatistics } from "../locality-statistics/locality-statistics.model";

export class AnalysisResult implements Deserializable {
  modelMetrics: AnalysisResultMetrics;
  resultSummary: Array<LocalityStatistics>;

  constructor() {
    this.modelMetrics = new AnalysisResultMetrics();
    this.resultSummary = new Array<LocalityStatistics>();
  }

  deserialize(input: any): this {
    this.modelMetrics = new AnalysisResultMetrics().deserialize(input.model_metrics);

    if (input.result_summary && input.result_summary.length > 0) {
      this.resultSummary = (input.result_summary as Array<any>).map((item) => {
        return new LocalityStatistics().deserializeFromAnalysisResult(item);
      });
    }

    return this;
  }
}