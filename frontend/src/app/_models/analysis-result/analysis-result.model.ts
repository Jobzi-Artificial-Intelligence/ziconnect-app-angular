import { AnalysisInputValidationResult } from "../analysis-input-validation-result/analysis-input-validation-result.model";
import { AnalysisResultMetrics } from "../analysis-result-metrics/analysis-result-metrics.model";
import { Deserializable } from "../deserializable.model";
import { LocalityStatistics } from "../locality-statistics/locality-statistics.model";

export class AnalysisResult implements Deserializable {
  modelMetrics: AnalysisResultMetrics | null;
  resultSummary: Array<LocalityStatistics> | null;
  schemaError: { [key: string]: AnalysisInputValidationResult } | null;
  allScenarios: any | null;
  bestScenario: any | null;


  constructor() {
    this.modelMetrics = null;
    this.resultSummary = null;
    this.schemaError = null;
    this.allScenarios = null;
    this.bestScenario = null;
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

      if (inputControl.all_scenarios) {
        this.allScenarios = input.all_scenarios;

        // BUILD ALL SCENARIOS STATISTICS
        if (this.allScenarios.employability_rate && this.allScenarios.employability_rate.is_A_greater_than_B_by_scenario) {
          this.allScenarios.evaluationStatistics = {} as any;

          this.allScenarios.evaluationStatistics.notComputedScenarios = this.allScenarios.employability_rate.is_A_greater_than_B_by_scenario.not_computed;
          this.allScenarios.evaluationStatistics.totalScenarios = Object.keys(this.allScenarios.employability_rate.is_A_greater_than_B_by_scenario)
            .reduce((sum, current) => sum + this.allScenarios.employability_rate.is_A_greater_than_B_by_scenario[current], 0);
          this.allScenarios.evaluationStatistics.computedScenarios = this.allScenarios.evaluationStatistics.totalScenarios - this.allScenarios.evaluationStatistics.notComputedScenarios;

          this.allScenarios.evaluationStatistics.greaterCount = this.allScenarios.employability_rate.is_A_greater_than_B_by_scenario.yes;
          this.allScenarios.evaluationStatistics.greaterPercentage = Math.round((this.allScenarios.evaluationStatistics.greaterCount / this.allScenarios.evaluationStatistics.computedScenarios) * 10000) / 100;
          this.allScenarios.evaluationStatistics.equalCount = this.allScenarios.employability_rate.is_A_greater_than_B_by_scenario.equal;
          this.allScenarios.evaluationStatistics.equalPercentage = Math.round((this.allScenarios.evaluationStatistics.equalCount / this.allScenarios.evaluationStatistics.computedScenarios) * 10000) / 100;
          this.allScenarios.evaluationStatistics.lessCount = this.allScenarios.employability_rate.is_A_greater_than_B_by_scenario.no;
          this.allScenarios.evaluationStatistics.lessPercentage = Math.round((this.allScenarios.evaluationStatistics.lessCount / this.allScenarios.evaluationStatistics.computedScenarios) * 10000) / 100;
        }
      }

      if (inputControl.best_scenario) {
        this.bestScenario = input.best_scenario;
      }
    }

    return this;
  }
}