export class MathHelper {
  public static mean(list: number[]): number | null {
    if (list.length === 0) {
      return 0;
    }

    let sum = 0;
    list.forEach(item => {
      sum += item;
    });
    return sum / list.length;
  };

  public static median(list: number[]): number | null {
    if (list.length === 0) {
      return null;
    }

    const listSorted = list.sort((a, b) => a - b);
    var half = Math.floor(listSorted.length / 2);

    if (listSorted.length % 2) {
      return listSorted[half];
    }

    return (listSorted[half - 1] + listSorted[half]) / 2.0;
  }
}