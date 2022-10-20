import { School } from '../_models';

export class SchoolCsvHelper {
  header: string;
  headerKeys: Array<string>;
  lines: Array<string>;

  // METADATA
  schools: Array<School>;

  constructor(csvData: string) {
    this.lines = csvData.split('\n');

    this.schools = new Array<School>();

    this.header = this.lines && this.lines.length > 0 ? this.lines[0] : '';
    this.headerKeys = this.header.split(',');

    this.buildData();
  }

  /**
   * Build helper class data from each csv dataset file
   */
  buildData() {
    if (!this.lines || this.lines.length <= 1) {
      throw new Error('File has no lines');
    }

    for (let index = 1; index < this.lines.length - 1; index++) {
      const line = this.lines[index];
      const columns = line.split(',');

      let schoolItem: any = {};

      for (let keyIndex = 0; keyIndex < this.headerKeys.length; keyIndex++) {
        const key = this.headerKeys[keyIndex];

        schoolItem[key] = columns[keyIndex];
      }

      const school = new School().deserializeFromFile(schoolItem);

      this.schools.push(school);
    }
  }

  /**
   * Gets the schools list from read csv dataset files
   * @returns Array<School>
   */
  getSchoolList(): Array<School> {
    return this.schools;
  }
}
