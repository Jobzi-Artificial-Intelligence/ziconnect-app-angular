import { School } from "./school.model";

describe('Model: Region', () => {

  it('should initialize all properties correctly', () => {
    const school = new School();

    expect(school.city).toEqual('');
    expect(school.city_code).toEqual('');
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
    expect(school.region).toEqual('');
    expect(school.region_code).toEqual('');
    expect(school.school_name).toEqual('');
    expect(school.school_region).toEqual('');
    expect(school.school_type).toEqual('');
    expect(school.source).toEqual('');
    expect(school.source_school_id).toEqual('');
    expect(school.state).toEqual('');
    expect(school.state_code).toEqual('');
    expect(school.student_count).toEqual(0);
    expect(school.uuid).toEqual('');
    expect(school.without_internet_availability_data).toEqual(false);
    expect(school.localityGeometry).toBeDefined();
  });

  describe('#deserializeFromFile', () => {

    it('should exists', () => {
      const school = new School();

      expect(school.deserializeFromFile).toBeTruthy();
      expect(school.deserializeFromFile).toEqual(jasmine.any(Function));
    });

    it('should works #1', () => {
      const schoolFromFile = {
        uuid: 'uuid',
        country: 'country',
        source: 'source',
        source_school_id: 'source school id',
        computer_availability: 'Yes',
        city: 'city',
        city_code: 'city code',
        dq_score: '1',
        internet_availability_prediction: 'No',
        internet_speed_Mbps: '10',
        latitude: 0,
        longitude: 0,
        region: 'region',
        region_code: 'region code',
        school_name: 'school name',
        school_region: 'school region',
        school_type: 'school type',
        state: 'state',
        state_code: 'state code',
        student_count: '1100',
        internet_availability: 'Yes'
      };

      const school = new School();

      school.deserializeFromFile(schoolFromFile);

      expect(school.city).toEqual(schoolFromFile.city);
      expect(school.city_code).toEqual(schoolFromFile.city_code);
      expect(school.computer_availability_bool).toEqual(true);
      expect(school.computer_availability_str).toEqual(schoolFromFile.computer_availability);
      expect(school.country).toEqual(schoolFromFile.country);
      expect(school.dq_score).toEqual(1);
      expect(school.internet_availability_bool).toEqual(true);
      expect(school.internet_availability_prediction_bool).toEqual(false);
      expect(school.internet_availability_prediction_str).toEqual(schoolFromFile.internet_availability_prediction);
      expect(school.internet_availability_str).toEqual(schoolFromFile.internet_availability);
      expect(school.internet_speed_Mbps).toEqual(10);
      expect(school.latitude).toEqual(schoolFromFile.latitude);
      expect(school.longitude).toEqual(schoolFromFile.longitude);
      expect(school.region).toEqual(schoolFromFile.region);
      expect(school.region_code).toEqual(schoolFromFile.region_code);
      expect(school.school_name).toEqual(schoolFromFile.school_name);
      expect(school.school_region).toEqual(schoolFromFile.school_region);
      expect(school.school_type).toEqual(schoolFromFile.school_type);
      expect(school.source).toEqual(schoolFromFile.source);
      expect(school.source_school_id).toEqual(schoolFromFile.source_school_id);
      expect(school.state).toEqual(schoolFromFile.state);
      expect(school.state_code).toEqual(schoolFromFile.state_code);
      expect(school.student_count).toEqual(1100);
      expect(school.uuid).toEqual(schoolFromFile.uuid);
      expect(school.without_internet_availability_data).toEqual(false);
    });

    it('should works #2', () => {
      const schoolFromFile = {
        uuid: 'uuid',
        country: 'country',
        source: 'source',
        source_school_id: 'source school id',
        computer_availability: 'Yes',
        city: 'city',
        dq_score: '1',
        internet_availability_prediction: 'No',
        latitude: 0,
        longitude: 0,
        region: 'region',
        school_name: 'school name',
        school_region: 'school region',
        school_type: 'school type',
        state: 'state',
        internet_availability: 'NA'
      };

      const school = new School();

      school.deserializeFromFile(schoolFromFile);

      expect(school.city).toEqual(schoolFromFile.city);
      expect(school.city_code).toEqual('');
      expect(school.computer_availability_bool).toEqual(true);
      expect(school.computer_availability_str).toEqual('Yes');
      expect(school.country).toEqual(schoolFromFile.country);
      expect(school.dq_score).toEqual(1);
      expect(school.internet_availability_bool).toEqual(false);
      expect(school.internet_availability_prediction_bool).toEqual(false);
      expect(school.internet_availability_prediction_str).toEqual(schoolFromFile.internet_availability_prediction);
      expect(school.internet_speed_Mbps).toEqual(0);
      expect(school.latitude).toEqual(schoolFromFile.latitude);
      expect(school.longitude).toEqual(schoolFromFile.longitude);
      expect(school.region).toEqual(schoolFromFile.region);
      expect(school.region_code).toEqual('');
      expect(school.school_name).toEqual(schoolFromFile.school_name);
      expect(school.school_region).toEqual(schoolFromFile.school_region);
      expect(school.school_type).toEqual(schoolFromFile.school_type);
      expect(school.source).toEqual(schoolFromFile.source);
      expect(school.source_school_id).toEqual(schoolFromFile.source_school_id);
      expect(school.state).toEqual(schoolFromFile.state);
      expect(school.state_code).toEqual('');
      expect(school.student_count).toEqual(0);
      expect(school.uuid).toEqual(schoolFromFile.uuid);
      expect(school.without_internet_availability_data).toEqual(true);
    });
  });
});