import { MathHelper } from "src/app/_helpers/util/math.helper";
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

    if (input && input.exc_type && input.exc_type === 'TableSchemaError') {
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
          this.allScenarios.evaluationStatistics.lessPercentage = 100 - (this.allScenarios.evaluationStatistics.greaterPercentage + this.allScenarios.evaluationStatistics.equalPercentage);
        }
      }

      if (inputControl.best_scenario) {
        this.bestScenario = input.best_scenario;

        // BUILD BEST SCENARIO STATISTICS
        this.bestScenario.evaluationStatistics = {} as any;

        this.bestScenario.evaluationStatistics.numMunicipalitiesA = this.bestScenario['A'].num_municipalities ?? 0;
        this.bestScenario.evaluationStatistics.numMunicipalitiesB = this.bestScenario['B'].num_municipalities ?? 0;

        this.bestScenario.evaluationStatistics.sumSchoolCountA = this.bestScenario['A'].school_count && Array.isArray(this.bestScenario['A'].school_count)
          ? this.bestScenario['A'].school_count.reduce((sum: number, current: number) => sum + current, 0)
          : 0;
        this.bestScenario.evaluationStatistics.sumSchoolCountB = this.bestScenario['A'].school_count && Array.isArray(this.bestScenario['B'].school_count)
          ? this.bestScenario['B'].school_count.reduce((sum: number, current: number) => sum + current, 0)
          : 0;

        this.bestScenario.evaluationStatistics.averageEmployabilityRateA = MathHelper.mean(this.bestScenario['A'].employability_rate);
        this.bestScenario.evaluationStatistics.averageEmployabilityRateB = MathHelper.mean(this.bestScenario['B'].employability_rate);

        this.bestScenario.evaluationStatistics.averageGrownA = ((this.bestScenario.evaluationStatistics.averageEmployabilityRateA / this.bestScenario.evaluationStatistics.averageEmployabilityRateB) - 1) * 100;
      }
    }

    return this;
  }
}