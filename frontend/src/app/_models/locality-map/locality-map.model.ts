import { Deserializable } from "../deserializable.model";

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

    return this;
  }
}