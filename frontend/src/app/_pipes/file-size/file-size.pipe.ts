import { Pipe, PipeTransform } from "@angular/core";

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(value: any): string {
    if (isNaN(value)) return 'invalid size value'; // will only work value is a number
    if (value === null) return 'invalid size value';

    let size = value;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${FILE_SIZE_UNITS[unitIndex]}`;
  }
}