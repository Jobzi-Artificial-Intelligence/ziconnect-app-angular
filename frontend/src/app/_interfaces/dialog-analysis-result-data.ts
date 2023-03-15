import { AnalysisType } from "../_helpers";
import { AnalysisTask } from "../_models";

export interface IDialogAnalysisResultData {
  analysisTask: AnalysisTask,
  analysisType: AnalysisType
}