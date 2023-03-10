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
      const taskResult = analysisResultFromServer.taskResult;
      const analysisResult = new AnalysisResult().deserialize(taskResult);

      expect(analysisResult.modelMetrics.classifierName).toEqual(taskResult.model_metrics.classifier_name);
      expect(analysisResult.modelMetrics.meanTrainAccuracy).toEqual(taskResult.model_metrics.mean_train_accuracy);
      expect(analysisResult.modelMetrics.meanValidAccuracy).toEqual(taskResult.model_metrics.mean_valid_accuracy);
      expect(analysisResult.modelMetrics.numFolds).toEqual(taskResult.model_metrics.num_folds);
      expect(analysisResult.modelMetrics.stdTrainAccuracy).toEqual(taskResult.model_metrics.std_train_accuracy);
      expect(analysisResult.modelMetrics.stdValidAccuracy).toEqual(taskResult.model_metrics.std_valid_accuracy);
      expect(analysisResult.modelMetrics.trainAccuracies).toEqual(taskResult.model_metrics.train_accuracies);
      expect(analysisResult.modelMetrics.validAccuracies).toEqual(taskResult.model_metrics.valid_accuracies);
    });
  });
});