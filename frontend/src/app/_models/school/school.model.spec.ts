import { School } from "./school.model";
import { schoolFromServer } from "../../../test/school-mock";
import { UtilHelper } from "src/app/_helpers";

describe('Model: Region', () => {

  it('should initialize all properties correctly', () => {
    const school = new School();

    expect(school.computer_availability_bool).toEqual(false);
    expect(school.computer_availability_str).toEqual('');
    expect(school.country).toEqual('');
    expect(school.dq_score).toEqual(0.0);
    expect(school.internet_availability_bool).toEqual(false);
    expect(school.internet_availability_prediction_bool).toEqual(false);
    expect(school.internet_availability_prediction_str).toEqual('NA');
    expect(school.internet_availability_str).toEqual('');
    expect(school.internet_speed_Mbps).toEqual(0);
    expect(school.latitude).toEqual(0);
    expect(school.longitude).toEqual(0);
    expect(school.school_name).toEqual('');
    expect(school.school_region).toEqual('');
    expect(school.school_type).toEqual('');
    expect(school.source).toEqual('');
    expect(school.source_school_id).toEqual('');
    expect(school.student_count).toEqual(0);
    expect(school.uuid).toEqual('');
    expect(school.without_internet_availability_data).toEqual(false);
    expect(school.localityMap).toBeDefined();
  });

  describe('#deserialize', () => {

    it('should exists', () => {
      const school = new School();

      expect(school.deserialize).toBeTruthy();
      expect(school.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works #1', () => {
      const school = new School();

      school.deserialize(schoolFromServer);

      expect(school.computer_availability_bool).toEqual(true);
      expect(school.computer_availability_str).toEqual(UtilHelper.getBooleanStr(schoolFromServer.computer_availability));
      expect(school.country).toEqual(schoolFromServer.country);
      expect(school.dq_score).toEqual(1);
      expect(school.internet_availability_bool).toEqual(true);
      expect(school.internet_availability_prediction_bool).toEqual(false);
      expect(school.internet_availability_prediction_str).toEqual(UtilHelper.getBooleanStr(schoolFromServer.internet_availability_prediction));
      expect(school.internet_availability_str).toEqual(UtilHelper.getBooleanStr(schoolFromServer.internet_availability));
      expect(school.internet_speed_Mbps).toEqual(10);
      expect(school.latitude).toEqual(schoolFromServer.latitude);
      expect(school.longitude).toEqual(schoolFromServer.longitude);
      expect(school.school_name).toEqual(schoolFromServer.school_name);
      expect(school.school_region).toEqual(schoolFromServer.school_region);
      expect(school.school_type).toEqual(schoolFromServer.school_type);
      expect(school.source).toEqual(schoolFromServer.source);
      expect(school.source_school_id).toEqual(schoolFromServer.source_school_id);
      expect(school.student_count).toEqual(1100);
      expect(school.uuid).toEqual(schoolFromServer.uuid);
      expect(school.without_internet_availability_data).toEqual(school.internet_availability_bool === null);
    });
  });
});