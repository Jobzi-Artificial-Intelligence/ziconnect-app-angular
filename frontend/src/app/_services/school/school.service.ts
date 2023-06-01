import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { School } from '../../_models';
import { APP_BASE_HREF } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { UtilHelper } from 'src/app/_helpers';

export interface ISchoolColumnGroup {
  id: string,
  name: string,
  description: string,
  columns: Array<ISchoolColumn>
}

export interface ISchoolColumn {
  columnDef: string,
  header: string,
  cell: (value?: any) => string | string,
  description: string
}

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private _localityMapColumns = ['id',
    'country_name',
    'country_code',
    'region_name',
    'region_code',
    'state_name',
    'state_abbreviation',
    'state_code',
    'municipality_name',
    'municipality_code',
    'adm_level',];
  private _postgrestSchoolPath = 'school';
  fileSuffix = '_schools_dataset.csv';


  schoolColumnGroups: Array<ISchoolColumnGroup> = [{
    id: 'school',
    name: 'School',
    description: 'Set of fields with school information',
    columns: [{
      columnDef: 'school_name',
      header: 'School Name',
      description: 'School name',
      cell: (x: School): string => `${x.school_name}`
    }, {
      columnDef: 'uuid',
      header: 'Uuid',
      description: 'Universally Unique Identifiers',
      cell: (x: School): string => `${x.uuid}`
    }, {
      columnDef: 'source',
      header: 'Source',
      description: 'Source of information',
      cell: (x: School): string => `${x.source}`
    }, {
      columnDef: 'source_school_id',
      header: 'Source id',
      description: 'School code at source',
      cell: (x: School): string => `${x.source_school_id}`
    }, {
      columnDef: 'school_region',
      header: 'School region',
      description: 'Region of school (Urban or rural)',
      cell: (x: School): string => `${x.school_region}`
    }, {
      columnDef: 'school_type',
      header: 'School type',
      description: 'Type of school (Federal | Estadual | Municipal)',
      cell: (x: School): string => `${x.school_type}`
    }, {
      columnDef: 'student_count',
      header: 'Student count',
      description: 'Number of school students',
      cell: (x: School): string => `${x.student_count}`
    }]
  }, {
    id: 'location',
    name: 'Location',
    description: 'Set of fields with location information',
    columns: [{
      columnDef: 'latitude',
      header: 'Latitude',
      description: 'Measurement of distance north or south of the Equator',
      cell: (x: School): string => `${x.latitude}`
    }, {
      columnDef: 'longitude',
      header: 'Longitude',
      description: 'Measures distance east or west of the prime meridian',
      cell: (x: School): string => `${x.longitude}`
    }, {
      columnDef: 'country',
      header: 'Country',
      description: 'Country name',
      cell: (x: School): string => `${x.country}`
    }, {
      columnDef: 'localityMap.municipalityName',
      header: 'City Name',
      description: 'City name',
      cell: (x: School): string => `${x.localityMap.municipalityName}`
    }, {
      columnDef: 'localityMap.municipalityCode',
      header: 'City Code',
      description: 'City code',
      cell: (x: School): string => `${x.localityMap.municipalityCode}`
    }, {
      columnDef: 'localityMap.regionName',
      header: 'Region name',
      description: 'Region name',
      cell: (x: School): string => `${x.localityMap.regionName}`
    }, {
      columnDef: 'localityMap.regionCode',
      header: 'Region Code',
      description: 'Region code',
      cell: (x: School): string => `${x.localityMap.regionCode}`
    }, {
      columnDef: 'localityMap.stateName',
      header: 'State Name',
      description: 'State name',
      cell: (x: School): string => `${x.localityMap.stateName}`
    }, {
      columnDef: 'localityMap.stateCode',
      header: 'State Code',
      description: 'State code',
      cell: (x: School): string => `${x.localityMap.stateCode}`
    }]
  }, {
    id: 'connectivity',
    name: 'Connectivity',
    description: 'Set of fields with connectivity information',
    columns: [{
      columnDef: 'computer_availability_str',
      header: 'Computer Availability Str',
      description: 'Computer availability string value (Yes, No, NA)',
      cell: (x: School): string => `${x.computer_availability_str}`
    }, {
      columnDef: 'computer_availability_bool',
      header: 'Computer Availability',
      description: 'Computer availability boolean value',
      cell: (x: School): string => `${x.computer_availability_bool}`
    }, {
      columnDef: 'internet_availability_str',
      header: 'Internet Availability Str',
      description: 'Internet availability string value (Yes, No, NA)',
      cell: (x: School): string => `${x.internet_availability_str}`
    }, {
      columnDef: 'internet_availability_bool',
      header: 'Internet Availability',
      description: 'Internet availability boolean value',
      cell: (x: School): string => `${x.internet_availability_bool}`
    }, {
      columnDef: 'internet_availability_prediction_str',
      header: 'Internet Prediction Str',
      description: 'Internet prediction string value (Yes, No, NA)',
      cell: (x: School): string => `${x.internet_availability_prediction_str}`
    }, {
      columnDef: 'internet_availability_prediction_bool',
      header: 'Internet Prediction',
      description: 'Internet prediction boolean value',
      cell: (x: School): string => `${x.internet_availability_prediction_bool}`
    }, {
      columnDef: 'internet_speed_mbps',
      header: 'Internet Speed Mbps',
      description: 'Internet speed Mbps',
      cell: (x: School): string => `${x.internet_speed_mbps}`
    }, {
      columnDef: 'without_internet_availability_data',
      header: 'Without internet data',
      description: 'Without internet availability data (boolean)',
      cell: (x: School): string => `${x.without_internet_availability_data}`
    }]
  }];

  constructor(private http: HttpClient, @Inject(APP_BASE_HREF) private baseHref: string) { }

  /**
   * Exports array of schools data as csv semicolon separated file format
   * @param filename exported csv file name
   * @param schools Array<schools>
   */
  exportToCsv(filename: string, schools: School[]) {
    if (!schools || schools.length === 0) {
      throw new Error('List of schools not provided!');
    }

    const separator = ';'

    // Get all object keys
    const keys = new Array<string>();
    UtilHelper.getObjectKeys(schools[0], '', keys);

    const headerLine = keys.join(separator) + '\n';
    const rows = schools.map(school => {
      return keys.map(k => {
        return UtilHelper.getPropertyValueByPath(school, k);
      }).join(separator);
    }).join('\n');

    const csvContent = headerLine + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      throw new Error('Browser does not support download attribute');
    }
  }

  /**
   * Returns all schools from locality map id
   * @param localityMapId locality map id
   * @returns Observable<School[]>
   */
  getSchoolsByLocalityMapId(localityMapId: number): Observable<School[]> {
    const query = `select=*,locality_map!inner(${this._localityMapColumns.join(',')})&locality_map_id=eq.${localityMapId}`;

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestSchoolPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new School().deserialize(item));
        })
      );
  }

  /**
   * Returns all schools from locality map id
   * @param countryCode country code
   * @param regionCode region code
   * @param stateCode state code
   * @param municipalityCode municipality code
   * @returns Observable<School[]>
   */
  getSchoolsByLocalityMapCodes(countryCode: string | null, regionCode: string | null, stateCode: string | null, municipalityCode: string | null): Observable<School[]> {
    let query = `select=*,locality_map!inner(${this._localityMapColumns.join(',')})`;

    if (countryCode !== null) {
      query += `&locality_map.country_code=eq.${countryCode}`;
    }

    if (regionCode !== null) {
      query += `&locality_map.region_code=eq.${regionCode}`;
    }

    if (stateCode !== null) {
      query += `&locality_map.state_code=eq.${stateCode}`;
    }

    if (municipalityCode !== null) {
      query += `&locality_map.municipality_code=eq.${municipalityCode}`;
    }

    return this.http
      .get<any>(`${environment.postgrestHost}${this._postgrestSchoolPath}?${query}`, {
        responseType: 'json'
      })
      .pipe(
        map((data) => {
          return data.map((item: any) => new School().deserialize(item));
        })
      );
  }
}
