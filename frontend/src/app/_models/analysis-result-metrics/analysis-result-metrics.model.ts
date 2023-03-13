import { Deserializable } from "../deserializable.model";

export class AnalysisResultMetrics implements Deserializable {
  classifierName: string;
  numFolds: number;
  trainAccuracies: Array<number>;
  meanTrainAccuracy: number;
  stdTrainAccuracy: number;
  validAccuracies: Array<number>;
  meanValidAccuracy: number;
  stdValidAccuracy: number;
  testAccuracy: number;

  constructor() {
    this.classifierName = '';
    this.meanTrainAccuracy = 0;
    this.meanValidAccuracy = 0;
    this.numFolds = 0;
    this.stdTrainAccuracy = 0;
    this.stdValidAccuracy = 0;
    this.testAccuracy = 0;
    this.trainAccuracies = new Array<number>();
    this.validAccuracies = new Array<number>();
  }

  deserialize(input: any): this {
    this.classifierName = input.classifier_name;
    this.meanTrainAccuracy = input.mean_train_accuracy;
    this.meanValidAccuracy = input.mean_valid_accuracy;
    this.numFolds = input.num_folds;
    this.stdTrainAccuracy = input.std_train_accuracy;
    this.stdValidAccuracy = input.std_valid_accuracy;
    this.testAccuracy = input.test_accuracy;
    this.trainAccuracies = input.train_accuracies;
    this.validAccuracies = input.valid_accuracies;

    return this;
  }
}