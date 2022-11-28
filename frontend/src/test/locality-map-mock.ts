import { LocalityMap } from "src/app/_models";

export const citiesResponseFromServer = [{
  "id": 34,
  "country_name": "Brasil",
  "country_code": "BR",
  "region_name": "Norte",
  "region_code": "1",
  "state_name": "Rondônia",
  "state_abbreviation": "RO",
  "state_code": "11",
  "municipality_name": "Alta Floresta D'Oeste",
  "municipality_code": "1100015",
  "adm_level": "municipality",
  "geometry": {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
        [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    "properties": {
      "adm_level": "municipality",
      "region_code": "1",
      "region_name": "Norte",
      "region_abbreviation": "N",
      "state_code": "11",
      "state_name": "Rondônia",
      "state_abbreviation": "RO",
      "municipality_code": "1100015",
      "municipality_name": "Alta Floresta D'Oeste",
      "country_code": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const countriesResponseFromServer = [{
  "id": 1,
  "country_name": "Brasil",
  "country_code": "BR",
  "region_name": null,
  "region_code": null,
  "state_name": null,
  "state_abbreviation": null,
  "state_code": null,
  "municipality_name": null,
  "municipality_code": null,
  "adm_level": "country",
  "geometry": {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
        [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    "properties": {
      "adm_level": "country",
      "country_code": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const regionsResponseFromServer = [{
  "id": 2,
  "country_name": "Brasil",
  "country_code": "BR",
  "region_name": "Norte",
  "region_code": "1",
  "state_name": null,
  "state_abbreviation": null,
  "state_code": null,
  "municipality_name": null,
  "municipality_code": null,
  "adm_level": "region",
  "geometry": {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
        [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    "properties": {
      "adm_level": "region",
      "region_code": "1",
      "region_name": "Norte",
      "region_abbreviation": "N",
      "country_code": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const statesResponseFromServer = [{
  "id": 7,
  "country_name": "Brasil",
  "country_code": "BR",
  "region_name": "Norte",
  "region_code": "1",
  "state_name": "Rondônia",
  "state_abbreviation": "RO",
  "state_code": "11",
  "municipality_name": null,
  "municipality_code": null,
  "adm_level": "state",
  "geometry": {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
        [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    "properties": {
      "adm_level": "state",
      "region_code": "1",
      "region_name": "Norte",
      "region_abbreviation": "N",
      "state_code": "11",
      "state_name": "Rondônia",
      "state_abbreviation": "RO",
      "country_code": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const citiesLocalityMapList = citiesResponseFromServer.map(item => { return new LocalityMap().deserialize(item) });
export const countriesLocalityMapList = countriesResponseFromServer.map(item => { return new LocalityMap().deserialize(item) });
export const regionsLocalityMapList = regionsResponseFromServer.map(item => { return new LocalityMap().deserialize(item) });
export const statesLocalityMapList = statesResponseFromServer.map(item => { return new LocalityMap().deserialize(item) });