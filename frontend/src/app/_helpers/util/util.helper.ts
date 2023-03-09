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

  /**
   * Parse any boolean value to string value
   * @param value boolean or null value
   * @returns string
   */
  public static getBooleanStr(value: boolean | null | undefined) {
    if (value !== null && value !== undefined) {
      return value ? 'Yes' : 'No';
    } else {
      return 'NA';
    }
  }

  /**
   * Returns value of object property by string path
   * @param obj object
   * @param path path to property. e.g: "user.name"
   * @returns return value of property
   */
  public static getPropertyValueByPath(obj: any, path: any): string | number {
    return path.split('.').reduce((o: any, p: any) => o && o[p], obj)
  }

  /**
   * Gets recursively object deep properties
   * @param obj object 
   * @param previousPath string of previous property path
   * @returns Array<string>
   */
  public static getObjectKeys(obj: any, previousPath = '', objectKeysRef: string[]) {
    // Step 1- Go through all the keys of the object
    Object.keys(obj).forEach((key) => {
      // Get the current path and concat the previous path if necessary
      const currentPath = previousPath ? `${previousPath}.${key}` : key;
      // Step 2- If the value is a string, then add it to the keys array
      if (typeof obj[key] !== 'object' || obj[key] === null) {
        objectKeysRef.push(currentPath);
      } else {
        // Step 3- If the value is an object, then recursively call the function
        this.getObjectKeys(obj[key], currentPath, objectKeysRef);
      }
    });
  }

  /**
   * Exports array of schools data as csv semicolon separated file format
   * @param filename exported csv file name
   * @param objects Array<any>
   */
  public static exportFromObjectToCsv(filename: string, objects: any[]) {
    if (!objects || objects.length === 0) {
      throw new Error('List of objects not provided!');
    }

    const separator = ';'

    // Get all object keys
    const keys = new Array<string>();
    UtilHelper.getObjectKeys(objects[0], '', keys);

    const headerLine = keys.join(separator) + '\n';
    const rows = objects.map(obj => {
      return keys.map(k => {
        return UtilHelper.getPropertyValueByPath(obj, k);
      }).join(separator);
    }).join('\n');

    const csvContent = headerLine + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      throw new Error('Browser does not support download attribute');
    }
  }
}