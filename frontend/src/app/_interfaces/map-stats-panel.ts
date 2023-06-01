import { LocalityStatistics } from "../_models";

export interface IMapStatsPanel {
  open: boolean;
  item: any;
  itemName: string;
  itemStats: LocalityStatistics;
  itemType: string;
  cardsInnerPadding: number;
  generalCardsData: Array<any>;
  generalCardsConnectivityData: Array<any>;
  connectivityBySchoolRegion: Array<any>;
  connectivityBySchoolType: Array<any>;
  connectivityPredictionBySchoolRegion: Array<any>;
  connectivityPredictionBySchoolType: Array<any>;
  schoolsConnectivity: Array<any>;
  schoolsConnectivityPrediction: Array<any>;
  internetAvailabityPrediction: number;
  internetAvailabityPredictionUnits: string;
}