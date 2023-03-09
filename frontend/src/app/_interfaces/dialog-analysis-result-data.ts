import { AnalysisType } from "../_helpers";
import { AnalysisTask } from "../_models";
import { AnalysisResult } from "../_models/analysis-result/analysis-result.model";

export interface IDialogAnalysisResultData {
  analysisResult: AnalysisResult,
  analysisTask: AnalysisTask,
  analysisType: AnalysisType
}