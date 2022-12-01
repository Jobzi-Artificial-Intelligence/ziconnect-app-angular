import { IConnectivityStats, ISchoolRegionStats, ISchoolTypeStats } from "src/app/_models/locality-statistics/locality-statistics.model";
import { LocalityStatistics } from "src/app/_models";

export const regionStats = {
  internetAvailabilityByValue: <IConnectivityStats>{
    YES: 50,
    NO: 30,
    NA: 20
  },
  municipalitiesCount: 100,
  internetAvailabilityBySchoolRegion: <ISchoolRegionStats>{
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
  internetAvailabilityBySchoolType: <ISchoolTypeStats>{
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
  schoolCount: 50,
  schoolInternetAvailabilityCount: 40,
  schoolInternetAvailabilityPercentage: 80,
  schoolWithoutInternetAvailabilityCount: 20,
  schoolWithoutInternetAvailabilityPercentage: 30,
  schoolInternetAvailabilityPredicitionCount: 20,
  schoolInternetAvailabilityPredicitionPercentage: 50,
  statesCount: 2,
  studentCount: 10000
} as LocalityStatistics

export const cityStats = {
  internetAvailabilityByValue: <IConnectivityStats>{
    YES: 50,
    NO: 30,
    NA: 20
  },
  municipalitiesCount: 100,
  internetAvailabilityBySchoolRegion: <ISchoolRegionStats>{
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
  internetAvailabilityBySchoolType: <ISchoolTypeStats>{
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
  schoolCount: 50,
  schoolInternetAvailabilityCount: 40,
  schoolInternetAvailabilityPercentage: 80,
  schoolWithoutInternetAvailabilityCount: 20,
  schoolWithoutInternetAvailabilityPercentage: 30,
  schoolInternetAvailabilityPredicitionCount: 20,
  schoolInternetAvailabilityPredicitionPercentage: 50,
  statesCount: 2,
  studentCount: 10000
} as LocalityStatistics

export const stateStats = {
  internetAvailabilityByValue: <IConnectivityStats>{
    YES: 50,
    NO: 30,
    NA: 20
  },
  municipalitiesCount: 100,
  internetAvailabilityBySchoolRegion: <ISchoolRegionStats>{
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
  internetAvailabilityBySchoolType: <ISchoolTypeStats>{
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
  schoolCount: 50,
  schoolInternetAvailabilityCount: 40,
  schoolInternetAvailabilityPercentage: 80,
  schoolWithoutInternetAvailabilityCount: 20,
  schoolWithoutInternetAvailabilityPercentage: 30,
  schoolInternetAvailabilityPredicitionCount: 20,
  schoolInternetAvailabilityPredicitionPercentage: 50,
  statesCount: 2,
  studentCount: 10000
} as LocalityStatistics