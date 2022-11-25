import { LocalityMap } from './locality-map.model';

describe('Model: LocalityMap', () => {
  it('should initialize all properties correctly', () => {
    const localityMap = new LocalityMap();

    expect(localityMap.id).toEqual(0);
    expect(localityMap.administrativeLevel).toEqual('country');
    expect(localityMap.municipalityCode).toEqual('');
    expect(localityMap.municipalityName).toEqual('');
    expect(localityMap.countryCode).toEqual('');
    expect(localityMap.countryName).toEqual('');
    expect(localityMap.geometry).toEqual(jasmine.any(Object));
    expect(localityMap.regionCode).toEqual('');
    expect(localityMap.regionName).toEqual('');
    expect(localityMap.stateAbbreviation).toEqual('');
    expect(localityMap.stateCode).toEqual('');
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
        'id': 34,
        'country_name': 'Brasil',
        'country_code': 'BR',
        'region_name': 'Norte',
        'region_code': '1',
        'state_name': 'Rondônia',
        'state_abbreviation': 'RO',
        'state_code': '11',
        'municipality_name': 'Alta Floresta D\'Oeste',
        'municipality_code': '1100015',
        'adm_level': 'municipality',
        'geometry': {
          'type': 'Feature',
          'properties': {
            'adm_level': 'city',
            'region_code': '1',
            'region_name': 'Norte',
            'region_abbreviation': 'N',
            'state_code': '11',
            'state_name': 'Rondônia',
            'state_abbreviation': 'RO',
            'municipality_code': '1100015',
            'municipality_name': 'Alta Floresta Oeste',
            'country_code': 'BR',
            'country_name': 'Brasil'
          }
        }
      };

      const localityMap = new LocalityMap();
      localityMap.deserialize(localityMapFromServer);

      expect(localityMap.id).toEqual(localityMapFromServer.id);
      expect(localityMap.administrativeLevel).toEqual(localityMapFromServer.adm_level);
      expect(localityMap.municipalityCode).toEqual(localityMapFromServer.municipality_code);
      expect(localityMap.municipalityName).toEqual(localityMapFromServer.municipality_name);
      expect(localityMap.countryCode).toEqual(localityMapFromServer.country_code);
      expect(localityMap.countryName).toEqual(localityMapFromServer.country_name);
      expect(localityMap.geometry).toEqual(localityMapFromServer.geometry);
      expect(localityMap.regionCode).toEqual(localityMapFromServer.region_code);
      expect(localityMap.regionName).toEqual(localityMapFromServer.region_name);
      expect(localityMap.stateAbbreviation).toEqual(localityMapFromServer.state_abbreviation);
      expect(localityMap.stateCode).toEqual(localityMapFromServer.state_code);
      expect(localityMap.stateName).toEqual(localityMapFromServer.state_name);
    });
  });
});