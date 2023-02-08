import { LocalityStatistics } from "../_models";

export interface IMapInfoWindowContent {
  code: string,
  name: string,
  type: string,
  stats: LocalityStatistics | null
}