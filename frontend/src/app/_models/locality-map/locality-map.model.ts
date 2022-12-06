import { City } from "../city/city.model";
import { Deserializable } from "../deserializable.model";
import { Region } from "../region/region.model";
import { State } from "../state/state.model";

export enum AdministrativeLevel {
  Country = 'country',
  Region = 'region',
  State = 'state',
  Municipality = 'municipality'
}

export class LocalityMap implements Deserializable {
  id: number;
  countryCode: String;
  countryName: String;
  regionCode: String;
  regionName: String;
  stateCode: String;
  stateAbbreviation: String;
  stateName: String;
  municipalityCode: String;
  municipalityName: String;
  administrativeLevel: AdministrativeLevel;

  municipality: City | null;
  region: Region | null;
  state: State | null;

  // GeoJson feature object
  geometry: any;

  constructor() {
    this.id = 0;
    this.administrativeLevel = AdministrativeLevel.Country;
    this.countryCode = '';
    this.countryName = '';
    this.regionCode = '';
    this.regionName = '';
    this.stateAbbreviation = '';
    this.stateCode = '';
    this.stateName = '';
    this.municipalityCode = '';
    this.municipalityName = '';
    this.geometry = {};

    this.municipality = null;
    this.region = null;
    this.state = null;
  }

  deserialize(input: any): this {
    this.id = input.id;
    this.administrativeLevel = input.adm_level;
    this.municipalityCode = input.municipality_code;
    this.municipalityName = input.municipality_name;
    this.countryCode = input.country_code;
    this.countryName = input.country_name;
    this.regionCode = input.region_code;
    this.regionName = input.region_name;
    this.stateAbbreviation = input.state_abbreviation;
    this.stateCode = input.state_code;
    this.stateName = input.state_name;
    this.geometry = input.geometry;

    if (this.regionCode && this.regionName) {
      this.region = new Region(this.regionCode, this.regionName);
    }

    if (this.region && this.stateCode && this.stateName) {
      this.state = new State(this.stateCode, this.stateName, this.region);
    }

    if (this.region && this.state && this.municipalityCode && this.municipalityName) {
      this.municipality = new City(this.municipalityCode.toString(), this.municipalityName.toString(), this.state);
    }

    return this;
  }
}