import { Deserializable } from "./deserializable.model";

enum AdministrativeLevel {
  Country = 'country',
  Region = 'region',
  State = 'state',
  City = 'city'
}

export class LocalityGeometry implements Deserializable {
  countryId: String;
  countryName: String;
  regionId: String;
  regionName: String;
  stateId: String;
  stateAbbreviation: String;
  stateName: String;
  cityId: String;
  cityName: String;
  administrativeLevel: AdministrativeLevel;

  // GeoJson feature object
  geometry: any;

  constructor() {
    this.administrativeLevel = AdministrativeLevel.Country;
    this.countryId = '';
    this.countryName = '';
    this.regionId = '';
    this.regionName = '';
    this.stateAbbreviation = '';
    this.stateId = '';
    this.stateName = '';
    this.cityId = '';
    this.cityName = '';
  }

  deserialize(input: any): this {
    this.administrativeLevel = input.adm_level;
    this.cityId = input.city_id;
    this.cityName = input.city_name;
    this.countryId = input.country_id;
    this.countryName = input.country_name;
    this.regionId = input.region_id;
    this.regionName = input.region_name;
    this.stateAbbreviation = input.state_abbreviation;
    this.stateId = input.state_id;
    this.stateName = input.state_name;
    this.geometry = input.geometry;

    return this;
  }
}