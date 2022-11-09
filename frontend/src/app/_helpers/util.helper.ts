export class UtilHelper {

  /**
 * Parse any boolean value to real boolean value
 * @param value boolean value as any
 * @returns boolean
 */
  public static getBoolean(value: any) {
    switch (value) {
      case true:
      case 'true':
      case 'True':
      case 1:
      case '1':
      case 'on':
      case 'On':
      case 'yes':
      case 'Yes':
        return true;
      default:
        return false;
    }
  }
}