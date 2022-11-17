import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalityGeometryService } from "./locality-geometry.service";
import { environment } from "src/environments/environment";
import { LocalityGeometry, LocalityGeometryAutocomplete } from "src/app/_models";
import { localitiesGeometryAutocompleteResponseFromServer } from "../../../test/locality-geometry-autocomplete-mock";

describe('LocalityGeometryService', () => {
  let httpTestingController: HttpTestingController;
  let service: LocalityGeometryService;
  let endpointUri = '';
  let endpointViewUri = '';
  let query = '';

  // function parameters
  const countryId = 'BR';
  const regionId = '1';
  const stateId = '2';

  // Response from server
  const citiesResponseFromServer = [{
    "country_name": "Brasil",
    "country_id": "BR",
    "region_name": "Norte",
    "region_id": "1",
    "state_name": "Rondônia",
    "state_abbreviation": "RO",
    "state_id": "11",
    "city_name": "Alta Floresta D'Oeste",
    "city_id": "1100015",
    "adm_level": "city",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "city",
        "region_id": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "state_id": "11",
        "state_name": "Rondônia",
        "state_abbreviation": "RO",
        "city_id": "1100015",
        "city_name": "Alta Floresta D'Oeste",
        "country_id": "BR",
        "country_name": "Brasil"
      }
    }
  }];
  const countriesResponseFromServer = [{
    "country_name": "Brasil",
    "country_id": "BR",
    "region_name": null,
    "region_id": null,
    "state_name": null,
    "state_abbreviation": null,
    "state_id": null,
    "city_name": null,
    "city_id": null,
    "adm_level": "country",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "country",
        "country_id": "BR",
        "country_name": "Brasil"
      }
    }
  }];
  const regionsResponseFromServer = [{
    "country_name": "Brasil",
    "country_id": "BR",
    "region_name": "Norte",
    "region_id": "1",
    "state_name": null,
    "state_abbreviation": null,
    "state_id": null,
    "city_name": null,
    "city_id": null,
    "adm_level": "region",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "region",
        "region_id": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "country_id": "BR",
        "country_name": "Brasil"
      }
    }
  }];
  const statesResponseFromServer = [{
    "country_name": "Brasil",
    "country_id": "BR",
    "region_name": "Norte",
    "region_id": "1",
    "state_name": "Rondônia",
    "state_abbreviation": "RO",
    "state_id": "11",
    "city_name": null,
    "city_id": null,
    "adm_level": "state",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "state",
        "region_id": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "state_id": "11",
        "state_name": "Rondônia",
        "state_abbreviation": "RO",
        "country_id": "BR",
        "country_name": "Brasil"
      }
    }
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(LocalityGeometryService);

    const host = environment.postgrestHost;
    //@ts-ignore
    const path = service._postgrestLocalityGeometryPath;
    endpointUri = `${host}${path}`

    //@ts-ignore
    const viewPath = service._viewLocalityGeometryAutocompltePath;
    endpointViewUri = `${host}${viewPath}`;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('#getCountries', () => {
    beforeAll(() => {
      query = 'adm_level=eq.country';
    });

    it('should exists', () => {
      expect(service.getCountries).toBeDefined();
      expect(service.getCountries).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getCountries().subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityGeometry[] = countriesResponseFromServer.map((item) => new LocalityGeometry().deserialize(item));

      service.getCountries().subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(countriesResponseFromServer);
    });
  });

  describe('#getRegionsByCountry', () => {
    beforeEach(() => {
      query = `adm_level=eq.region&country_id=eq.${countryId}`;
    });

    it('should exists', () => {
      expect(service.getRegionsByCountry).toBeDefined();
      expect(service.getRegionsByCountry).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getRegionsByCountry(countryId).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityGeometry[] = regionsResponseFromServer.map((item) => new LocalityGeometry().deserialize(item));

      service.getRegionsByCountry(countryId).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(regionsResponseFromServer);
    });
  });

  describe('#getStatesByRegion', () => {
    beforeAll(() => {
      query = `adm_level=eq.state&country_id=eq.${countryId}&region_id=eq.${regionId}`;
    });

    it('should exists', () => {
      expect(service.getStatesByRegion).toBeDefined();
      expect(service.getStatesByRegion).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getStatesByRegion(countryId, regionId).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityGeometry[] = statesResponseFromServer.map((item) => new LocalityGeometry().deserialize(item));

      service.getStatesByRegion(countryId, regionId).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(statesResponseFromServer);
    });
  });

  describe('#getCitiesByState', () => {
    beforeAll(() => {
      query = `adm_level=eq.city&country_id=eq.${countryId}&region_id=eq.${regionId}&state_id=eq.${stateId}`;
    });

    it('should exists', () => {
      expect(service.getCitiesByState).toBeDefined();
      expect(service.getCitiesByState).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getCitiesByState(countryId, regionId, stateId).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityGeometry[] = citiesResponseFromServer.map((item) => new LocalityGeometry().deserialize(item));

      service.getCitiesByState(countryId, regionId, stateId).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(citiesResponseFromServer);
    });
  });

  describe('#getFeatureCollectionFromLocalityList', () => {

    it('should exists', () => {
      expect(service.getFeatureCollectionFromLocalityList).toBeDefined();
      expect(service.getFeatureCollectionFromLocalityList).toEqual(jasmine.any(Function));
    });

    it('should throw error when locality list is empty', () => {
      expect(() => service.getFeatureCollectionFromLocalityList(new Array<LocalityGeometry>()))
        .toThrow(new Error('Get Feature Collection: Locality list was not provided!'));
    })

    it('should works', () => {
      const localityGeometryList: LocalityGeometry[] = citiesResponseFromServer.map((item) => new LocalityGeometry().deserialize(item));

      const result = service.getFeatureCollectionFromLocalityList(localityGeometryList);

      expect(result).toBeTruthy();
      expect(result.type).toEqual('FeatureCollection');
      expect(result.features.length).toBeGreaterThan(0);
      expect(result.features[0]).toEqual(localityGeometryList[0].geometry);
    })
  });

  describe('#getLocalityAutocompleteByCountry', () => {
    beforeEach(() => {
      query = `country_id=eq.${countryId}&limit=5`;
    });

    it('should exists', () => {
      expect(service.getLocalityAutocompleteByCountry).toBeDefined();
      expect(service.getLocalityAutocompleteByCountry).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      let term = 'test';
      let searchString = term.trim();
      searchString = searchString.replace(' ', '*');
      searchString += '*';

      query += `&name=ilike.${searchString.replace(' ', '*')}`;
      query += `&order=name.asc`;

      service.getLocalityAutocompleteByCountry(countryId, term).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointViewUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      let term = 'test extra';
      let searchString = term.trim();
      searchString = searchString.replace(' ', '*');
      searchString += '*';

      query += `&name=ilike.${searchString.replace(' ', '*')}`;
      query += `&order=name.asc`;

      const expectedData: LocalityGeometryAutocomplete[] = localitiesGeometryAutocompleteResponseFromServer.map((item) => new LocalityGeometryAutocomplete().deserialize(item));

      service.getLocalityAutocompleteByCountry(countryId, term).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointViewUri}?${query}`);
      testRequest.flush(localitiesGeometryAutocompleteResponseFromServer);
    });
  });
});