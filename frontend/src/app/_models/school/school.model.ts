import { UtilHelper } from "../../_helpers";

export class School {
  uuid: string;
  country: string;
  source: string;
  source_school_id: string;
  computer_availability_str: string;
  computer_availability_bool: Boolean;
  city: string;
  city_code: string;
  dq_score: Number;
  internet_availability_str: string;
  internet_availability_bool: Boolean;
  internet_availability_prediction_bool: Boolean;
  internet_availability_prediction_str: string;
  internet_speed_Mbps: number;
  latitude: Number;
  longitude: Number;
  region: String;
  region_code: string;
  school_name: String;
  school_region: String;
  school_type: String;
  state: String;
  state_code: string;
  student_count: number;
  without_internet_availability_data: Boolean;

  constructor() {
    this.uuid = '';
    this.country = '';
    this.source = '';
    this.source_school_id = '';
    this.computer_availability_str = '';
    this.computer_availability_bool = false;
    this.city = '';
    this.city_code = '';
    this.dq_score = 0.0;
    this.internet_availability_str = '';
    this.internet_availability_bool = false;
    this.internet_availability_prediction_bool = false;
    this.internet_availability_prediction_str = 'NA';
    this.internet_speed_Mbps = 0;
    this.latitude = 0;
    this.longitude = 0;
    this.region = '';
    this.region_code = '';
    this.school_name = '';
    this.school_region = '';
    this.school_type = '';
    this.state = '';
    this.state_code = '';
    this.student_count = 0;
    this.without_internet_availability_data = false;
  }

  /**
   * Deserealize dataset csv file row to school model object
   * @param input dataset row data
   * @returns school object
   */
  deserializeFromFile(input: any): this {
    this.uuid = input.uuid;
    this.country = input.country;
    this.source = input.source;
    this.source_school_id = input.source_school_id;
    this.computer_availability_str = input.computer_availability;
    this.computer_availability_bool = UtilHelper.getBoolean(input.computer_availability);
    this.city = input.city;
    this.city_code = input.city_code || '';
    this.dq_score = parseFloat(input.dq_score);
    this.internet_availability_prediction_bool = UtilHelper.getBoolean(
      String(input.internet_availability_prediction).toLowerCase()
    );
    this.internet_availability_prediction_str = input.internet_availability_prediction;
    this.internet_speed_Mbps = parseFloat(input.internet_speed_Mbps ? input.internet_speed_Mbps : 0);
    this.latitude = parseFloat(input.latitude);
    this.longitude = parseFloat(input.longitude);
    this.region = input.region;
    this.region_code = input.region_code || '';
    this.school_name = input.school_name;
    this.school_region = input.school_region;
    this.school_type = input.school_type;
    this.state = input.state;
    this.state_code = input.state_code || '';
    this.student_count = parseInt(input.student_count ? input.student_count : 0);

    if (input.internet_availability !== 'Yes' && input.internet_availability !== 'No') {
      this.internet_availability_str = 'NA';
      this.without_internet_availability_data = true;
    } else {
      this.internet_availability_str = input.internet_availability;
      this.internet_availability_bool = UtilHelper.getBoolean(
        String(input.internet_availability).toLowerCase()
      );
    }

    return this;
  }
}
