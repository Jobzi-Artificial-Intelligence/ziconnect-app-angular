import { IConnectivityStats, IGeneralStats, ISchoolRegionStats, ISchoolTypeStats, StatType } from "src/app/_helpers";

export const regionStats = {
  byConnectivity: <IConnectivityStats>{
    YES: 50,
    NO: 30,
    NA: 20
  },
  citiesCount: 100,
  cityCode: '',
  cityName: '',
  connectivityBySchoolRegion: <ISchoolRegionStats>{
    Rural: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Urban: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    }
  },
  connectivityBySchoolType: <ISchoolTypeStats>{
    Municipal: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Estadual: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Federal: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    }
  },
  regionCode: '1',
  regionName: 'Norte',
  schoolsCount: 50,
  schoolsConnectedCount: 40,
  schoolsConnectedPercentage: 80,
  schoolsWithoutConnectivityDataCount: 20,
  schoolsWithoutConnectivityDataPercentage: 30,
  schoolsInternetAvailabilityPredictionCount: 20,
  schoolsInternetAvailabilityPredictionPercentage: 50,
  stateCode: '',
  stateName: '',
  statesCount: 2,
  studentCount: 10000,
  type: StatType.Region
} as IGeneralStats

export const cityStats = {
  byConnectivity: <IConnectivityStats>{
    YES: 50,
    NO: 30,
    NA: 20
  },
  citiesCount: 100,
  cityCode: '',
  cityName: '',
  connectivityBySchoolRegion: <ISchoolRegionStats>{
    Rural: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Urban: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    }
  },
  connectivityBySchoolType: <ISchoolTypeStats>{
    Municipal: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Estadual: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Federal: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    }
  },
  regionCode: '1',
  regionName: 'Norte',
  schoolsCount: 50,
  schoolsConnectedCount: 40,
  schoolsConnectedPercentage: 80,
  schoolsWithoutConnectivityDataCount: 20,
  schoolsWithoutConnectivityDataPercentage: 30,
  schoolsInternetAvailabilityPredictionCount: 20,
  schoolsInternetAvailabilityPredictionPercentage: 50,
  stateCode: '',
  stateName: '',
  statesCount: 2,
  studentCount: 10000,
  type: StatType.Region
} as IGeneralStats

export const stateStats = {
  byConnectivity: <IConnectivityStats>{
    YES: 50,
    NO: 30,
    NA: 20
  },
  citiesCount: 100,
  cityCode: '',
  cityName: '',
  connectivityBySchoolRegion: <ISchoolRegionStats>{
    Rural: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Urban: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    }
  },
  connectivityBySchoolType: <ISchoolTypeStats>{
    Municipal: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Estadual: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    },
    Federal: <IConnectivityStats>{
      YES: 50,
      NO: 30,
      NA: 20
    }
  },
  regionCode: '1',
  regionName: 'Norte',
  schoolsCount: 50,
  schoolsConnectedCount: 40,
  schoolsConnectedPercentage: 80,
  schoolsWithoutConnectivityDataCount: 20,
  schoolsWithoutConnectivityDataPercentage: 30,
  schoolsInternetAvailabilityPredictionCount: 20,
  schoolsInternetAvailabilityPredictionPercentage: 50,
  stateCode: 'code01',
  stateName: 'Name01',
  statesCount: 2,
  studentCount: 10000,
  type: StatType.Region
} as IGeneralStats