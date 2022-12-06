import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AdministrativeLevel, LocalityStatistics } from "src/app/_models";
import { environment } from "src/environments/environment";
import { localityStatisticsFromServer } from "src/test/locality-statistics-mock";
import { LocalityStatisticsService } from "./locality-statistics.service";

describe('LocalityStatisticsService', () => {
  let httpTestingController: HttpTestingController;
  let service: LocalityStatisticsService;

  let endpointUri = '';
  let query = '';

  const countryCode = 'country01';
  const regionCode = 'region01';
  const stateCode = 'state01';

  let mockLocalityStatisticsData = new LocalityStatistics().deserialize(localityStatisticsFromServer[0]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(LocalityStatisticsService);

    const host = environment.postgrestHost;
    //@ts-ignore
    const path = service._postgrestLocalityStatisticsPath;
    endpointUri = `${host}${path}`
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getSchoolsByLocalityMapId', () => {
    beforeEach(() => {
      //@ts-ignore
      query = `select=*,locality_map!inner(${service._localityMapColumns.join(',')})&locality_map.adm_level=eq.${AdministrativeLevel.Country}`;
    });

    it('should exists', () => {
      expect(service.getStatisticsOfCountries).toBeDefined();
      expect(service.getStatisticsOfCountries).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getStatisticsOfCountries().subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityStatistics[] = localityStatisticsFromServer.map((item) => new LocalityStatistics().deserialize(item));

      service.getStatisticsOfCountries().subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(localityStatisticsFromServer);
    });
  });

  describe('#getStatisticsOfRegions', () => {
    beforeEach(() => {
      //@ts-ignore
      query = `select=*,locality_map!inner(${service._localityMapColumns.join(',')})`;
      query += `&locality_map.country_code=eq.${countryCode}`;
      query += `&locality_map.adm_level=eq.${AdministrativeLevel.Region}`;
    });

    it('should exists', () => {
      expect(service.getStatisticsOfRegions).toBeTruthy();
      expect(service.getStatisticsOfRegions).toEqual(jasmine.any(Function));
    })

    it('should throw error when country code is empty', () => {
      expect(() => service.getStatisticsOfRegions(''))
        .toThrow(new Error('ISO 2 digits country code not provided!'));
    });

    it('should use GET to retrieve data', () => {
      service.getStatisticsOfRegions(countryCode).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityStatistics[] = localityStatisticsFromServer.map((item) => new LocalityStatistics().deserialize(item));

      service.getStatisticsOfRegions(countryCode).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(localityStatisticsFromServer);
    });
  });

  describe('#getStatisticsOfStates', () => {
    beforeEach(() => {
      //@ts-ignore
      query = `select=*,locality_map!inner(${service._localityMapColumns.join(',')})`;
      query += `&locality_map.country_code=eq.${countryCode}`;
      query += `&locality_map.region_code=eq.${regionCode}`;
      query += `&locality_map.adm_level=eq.${AdministrativeLevel.State}`;
    });

    it('should exists', () => {
      expect(service.getStatisticsOfStates).toBeTruthy();
      expect(service.getStatisticsOfStates).toEqual(jasmine.any(Function));
    })

    it('should throw error when country code is empty', () => {
      expect(() => service.getStatisticsOfStates('', regionCode))
        .toThrow(new Error('ISO 2 digits country code not provided!'));
    });

    it('should throw error when region code is empty', () => {
      expect(() => service.getStatisticsOfStates(countryCode, ''))
        .toThrow(new Error('Region code not provided!'));
    });

    it('should use GET to retrieve data', () => {
      service.getStatisticsOfStates(countryCode, regionCode).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityStatistics[] = localityStatisticsFromServer.map((item) => new LocalityStatistics().deserialize(item));

      service.getStatisticsOfStates(countryCode, regionCode).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(localityStatisticsFromServer);
    });
  });

  describe('#getStatisticsOfMunicipalities', () => {
    beforeEach(() => {
      //@ts-ignore
      query = `select=*,locality_map!inner(${service._localityMapColumns.join(',')})`;
      query += `&locality_map.country_code=eq.${countryCode}`;
      query += `&locality_map.region_code=eq.${regionCode}`;
      query += `&locality_map.state_code=eq.${stateCode}`;
      query += `&locality_map.adm_level=eq.${AdministrativeLevel.Municipality}`;
    });

    it('should exists', () => {
      expect(service.getStatisticsOfMunicipalities).toBeTruthy();
      expect(service.getStatisticsOfMunicipalities).toEqual(jasmine.any(Function));
    })

    it('should throw error when country code is empty', () => {
      expect(() => service.getStatisticsOfMunicipalities('', regionCode, stateCode))
        .toThrow(new Error('ISO 2 digits country code not provided!'));
    });

    it('should throw error when region code is empty', () => {
      expect(() => service.getStatisticsOfMunicipalities(countryCode, '', stateCode))
        .toThrow(new Error('Region code not provided!'));
    });

    it('should throw error when state code is empty', () => {
      expect(() => service.getStatisticsOfMunicipalities(countryCode, regionCode, ''))
        .toThrow(new Error('State code not provided!'));
    });

    it('should use GET to retrieve data', () => {
      service.getStatisticsOfMunicipalities(countryCode, regionCode, stateCode).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: LocalityStatistics[] = localityStatisticsFromServer.map((item) => new LocalityStatistics().deserialize(item));

      service.getStatisticsOfMunicipalities(countryCode, regionCode, stateCode).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush(localityStatisticsFromServer);
    });
  });

  describe('#getStatisticsOfAdministrativeLevelLocalities', () => {
    it('should exists', () => {
      expect(service.getStatisticsOfAdministrativeLevelLocalities).toBeDefined();
      expect(service.getStatisticsOfAdministrativeLevelLocalities).toEqual(jasmine.any(Function));
    });

    it('should works for AdminitrativeLevel.Country', () => {
      spyOn(service, 'getStatisticsOfCountries');

      service.getStatisticsOfAdministrativeLevelLocalities(AdministrativeLevel.Country, null, null, null);

      expect(service.getStatisticsOfCountries).toHaveBeenCalled();
    });

    it('should works for AdminitrativeLevel.Region', () => {
      spyOn(service, 'getStatisticsOfRegions');

      // With country code
      service.getStatisticsOfAdministrativeLevelLocalities(AdministrativeLevel.Region, countryCode, null, null);
      expect(service.getStatisticsOfRegions).toHaveBeenCalledWith(countryCode);

      // Without country code
      service.getStatisticsOfAdministrativeLevelLocalities(AdministrativeLevel.Region, null, null, null);
      expect(service.getStatisticsOfRegions).toHaveBeenCalledWith('');
    });

    it('should works for AdminitrativeLevel.State', () => {
      spyOn(service, 'getStatisticsOfStates');

      // With codes
      service.getStatisticsOfAdministrativeLevelLocalities(AdministrativeLevel.State, countryCode, regionCode, null);
      expect(service.getStatisticsOfStates).toHaveBeenCalledWith(countryCode, regionCode);

      // Without codes
      service.getStatisticsOfAdministrativeLevelLocalities(AdministrativeLevel.State, null, null, null);
      expect(service.getStatisticsOfStates).toHaveBeenCalledWith('', '');
    });

    it('should works for AdminitrativeLevel.Municipality', () => {
      spyOn(service, 'getStatisticsOfMunicipalities');

      // With codes
      service.getStatisticsOfAdministrativeLevelLocalities(AdministrativeLevel.Municipality, countryCode, regionCode, stateCode);
      expect(service.getStatisticsOfMunicipalities).toHaveBeenCalledWith(countryCode, regionCode, stateCode);

      // Without codes
      service.getStatisticsOfAdministrativeLevelLocalities(AdministrativeLevel.Municipality, null, null, null);
      expect(service.getStatisticsOfMunicipalities).toHaveBeenCalledWith('', '', '');
    });

    it('should works for invalid AdministrativeLevel', () => {
      spyOn(service, 'getStatisticsOfCountries');

      // With codes
      service.getStatisticsOfAdministrativeLevelLocalities('abc123' as AdministrativeLevel, null, null, null);
      expect(service.getStatisticsOfCountries).toHaveBeenCalledWith();
    });
  });
});