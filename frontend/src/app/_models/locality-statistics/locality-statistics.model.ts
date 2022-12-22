import { Deserializable } from "../deserializable.model";
import { LocalityMap } from "../locality-map/locality-map.model";

export interface IConnectivityStats {
  YES: number;
  NO: number;
  NA: number;
}

export interface ISchoolRegionStats {
  Rural: IConnectivityStats,
  Urban: IConnectivityStats
}

export interface ISchoolTypeStats {
  Municipal: IConnectivityStats,
  Estadual: IConnectivityStats,
  Federal: IConnectivityStats
}

export class LocalityStatistics implements Deserializable {
  id: number;
  localityMap: LocalityMap;

  municipalitiesCount: number;
  regionsCount: number;
  statesCount: number;
  schoolCount: number;
  studentCount: number;

  schoolInternetAvailabilityCount: number;
  schoolInternetAvailabilityPercentage: number;
  schoolInternetAvailabilityPredicitionCount: number;
  schoolInternetAvailabilityPredicitionPercentage: number;
  schoolWithoutInternetAvailabilityCount: number;
  schoolWithoutInternetAvailabilityPercentage: number;

  // Internet Availability
  internetAvailabilityByValue: IConnectivityStats;
  internetAvailabilityBySchoolRegion: ISchoolRegionStats;
  internetAvailabilityBySchoolType: ISchoolTypeStats;

  // Internet Availability Predicition
  internetAvailabilityPredictionByValue: IConnectivityStats;
  internetAvailabilityPredictionBySchoolRegion: ISchoolRegionStats;
  internetAvailabilityPredictionBySchoolType: ISchoolTypeStats;

  constructor() {
    this.id = 0;
    this.localityMap = new LocalityMap();

    this.municipalitiesCount = 0;
    this.regionsCount = 0;
    this.statesCount = 0;
    this.schoolCount = 0;
    this.studentCount = 0;

    this.schoolInternetAvailabilityCount = 0;
    this.schoolInternetAvailabilityPercentage = 0;
    this.schoolInternetAvailabilityPredicitionCount = 0;
    this.schoolInternetAvailabilityPredicitionPercentage = 0;
    this.schoolWithoutInternetAvailabilityCount = 0;
    this.schoolWithoutInternetAvailabilityPercentage = 0;

    this.internetAvailabilityByValue = <IConnectivityStats>{
      YES: 0,
      NO: 0,
      NA: 0
    };
    this.internetAvailabilityBySchoolRegion = <ISchoolRegionStats>{
      Rural: {
        YES: 0,
        NA: 0,
        NO: 0
      },
      Urban: {
        YES: 0,
        NA: 0,
        NO: 0
      }
    };
    this.internetAvailabilityBySchoolType = <ISchoolTypeStats>{
      Estadual: {
        YES: 0,
        NA: 0,
        NO: 0
      },
      Federal: {
        YES: 0,
        NA: 0,
        NO: 0
      },
      Municipal: {
        YES: 0,
        NA: 0,
        NO: 0
      }
    };

    this.internetAvailabilityPredictionByValue = <IConnectivityStats>{
      YES: 0,
      NO: 0,
      NA: 0
    };
    this.internetAvailabilityPredictionBySchoolRegion = <ISchoolRegionStats>{
      Rural: {
        YES: 0,
        NA: 0,
        NO: 0
      },
      Urban: {
        YES: 0,
        NA: 0,
        NO: 0
      }
    };
    this.internetAvailabilityPredictionBySchoolType = <ISchoolTypeStats>{
      Estadual: {
        YES: 0,
        NA: 0,
        NO: 0
      },
      Federal: {
        YES: 0,
        NA: 0,
        NO: 0
      },
      Municipal: {
        YES: 0,
        NA: 0,
        NO: 0
      }
    };
  }

  deserialize(input: any): this {
    this.id = input.id;
    this.localityMap = new LocalityMap().deserialize(input.locality_map);

    this.municipalitiesCount = input.municipality_count;
    this.regionsCount = input.region_count;
    this.statesCount = input.state_count;
    this.schoolCount = input.school_count;
    this.studentCount = input.student_count;

    this.schoolInternetAvailabilityCount = input.connected_count;
    this.schoolInternetAvailabilityPercentage = Math.round(input.connected_percentage);
    this.schoolInternetAvailabilityPredicitionCount = input.internet_availability_prediction_count;
    this.schoolInternetAvailabilityPredicitionPercentage = Math.round(input.internet_availability_prediction_percentage);
    this.schoolWithoutInternetAvailabilityCount = input.internet_availability_null_count;
    this.schoolWithoutInternetAvailabilityPercentage = Math.round(input.internet_availability_null_percentage);

    this.internetAvailabilityByValue = input.internet_availability_by_value as IConnectivityStats;
    this.internetAvailabilityBySchoolRegion = input.internet_availability_by_school_region as ISchoolRegionStats;
    this.internetAvailabilityBySchoolType = input.internet_availability_by_school_type as ISchoolTypeStats;

    this.internetAvailabilityPredictionByValue = input.internet_availability_prediction_by_value as IConnectivityStats;
    this.internetAvailabilityPredictionBySchoolRegion = input.internet_availability_prediction_by_school_region as ISchoolRegionStats;
    this.internetAvailabilityPredictionBySchoolType = input.internet_availability_prediction_by_school_type as ISchoolTypeStats;

    return this;
  }
}