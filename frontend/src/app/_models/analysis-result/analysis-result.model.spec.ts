import { AnalysisResult } from "./analysis-result.model";
import { analysisResultFromServer } from "../../../test/analysis-result";

describe('Model: AnalysisResult', () => {

  it('should initialize all properties correctly', () => {
    const analysisResult = new AnalysisResult();

    expect(analysisResult.modelMetrics).toBeDefined();
    expect(analysisResult.resultSummary).toBeDefined();
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const analysisResult = new AnalysisResult();

      expect(analysisResult.deserialize).toBeTruthy();
      expect(analysisResult.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const analysisResult = new AnalysisResult().deserialize(analysisResultFromServer);

      expect(analysisResult.modelMetrics.classifierName).toEqual(analysisResultFromServer.model_metrics.classifier_name);
      expect(analysisResult.modelMetrics.meanTrainAccuracy).toEqual(analysisResultFromServer.model_metrics.mean_train_accuracy);
      expect(analysisResult.modelMetrics.meanValidAccuracy).toEqual(analysisResultFromServer.model_metrics.mean_valid_accuracy);
      expect(analysisResult.modelMetrics.numFolds).toEqual(analysisResultFromServer.model_metrics.num_folds);
      expect(analysisResult.modelMetrics.stdTrainAccuracy).toEqual(analysisResultFromServer.model_metrics.std_train_accuracy);
      expect(analysisResult.modelMetrics.stdValidAccuracy).toEqual(analysisResultFromServer.model_metrics.std_valid_accuracy);
      expect(analysisResult.modelMetrics.trainAccuracies).toEqual(analysisResultFromServer.model_metrics.train_accuracies);
      expect(analysisResult.modelMetrics.validAccuracies).toEqual(analysisResultFromServer.model_metrics.valid_accuracies);
    });
  });
});