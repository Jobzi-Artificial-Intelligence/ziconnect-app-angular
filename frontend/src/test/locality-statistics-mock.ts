import { LocalityStatistics } from "src/app/_models";

export const localityStatisticsFromServer = [
  {
    "id": 1,
    "locality_map_id": 2,
    "municipality_count": 100,
    "region_count": 1,
    "state_count": 5,
    "school_count": 24781,
    "student_count": 4727271,
    "connected_count": 7897,
    "connected_percentage": 31.8671562890924,
    "internet_availability_null_count": 4352,
    "internet_availability_null_percentage": 17.5618417335862,
    "internet_availability_by_value": {
      "Yes": 7897,
      "No": 12532,
      "NA": 4352
    },
    "internet_availability_by_school_region": {
      "Rural": {
        "NA": 3933,
        "No": 11228,
        "Yes": 2357
      },
      "Urban": {
        "NA": 419,
        "No": 1304,
        "Yes": 5540
      }
    },
    "internet_availability_by_school_type": {
      "Estadual": {
        "NA": 275,
        "No": 1583,
        "Yes": 2371
      },
      "Federal": {
        "NA": 1,
        "No": 0,
        "Yes": 79
      },
      "Municipal": {
        "NA": 4076,
        "No": 10949,
        "Yes": 5447
      }
    },
    "internet_availability_prediction_count": 407,
    "internet_availability_prediction_percentage": 9.35202205882353,
    "create_at": "2022-11-25T20:14:15.001452+00:00",
    "locality_map": {
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
      "geometry": {},
      "create_at": "2022-11-23T19:58:42.418144+00:00"
    }
  }
];

export const localityStatisticsRegionFromServer = [
  {
    "id": 1,
    "locality_map_id": 2,
    "school_count": 24781,
    "student_count": 4727271,
    "connected_count": 7897,
    "connected_percentage": 31.8671562890924,
    "internet_availability_null_count": 4352,
    "internet_availability_null_percentage": 17.5618417335862,
    "internet_availability_by_value": {
      "Yes": 7897,
      "No": 12532,
      "NA": 4352
    },
    "internet_availability_by_school_region": {
      "Rural": {
        "NA": 3933,
        "No": 11228,
        "Yes": 2357
      },
      "Urban": {
        "NA": 419,
        "No": 1304,
        "Yes": 5540
      }
    },
    "internet_availability_by_school_type": {
      "Estadual": {
        "NA": 275,
        "No": 1583,
        "Yes": 2371
      },
      "Federal": {
        "NA": 1,
        "No": 0,
        "Yes": 79
      },
      "Municipal": {
        "NA": 4076,
        "No": 10949,
        "Yes": 5447
      }
    },
    "internet_availability_prediction_count": 407,
    "internet_availability_prediction_percentage": 9.35202205882353,
    "create_at": "2022-11-25T20:14:15.001452+00:00",
    "locality_map": {
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
      "adm_level": "region"
    }
  }
];

export const localityStatisticsStateFromServer = [{
  "id": 6,
  "locality_map_id": 7,
  "school_count": 702,
  "student_count": 532329,
  "connected_count": 679,
  "connected_percentage": 96.7236467236467,
  "internet_availability_null_count": 6,
  "internet_availability_null_percentage": 0.854700854700855,
  "internet_availability_by_value": {
    "Yes": 679,
    "NA": 6,
    "No": 17
  },
  "internet_availability_by_school_region": {
    "Rural": {
      "NA": 2,
      "No": 9,
      "Yes": 73
    },
    "Urban": {
      "NA": 4,
      "No": 8,
      "Yes": 606
    }
  },
  "internet_availability_by_school_type": {
    "Estadual": {
      "NA": 6,
      "No": 17,
      "Yes": 668
    },
    "Federal": {
      "NA": 0,
      "No": 0,
      "Yes": 11
    }
  },
  "internet_availability_prediction_count": 6,
  "internet_availability_prediction_percentage": 100,
  "create_at": "2022-11-25T20:14:15.001452+00:00",
  "locality_map": {
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
    "adm_level": "state"
  }
}];

export const localityStatisticsMunicipalityFromServer = [{
  "id": 84,
  "locality_map_id": 86,
  "school_count": 15,
  "student_count": 4472,
  "connected_count": 9,
  "connected_percentage": 60,
  "internet_availability_null_count": 4,
  "internet_availability_null_percentage": 26.6666666666667,
  "internet_availability_by_value": {
    "No": 2,
    "Yes": 9,
    "NA": 4
  },
  "internet_availability_by_school_region": {
    "Rural": {
      "NA": 4,
      "No": 2,
      "Yes": 4
    },
    "Urban": {
      "NA": 0,
      "No": 0,
      "Yes": 5
    }
  },
  "internet_availability_by_school_type": {
    "Estadual": {
      "NA": 0,
      "No": 1,
      "Yes": 4
    },
    "Municipal": {
      "NA": 4,
      "No": 1,
      "Yes": 5
    }
  },
  "internet_availability_prediction_count": 0,
  "internet_availability_prediction_percentage": 0,
  "create_at": "2022-11-25T20:14:15.001452+00:00",
  "locality_map": {
    "id": 86,
    "country_name": "Brasil",
    "country_code": "BR",
    "region_name": "Norte",
    "region_code": "1",
    "state_name": "Acre",
    "state_abbreviation": "AC",
    "state_code": "12",
    "municipality_name": "Acrelândia",
    "municipality_code": "1200013",
    "adm_level": "municipality"
  }
}];

export const localityStatisticsRegions = localityStatisticsRegionFromServer.map(item => { return new LocalityStatistics().deserialize(item) });
export const localityStatisticsStates = localityStatisticsStateFromServer.map(item => { return new LocalityStatistics().deserialize(item) });
export const localityStatisticsMunicipalities = localityStatisticsMunicipalityFromServer.map(item => { return new LocalityStatistics().deserialize(item) });