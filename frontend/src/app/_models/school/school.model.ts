import { UtilHelper } from "../../_helpers";
import { Deserializable } from "../deserializable.model";
import { LocalityMap } from "../locality-map/locality-map.model";

export class School implements Deserializable {
  id: number
  uuid: string;
  country: string;
  source: string;
  source_school_id: string;
  computer_availability_str: string;
  computer_availability_bool: Boolean | null;
  dq_score: Number;
  internet_availability_str: string;
  internet_availability_bool: Boolean | null;
  internet_availability_prediction_bool: Boolean | null;
  internet_availability_prediction_str: string;
  internet_speed_Mbps: number;
  latitude: Number;
  longitude: Number;
  school_name: String;
  school_region: String;
  school_type: String;
  student_count: number;
  without_internet_availability_data: Boolean;

  localityMap: LocalityMap;

  constructor() {
    this.id = 0
    this.uuid = '';
    this.country = '';
    this.source = '';
    this.source_school_id = '';
    this.computer_availability_str = '';
    this.computer_availability_bool = false;
    this.dq_score = 0.0;
    this.internet_availability_str = '';
    this.internet_availability_bool = false;
    this.internet_availability_prediction_bool = false;
    this.internet_availability_prediction_str = 'NA';
    this.internet_speed_Mbps = 0;
    this.latitude = 0;
    this.longitude = 0;
    this.school_name = '';
    this.school_region = '';
    this.school_type = '';
    this.student_count = 0;
    this.without_internet_availability_data = false;

    this.localityMap = new LocalityMap().deserialize({});
  }

  /**
   * Deserealize data from server response to school model object
   * @param input server response json
   * @returns school object
   */
  deserialize(input: any): this {
    this.uuid = input.uuid;
    this.country = input.country;
    this.source = input.source;
    this.source_school_id = input.source_school_id;

    this.dq_score = input.dq_score;
    this.internet_speed_Mbps = parseFloat(input.internet_speed_Mbps ? input.internet_speed_Mbps : 0);
    this.latitude = input.latitude;
    this.longitude = input.longitude;
    this.school_name = input.school_name;
    this.school_region = input.school_region;
    this.school_type = input.school_type;
    this.student_count = input.student_count;

    this.computer_availability_bool = input.computer_availability;
    this.computer_availability_str = UtilHelper.getBooleanStr(input.computer_availability);
    this.internet_availability_bool = input.internet_availability;
    this.internet_availability_str = UtilHelper.getBooleanStr(input.internet_availability);
    this.internet_availability_prediction_bool = input.internet_availability_prediction;
    this.internet_availability_prediction_str = UtilHelper.getBooleanStr(input.internet_availability_prediction);

    this.without_internet_availability_data = this.internet_availability_bool === null;

    this.localityMap = new LocalityMap().deserialize(input.locality_map);

    return this;
  }
}
