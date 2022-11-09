import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { School } from "src/app/_models";
import { SchoolService } from "..";

describe('SchoolService', () => {
  let httpTestingController: HttpTestingController;
  let service: SchoolService;

  let mockSchoolData = new School();

  const schoolValues = {
    uuid: '',
    country: '',
    source: '',
    source_school_id: '',
    computer_availability_str: '',
    computer_availability_bool: false,
    city: '',
    city_code: '',
    dq_score: 0.0,
    internet_availability_str: '',
    internet_availability_bool: false,
    internet_availability_prediction_bool: false,
    internet_availability_prediction_str: 'NA',
    internet_speed_Mbps: 0,
    latitude: 0,
    longitude: 0,
    region: '',
    region_code: '',
    school_name: 'EEEFM, DR JOSE OTINO DE FREITAS',
    school_region: '',
    school_type: '',
    state: '',
    state_code: '',
    student_count: 0,
    without_internet_availability_data: false
  } as any;


  mockSchoolData = { ...schoolValues };


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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check schoolColumnGroups values are correct', () => {
    service.schoolColumnGroups.forEach((columnGroup) => {
      columnGroup.columns.forEach((groupColumn) => {
        const valueToTest = mockSchoolData as any;

        expect(groupColumn.cell(mockSchoolData)).toEqual(valueToTest[groupColumn.columnDef].toString());
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
});