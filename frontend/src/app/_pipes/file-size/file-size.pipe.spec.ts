import { FileSizePipe } from './file-size.pipe';

describe('ShortNumberPipe', () => {

  it('create an instance', () => {
    const pipe = new FileSizePipe();
    expect(pipe).toBeTruthy();
  });

  it('should works for invalid values', () => {
    const pipe = new FileSizePipe();
    let result;

    //NaN
    result = pipe.transform('asahua');
    expect(result).toEqual('invalid size value');

    //Null
    result = pipe.transform(null);
    expect(result).toEqual('invalid size value');
  });

  it('should works for valid values', () => {
    const pipe = new FileSizePipe();
    let result;

    const fileSizeValues = [{
      value: 10,
      expectedResult: '10.00 B'
    }, {
      value: 100,
      expectedResult: '100.00 B'
    }, {
      value: 1000,
      expectedResult: '1000.00 B'
    }, {
      value: 10000,
      expectedResult: '9.77 KB'
    }, {
      value: 100000,
      expectedResult: '97.66 KB'
    }, {
      value: 10000000,
      expectedResult: '9.54 MB'
    }, {
      value: 10000000000,
      expectedResult: '9.31 GB'
    }];

    fileSizeValues.forEach((item) => {
      result = pipe.transform(item.value);

      expect(result).toEqual(item.expectedResult);
    });
  });
});