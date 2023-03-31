import { analysisInputValidationResultFromServer } from './analysis-input-validation-result';

export const analysisResultFromServer = {
  "taskResult": {
    "model_metrics": {
      "classifier_name": "random_forest",
      "num_folds": 10,
      "train_accuracies": [
        0.8786324786324786,
        0.8744366744366744,
        0.8777000777000777,
        0.8780885780885781,
        0.8741258741258742,
        0.8757575757575757,
        0.87995337995338,
        0.877000777000777,
        0.8766122766122766,
        0.8754467754467754
      ],
      "mean_train_accuracy": 0.8767754467754468,
      "std_train_accuracy": 0.0017747112777286116,
      "valid_accuracies": [
        0.8538461538461538,
        0.8608391608391608,
        0.8335664335664336,
        0.8412587412587412,
        0.8748251748251749,
        0.855944055944056,
        0.8286713286713286,
        0.848951048951049,
        0.8475524475524475,
        0.8496503496503497
      ],
      "mean_valid_accuracy": 0.8495104895104895,
      "std_valid_accuracy": 0.012609925477522946,
      "test_accuracy": 0.859846630771741
    },
    "result_summary": [{
      "country_name": "Brasil",
      "country_code": "BR",
      "state_count": 7,
      "municipality_count": 449,
      "school_count": 24781,
      "student_count": 4727271,
      "internet_availability_by_value": {
        "NA": 4352,
        "No": 12532,
        "Yes": 7897
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
      "internet_availability_prediction_by_value": {
        "No": 3381,
        "Yes": 971
      },
      "internet_availability_prediction_by_school_region": {
        "Rural": {
          "No": 3356,
          "Yes": 577
        },
        "Urban": {
          "No": 25,
          "Yes": 394
        }
      },
      "internet_availability_prediction_by_school_type": {
        "Estadual": {
          "No": 129,
          "Yes": 146
        },
        "Federal": {
          "No": 0,
          "Yes": 1
        },
        "Municipal": {
          "No": 3252,
          "Yes": 824
        }
      },
      "state_name": "",
      "state_code": "",
      "municipality_name": "",
      "municipality_code": ""
    },
    {
      "country_name": "Brasil",
      "country_code": "BR",
      "state_count": 1,
      "municipality_count": 1,
      "school_count": 15,
      "student_count": 4472,
      "internet_availability_by_value": {
        "NA": 4,
        "No": 2,
        "Yes": 9
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
      "internet_availability_prediction_by_value": {
        "Yes": 4
      },
      "internet_availability_prediction_by_school_region": {
        "Rural": {
          "Yes": 4
        }
      },
      "internet_availability_prediction_by_school_type": {
        "Municipal": {
          "Yes": 4
        }
      },
      "state_name": "Acre",
      "state_code": 12.0,
      "municipality_name": "Acrel\u00e2ndia",
      "municipality_code": 1200013.0
    },
    {
      "country_name": "Brasil",
      "country_code": "BR",
      "state_count": 1,
      "municipality_count": 1,
      "school_count": 72,
      "student_count": 3832,
      "internet_availability_by_value": {
        "NA": 4,
        "No": 66,
        "Yes": 2
      },
      "internet_availability_by_school_region": {
        "Rural": {
          "NA": 4,
          "No": 63,
          "Yes": 0
        },
        "Urban": {
          "NA": 0,
          "No": 3,
          "Yes": 2
        }
      },
      "internet_availability_by_school_type": {
        "Estadual": {
          "NA": 1,
          "No": 29,
          "Yes": 1
        },
        "Municipal": {
          "NA": 3,
          "No": 37,
          "Yes": 1
        }
      },
      "internet_availability_prediction_by_value": {
        "No": 4
      },
      "internet_availability_prediction_by_school_region": {
        "Rural": {
          "No": 4
        }
      },
      "internet_availability_prediction_by_school_type": {
        "Estadual": {
          "No": 1
        },
        "Municipal": {
          "No": 3
        }
      },
      "state_name": "Acre",
      "state_code": 12.0,
      "municipality_name": "Assis Brasil",
      "municipality_code": 1200054.0
    },
    {
      "country_name": "Brasil",
      "country_code": "BR",
      "state_count": 1,
      "municipality_count": 1,
      "school_count": 61,
      "student_count": 7229,
      "internet_availability_by_value": {
        "NA": 22,
        "No": 29,
        "Yes": 10
      },
      "internet_availability_by_school_region": {
        "Rural": {
          "NA": 22,
          "No": 27,
          "Yes": 1
        },
        "Urbana": {
          "NA": 0,
          "No": 2,
          "Yes": 9
        }
      },
      "internet_availability_by_school_type": {
        "Estadual": {
          "NA": 0,
          "No": 0,
          "Yes": 5
        },
        "Municipal": {
          "NA": 22,
          "No": 29,
          "Yes": 5
        }
      },
      "internet_availability_prediction_by_value": {
        "No": 22
      },
      "internet_availability_prediction_by_school_region": {
        "Rural": {
          "No": 22
        }
      },
      "internet_availability_prediction_by_school_type": {
        "Municipal": {
          "No": 22
        }
      },
      "state_name": "Acre",
      "state_code": 12.0,
      "municipality_name": "Brasil\u00e9ia",
      "municipality_code": 1200104.0
    },
    {
      "country_name": "Brasil",
      "country_code": "BR",
      "state_count": 1,
      "municipality_count": 1,
      "school_count": 42,
      "student_count": 4032,
      "internet_availability_by_value": {
        "NA": 6,
        "No": 30,
        "Yes": 6
      },
      "internet_availability_by_school_region": {
        "Rural": {
          "NA": 6,
          "No": 29,
          "Yes": 3
        },
        "Urban": {
          "NA": 0,
          "No": 1,
          "Yes": 3
        }
      },
      "internet_availability_by_school_type": {
        "Estadual": {
          "NA": 5,
          "No": 18,
          "Yes": 3
        },
        "Municipal": {
          "NA": 1,
          "No": 12,
          "Yes": 3
        }
      },
      "internet_availability_prediction_by_value": {
        "No": 6
      },
      "internet_availability_prediction_by_school_region": {
        "Rural": {
          "No": 6
        }
      },
      "internet_availability_prediction_by_school_type": {
        "Estadual": {
          "No": 5
        },
        "Municipal": {
          "No": 1
        }
      },
      "state_name": "Acre",
      "state_code": 12.0,
      "municipality_name": "Bujari",
      "municipality_code": 1200138.0
    },
    {
      "country_name": "Brasil",
      "country_code": "BR",
      "state_count": 1,
      "municipality_count": 1,
      "school_count": 17,
      "student_count": 3657,
      "internet_availability_by_value": {
        "NA": 2,
        "No": 8,
        "Yes": 7
      },
      "internet_availability_by_school_region": {
        "Rural": {
          "NA": 2,
          "No": 8,
          "Yes": 3
        },
        "Urban": {
          "NA": 0,
          "No": 0,
          "Yes": 4
        }
      },
      "internet_availability_by_school_type": {
        "Estadual": {
          "NA": 0,
          "No": 0,
          "Yes": 3
        },
        "Municipal": {
          "NA": 2,
          "No": 8,
          "Yes": 4
        }
      },
      "internet_availability_prediction_by_value": {
        "No": 2
      },
      "internet_availability_prediction_by_school_region": {
        "Rural": {
          "No": 2
        }
      },
      "internet_availability_prediction_by_school_type": {
        "Municipal": {
          "No": 2
        }
      },
      "state_name": "Acre",
      "state_code": 12.0,
      "municipality_name": "Capixaba",
      "municipality_code": 1200179.0
    }],
    "table_schemas": {
      'schools': analysisInputValidationResultFromServer
    }
  }
}