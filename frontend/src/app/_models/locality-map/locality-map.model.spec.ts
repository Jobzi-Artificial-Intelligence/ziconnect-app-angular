import { LocalityMap } from './locality-map.model';

describe('Model: LocalityGeometry', () => {
  it('should initialize all properties correctly', () => {
    const localityMap = new LocalityMap();

    expect(localityMap.administrativeLevel).toEqual('country');
    expect(localityMap.cityId).toEqual('');
    expect(localityMap.cityName).toEqual('');
    expect(localityMap.countryId).toEqual('');
    expect(localityMap.countryName).toEqual('');
    expect(localityMap.geometry).toEqual(jasmine.any(Object));
    expect(localityMap.regionId).toEqual('');
    expect(localityMap.regionName).toEqual('');
    expect(localityMap.stateAbbreviation).toEqual('');
    expect(localityMap.stateId).toEqual('');
    expect(localityMap.stateName).toEqual('');
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const localityMap = new LocalityMap();

      expect(localityMap.deserialize).toBeTruthy();
      expect(localityMap.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const localityMapFromServer = {
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

      const localityMap = new LocalityMap();
      localityMap.deserialize(localityMapFromServer);

      expect(localityMap.administrativeLevel).toEqual(localityMapFromServer.adm_level);
      expect(localityMap.cityId).toEqual(localityMapFromServer.city_id);
      expect(localityMap.cityName).toEqual(localityMapFromServer.city_name);
      expect(localityMap.countryId).toEqual(localityMapFromServer.country_id);
      expect(localityMap.countryName).toEqual(localityMapFromServer.country_name);
      expect(localityMap.geometry).toEqual(localityMapFromServer.geometry);
      expect(localityMap.regionId).toEqual(localityMapFromServer.region_id);
      expect(localityMap.regionName).toEqual(localityMapFromServer.region_name);
      expect(localityMap.stateAbbreviation).toEqual(localityMapFromServer.state_abbreviation);
      expect(localityMap.stateId).toEqual(localityMapFromServer.state_id);
      expect(localityMap.stateName).toEqual(localityMapFromServer.state_name);
    });
  });
});