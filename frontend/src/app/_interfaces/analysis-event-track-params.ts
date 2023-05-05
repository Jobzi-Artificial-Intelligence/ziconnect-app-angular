import { AnalysisType } from "../_helpers";
import { AnalysisGaEventName } from "../_helpers/enums/analysis-event-name";

export interface IAnalysisEventTrackParams {
  eventName: AnalysisGaEventName;
  analysisType: AnalysisType | null;
  analysisTaskId: string | null;
  analysisConnectivityThresholdA: number | null;
  analysisConnectivityThresholdB: number | null;
  analysisMunicipalitiesThreshold: number | null;
}