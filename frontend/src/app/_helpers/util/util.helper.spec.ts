import { UtilHelper } from "./util.helper";

describe('Helper: Util', () => {

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
});