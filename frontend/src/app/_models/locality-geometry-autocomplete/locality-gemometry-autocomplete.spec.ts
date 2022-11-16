import { LocalityGeometryAutocomplete } from "./locality-geometry-autocomplete";
import { localityGeometryAutocompleteResponseFromServer } from '../../../test/locality-geometry-autocomplete-mock';

describe('Model: LocalityGeometryAutocomplete', () => {
  it('should initialize all properties correctly', () => {
    const autocompleteObj = new LocalityGeometryAutocomplete();

    // Inherit properties
    expect(autocompleteObj.administrativeLevel).toEqual('country');
    expect(autocompleteObj.cityId).toEqual('');
    expect(autocompleteObj.cityName).toEqual('');
    expect(autocompleteObj.countryId).toEqual('');
    expect(autocompleteObj.countryName).toEqual('');
    expect(autocompleteObj.geometry).toEqual(undefined);
    expect(autocompleteObj.regionId).toEqual('');
    expect(autocompleteObj.regionName).toEqual('');
    expect(autocompleteObj.stateAbbreviation).toEqual('');
    expect(autocompleteObj.stateId).toEqual('');
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
      const localityGeometry = new LocalityGeometryAutocomplete();

      expect(localityGeometry.deserialize).toBeTruthy();
      expect(localityGeometry.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const autocompleteObj = new LocalityGeometryAutocomplete().deserialize(localityGeometryAutocompleteResponseFromServer);

      expect(autocompleteObj.code).toEqual(autocompleteObj.cityId);
      expect(autocompleteObj.name).toEqual(autocompleteObj.cityName);
      expect(autocompleteObj.city).toBeDefined();
      expect(autocompleteObj.city?.code).toEqual(autocompleteObj.cityId.toString());
      expect(autocompleteObj.city?.name).toEqual(autocompleteObj.cityName.toString());
      expect(autocompleteObj.state).toBeDefined();
      expect(autocompleteObj.state?.code).toEqual(autocompleteObj.stateId.toString());
      expect(autocompleteObj.state?.name).toEqual(autocompleteObj.stateName.toString());
      expect(autocompleteObj.region).toBeDefined();
      expect(autocompleteObj.region?.code).toEqual(autocompleteObj.regionId.toString());
      expect(autocompleteObj.region?.name).toEqual(autocompleteObj.regionName.toString());
    });
  });
});