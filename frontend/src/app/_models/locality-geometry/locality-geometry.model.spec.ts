import { LocalityGeometry } from './locality-geometry.model';

describe('Model: LocalityGeometry', () => {
  it('should initialize all properties correctly', () => {
    const localityGeometry = new LocalityGeometry();

    expect(localityGeometry.administrativeLevel).toEqual('country');
    expect(localityGeometry.cityId).toEqual('');
    expect(localityGeometry.cityName).toEqual('');
    expect(localityGeometry.countryId).toEqual('');
    expect(localityGeometry.countryName).toEqual('');
    expect(localityGeometry.geometry).toEqual(jasmine.any(Object));
    expect(localityGeometry.regionId).toEqual('');
    expect(localityGeometry.regionName).toEqual('');
    expect(localityGeometry.stateAbbreviation).toEqual('');
    expect(localityGeometry.stateId).toEqual('');
    expect(localityGeometry.stateName).toEqual('');
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const localityGeometry = new LocalityGeometry();

      expect(localityGeometry.deserialize).toBeTruthy();
      expect(localityGeometry.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const localityGeometryFromServer = {
        'country_name': 'Brasil',
        'country_id': 'BR',
        'region_name': 'Norte',
        'region_id': '1',
        'state_name': 'Rondônia',
        'state_abbreviation': 'RO',
        'state_id': '11',
        'city_name': 'Alta Floresta Oeste',
        'city_id': '1100015',
        'adm_level': 'city',
        'geometry': {
          'type': 'Feature',
          'properties': {
            'adm_level': 'city',
            'region_id': '1',
            'region_name': 'Norte',
            'region_abbreviation': 'N',
            'state_id': '11',
            'state_name': 'Rondônia',
            'state_abbreviation': 'RO',
            'city_id': '1100015',
            'city_name': 'Alta Floresta Oeste',
            'country_id': 'BR',
            'country_name': 'Brasil'
          }
        }
      };

      const localityGeometry = new LocalityGeometry();
      localityGeometry.deserialize(localityGeometryFromServer);

      expect(localityGeometry.administrativeLevel).toEqual(localityGeometryFromServer.adm_level);
      expect(localityGeometry.cityId).toEqual(localityGeometryFromServer.city_id);
      expect(localityGeometry.cityName).toEqual(localityGeometryFromServer.city_name);
      expect(localityGeometry.countryId).toEqual(localityGeometryFromServer.country_id);
      expect(localityGeometry.countryName).toEqual(localityGeometryFromServer.country_name);
      expect(localityGeometry.geometry).toEqual(localityGeometryFromServer.geometry);
      expect(localityGeometry.regionId).toEqual(localityGeometryFromServer.region_id);
      expect(localityGeometry.regionName).toEqual(localityGeometryFromServer.region_name);
      expect(localityGeometry.stateAbbreviation).toEqual(localityGeometryFromServer.state_abbreviation);
      expect(localityGeometry.stateId).toEqual(localityGeometryFromServer.state_id);
      expect(localityGeometry.stateName).toEqual(localityGeometryFromServer.state_name);
    });
  });
});