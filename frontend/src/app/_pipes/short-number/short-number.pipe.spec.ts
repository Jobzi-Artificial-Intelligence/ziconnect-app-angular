import { ShortNumberPipe } from './short-number.pipe';

describe('ShortNumberPipe', () => {

  it('create an instance', () => {
    const pipe = new ShortNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('should works for invalid values', () => {
    const pipe = new ShortNumberPipe();
    let result;

    //NaN
    result = pipe.transform('asahua');
    expect(result).toEqual(0);

    //Null
    result = pipe.transform(null);
    expect(result).toEqual(0);

    //0
    result = pipe.transform(0);
    expect(result).toEqual(0);
  });

  it('should works for integer values', () => {
    const pipe = new ShortNumberPipe();
    let result;

    // Number > 0 and < 1000
    result = pipe.transform(900);
    expect(result).toEqual('900');

    // Number > 1K and < 1M
    result = pipe.transform(35000);
    expect(result).toEqual('35K');

    // Number > 1M and < 1B
    result = pipe.transform(Math.pow(10, 6));
    expect(result).toEqual('1M');

    // Number > 1B and < 1T
    result = pipe.transform(Math.pow(10, 9));
    expect(result).toEqual('1B');

    // Number > 1T and < 1Q
    result = pipe.transform(Math.pow(10, 12));
    expect(result).toEqual('1T');

    // Number > 1Q
    result = pipe.transform(Math.pow(10, 15));
    expect(result).toEqual('1Q');

    // Number greater than quadrillion
    result = pipe.transform(Math.pow(10, 18));
    expect(result).toEqual('1000Q');

    // Number is negative
    result = pipe.transform(-10000);
    expect(result).toEqual('-10K');
  });

  it('should works for float values', () => {
    const pipe = new ShortNumberPipe();
    let result;

    // Number > 0 and < 1000
    result = pipe.transform(900.5);
    expect(result).toEqual('900.5');

    // Number > 1K and < 1M
    result = pipe.transform(35500);
    expect(result).toEqual('35.5K');

    // Number > 1M and < 1B
    result = pipe.transform(Math.pow(10, 6) + Math.pow(10, 5));
    expect(result).toEqual('1.1M');

    // Number > 1B and < 1T
    result = pipe.transform(Math.pow(10, 9) + Math.pow(10, 8));
    expect(result).toEqual('1.1B');

    // Number > 1T and < 1Q
    result = pipe.transform(Math.pow(10, 12) + Math.pow(10, 11));
    expect(result).toEqual('1.1T');

    // Number > 1Q
    result = pipe.transform(Math.pow(10, 15) + Math.pow(10, 14));
    expect(result).toEqual('1.1Q');

    // Number greater than quadrillion
    result = pipe.transform(Math.pow(10, 18) + Math.pow(10, 17));
    expect(result).toEqual('1100Q');

    // Number is negative
    result = pipe.transform(-10000);
    expect(result).toEqual('-10K');
  });
});