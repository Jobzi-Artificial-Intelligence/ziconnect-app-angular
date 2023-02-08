export const geoJsonSample = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
          [100.0, 1.0], [100.0, 0.0]]
        ]

      },
      "properties": {
        "id": "id0",
        "prop1": "prop1"
      }
    }
  ]
};

export const geoJsonCities = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
          [100.0, 1.0], [100.0, 0.0]]
        ]
      },
      "properties": {
        "code": "1100015",
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
        "country_name": "Brasil",
        "localityMapId": 123456
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
          [100.0, 1.0], [100.0, 0.0]]
        ]
      },
      "properties": {
        "code": "1100098",
        "adm_level": "municipality",
        "region_code": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "state_code": "11",
        "state_name": "Rondônia",
        "state_abbreviation": "RO",
        "municipality_code": "1100098",
        "municipality_name": "Espigão D'Oeste",
        "country_code": "BR",
        "country_name": "Brasil"
      }
    }
  ]
};

export const geoJsonRegions = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
          [100.0, 1.0], [100.0, 0.0]]
        ]

      },
      "properties": {
        "code": "1",
        "adm_level": "region",
        "region_code": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "country_code": "BR",
        "country_name": "Brasil",
        "localityMapId": 987654
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
          [100.0, 1.0], [100.0, 0.0]]
        ]

      },
      "properties": {
        "code": "2",
        "adm_level": "region",
        "region_code": "2",
        "region_name": "Nordeste",
        "region_abbreviation": "NE",
        "country_code": "BR",
        "country_name": "Brasil"
      }
    }
  ]
};

export const geoJsonStates = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
          [100.0, 1.0], [100.0, 0.0]]
        ]

      },
      "properties": {
        "code": "11",
        "adm_level": "state",
        "region_code": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "state_code": "11",
        "state_name": "Rondônia",
        "state_abbreviation": "RO",
        "country_code": "BR",
        "country_name": "Brasil",
        "localityMapId": 1
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
          [100.0, 1.0], [100.0, 0.0]]
        ]

      },
      "properties": {
        "code": "12",
        "adm_level": "state",
        "region_code": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "state_code": "12",
        "state_name": "Acre",
        "state_abbreviation": "AC",
        "country_code": "BR",
        "country_name": "Brasil"
      }
    }
  ]
};