import { Injectable } from '@angular/core';
import { AnalysisInputType } from 'src/app/_helpers';
import { IAnalysisInputValidationResult } from 'src/app/_interfaces';
import { AnalysisInputDefinition } from 'src/app/_models';
import { AnalysisInputDefinitionService } from '../analysis-input-definition/analysis-input-definition.service';

@Injectable({
  providedIn: 'root'
})
export class AnalysisInputValidationService {

  constructor(private _analysisInputDefinitionService: AnalysisInputDefinitionService) { }

  validateSchoolInputFile(schoolFile: File): Promise<Array<IAnalysisInputValidationResult>> {
    return new Promise((resolve, reject) => {
      this._analysisInputDefinitionService
        .getAnalysisInputDefinition(AnalysisInputType.School)
        .subscribe((data) => {
          let result = this.validateInputFile(data, schoolFile).then((data) => {
            resolve(data as Array<IAnalysisInputValidationResult>);
          });
        }, (error) => {
          reject(new Array<IAnalysisInputValidationResult>());
        });
    })
  }

  validateLocalityInputFile(localityFile: File): Promise<Array<IAnalysisInputValidationResult>> {
    return new Promise((resolve, reject) => {
      this._analysisInputDefinitionService
        .getAnalysisInputDefinition(AnalysisInputType.Locality)
        .subscribe((data) => {
          let result = this.validateInputFile(data, localityFile).then((data) => {
            resolve(data as Array<IAnalysisInputValidationResult>);
          });
        }, (error) => {
          reject(new Array<IAnalysisInputValidationResult>());
        });
    })
  }

  validateInputFile(fileDefinition: AnalysisInputDefinition[], file: File) {
    return new Promise((resolve, reject) => {
      let result = new Array<IAnalysisInputValidationResult>();
      let reader: FileReader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let fileContent = reader.result as string;
        if (fileContent.length === 0) {
          result.push({
            valid: false,
            message: 'The file is empty'
          } as IAnalysisInputValidationResult);

          resolve(result);
        } else {
          result.push({
            valid: true,
            message: 'The file is not empty'
          } as IAnalysisInputValidationResult);
        }

        let fileLines = fileContent.split('\n');
        if (fileLines.length <= 1) {
          result.push({
            valid: false,
            message: 'The file does not have enough lines'
          } as IAnalysisInputValidationResult);

          resolve(result);
        } else {
          result.push({
            valid: true,
            message: `The file has ${fileLines.length} lines`
          } as IAnalysisInputValidationResult);
        }

        // VALIDATE HEADER COLUMNS
        let inputDefinitionColumns = fileDefinition.map((item) => { return item.column });
        let fileHeaderLine = fileLines.shift();
        const fileHeaderColumns = fileHeaderLine?.split(',');
        let hasAllHeaderColumns = inputDefinitionColumns.every(column => fileHeaderColumns?.includes(column));
        if (hasAllHeaderColumns) {
          result.push({
            valid: true,
            message: 'The header row has all required columns'
          } as IAnalysisInputValidationResult);
        } else {
          let missingHeaders = inputDefinitionColumns.filter(column => !fileHeaderColumns?.includes(column));

          result.push({
            valid: false,
            message: `Some columns are missing from the header row: [${missingHeaders.join(',')}]`
          } as IAnalysisInputValidationResult);
        }

        // VALIDATE ROW COLUMNS
        let rowsWithoutAllColumnsCount = 0;
        fileLines.forEach((row) => {
          const rowColumns = row.split(',');
          if (rowColumns.length !== fileDefinition.length) {
            rowsWithoutAllColumnsCount++;
          }
        });

        if (rowsWithoutAllColumnsCount > 0) {
          result.push({
            valid: false,
            message: `has ${rowsWithoutAllColumnsCount} rows with less or more than ${fileDefinition.length} columns.`
          } as IAnalysisInputValidationResult);
        } else {
          result.push({
            valid: true,
            message: `All rows have the required columns.`
          } as IAnalysisInputValidationResult);
        }

        resolve(result);
      };
    });
  }
}
