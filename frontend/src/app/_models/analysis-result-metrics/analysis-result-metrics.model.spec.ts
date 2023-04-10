import { AnalysisResultMetrics } from "./analysis-result-metrics.model";
import { analysisResultMetricsFromServer } from "../../../test/analysis-result-metrics";

describe('Model: AnalysisResultMetrics', () => {

  it('should initialize all properties correctly', () => {
    const analysisResultMetrics = new AnalysisResultMetrics();

    expect(analysisResultMetrics.classifierName).toEqual('');
    expect(analysisResultMetrics.meanTrainAccuracy).toEqual(0);
    expect(analysisResultMetrics.meanValidAccuracy).toEqual(0);
    expect(analysisResultMetrics.numFolds).toEqual(0);
    expect(analysisResultMetrics.stdTrainAccuracy).toEqual(0);
    expect(analysisResultMetrics.stdValidAccuracy).toEqual(0);
    expect(analysisResultMetrics.trainAccuracies).toEqual(jasmine.any(Array));
    expect(analysisResultMetrics.validAccuracies).toEqual(jasmine.any(Array));
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const analysisResultMetrics = new AnalysisResultMetrics();

      expect(analysisResultMetrics.deserialize).toBeTruthy();
      expect(analysisResultMetrics.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const analysisResultMetrics = new AnalysisResultMetrics();
      analysisResultMetrics.deserialize(analysisResultMetricsFromServer);

      expect(analysisResultMetrics.classifierName).toEqual(analysisResultMetricsFromServer.classifier_name);
      expect(analysisResultMetrics.meanTrainAccuracy).toEqual(analysisResultMetricsFromServer.mean_train_accuracy);
      expect(analysisResultMetrics.meanValidAccuracy).toEqual(analysisResultMetricsFromServer.mean_valid_accuracy);
      expect(analysisResultMetrics.numFolds).toEqual(analysisResultMetricsFromServer.num_folds);
      expect(analysisResultMetrics.stdTrainAccuracy).toEqual(analysisResultMetricsFromServer.std_train_accuracy);
      expect(analysisResultMetrics.stdValidAccuracy).toEqual(analysisResultMetricsFromServer.std_valid_accuracy);
      expect(analysisResultMetrics.trainAccuracies).toEqual(analysisResultMetricsFromServer.train_accuracies);
      expect(analysisResultMetrics.validAccuracies).toEqual(analysisResultMetricsFromServer.valid_accuracies);
    });
  });
});