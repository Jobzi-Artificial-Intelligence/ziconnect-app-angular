import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalityMapService } from "./locality-map.service";
import { environment } from "src/environments/environment";
import { LocalityMap, LocalityMapAutocomplete, Region, State } from "src/app/_models";
import { localitiesMapAutocompleteResponseFromServer } from "../../../test/locality-map-autocomplete-mock";

describe('LocalityMapService', () => {
  let httpTestingController: HttpTestingController;
  let service: LocalityMapService;
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
    "country_code": "BR",
    "region_name": "Norte",
    "region_code": "1",
    "state_name": "Rondônia",
    "state_abbreviation": "RO",
    "state_code": "11",
    "city_name": "Alta Floresta D'Oeste",
    "city_id": "1100015",
    "adm_level": "city",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "city",
        "region_code": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "state_code": "11",
        "state_name": "Rondônia",
        "state_abbreviation": "RO",
        "city_id": "1100015",
        "city_name": "Alta Floresta D'Oeste",
        "country_code": "BR",
        "country_name": "Brasil"
      }
    }
  }];
  const countriesResponseFromServer = [{
    "country_name": "Brasil",
    "country_code": "BR",
    "region_name": null,
    "region_code": null,
    "state_name": null,
    "state_abbreviation": null,
    "state_code": null,
    "city_name": null,
    "city_id": null,
    "adm_level": "country",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "country",
        "country_code": "BR",
        "country_name": "Brasil"
      }
    }
  }];
  const regionsResponseFromServer = [{
    "country_name": "Brasil",
    "country_code": "BR",
    "region_name": "Norte",
    "region_code": "1",
    "state_name": null,
    "state_abbreviation": null,
    "state_code": null,
    "city_name": null,
    "city_id": null,
    "adm_level": "region",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "region",
        "region_code": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "country_code": "BR",
        "country_name": "Brasil"
      }
    }
  }];
  const statesResponseFromServer = [{
    "country_name": "Brasil",
    "country_code": "BR",
    "region_name": "Norte",
    "region_code": "1",
    "state_name": "Rondônia",
    "state_abbreviation": "RO",
    "state_code": "11",
    "city_name": null,
    "city_id": null,
    "adm_level": "state",
    "geometry": {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "adm_level": "state",
        "region_code": "1",
        "region_name": "Norte",
        "region_abbreviation": "N",
        "state_code": "11",
        "state_name": "Rondônia",
        "state_abbreviation": "RO",
        "country_code": "BR",
        "country_name": "Brasil"
      }
    }
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(LocalityMapService);

    const host = environment.postgrestHost;
    //@ts-ignore
    const path = service._postgrestLocalityMapPath;
    endpointUri = `${host}${path}`

    //@ts-ignore
    const viewPath = service._viewLocalityMapAutocompletePath;
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
      const expectedData: LocalityMap[] = countriesResponseFromServer.map((item) => new LocalityMap().deserialize(item));

      service.getCountries().subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(countriesResponseFromServer);
    });
  });

  describe('#getLocalityMapRegionsByCountry', () => {
    beforeEach(() => {
      query = `adm_level=eq.region&country_code=eq.${countryId}`;
    });

    it('should exists', () => {
      expect(service.getLocalityMapRegionsByCountry).toBeDefined();
      expect(service.getLocalityMapRegionsByCountry).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getLocalityMapRegionsByCountry(countryId).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityMap[] = regionsResponseFromServer.map((item) => new LocalityMap().deserialize(item));

      service.getLocalityMapRegionsByCountry(countryId).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(regionsResponseFromServer);
    });
  });

  describe('#getStatesByRegion', () => {
    beforeAll(() => {
      query = `adm_level=eq.state&country_code=eq.${countryId}&region_code=eq.${regionId}`;
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
      const expectedData: LocalityMap[] = statesResponseFromServer.map((item) => new LocalityMap().deserialize(item));

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
      query = `adm_level=eq.municipality&country_code=eq.${countryId}&region_code=eq.${regionId}&state_code=eq.${stateId}`;
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
      const expectedData: LocalityMap[] = citiesResponseFromServer.map((item) => new LocalityMap().deserialize(item));

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
      expect(() => service.getFeatureCollectionFromLocalityList(new Array<LocalityMap>()))
        .toThrow(new Error('Get Feature Collection: Locality list was not provided!'));
    })

    it('should works', () => {
      const localityMapList: LocalityMap[] = citiesResponseFromServer.map((item) => new LocalityMap().deserialize(item));

      const result = service.getFeatureCollectionFromLocalityList(localityMapList);

      expect(result).toBeTruthy();
      expect(result.type).toEqual('FeatureCollection');
      expect(result.features.length).toBeGreaterThan(0);
      expect(result.features[0]).toEqual(localityMapList[0].geometry);
    })
  });

  describe('#getLocalityAutocompleteByCountry', () => {
    beforeEach(() => {
      query = `country_code=eq.${countryId}&limit=5`;
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

      const expectedData: LocalityMapAutocomplete[] = localitiesMapAutocompleteResponseFromServer.map((item) => new LocalityMapAutocomplete().deserialize(item));

      service.getLocalityAutocompleteByCountry(countryId, term).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointViewUri}?${query}`);
      testRequest.flush(localitiesMapAutocompleteResponseFromServer);
    });
  });

  describe('#getRegionsOfCountry', () => {
    beforeEach(() => {
      query = `select=region_code,region_name&adm_level=eq.region&country_code=eq.${countryId}`;
    });

    it('should exists', () => {
      expect(service.getRegionsOfCountry).toBeDefined();
      expect(service.getRegionsOfCountry).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getRegionsOfCountry(countryId).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: Region[] = regionsResponseFromServer.map((item) => new Region(item.region_code, item.region_name));

      service.getRegionsOfCountry(countryId).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(regionsResponseFromServer);
    });
  });

  describe('#getStatesOfCountry', () => {
    beforeEach(() => {
      query = `select=region_code,region_name,state_code,state_name&adm_level=eq.state&country_code=eq.${countryId}`;
    });

    it('should exists', () => {
      expect(service.getStatesOfCountry).toBeDefined();
      expect(service.getStatesOfCountry).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getStatesOfCountry(countryId).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: State[] = statesResponseFromServer.map((item) => new State(item.state_code, item.state_name, new Region(item.region_code, item.region_name)));

      service.getStatesOfCountry(countryId).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(statesResponseFromServer);
    });
  });
});