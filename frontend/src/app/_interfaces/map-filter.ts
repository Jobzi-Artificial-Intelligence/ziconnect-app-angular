import { City, Region, State } from "../_models";
import { IMapViewOption } from "./map-view-option";

export interface IMapFilter {
  regionOptions: Array<Region>;
  stateOptions: Array<State>;
  selectedCity?: City;
  selectedCountry: string,
  selectedRegion?: Region;
  selectedState?: State;
  selectedSchoolRegion: String,
  selectedSchoolType: String,
  viewOptions: Array<IMapViewOption>,
}