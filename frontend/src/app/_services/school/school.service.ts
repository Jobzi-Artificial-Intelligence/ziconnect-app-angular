import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { School } from "../../_models";
import { APP_BASE_HREF } from "@angular/common";

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
  providedIn: "root",
})
export class SchoolService {
  csvFilePath = 'assets/datasets/schools/';
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
      columnDef: 'city',
      header: 'City Name',
      description: 'City name',
      cell: (x: School): string => `${x.city}`
    }, {
      columnDef: 'city_code',
      header: 'City Code',
      description: 'City code',
      cell: (x: School): string => `${x.city_code}`
    }, {
      columnDef: 'region',
      header: 'Region name',
      description: 'Region name',
      cell: (x: School): string => `${x.region}`
    }, {
      columnDef: 'region_code',
      header: 'Region Code',
      description: 'Region code',
      cell: (x: School): string => `${x.region_code}`
    }, {
      columnDef: 'state',
      header: 'State Name',
      description: 'State name',
      cell: (x: School): string => `${x.state}`
    }, {
      columnDef: 'state_code',
      header: 'State Code',
      description: 'State code',
      cell: (x: School): string => `${x.state_code}`
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
      columnDef: 'internet_speed_Mbps',
      header: 'Internet Speed Mbps',
      description: 'Internet speed Mbps',
      cell: (x: School): string => `${x.internet_speed_Mbps}`
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
    const keys = Object.keys(schools[0]);
    const headerLine = keys.join(separator) + '\n';
    const rows = schools.map(school => {
      const row = school as any;

      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];

        cell = cell instanceof Date
          ? cell.toLocaleString()
          : cell.toString().replace(/"/g, '""');

        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }

        return cell;
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
   * Gets csv dataset file and convert to string
   * @returns Observable<string> with csv file content
   */
  getSchoolsByStateCode(countryCode: string, stateCode: string) {
    if (!countryCode) {
      throw new Error('ISO 2 digits country code not provided!');
    }

    if (!stateCode) {
      throw new Error('State code not provided!');
    }

    return this.http.get(`${this.baseHref}${this.csvFilePath}${countryCode.toLowerCase()}/${stateCode.toUpperCase()}${this.fileSuffix}`, { responseType: 'text' });
  }
}
