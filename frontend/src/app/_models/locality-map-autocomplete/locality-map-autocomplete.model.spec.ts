import { LocalityMapAutocomplete } from "./locality-map-autocomplete.model";
import { localityMapAutocompleteResponseFromServer } from '../../../test/locality-map-autocomplete-mock';

describe('Model: LocalityGeometryAutocomplete', () => {
  it('should initialize all properties correctly', () => {
    const autocompleteObj = new LocalityMapAutocomplete();

    // Inherit properties
    expect(autocompleteObj.administrativeLevel).toEqual('country');
    expect(autocompleteObj.municipalityCode).toEqual('');
    expect(autocompleteObj.municipalityName).toEqual('');
    expect(autocompleteObj.countryCode).toEqual('');
    expect(autocompleteObj.countryName).toEqual('');
    expect(autocompleteObj.geometry).toEqual(jasmine.any(Object));
    expect(autocompleteObj.regionCode).toEqual('');
    expect(autocompleteObj.regionName).toEqual('');
    expect(autocompleteObj.stateAbbreviation).toEqual('');
    expect(autocompleteObj.stateCode).toEqual('');
    expect(autocompleteObj.stateName).toEqual('');

    // Own properties
    expect(autocompleteObj.code).toEqual('');
    expect(autocompleteObj.name).toEqual('');
    expect(autocompleteObj.city).toBeUndefined();
    expect(autocompleteObj.state).toBeUndefined();
    expect(autocompleteObj.region).toBeUndefined();
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const localityGeometry = new LocalityMapAutocomplete();

      expect(localityGeometry.deserialize).toBeTruthy();
      expect(localityGeometry.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const autocompleteObj = new LocalityMapAutocomplete().deserialize(localityMapAutocompleteResponseFromServer);

      expect(autocompleteObj.code).toEqual(autocompleteObj.municipalityCode);
      expect(autocompleteObj.name).toEqual(autocompleteObj.municipalityName);
      expect(autocompleteObj.city).toBeDefined();
      expect(autocompleteObj.city?.code).toEqual(autocompleteObj.municipalityCode.toString());
      expect(autocompleteObj.city?.name).toEqual(autocompleteObj.municipalityName.toString());
      expect(autocompleteObj.state).toBeDefined();
      expect(autocompleteObj.state?.code).toEqual(autocompleteObj.stateCode.toString());
      expect(autocompleteObj.state?.name).toEqual(autocompleteObj.stateName.toString());
      expect(autocompleteObj.region).toBeDefined();
      expect(autocompleteObj.region?.code).toEqual(autocompleteObj.regionCode.toString());
      expect(autocompleteObj.region?.name).toEqual(autocompleteObj.regionName.toString());
    });
  });

  describe('#getText', () => {
    it('should works', () => {
      let autocompleteObj = new LocalityMapAutocomplete();

      // only region name
      autocompleteObj.regionName = 'Region01';
      expect(autocompleteObj.getText).toEqual('Region01');

      // state and region name
      autocompleteObj.stateName = 'State01';
      expect(autocompleteObj.getText).toEqual('State01, Region01');

      // city, state and region name
      autocompleteObj.municipalityName = 'City01';
      expect(autocompleteObj.getText).toEqual('City01, State01, Region01');
    });
  });
});