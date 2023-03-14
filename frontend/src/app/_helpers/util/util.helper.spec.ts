import { School } from "src/app/_models";
import { schoolFromServer } from "src/test/school-mock";
import { UtilHelper } from "./util.helper";

describe('Helper: Util', () => {
  let mockSchoolData = new School().deserialize(schoolFromServer);

  describe('#exportFromObjectToCsv', () => {
    it('should exists', () => {
      expect(UtilHelper.exportFromObjectToCsv).toBeTruthy();
      expect(UtilHelper.exportFromObjectToCsv).toEqual(jasmine.any(Function));
    })

    it('should throw error when schools is empty', () => {
      expect(() => UtilHelper.exportFromObjectToCsv('fileName', new Array<School>()))
        .toThrow(new Error('List of objects not provided!'));
    });

    it('should throw error when browser does not support download attribute', () => {
      const schoolList = [mockSchoolData];

      // create spy object with a click() method
      const spyObj = jasmine.createSpyObj('a', ['click', 'setAttribute'], { style: {} });

      // spy on document.createElement() and return the spy object
      spyOn(document, 'createElement').and.returnValue(spyObj);

      expect(() => UtilHelper.exportFromObjectToCsv('fileName', schoolList))
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

      UtilHelper.exportFromObjectToCsv('fileName', schoolList);

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

  describe('#getBoolean', () => {

    it('should exists', () => {
      expect(UtilHelper.getBoolean).toBeTruthy();
      expect(UtilHelper.getBoolean).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      // False values
      expect(UtilHelper.getBoolean(null)).toEqual(false);
      expect(UtilHelper.getBoolean(undefined)).toEqual(false);
      expect(UtilHelper.getBoolean(false)).toEqual(false);
      expect(UtilHelper.getBoolean('false')).toEqual(false);
      expect(UtilHelper.getBoolean('False')).toEqual(false);
      expect(UtilHelper.getBoolean('trues')).toEqual(false);
      expect(UtilHelper.getBoolean(0)).toEqual(false);
      expect(UtilHelper.getBoolean('abc')).toEqual(false);

      // True values
      expect(UtilHelper.getBoolean(true)).toEqual(true);
      expect(UtilHelper.getBoolean('true')).toEqual(true);
      expect(UtilHelper.getBoolean('True')).toEqual(true);
      expect(UtilHelper.getBoolean(1)).toEqual(true);
      expect(UtilHelper.getBoolean('1')).toEqual(true);
      expect(UtilHelper.getBoolean('on')).toEqual(true);
      expect(UtilHelper.getBoolean('On')).toEqual(true);
      expect(UtilHelper.getBoolean('yes')).toEqual(true);
      expect(UtilHelper.getBoolean('Yes')).toEqual(true);
    });
  });

  describe('#getBooleanStr', () => {

    it('should exists', () => {
      expect(UtilHelper.getBooleanStr).toBeTruthy();
      expect(UtilHelper.getBooleanStr).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      // undefined value test
      let obj = {} as any;
      expect(UtilHelper.getBooleanStr(obj.booleanValue)).toEqual('NA');

      expect(UtilHelper.getBooleanStr(null)).toEqual('NA');
      expect(UtilHelper.getBooleanStr(true)).toEqual('Yes');
      expect(UtilHelper.getBooleanStr(false)).toEqual('No');
    });
  });

  describe('#getPropertyValueByPath', () => {

    it('should exists', () => {
      expect(UtilHelper.getPropertyValueByPath).toBeTruthy();
      expect(UtilHelper.getPropertyValueByPath).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const person = {
        name: 'pfigueiredo',
        age: 30,
        address: null,
        dog: {
          owner: {
            name: 'pfigueiredo'
          }
        }
      };

      const result1 = UtilHelper.getPropertyValueByPath(person, 'age');
      const result2 = UtilHelper.getPropertyValueByPath(person, 'dog.owner.name');

      expect(result1).toEqual(person.age);
      expect(result2).toEqual(person.dog.owner.name);
    });
  });

  describe('#getObjectKeys', () => {

    it('should exists', () => {
      expect(UtilHelper.getPropertyValueByPath).toBeTruthy();
      expect(UtilHelper.getPropertyValueByPath).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const person = {
        name: 'pfigueiredo',
        age: 30,
        address: null,
        dog: {
          owner: {
            name: 'pfigueiredo'
          }
        }
      };

      let objectKeys = new Array<string>();

      UtilHelper.getObjectKeys(person, '', objectKeys);

      expect(objectKeys.includes('name')).toBeTrue();
      expect(objectKeys.includes('age')).toBeTrue();
      expect(objectKeys.includes('address')).toBeTrue();
      expect(objectKeys.includes('dog.owner.name')).toBeTrue();
    });
  });

  describe('#formatDuration', () => {

    it('should exists', () => {
      expect(UtilHelper.formatDuration).toBeTruthy();
      expect(UtilHelper.formatDuration).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const expectedResults = [{
        value: 10010,
        result: '10 seconds'
      }, {
        value: 100100,
        result: '1 minute, 40 seconds'
      }, {
        value: 10010010,
        result: '2 hours, 46 minutes, 50 seconds'
      }, {
        value: 100100100,
        result: '1 day, 3 hours, 48 minutes, 20 seconds'
      }, {
        value: -10010,
        result: '10 seconds'
      }];

      expectedResults.forEach((expectedResult) => {
        expect(UtilHelper.formatDuration(expectedResult.value)).toEqual(expectedResult.result);
      })
    });
  });
});