import { LocalityGeometry } from "src/app/_models";

export const citiesResponseFromServer = [{
  "country_name": "Brasil",
  "country_id": "BR",
  "region_name": "Norte",
  "region_id": "1",
  "state_name": "Rondônia",
  "state_abbreviation": "RO",
  "state_id": "11",
  "city_name": "Alta Floresta D'Oeste",
  "city_id": "1100015",
  "adm_level": "city",
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
      "adm_level": "city",
      "region_id": "1",
      "region_name": "Norte",
      "region_abbreviation": "N",
      "state_id": "11",
      "state_name": "Rondônia",
      "state_abbreviation": "RO",
      "city_id": "1100015",
      "city_name": "Alta Floresta D'Oeste",
      "country_id": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const countriesResponseFromServer = [{
  "country_name": "Brasil",
  "country_id": "BR",
  "region_name": null,
  "region_id": null,
  "state_name": null,
  "state_abbreviation": null,
  "state_id": null,
  "city_name": null,
  "city_id": null,
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
      "country_id": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const regionsResponseFromServer = [{
  "country_name": "Brasil",
  "country_id": "BR",
  "region_name": "Norte",
  "region_id": "1",
  "state_name": null,
  "state_abbreviation": null,
  "state_id": null,
  "city_name": null,
  "city_id": null,
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
      "region_id": "1",
      "region_name": "Norte",
      "region_abbreviation": "N",
      "country_id": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const statesResponseFromServer = [{
  "country_name": "Brasil",
  "country_id": "BR",
  "region_name": "Norte",
  "region_id": "1",
  "state_name": "Rondônia",
  "state_abbreviation": "RO",
  "state_id": "11",
  "city_name": null,
  "city_id": null,
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
      "region_id": "1",
      "region_name": "Norte",
      "region_abbreviation": "N",
      "state_id": "11",
      "state_name": "Rondônia",
      "state_abbreviation": "RO",
      "country_id": "BR",
      "country_name": "Brasil"
    }
  }
}];

export const citiesLocalityGeometryList = citiesResponseFromServer.map(item => { return new LocalityGeometry().deserialize(item) });
export const countriesLocalityGeometryList = countriesResponseFromServer.map(item => { return new LocalityGeometry().deserialize(item) });
export const regionsLocalityGeometryList = regionsResponseFromServer.map(item => { return new LocalityGeometry().deserialize(item) });
export const statesLocalityGeometryList = statesResponseFromServer.map(item => { return new LocalityGeometry().deserialize(item) });