import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { UtilHelper } from "src/app/_helpers";
import { School } from "src/app/_models";
import { environment } from "src/environments/environment";
import { SchoolService } from "..";

import { schoolFromServer } from "../../../test/school-mock";

describe('SchoolService', () => {
  let httpTestingController: HttpTestingController;
  let service: SchoolService;

  let endpointUri = '';
  const localityMapId = 123456;
  let query = '';

  let mockSchoolData = new School().deserialize(schoolFromServer);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: APP_BASE_HREF,
        useValue: ''
      }]
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(SchoolService);

    const host = environment.postgrestHost;
    //@ts-ignore
    const path = service._postgrestSchoolPath;
    endpointUri = `${host}${path}`
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check schoolColumnGroups values are correct', () => {
    service.schoolColumnGroups.forEach((columnGroup) => {
      columnGroup.columns.forEach((groupColumn) => {
        const valueToTest = mockSchoolData as any;

        expect(groupColumn.cell(mockSchoolData)).toEqual(UtilHelper.getPropertyValueByPath(valueToTest, groupColumn.columnDef).toString());
      });
    });
  });

  describe('#exportToCsv', () => {
    it('should exists', () => {
      expect(service.exportToCsv).toBeTruthy();
      expect(service.exportToCsv).toEqual(jasmine.any(Function));
    })

    it('should throw error when schools is empty', () => {
      expect(() => service.exportToCsv('fileName', new Array<School>()))
        .toThrow(new Error('List of schools not provided!'));
    });

    it('should throw error when browser does not support download attribute', () => {
      const schoolList = [mockSchoolData];

      // create spy object with a click() method
      const spyObj = jasmine.createSpyObj('a', ['click', 'setAttribute'], { style: {} });

      // spy on document.createElement() and return the spy object
      spyOn(document, 'createElement').and.returnValue(spyObj);

      expect(() => service.exportToCsv('fileName', schoolList))
        .toThrow(new Error('Browser does not support download attribute'));
    });

    it('should works', () => {
      // create spy object with a click() method
      const spyObj = jasmine.createSpyObj('a', ['click', 'setAttribute'], { download: true, style: {} });

      // spy on document.createElement() and return the spy object
      spyOn(document, 'createElement').and.returnValue(spyObj);

      // spy on document.body functions
      spyOn(document.body, 'appendChild');
      spyOn(document.body, 'removeChild');

      const schoolList = [mockSchoolData];

      service.exportToCsv('fileName', schoolList);

      expect(document.createElement).toHaveBeenCalledTimes(1);
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(spyObj.click).toHaveBeenCalled();
      expect(spyObj.setAttribute).toHaveBeenCalledWith('href', jasmine.any(String));
      expect(spyObj.setAttribute).toHaveBeenCalledWith('download', 'fileName');
      expect(spyObj.style.visibility).toEqual('hidden');
      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
      expect(document.body.removeChild).toHaveBeenCalledTimes(1);
    });
  });

  describe('#getSchoolsByLocalityMapId', () => {
    beforeEach(() => {
      //@ts-ignore
      query = `select=*,locality_map!inner(${service._localityMapColumns.join(',')})&locality_map_id=eq.${localityMapId}`;
    });

    it('should exists', () => {
      expect(service.getSchoolsByLocalityMapId).toBeDefined();
      expect(service.getSchoolsByLocalityMapId).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve data', () => {
      service.getSchoolsByLocalityMapId(localityMapId).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const expectedData: School[] = [schoolFromServer].map((item) => new School().deserialize(item));

      service.getSchoolsByLocalityMapId(localityMapId).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush([schoolFromServer]);
    });
  });

  describe('#getSchoolsByLocalityMapCodes', () => {
    beforeEach(() => {
      //@ts-ignore
      query = `select=*,locality_map!inner(${service._localityMapColumns.join(',')})`;
    });

    it('should exists', () => {
      expect(service.getSchoolsByLocalityMapCodes).toBeDefined();
      expect(service.getSchoolsByLocalityMapCodes).toEqual(jasmine.any(Function));
    });

    it('should use GET to retrieve school from country', () => {
      const countryCode = 'country01';
      query += `&locality_map.country_code=eq.${countryCode}`;

      service.getSchoolsByLocalityMapCodes(countryCode, null, null, null).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should use GET to retrieve school from region', () => {
      const regionCode = 'region01';
      query += `&locality_map.region_code=eq.${regionCode}`;

      service.getSchoolsByLocalityMapCodes(null, regionCode, null, null).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should use GET to retrieve school from state', () => {
      const stateCode = 'state01';
      query += `&locality_map.state_code=eq.${stateCode}`;

      service.getSchoolsByLocalityMapCodes(null, null, stateCode, null).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should use GET to retrieve school from municipality', () => {
      const municipalityCode = 'municipality01';
      query += `&locality_map.municipality_code=eq.${municipalityCode}`;

      service.getSchoolsByLocalityMapCodes(null, null, null, municipalityCode).subscribe();

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      expect(testRequest.request.method).toEqual('GET');
    });

    it('should return expected data', (done) => {
      const countryCode = 'country01';
      query += `&locality_map.country_code=eq.${countryCode}`;

      const expectedData: School[] = [schoolFromServer].map((item) => new School().deserialize(item));

      service.getSchoolsByLocalityMapCodes(countryCode, null, null, null).subscribe(data => {
        expect(data).toEqual(expectedData);
        done();
      });

      const testRequest = httpTestingController.expectOne(`${endpointUri}?${query}`);
      testRequest.flush([schoolFromServer]);
    });
  });
});