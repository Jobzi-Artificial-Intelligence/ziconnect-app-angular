import { MathHelper } from "./math.helper";

describe('Helper: Math', () => {
  describe('#mean', () => {
    it('should exists', () => {
      expect(MathHelper.mean).toBeTruthy();
      expect(MathHelper.mean).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const numbers = [5, 5, 5, 5];

      const result = MathHelper.mean(numbers);

      expect(result).toEqual(5);
    });

    it('should works for empty list', () => {
      const numbers: number[] = [];

      const result = MathHelper.mean(numbers);

      expect(result).toEqual(0);
    });
  });

  describe('#median', () => {
    it('should exists', () => {
      expect(MathHelper.median).toBeTruthy();
      expect(MathHelper.median).toEqual(jasmine.any(Function));
    });

    it('should works for odd array length', () => {
      const numbers = [5, 7, 6, 6.5, 9];

      const result = MathHelper.median(numbers);

      expect(result).toEqual(6.5);
    });

    it('should works for even array length', () => {
      const numbers = [5, 7, 6, 9];

      const result = MathHelper.median(numbers);

      expect(result).toEqual(6.5);
    });

    it('should works for empty list', () => {
      const numbers: number[] = [];

      const result = MathHelper.median(numbers);

      expect(result).toEqual(null);
    });
  });
});