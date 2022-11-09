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
  })
});