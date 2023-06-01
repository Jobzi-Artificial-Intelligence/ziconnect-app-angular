import { MapViewOptionValue } from "../_helpers";
import { IMapRangeColor } from "./map-range-color";

export interface IMapViewOption {
  name: string,
  description: string,
  rangeColors: IMapRangeColor[],
  value: MapViewOptionValue
}