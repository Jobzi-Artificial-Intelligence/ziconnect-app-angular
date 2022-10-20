import { City, Region, State } from "../_models";

enum StatType {
  Region,
  State,
  City
}

export interface IGeneralStats {
  byConnectivity: IConnectivityStats;
  citiesCount: number;
  cityCode: string;
  cityName: string;
  connectivityBySchoolRegion: ISchoolRegionStats,
  connectivityBySchoolType: ISchoolTypeStats
  regionCode: string;
  regionName: string;
  schoolsCount: number;
  schoolsConnectedCount: number;
  schoolsConnectedPercentage: number;
  schoolsWithoutConnectivityDataCount: number;
  schoolsWithoutConnectivityDataPercentage: number;
  schoolsInternetAvailabilityPredictionCount: number;
  schoolsInternetAvailabilityPredictionPercentage: number;
  stateCode: string;
  stateName: string;
  statesCount: number;
  studentCount: number;
  type: StatType
}

interface IGeneralStatsMeta {
  cityCodes: Array<string>;
  cities: Array<City>;
  regionCodes: Array<string>;
  regions: Array<Region>;
  stateCodes: Array<string>;
  states: Array<State>;
}

interface ISchoolRegionStats {
  Rural: IConnectivityStats,
  Urban: IConnectivityStats
}

interface ISchoolTypeStats {
  Municipal: IConnectivityStats,
  Estadual: IConnectivityStats,
  Federal: IConnectivityStats
}

interface IConnectivityStats {
  YES: number;
  NO: number;
  NA: number;
}

export class StatsCsvHelper {
  fileHeaderColumns: Array<string>;
  fileLines: Array<string>;
  fileContentDataLines: Array<string>;
  stats: Array<IGeneralStats>;
  meta: IGeneralStatsMeta;

  constructor(csvStringData: string) {
    // Initializes meta data
    this.meta = {
      cities: new Array<City>(),
      cityCodes: new Array<string>(),
      regionCodes: new Array<string>(),
      regions: new Array<Region>(),
      stateCodes: new Array<string>(),
      states: new Array<State>()
    } as IGeneralStatsMeta;

    // Initializes general stats array items
    this.stats = new Array<IGeneralStats>();

    this.fileContentDataLines = new Array<string>();
    this.fileHeaderColumns = new Array<string>();

    this.fileLines = csvStringData.split('\n');

    if (!this.fileLines || this.fileLines.length <= 1) {
      throw new Error('File has no lines');
    }

    if (this.fileLines.length > 1) {
      this.fileHeaderColumns = this.fileLines[0].split(',');
    }

    this.fileContentDataLines = this.fileLines.slice(1);

    this._buildData();
  }

  //#region PRIVATE METHODS
  private _addMetaData(statItem: IGeneralStats) {
    if (statItem.type === StatType.Region && !this.meta.regionCodes.includes(statItem.regionCode)) {
      this.meta.regionCodes.push(statItem.regionCode);
      this.meta.regions.push(new Region(statItem.regionCode, statItem.regionName));
      return;
    }

    if (statItem.type === StatType.State && !this.meta.stateCodes.includes(statItem.stateCode)) {
      const region = new Region(statItem.regionCode, statItem.regionName);

      this.meta.stateCodes.push(statItem.stateCode);
      this.meta.states.push(new State(statItem.stateCode, statItem.stateName, region));
      return;
    }

    if (statItem.type === StatType.City && !this.meta.cityCodes.includes(statItem.cityCode)) {
      const region = new Region(statItem.regionCode, statItem.regionName);
      const state = new State(statItem.stateCode, statItem.stateName, region);

      this.meta.cityCodes.push(statItem.stateCode);
      this.meta.cities.push(new City(statItem.cityCode, statItem.cityName, state));
      return;
    }
  }

  private _buildData() {
    for (let index = 0; index < this.fileContentDataLines.length; index++) {
      const row = this.fileContentDataLines[index];
      if (row) {
        this._pushStatsItemByRow(row);
      }
    }
  }

  private _getStatType(statItem: IGeneralStats): StatType {
    const hasCityCode = statItem.cityCode && statItem.cityCode.toString().trim().length > 0;
    const hasStateCode = statItem.stateCode && statItem.stateCode.toString().trim().length > 0;
    const hasRegionCode = statItem.regionCode && statItem.regionCode.toString().trim().length > 0;

    if (hasCityCode) {
      return StatType.City;
    }

    if (hasStateCode && !hasCityCode) {
      return StatType.State;
    }

    if (hasRegionCode && !hasStateCode && !hasCityCode) {
      return StatType.Region;
    }

    return StatType.City;
  }

  private _isNumber(str: any): boolean {
    if (typeof str !== 'string') {
      return false;
    }

    if (str.trim() === '') {
      return false;
    }

    return !Number.isNaN(Number(str));
  }

  private _pushStatsItemByRow(row: string) {
    // Spit string row of values by comma
    const values = row.split(',');

    // Initializes stat item object
    const statsObject = {} as IGeneralStats;

    // Go through file header columns and assign the value to each property
    for (let index = 0; index < this.fileHeaderColumns.length; index++) {
      this._setProperty(statsObject, this.fileHeaderColumns[index], values[index]);
    }

    // All codes should be string data type
    statsObject.cityCode = statsObject.cityCode.toString();
    statsObject.regionCode = statsObject.regionCode.toString();
    statsObject.stateCode = statsObject.stateCode.toString();

    // Set stat item type
    statsObject.type = this._getStatType(statsObject);

    // Add new stat item to the array of stats
    this.stats.push(statsObject);

    // Add meta data from stat item object
    this._addMetaData(statsObject);
  }

  private _setProperty(obj: any, path: string, value: any) {
    if (obj === null || path === null || path.length === 0) {
      return obj;
    }

    const paths = path.split('.');

    if (paths.length === 1) {
      this._setPropertyValue(obj, path, value);
      return;
    }

    const rootProperty = paths.shift();

    if (!obj[rootProperty || '']) {
      obj[rootProperty || ''] = {} as any;
    }

    const newPath = paths.join('.');
    this._setProperty(obj[rootProperty || ''], newPath, value);
  }

  private _setPropertyValue(obj: any, propertyName: string, value: any) {
    obj[propertyName] = this._isNumber(value) ? Number(value) : value;
  }
  //#endregion
  ////////////////////////////////////

  //#region PUBLIC METHODS
  getStatsByCityCode(code: string): IGeneralStats | undefined {
    return this.stats.find(x => x.cityCode.toLowerCase() === code.toLowerCase());
  }

  getStatsByRegionCode(code: string): IGeneralStats | undefined {
    return this.stats.find(x => x.regionCode === code);
  }

  getStatsByStateCode(code: string): IGeneralStats | undefined {
    return this.stats.find(x => x.stateCode === code);
  }
  //#endregion
  ////////////////////////////////////
}